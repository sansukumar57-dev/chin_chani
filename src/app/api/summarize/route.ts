import { NextResponse } from 'next/server';
import { generateAICompletion, generateLocalSummary } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Missing content to summarize' }, { status: 400 });
    }

    const docTitle = title || 'Study Material';

    // Check if OpenAI is available
    if (process.env.OPENAI_API_KEY) {
      const prompt = `You are StudyGenie, an expert educational AI tutor.
Summarize the following academic material and return strict JSON with this exact schema:
{
  "mainTopic": "string",
  "overview": "string",
  "keyConcepts": [
    {"term": "string", "explanation": "string", "importance": "Critical" | "High" | "Medium"}
  ],
  "definitions": [
    {"term": "string", "definition": "string"}
  ],
  "highYieldTakeaways": ["string"],
  "examTips": ["string"]
}

Document Title: ${docTitle}
Material:
${content.slice(0, 15000)}`;

      const aiResponse = await generateAICompletion(prompt);
      if (aiResponse) {
        try {
          const cleaned = aiResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({ success: true, summary: parsed });
        } catch (jsonErr) {
          console.warn('Failed to parse AI JSON summary, using fallback:', jsonErr);
        }
      }
    }

    // Heuristic structured summary
    const summary = generateLocalSummary(docTitle, content);
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
