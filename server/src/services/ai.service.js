import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API if key is present
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI Engine initialized successfully.');
  } catch (error) {
    console.error('Error initializing Gemini AI Engine:', error);
  }
} else {
  console.log('No GEMINI_API_KEY found. AI Interview Engine running in local simulator mode.');
}

// ----------------------------------------------------
// LOCAL SIMULATOR DATABASE OF QUESTIONS (Fallback Mode)
// ----------------------------------------------------
const MOCK_QUESTION_BANK = {
  frontend: {
    beginner: [
      "What is the difference between state and props in React?",
      "Can you explain the box model in CSS and how box-sizing works?",
      "What is the purpose of useEffect in React and when does it run?",
      "Explain the difference between let, const, and var in JavaScript.",
      "How do you handle form submission in React?"
    ],
    intermediate: [
      "Explain closures in JavaScript and provide a practical use case.",
      "What is the Virtual DOM and how does React's reconciliation algorithm work?",
      "How do you manage global state in a React application? Compare Redux and Context API.",
      "Explain event delegation in JavaScript and why it is useful.",
      "How do you optimize a React app's performance? Mention hooks like useMemo and useCallback."
    ],
    advanced: [
      "Explain the event loop, microtasks, and macrotasks in JavaScript with examples.",
      "How would you design a custom hook for state synchronization across browser tabs?",
      "Detail your approach to code-splitting, lazy loading, and rendering strategies (SSR, SSG, ISR) in Next.js.",
      "Explain JavaScript prototypes, prototype chaining, and how inheritance works under the hood.",
      "How would you set up a robust web performance monitoring and Core Web Vitals optimization pipeline?"
    ]
  },
  backend: {
    beginner: [
      "What is the difference between SQL and NoSQL databases? When would you use which?",
      "What is Node.js and how does it handle non-blocking asynchronous operations?",
      "Explain the purpose of middleware in Express.js.",
      "What are the common HTTP status codes and what do they mean (e.g. 200, 201, 400, 401, 404, 500)?",
      "How do you connect an Express server to a MongoDB database?"
    ],
    intermediate: [
      "How do JWTs (JSON Web Tokens) work for authentication? What is the difference between access and refresh tokens?",
      "Explain database indexing. How does it improve query performance and what are the trade-offs?",
      "How do you handle errors globally in an Express.js application?",
      "Explain the event-driven architecture of Node.js and the role of the EventEmitter class.",
      "How would you design a RESTful API for a blogging platform, including routing, validation, and status codes?"
    ],
    advanced: [
      "How would you design and implement a scalable rate limiter for an API? What data store would you use?",
      "Explain the differences between clustering and worker threads in Node.js. When should each be used?",
      "How do you prevent SQL injection, XSS, and CSRF attacks in a production Node.js environment?",
      "Describe how you would debug a memory leak in a running Node.js production server.",
      "How would you handle database migrations and zero-downtime deployments in a highly active SaaS platform?"
    ]
  },
  mixed: {
    beginner: [
      "What is a REST API? Describe the main HTTP methods.",
      "What is Git? Explain the difference between git merge and git rebase.",
      "How do client-side rendering and server-side rendering differ?",
      "Explain the concept of MVC (Model-View-Controller) architecture.",
      "Tell me about a technical project you recently worked on and the challenges you faced."
    ],
    intermediate: [
      "Explain Cors (Cross-Origin Resource Sharing) and how to resolve CORS errors in production.",
      "How do you ensure password security in database storage? Explain salt, rounds, and hashing algorithms.",
      "What are WebSockets and how do they differ from HTTP polling?",
      "How would you structure a standard git-based release workflow in a team of 5 developers?",
      "Tell me about a time you had a technical disagreement with a team member. How did you resolve it?"
    ],
    advanced: [
      "Describe the design of a highly available, real-time chat application with message history persistence.",
      "How do microservices communicate? Compare REST, gRPC, and message brokers like RabbitMQ or Kafka.",
      "Explain database sharding and partitioning. When is sharding necessary, and how does it affect query planning?",
      "Describe how you would design a CI/CD pipeline for a full-stack containerized (Docker) application.",
      "Tell me about a major technical failure you were responsible for. What went wrong, and how did you remediate and prevent it?"
    ]
  }
};

// Helper to choose random question from bank
function getSimulatedQuestion(category, level, index) {
  const cat = MOCK_QUESTION_BANK[category] || MOCK_QUESTION_BANK.mixed;
  const lev = cat[level.toLowerCase()] || cat.intermediate;
  return lev[index % lev.length];
}

