import { Interview } from '../models/db.js';
import * as aiService from './ai.service.js';

export const startInterview = async (userId, data) => {
  const { role, level, experience, focus, difficulty, questionCount, interviewType } = data;

  if (!role || !level || !experience || !focus || !difficulty || !questionCount) {
    throw new Error('Missing required interview configuration fields');
  }

  // 1. Generate the very first question from the AI
  const firstQuestionText = await aiService.generateFirstQuestion(
    role,
    level,
    experience,
    focus,
    difficulty
  );

  // 2. Create interview document
  const interview = await Interview.create({
    userId,
    role,
    level,
    experience,
    focus,
    difficulty,
    questionCount: Number(questionCount),
    interviewType: interviewType || 'Technical',
    questions: [
      {
        questionText: firstQuestionText,
        answerText: '',
        score: 0,
        feedback: '',
        durationSeconds: 0
      }
    ],
    status: 'in-progress'
  });

  return interview;
};

export const submitAnswer = async (userId, interviewId, answerText, durationSeconds) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview session not found');
  }

  if (interview.userId !== userId) {
    throw new Error('Not authorized to access this interview');
  }

  if (interview.status !== 'in-progress') {
    throw new Error('This interview is already completed');
  }

  const currentQuestions = interview.questions;
  const currentIdx = currentQuestions.length - 1;

  if (currentIdx < 0) {
    throw new Error('No active question in this session');
  }

  // 1. Evaluate the current answer and retrieve next adaptive question
  const evaluation = await aiService.evaluateAnswerAndGetNextQuestion(interview, answerText);

  // 2. Update current question details
  currentQuestions[currentIdx].answerText = answerText || '[No response provided]';
  currentQuestions[currentIdx].score = evaluation.score;
  currentQuestions[currentIdx].feedback = evaluation.feedback;
  currentQuestions[currentIdx].durationSeconds = Number(durationSeconds) || 0;

  let isCompleted = false;
  let nextQuestionText = '';

  // 3. Determine if we continue or complete
  if (currentQuestions.length < interview.questionCount) {
    // Generate next question
    nextQuestionText = evaluation.nextQuestionText;
    currentQuestions.push({
      questionText: nextQuestionText,
      answerText: '',
      score: 0,
      feedback: '',
      durationSeconds: 0
    });

    await Interview.findByIdAndUpdate(interviewId, {
      questions: currentQuestions
    });
  } else {
    // We have reached the final question. Transition to completed and run evaluation
    isCompleted = true;
    interview.status = 'completed';

    // Temporary update so generateFinalReport has the latest updated question answers
    interview.questions = currentQuestions;
    
    console.log(`Generating final report for interview ${interviewId}...`);
    const report = await aiService.generateFinalReport(interview);

    // Save final report data
    await Interview.findByIdAndUpdate(interviewId, {
      questions: currentQuestions,
      status: 'completed',
      overallScore: report.overallScore,
      finalFeedback: report.finalFeedback,
      recommendation: report.recommendation,
      skillBreakdown: report.skillBreakdown,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      suggestions: report.suggestions
    });
  }

  // Refetch the updated interview
  const updatedInterview = await Interview.findById(interviewId);

  return {
    isCompleted,
    score: evaluation.score,
    feedback: evaluation.feedback,
    nextQuestionText,
    interview: updatedInterview
  };
};

export const getInterviewHistory = async (userId) => {
  return await Interview.find({ userId });
};

export const getInterviewById = async (userId, interviewId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview session not found');
  }

  if (interview.userId !== userId) {
    throw new Error('Not authorized to access this interview');
  }

  return interview;
};
