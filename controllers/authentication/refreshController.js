import { verifyRefreshTokenOrCreateNew } from './../../services/auth/authService.js';
import { authConfig } from "./../../constants/authConfig.js";

export const refreshController = async(req,res,next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({ error: 'Refresh token not provided' });
    }
    try{
        const response = await verifyRefreshTokenOrCreateNew(refreshToken);
        res.cookie('refreshToken', response.refreshToken, {httpOnly: true, secure: true, sameSite: 'Strict', maxAge: authConfig.refreshTokenMillis});
        return res.status(200).json({user: response.user, token: response.accessToken});
    }catch(error){
        next(error);
    }
}