// Helper to simulate skill breakdown
function getSimulatedSkills(role, baseScore) {
  const normalizedRole = role.toLowerCase();
  let skills = {};

  if (normalizedRole.includes('mern') || normalizedRole.includes('fullstack') || normalizedRole.includes('full stack')) {
    skills = { 'React': 0.8, 'Node.js': 0.8, 'Express': 0.85, 'MongoDB': 0.75, 'Communication': 0.8 };
  } else if (normalizedRole.includes('front')) {
    skills = { 'HTML/CSS': 0.9, 'JavaScript': 0.85, 'React': 0.8, 'UI/UX Design': 0.7, 'Communication': 0.85 };
  } else if (normalizedRole.includes('back')) {
    skills = { 'Node.js': 0.85, 'Database Design': 0.8, 'API Design': 0.85, 'Security': 0.7, 'Communication': 0.75 };
  } else {
    skills = { 'Technical Skill': 0.8, 'Problem Solving': 0.85, 'System Design': 0.7, 'Communication': 0.8 };
  }

  // Adjust scores based on final overallScore percentage
  const multiplier = baseScore / 80;
  const breakdown = {};
  for (const [skill, val] of Object.entries(skills)) {
    breakdown[skill] = Math.min(10, Math.max(1, Math.round(val * 10 * multiplier)));
  }
  return breakdown;
}

// ----------------------------------------------------
// CORE AI SERVICES
// ----------------------------------------------------

/**
 * Generate first interview question
 */
export const generateFirstQuestion = async (role, level, experience, focus, difficulty) => {
  const prompt = `
    You are a professional technical interviewer. You are conducting a mock interview for the following role:
    - Role: ${role}
    - Seniority Level: ${level}
    - Years of Experience: ${experience}
    - Tech Focus Area: ${focus}
    - Target Difficulty: ${difficulty}
    
    Write the opening question of the interview. The question should be challenging and highly relevant to the role, seniority, and focus.
    
    You MUST respond with a JSON object matching this structure EXACTLY:
    {
      "questionText": "Your opening question here"
    }
  `;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (parsed.questionText) {
        return parsed.questionText;
      }
    } catch (error) {
      console.error('Gemini API generateFirstQuestion error, using fallback:', error);
    }
  }

  // Fallback simulator
  let category = 'mixed';
  if (focus.toLowerCase().includes('front')) category = 'frontend';
  if (focus.toLowerCase().includes('back')) category = 'backend';
  return getSimulatedQuestion(category, level, 0);
};

/**
 * Evaluate user's latest response and generate next question adaptively
 */
export const evaluateAnswerAndGetNextQuestion = async (interview, currentAnswerText) => {
  const previousQuestions = interview.questions;
  const currentQuestionIndex = previousQuestions.length;
  const currentQuestionText = previousQuestions[currentQuestionIndex - 1].questionText;

  // Prepare full conversation transcript
  const transcript = previousQuestions.map((q, idx) => {
    return `Q${idx + 1}: "${q.questionText}"\nUser: "${idx === currentQuestionIndex - 1 ? currentAnswerText : q.answerText}"\n`;
  }).join('\n');

  const prompt = `
    You are an expert technical interviewer. Evaluate the user's latest answer and generate the next adaptive interview question.
    
    INTERVIEW DETAILS:
    - Target Role: ${interview.role}
    - Experience Level: ${interview.level} (${interview.experience})
    - Focus Area: ${interview.focus}
    - Difficulty: ${interview.difficulty}
    - Total Target Questions: ${interview.questionCount}
    
    TRANSCRIPT OF INTERVIEW SO FAR:
    ${transcript}
    
    LATEST QUESTION: "${currentQuestionText}"
    LATEST USER ANSWER: "${currentAnswerText}"
    
    DIRECTIONS:
    1. Evaluate the quality, technical accuracy, and completeness of the LATEST USER ANSWER.
    2. Grade the answer on a scale from 0 to 10. Give an honest score (be strict but fair).
    3. Provide constructive, professional feedback for this specific answer in 1-3 sentences.
    4. Formulate the NEXT adaptive question (e.g. Q${currentQuestionIndex + 1}). 
       - If the user answered correctly and deeply, ask a harder follow-up or explore a complex edge-case.
       - If the user struggled or gave a surface-level answer, drill down into foundational aspects or give a helpful nudge in the right direction.
       - Ensure the question is relevant to the candidate's background (${interview.focus}, ${interview.role}).
    
    You MUST respond with a JSON object matching this structure EXACTLY:
    {
      "score": <number from 0 to 10>,
      "feedback": "Your concise constructive feedback here",
      "nextQuestionText": "Your next adaptive question here"
    }
  `;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (parsed.score !== undefined && parsed.feedback && parsed.nextQuestionText) {
        return {
          score: Number(parsed.score),
          feedback: parsed.feedback,
          nextQuestionText: parsed.nextQuestionText
        };
      }
    } catch (error) {
      console.error('Gemini API evaluateAnswerAndGetNextQuestion error, using fallback:', error);
    }
  }

  // Fallback simulator
  const score = Math.min(10, Math.max(3, Math.round(currentAnswerText.split(' ').length / 8) + 3)); // simple length heuristic
  const feedback = score >= 7 
    ? 'Excellent response! You explained the concepts clearly with appropriate technical terminology.' 
    : 'A reasonable attempt, but you could expand more on the core architectural design and standard best practices.';
  
  let category = 'mixed';
  if (interview.focus.toLowerCase().includes('front')) category = 'frontend';
  if (interview.focus.toLowerCase().includes('back')) category = 'backend';
  const nextQuestionText = getSimulatedQuestion(category, interview.level, currentQuestionIndex);

  return { score, feedback, nextQuestionText };
};

