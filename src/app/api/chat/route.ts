import { NextResponse } from 'next/server';
import { generateAICompletion, answerLocalDoubt } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { title, content, question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const docTitle = title || 'Uploaded Document';
    const docContent = content || '';

    if (process.env.OPENAI_API_KEY) {
      const prompt = `You are StudyGenie, an expert and supportive academic tutor.
Answer the student's question directly using their study notes as grounding context.
If their question asks for an analogy, provide an intuitive real-world comparison.
If it asks for exam tips, highlight typical trick questions and formulas.
Keep your explanation clear, well-structured, and pedagogical with Markdown formatting.

DOCUMENT TITLE: ${docTitle}
STUDY NOTES CONTEXT:
${docContent.slice(0, 14000)}

STUDENT'S QUESTION:
${question}`;

      const aiText = await generateAICompletion(prompt);
      if (aiText) {
        return NextResponse.json({
          success: true,
          answer: aiText,
          citations: [`Document: ${docTitle}`, 'AI Tutor Synthesis'],
        });
      }
    }

    // Local grounded tutor fallback
    const result = answerLocalDoubt(docTitle, docContent, question);
    return NextResponse.json({
      success: true,
      answer: result.answer,
      citations: result.citations,
    });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Failed to process doubt question' }, { status: 500 });
  }
}
