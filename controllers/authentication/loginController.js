import { USER_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS } from '../../constants/errors.js';
import {loginService} from './../../services/auth/authService.js';
export const loginController = async (req, res, next) => {
    try {
       const response = await loginService(req,res,next);
        return res.status(200).json({ response });
    } catch (error) {
        console.error('Login error:', error);
        next(INTERNAL_SERVER_ERROR);
      }
}


