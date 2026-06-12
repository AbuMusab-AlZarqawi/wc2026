import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a dramatic, cinematic football match commentator and simulator. Your job is to simulate a football match between two teams and return a structured JSON result.

RULES:
- Scorelines can be anything — wild, unpredictable, no limits (5-4, 6-2, 1-0, anything goes)
- If the match ends in a draw after 90 minutes, you MUST simulate a penalty shootout and declare a winner
- The MVP can come from either team — reward the best individual performance regardless of result
- All goalscorers MUST be real players from the named team rosters provided
- The AI Team has no named players — refer to them generically (e.g. "AI striker", "AI defender")
- Player names passed in have no fixed positions — assign them roles organically based on the match narrative
- The narrative must feel cinematic and dramatic — like a movie, not a sports report

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown. No backticks. No explanation. No text before or after the JSON.

The JSON must follow this exact schema:
{
  "homeTeam": "string — the user's team name",
  "awayTeam": "AI Team",
  "homeScore": number,
  "awayScore": number,
  "draw": boolean,
  "penaltyShootout": {
    "occurred": boolean,
    "homeScore": number,
    "awayScore": number,
    "winner": "string — team name that won on penalties, or null if no shootout"
  },
  "winner": "string — name of the winning team (after penalties if applicable)",
  "goals": [
    {
      "minute": number,
      "scorer": "string — player name or 'AI striker/midfielder/etc'",
      "team": "string — team name",
      "type": "string — one of: 'goal', 'penalty', 'own goal', 'free kick', 'header', 'volley', 'screamer'"
    }
  ],
  "mvp": {
    "name": "string — player name or 'AI [role]'",
    "team": "string — team name",
    "rating": number between 6.0 and 10.0,
    "description": "string — 2-3 sentences, cinematic and vivid, describing why they were the standout player"
  },
  "tacticalSummary": "string — 3-4 sentences. Cinematic tone. Describe how the match unfolded tactically, key turning points, and the mood of the game.",
  "matchMood": "string — one word that captures the match vibe, e.g. 'Breathtaking', 'Ruthless', 'Chaotic', 'Gritty', 'Dominant', 'Miraculous'"
}`;

export async function POST(req: NextRequest) {
  try {
    const { teamName, players, formation } = await req.json();

    if (!teamName || !players || !Array.isArray(players)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const userPrompt = `Simulate a football match with the following details:

HOME TEAM: "${teamName}"
HOME FORMATION: ${formation}
HOME PLAYERS (11 players, any can play any position):
${players.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

AWAY TEAM: "AI Team"
AWAY PLAYERS: Generic AI players — no names needed

Simulate the full 90-minute match. Make it dramatic and unpredictable. Return only the JSON object.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1200,
        temperature: 1.0,
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

    return NextResponse.json(result);
  } catch (err) {
    console.error("Simulate match error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
