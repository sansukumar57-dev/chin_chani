import { NextResponse } from 'next/server';
import { generateAICompletion, generateLocalQuiz } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Missing document content for quiz' }, { status: 400 });
    }

    const docTitle = title || 'Study Material';

    if (process.env.OPENAI_API_KEY) {
      const prompt = `You are StudyGenie. Generate 4 high-quality multiple choice questions based on this study text.
Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "string",
      "topic": "string"
    }
  ]
}

Ensure exactly 4 options per question, exactly 1 correct answer (index 0, 1, 2, or 3), and clear educational explanations.
Material:
${content.slice(0, 12000)}`;

      const aiResponse = await generateAICompletion(prompt);
      if (aiResponse) {
        try {
          const cleaned = aiResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return NextResponse.json({ success: true, questions: parsed.questions });
          }
        } catch (jsonErr) {
          console.warn('AI quiz JSON parse failed, using fallback:', jsonErr);
        }
      }
    }

    const questions = generateLocalQuiz(docTitle, content);
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error('Quiz route error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
