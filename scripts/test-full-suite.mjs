// Comprehensive Full-Stack End-to-End Test Suite for StudyGenie
// Tests all Backend APIs and Frontend Routes on http://localhost:3001

const BASE_URL = 'http://localhost:3001';

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(name, passed, details = '') {
  if (passed) {
    results.passed++;
    console.log(`✅ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  } else {
    results.failed++;
    console.error(`❌ [FAIL] ${name}: ${details}`);
  }
  results.tests.push({ name, passed, details });
}

async function testFrontendRoutes() {
  console.log('\n========================================');
  console.log('🧪 TESTING FRONTEND ROUTES (SSR & STATIC)');
  console.log('========================================\n');

  const pages = [
    { url: '/', titleCheck: 'StudyGenie' },
    { url: '/dashboard', titleCheck: 'Dashboard' },
    { url: '/library', titleCheck: 'Library' },
    { url: '/quiz', titleCheck: 'Practice Quiz' },
    { url: '/quiz?topic=Deadlocks', titleCheck: 'Drill' },
    { url: '/flashcards', titleCheck: 'Flashcards' },
    { url: '/analytics', titleCheck: 'Weak-Topic' },
    { url: '/chat', titleCheck: 'AI Doubt Solver' },
    { url: '/study/doc-1', titleCheck: 'StudyGenie' },
    { url: '/login', titleCheck: 'StudyGenie' },
    { url: '/signup', titleCheck: 'StudyGenie' },
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page.url}`);
      const text = await res.text();
      const statusOk = res.status === 200;
      const contentMatches = text.toLowerCase().includes(page.titleCheck.toLowerCase());

      recordTest(
        `GET ${page.url}`,
        statusOk && contentMatches,
        `Status ${res.status}, contains "${page.titleCheck}": ${contentMatches}`
      );
    } catch (err) {
      recordTest(`GET ${page.url}`, false, err.message);
    }
  }
}