/**
 * Generate final assessment and report
 */
export const generateFinalReport = async (interview) => {
  const transcript = interview.questions.map((q, idx) => {
    return `Q${idx + 1}: "${q.questionText}"\nUser: "${q.answerText}"\nAI Score: ${q.score}/10\nAI Feedback: ${q.feedback}\n`;
  }).join('\n');

  const prompt = `
    You are a lead technical recruiter compiling a final evaluation report for a mock interview candidate.
    
    CANDIDATE INTERVIEW SPECS:
    - Target Role: ${interview.role}
    - Experience/Level: ${interview.level} (${interview.experience})
    - Focus Area: ${interview.focus}
    - Difficulty: ${interview.difficulty}
    
    TRANSCRIPT AND DETAIL OF COMPLETED INTERVIEW:
    ${transcript}
    
    DIRECTIONS:
    1. Read through the candidate's answers, scores, and feedback.
    2. Determine an Overall Technical Score (0 to 100 percentage) summarizing their total performance.
    3. Generate a Skill Breakdown score (from 1 to 10) for 4-5 relevant tech skills and "Communication".
    4. Identify 2-3 core Technical Strengths demonstrated by the user.
    5. Identify 2-3 Technical Weaknesses or areas needing improvement.
    6. Provide 2-3 specific, actionable Improvement Suggestions for study/practice.
    7. Determine the overall Recommendation level. Must be exactly one of: "Strong Hire", "Hire", "Needs Improvement".
    8. Write a comprehensive, professional summary of the candidate's performance as Final Feedback (2-4 paragraphs).
    
    You MUST respond with a JSON object matching this structure EXACTLY:
    {
      "overallScore": <number from 0 to 100>,
      "skillBreakdown": {
        "SkillName1": <number from 1 to 10>,
        "SkillName2": <number from 1 to 10>,
        "Communication": <number from 1 to 10>
      },
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "suggestions": ["Actionable advice 1", "Actionable advice 2"],
      "recommendation": "Strong Hire" | "Hire" | "Needs Improvement",
      "finalFeedback": "Your comprehensive final review..."
    }
  `;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (parsed.overallScore !== undefined && parsed.recommendation) {
        return parsed;
      }
    } catch (error) {
      console.error('Gemini API generateFinalReport error, using fallback:', error);
    }
  }

  // Fallback simulator
  const totalScorePoints = interview.questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const maxScorePoints = interview.questions.length * 10;
  const overallScore = maxScorePoints > 0 ? Math.round((totalScorePoints / maxScorePoints) * 100) : 75;

  let recommendation = 'Needs Improvement';
  if (overallScore >= 85) recommendation = 'Strong Hire';
  else if (overallScore >= 70) recommendation = 'Hire';

  const skillBreakdown = getSimulatedSkills(interview.role, overallScore);

  const strengths = [
    `Demonstrated familiarity with core ${interview.role} concepts.`,
    `Structured and logical explanation style for ${interview.focus} topics.`
  ];

  const weaknesses = [
    "Could provide more code snippets or specific architectural examples in explanations.",
    "Potential gaps in handling complex failure scenarios or edge cases under pressure."
  ];

  const suggestions = [
    `Study advanced patterns in ${interview.role} including state routing and error barriers.`,
    "Practice coding under timed environments to build comfort with instant technical articulation.",
    "Read official docs regarding system design patterns and security integrations."
  ];

  const finalFeedback = `The candidate completed a comprehensive mock interview for the position of ${interview.role} (${interview.level} level). Throughout the session, the candidate answered ${interview.questions.length} questions exploring various facets of ${interview.focus}. With a cumulative score of ${overallScore}%, the candidate has demonstrated a ${overallScore >= 70 ? 'solid' : 'developing'} grip on the primary technological frameworks required. Overall, they show great promise and would benefit from targeting the detailed improvement steps outlined in this report.`;

  return {
    overallScore,
    skillBreakdown,
    strengths,
    weaknesses,
    suggestions,
    recommendation,
    finalFeedback
  };
};
