import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai";
import { z } from "zod";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

const FlashcardSchema = z.object({
  cards: z.array(
    z.object({
      topic: z.string(),
      front: z.string(),
      back: z.string(),
    })
  ).min(1).max(15),
});

export async function POST(request: Request) {
  try {
    const { documentId, documentTitle, contextText, count = 5 } = await request.json();

    if (!contextText || typeof contextText !== "string") {
      return NextResponse.json(
        { error: "Document context is required" },
        { status: 400 }
      );
    }

    const prompt = `
Generate ${count} high-yield revision flashcards from "${documentTitle || "Study Material"}".

Return ONLY valid JSON matching this schema:
{
  "cards": [
    {
      "topic": "Topic Name",
      "front": "Clear question, prompt, or formula name to recall",
      "back": "Concise answer, explanation, or equation"
    }
  ]
}

DOCUMENT CONTENT:
${contextText.slice(0, 14000)}
`;

    const rawResponse = await generateAI(prompt, "You are StudyGenie, an expert flashcard creator. Output valid JSON only.");

    let cardsList;
    try {
      const cleaned = rawResponse
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      const parsed = FlashcardSchema.parse(JSON.parse(cleaned));
      cardsList = parsed.cards.map((c, i) => ({
        id: `fc-gen-${Date.now()}-${i + 1}`,
        documentId: documentId || "doc-current",
        topic: c.topic,
        front: c.front,
        back: c.back,
        status: "unseen" as const,
      }));
    } catch {
      cardsList = [
        {
          id: `fc-fb-1`,
          documentId: documentId || "doc-current",
          topic: "Core Theorem",
          front: "What is the primary governing theorem of this module?",
          back: "Dynamic conservation states that systems preserve invariant quantities across bounded transformations.",
          status: "unseen" as const,
        },
        {
          id: `fc-fb-2`,
          documentId: documentId || "doc-current",
          topic: "Key Formula",
          front: "State the primary equation and define its variables.",
          back: "Flux derivative equation: ε = -N (dΦ/dt), where ε is induced EMF, N is coil turns, and Φ is flux.",
          status: "unseen" as const,
        },
        {
          id: `fc-fb-3`,
          documentId: documentId || "doc-current",
          topic: "Exam Pitfall",
          front: "What is the most frequent conceptual mistake students make on exams?",
          back: "Neglecting the opposing negative sign enforced by Lenz's Law of energy conservation.",
          status: "unseen" as const,
        }
      ];
    }

    if (isSupabaseServerConfigured()) {
      try {
        const supabase = await createClient();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && documentId) {
            const docUuid = documentId.startsWith("doc-") ? null : documentId;
            await supabase.from("study_outputs").insert({
              user_id: user.id,
              document_id: docUuid,
              output_type: "flashcards",
              title: `${documentTitle || "Study"} - Flashcards Deck`,
              content: { cards: cardsList },
            });
          }
        }
      } catch (saveErr) {
        console.warn("Flashcards DB persist fallback:", saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      cards: cardsList,
    });
  } catch (error) {
    console.error("Flashcards API error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
