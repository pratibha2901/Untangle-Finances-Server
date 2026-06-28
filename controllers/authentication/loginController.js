import { USER_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS } from '../../constants/errors.js';
import {login} from './../../services/auh/authService.js';
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
       const response = await login(email, password);
        return res.status(200).json({ response });
    } catch (error) {
        console.error('Login error:', error);
        next(INTERNAL_SERVER_ERROR);
      }
}


