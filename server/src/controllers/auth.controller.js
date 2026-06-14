import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser(name, email, password);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      ...data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserById(userId);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
