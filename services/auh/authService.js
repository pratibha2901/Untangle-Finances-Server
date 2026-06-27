import { USER_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS } from '../../constants/errors.js';
import User from "./../../models/user.js";
import { SignJWT }  from 'jose';
import bcrypt from 'bcrypt';
import RefreshToken from "./../../models/refreshToken.js";
import crypto from 'crypto';
import { authConfig } from "./../../constants/authConfig.js";
import {userRepository} from "./../../repository/userRepository.js";
import {refreshTokenRepository} from "./../../repository/refreshTokenRepository.js";

export const login = async (email,password) => {
     
        const normalizedEmail = email.trim().toLowerCase();
        const user = await userRepository.findByEmail(normalizedEmail);
        if(!user){
            return res.status(404).json({ error: USER_NOT_FOUND });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordMatch){
            return res.status(401).json({ error: INVALID_CREDENTIALS });
        }
        const token = await generateToken(user);
        const jwtRefreshToken = await generateRefreshToken(user);
        const refreshTokenHash = crypto.createHash('sha256').update(jwtRefreshToken).digest('hex');
        const refreshToken = new RefreshToken({ userId: user._id, tokenHash: refreshTokenHash, deviceId: req.body.deviceId, deviceName: req.body.deviceName, expiresAt: new Date(Date.now() + authConfig["refreshTokenMillis"]) });
        await refreshTokenRepository.create(refreshToken);
        res.cookie('refreshToken', jwtRefreshToken, {httpOnly: true, secure: true, sameSite: 'Strict', maxAge: authConfig["refreshTokenMillis"]});
        
        const response = createLoginResponse(user, token);
        return response;
}

const createLoginResponse = (user, token,refreshToken) => {
    return {
        token,
        refreshToken,        
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            participationType: user.participationType,
            familyRole: user.familyRole,
            income: user.income,
            userId: user._id,
            email: user.email,
        }
    }
}