import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a dramatic, cinematic football match commentator and simulator. Your job is to simulate a football match between two teams and return a structured JSON result.

CRITICAL RULES — READ CAREFULLY:
- Every single match MUST have a UNIQUE, UNPREDICTABLE scoreline. Never repeat the same score.
- Scorelines must vary wildly: sometimes 1-0, sometimes 3-2, sometimes 5-1, sometimes 0-0 going to penalties, sometimes 4-3. No pattern, no defaults.
- The number of goals in the goals array MUST exactly equal homeScore + awayScore. Count them carefully.
- Spread goals across different minutes throughout 1-90. Never cluster them all in the same range.
- Use different goal types each match — vary between: goal, penalty, own goal, free kick, header, volley, screamer.
- Different players must score in different matches — rotate who gets the goals, do not always use the same scorers.
- If the match ends in a draw after 90 minutes, you MUST simulate a penalty shootout and declare a winner.
- The MVP can come from either team — sometimes pick an AI player as MVP.
- All goalscorers from the home team MUST be real players from the roster provided.
- The AI Team has no named players — refer to them as: "AI striker", "AI midfielder", "AI defender", "AI winger", "AI forward".
- The narrative must feel cinematic and dramatic — like a movie, not a sports report.

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown. No backticks. No explanation. No text before or after the JSON.

The JSON must follow this exact schema:
{
  "homeTeam": "string — the user team name",
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
  "winner": "string — winning team name after penalties if applicable",
  "goals": [
    {
      "minute": number,
      "scorer": "string",
      "team": "string",
      "type": "string — one of: goal, penalty, own goal, free kick, header, volley, screamer"
    }
  ],
  "mvp": {
    "name": "string",
    "team": "string",
    "rating": number,
    "description": "string — 2-3 cinematic sentences"
  },
  "tacticalSummary": "string — 3-4 cinematic sentences unique to this match",
  "matchMood": "string — one word from: Breathtaking, Ruthless, Chaotic, Gritty, Dominant, Miraculous, Electric, Tense, Dramatic, Ferocious, Scrappy, Stunning"
}`;

const SCORE_POOL = [
  [1,0],[2,1],[3,0],[0,1],[1,2],[2,0],[3,2],[4,1],[2,3],[0,2],
  [1,1],[2,2],[3,3],[0,0],[3,1],[4,2],[5,1],[1,4],[2,4],[5,3],
  [1,3],[4,3],[0,3],[6,1],[3,4],[1,5],[2,2],[0,4],[4,0],[3,3],
];

export async function POST(req: NextRequest) {
  try {
    const { teamName, players, formation } = await req.json();

    if (!teamName || !players || !Array.isArray(players)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Random seed and suggested score — forces unique output every call
    const seed = Math.floor(Math.random() * 999999);
    const [sHome, sAway] = SCORE_POOL[Math.floor(Math.random() * SCORE_POOL.length)];
    const isDraw = sHome === sAway;

    const userPrompt = `MATCH SEED: ${seed}

HOME TEAM: "${teamName}"
HOME FORMATION: ${formation}
HOME SQUAD:
${players.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

AWAY TEAM: "AI Team"

REQUIRED SCORELINE: ${sHome}-${sAway} (home-away)
- homeScore MUST be ${sHome}
- awayScore MUST be ${sAway}
- goals array MUST contain exactly ${sHome + sAway} goal objects
${isDraw ? "- This is a draw — simulate a penalty shootout to determine the winner" : ""}

Distribute goal minutes randomly across 1-90 minutes. Pick scorers from the squad randomly — do not always use the same players. Make the tactical summary and match narrative completely unique. Return only the JSON object.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1400,
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
    const result = JSON.parse(clean);

    // Safety: ensure goal count matches scoreline
    const expectedGoals = (result.homeScore ?? sHome) + (result.awayScore ?? sAway);
    if (result.goals && result.goals.length !== expectedGoals) {
      result.goals = result.goals.slice(0, expectedGoals);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Simulate match error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
