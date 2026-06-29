import {  INTERNAL_SERVER_ERROR } from '../../constants/errors.js';
import {login} from './../../services/auh/authService.js';
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
       const {user,accessToken,refreshToken} = await login(email, password,req.deviceId,req.deviceName);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, sameSite: 'Strict', maxAge: authConfig["refreshTokenMillis"]});
        return res.status(200).json({ user:user,token:accessToken   });
    } catch (error) {
        console.error('Login error:', error);
        next(INTERNAL_SERVER_ERROR);
      }
}