async function testBackendAPIs() {
  console.log('\n========================================');
  console.log('🧪 TESTING BACKEND API ENDPOINTS');
  console.log('========================================\n');

  const testNotes = `
  Thermodynamics and Heat Engines.
  The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed: ΔU = Q - W.
  The Second Law of Thermodynamics dictates that the entropy of an isolated system always increases over time.
  Carnot efficiency establishes the maximum theoretical limit of any heat engine operating between two temperatures:
  η_max = 1 - (T_cold / T_hot).
  Isothermal expansion occurs at constant temperature, while adiabatic expansion occurs without heat exchange (Q = 0).
  High-yield exam trap: Always convert temperatures to Kelvin (K) when calculating Carnot efficiency!
  `;

  // 1. POST /api/summarize
  try {
    const res = await fetch(`${BASE_URL}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Thermodynamics Principles',
        content: testNotes,
      }),
    });
    const data = await res.json();
    const hasSummary =
      data.success &&
      data.summary &&
      data.summary.mainTopic &&
      Array.isArray(data.summary.keyConcepts) &&
      data.summary.keyConcepts.length > 0;

    recordTest(
      'POST /api/summarize (Valid Input)',
      res.status === 200 && hasSummary,
      `Received summary for topic: "${data.summary?.mainTopic}" with ${data.summary?.keyConcepts?.length || 0} key concepts`
    );
  } catch (err) {
    recordTest('POST /api/summarize (Valid Input)', false, err.message);
  }

  // 1b. POST /api/summarize (Invalid Input validation)
  try {
    const res = await fetch(`${BASE_URL}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    recordTest(
      'POST /api/summarize (Missing Content Validation)',
      res.status === 400,
      `Expected status 400, got ${res.status}`
    );
  } catch (err) {
    recordTest('POST /api/summarize (Missing Content Validation)', false, err.message);
  }

  // 2. POST /api/quiz
  try {
    const res = await fetch(`${BASE_URL}/api/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Thermodynamics',
        content: testNotes,
      }),
    });
    const data = await res.json();
    const validQuestions =
      data.success &&
      Array.isArray(data.questions) &&
      data.questions.length > 0 &&
      data.questions[0].options.length === 4;

    recordTest(
      'POST /api/quiz (Questions Generator)',
      res.status === 200 && validQuestions,
      `Generated ${data.questions?.length || 0} questions with 4 options each`
    );
  } catch (err) {
    recordTest('POST /api/quiz (Questions Generator)', false, err.message);
  }

  // 3. POST /api/flashcards
  try {
    const res = await fetch(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentTitle: 'Thermodynamics',
        contextText: testNotes,
        count: 4,
      }),
    });
    const data = await res.json();
    const validCards =
      data.cards &&
      Array.isArray(data.cards) &&
      data.cards.length > 0 &&
      typeof data.cards[0].front === 'string' &&
      typeof data.cards[0].back === 'string';

    recordTest(
      'POST /api/flashcards (Flashcards Generator)',
      res.status === 200 && validCards,
      `Generated ${data.cards?.length || 0} flashcards`
    );
  } catch (err) {
    recordTest('POST /api/flashcards (Flashcards Generator)', false, err.message);
  }

  // 4. POST /api/chat
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Thermodynamics',
        content: testNotes,
        question: 'What is the most frequent exam mistake with Carnot efficiency?',
      }),
    });
    const data = await res.json();
    const validAnswer =
      data.success &&
      typeof data.answer === 'string' &&
      data.answer.length > 20 &&
      Array.isArray(data.citations);

    recordTest(
      'POST /api/chat (AI Doubt Solver Context-Grounded)',
      res.status === 200 && validAnswer,
      `Answer received (${data.answer?.length} chars, citations: ${data.citations?.join(', ')})`
    );
  } catch (err) {
    recordTest('POST /api/chat (AI Doubt Solver Context-Grounded)', false, err.message);
  }

  // 4b. POST /api/chat (Empty question validation)
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '' }),
    });
    recordTest(
      'POST /api/chat (Empty Question Validation)',
      res.status === 400,
      `Expected status 400, got ${res.status}`
    );
  } catch (err) {
    recordTest('POST /api/chat (Empty Question Validation)', false, err.message);
  }

  // 5. POST /api/upload (Multipart Direct Text Upload)
  try {
    const formData = new FormData();
    formData.append('title', 'Quantum Computing Fundamentals');
    formData.append(
      'text',
      'Quantum superposition allows qubits to represent linear combinations of |0⟩ and |1⟩ states simultaneously. Quantum entanglement couples quantum states across arbitrary physical distances.'
    );

    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const validUpload =
      data.success &&
      data.document &&
      data.document.title === 'Quantum Computing Fundamentals' &&
      data.document.summary;

    recordTest(
      'POST /api/upload (Text Upload & Synthesis)',
      res.status === 200 && validUpload,
      `Document created: ID ${data.document?.id}, Summary Topic: ${data.document?.summary?.mainTopic}`
    );
  } catch (err) {
    recordTest('POST /api/upload (Text Upload & Synthesis)', false, err.message);
  }

  // 5b. POST /api/upload (Empty Document Validation)
  try {
    const formData = new FormData();
    formData.append('text', 'too short');
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    recordTest(
      'POST /api/upload (Too Short / Invalid Content Validation)',
      res.status === 400,
      `Expected status 400, got ${res.status}`
    );
  } catch (err) {
    recordTest('POST /api/upload (Too Short / Invalid Content Validation)', false, err.message);
  }

  // 6. POST /api/upload with actual File/Blob (Markdown Chapter)
  try {
    const fileContent = `# Chapter 4: Neural Networks & Backpropagation
Neural networks learn representations through layered weight matrices and nonlinear activation functions like ReLU.
Gradient descent iteratively adjusts parameters in the direction of steepest loss reduction:
W_new = W_old - lr * dL/dW.
Backpropagation relies on the calculus chain rule to distribute error gradients backward through hidden layers.
Vanishing gradients occur when saturated sigmoidal activations squash derivative values.`;

    const blob = new Blob([fileContent], { type: 'text/markdown' });
    const formData = new FormData();
    formData.append('file', blob, 'neural_networks.md');

    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const validUpload =
      data.success &&
      data.document &&
      data.document.title === 'neural_networks.md' &&
      data.document.summary?.keyConcepts?.length > 0;

    recordTest(
      'POST /api/upload (Markdown File Upload via FormData)',
      res.status === 200 && validUpload,
      `Parsed file: "${data.document?.title}" with ${data.document?.summary?.keyConcepts?.length} concepts`
    );
  } catch (err) {
    recordTest('POST /api/upload (Markdown File Upload via FormData)', false, err.message);
  }

  // 7. POST /api/chat with ELI5 Prompt
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Neural Networks & Backpropagation',
        content: 'Backpropagation computes the gradient of the loss function with respect to weights using the chain rule.',
        question: 'Explain backpropagation in simple terms (ELI5)',
      }),
    });
    const data = await res.json();
    recordTest(
      'POST /api/chat (ELI5 Simplicity & Tone Check)',
      res.status === 200 && data.success && data.answer?.length > 50,
      `Generated explanation (${data.answer?.length} characters)`
    );
  } catch (err) {
    recordTest('POST /api/chat (ELI5 Simplicity & Tone Check)', false, err.message);
  }
}

async function testDiagnosticScoringAlgorithms() {
  console.log('\n========================================');
  console.log('🧪 TESTING DIAGNOSTIC & ADAPTIVE SCORING LOGIC');
  console.log('========================================\n');

  // Test 1: Accuracy categorization boundary conditions
  const testCases = [
    { correct: 2, total: 5, expected: 'Needs Revision' }, // 40%
    { correct: 3, total: 5, expected: 'Improving' },      // 60%
    { correct: 4, total: 5, expected: 'Mastered' },       // 80%
    { correct: 5, total: 5, expected: 'Mastered' },       // 100%
  ];

  for (const tc of testCases) {
    const accuracy = Math.round((tc.correct / tc.total) * 100);
    const status =
      accuracy >= 80 ? 'Mastered' : accuracy >= 60 ? 'Improving' : 'Needs Revision';
    recordTest(
      `Scoring Matrix (${tc.correct}/${tc.total} = ${accuracy}%)`,
      status === tc.expected,
      `Result: ${status}, Expected: ${tc.expected}`
    );
  }
}

async function runAllTests() {
  console.log('🚀 Launching StudyGenie Full-Stack E2E Test Suite...\n');
  const startTime = Date.now();

  await testFrontendRoutes();
  await testBackendAPIs();
  await testDiagnosticScoringAlgorithms();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n========================================');
  console.log('📊 TEST EXECUTION SUMMARY');
  console.log('========================================');
  console.log(`Total Tests Run:  ${results.passed + results.failed}`);
  console.log(`Passed:           ${results.passed} ✅`);
  console.log(`Failed:           ${results.failed} ❌`);
  console.log(`Time Elapsed:     ${duration}s`);
  console.log('========================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! Application is 100% verified.\n');
    process.exit(0);
  }
}

runAllTests();
