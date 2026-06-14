import * as interviewService from '../services/interview.service.js';

export const start = async (req, res) => {
  try {
    const userId = req.user.id;
    const interview = await interviewService.startInterview(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Interview session created successfully',
      interview,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const answer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { answerText, durationSeconds } = req.body;

    const data = await interviewService.submitAnswer(userId, id, answerText, durationSeconds);
    return res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      ...data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await interviewService.getInterviewHistory(userId);
    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const interview = await interviewService.getInterviewById(userId, id);
    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
