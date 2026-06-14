import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a dramatic, cinematic football match commentator and simulator. Your job is to simulate a football match between two teams and return a structured JSON result.

CRITICAL RULES:
- Every match MUST have a UNIQUE, UNPREDICTABLE scoreline. Never repeat the same score.
- The number of goals in the goals array MUST exactly equal homeScore + awayScore.
- Spread goals across different minutes throughout 1-90.
- Use different goal types each match: goal, penalty, own goal, free kick, header, volley, screamer.
- Different players must score in different matches — rotate scorers randomly.
- If the match ends in a draw after 90 minutes, simulate a penalty shootout.
- MVP can come from either team.
- All home team goalscorers MUST be real players from the roster provided.
- AI Team scorers: "AI striker", "AI midfielder", "AI defender", "AI winger", "AI forward".
- Keep tacticalSummary under 200 characters. Keep mvp.description under 200 characters. This is critical to avoid token overflow.

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown. No backticks. No explanation.

{
  "homeTeam": "string",
  "awayTeam": "AI Team",
  "homeScore": number,
  "awayScore": number,
  "draw": boolean,
  "penaltyShootout": {
    "occurred": boolean,
    "homeScore": number,
    "awayScore": number,
    "winner": "string or null"
  },
  "winner": "string",
  "goals": [
    {
      "minute": number,
      "scorer": "string",
      "team": "string",
      "type": "string"
    }
  ],
  "mvp": {
    "name": "string",
    "team": "string",
    "rating": number,
    "description": "string — max 180 characters"
  },
  "tacticalSummary": "string — max 220 characters",
  "matchMood": "string — one word only"
}`;

const SCORE_POOL: [number, number][] = [
  [1,0],[2,1],[3,0],[0,1],[1,2],[2,0],[3,2],[4,1],[2,3],[0,2],
  [1,1],[2,2],[3,3],[0,0],[3,1],[4,2],[5,1],[1,4],[2,4],[5,3],
  [1,3],[4,3],[0,3],[6,1],[3,4],[1,5],[4,0],[3,3],[0,4],[2,5],
];

// Attempt to salvage truncated JSON by closing any open strings/braces
function tryRepairJSON(raw: string): string {
  let s = raw.trim();
  // Remove trailing comma if present
  s = s.replace(/,\s*$/, "");
  // Count unclosed braces and brackets
  let braces = 0;
  let brackets = 0;
  let inString = false;
  let escape = false;
  for (const ch of s) {
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"' && !escape) { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") braces++;
    if (ch === "}") braces--;
    if (ch === "[") brackets++;
    if (ch === "]") brackets--;
  }
  // Close any open string
  if (inString) s += '"';
  // Close open arrays then objects
  for (let i = 0; i < brackets; i++) s += "]";
  for (let i = 0; i < braces; i++) s += "}";
  return s;
}

export async function POST(req: NextRequest) {
  try {
    const { teamName, players, formation } = await req.json();

    if (!teamName || !players || !Array.isArray(players)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const seed = Math.floor(Math.random() * 999999);
    const [sHome, sAway] = SCORE_POOL[Math.floor(Math.random() * SCORE_POOL.length)];
    const isDraw = sHome === sAway;

    const userPrompt = `MATCH SEED: ${seed}

HOME TEAM: "${teamName}"
FORMATION: ${formation}
HOME SQUAD:
${players.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

AWAY TEAM: "AI Team"

REQUIRED SCORELINE: home ${sHome} - away ${sAway}
- homeScore MUST be ${sHome}, awayScore MUST be ${sAway}
- goals array MUST have exactly ${sHome + sAway} items
${isDraw ? "- Draw — include penalty shootout" : ""}
- Keep ALL text fields short (under 200 chars each) to avoid truncation
- Return ONLY the JSON object, nothing else`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        temperature: 1.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "Groq API failed" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      // Attempt JSON repair on truncated response
      console.warn("JSON parse failed, attempting repair...");
      try {
        result = JSON.parse(tryRepairJSON(clean));
        console.log("JSON repair succeeded");
      } catch (repairErr) {
        console.error("JSON repair also failed:", repairErr);
        console.error("Raw response:", clean.slice(0, 500));
        return NextResponse.json({ error: "Match simulation returned invalid data. Please try again." }, { status: 500 });
      }
    }

    // Safety: ensure goal count matches scoreline
    const totalGoals = (result.homeScore ?? sHome) + (result.awayScore ?? sAway);
    if (Array.isArray(result.goals) && result.goals.length > totalGoals) {
      result.goals = result.goals.slice(0, totalGoals);
    }

    // Ensure penaltyShootout always exists
    if (!result.penaltyShootout) {
      result.penaltyShootout = { occurred: false, homeScore: 0, awayScore: 0, winner: null };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Simulate match error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
