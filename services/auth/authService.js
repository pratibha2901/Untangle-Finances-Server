import { USER_NOT_FOUND, INVALID_CREDENTIALS } from '../../constants/errors.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authConfig } from "./../../constants/authConfig.js";
import UserRepository from "./../../repository/userRepository.js";
import RefreshTokenRepository from "./../../repository/refreshTokenRepository.js";
import { generateToken, generateRefreshToken,verifyRefreshToken } from '../../utility/jwtUtility.js';

export const login = async (email,password, deviceId,deviceName) => {
     
        const normalizedEmail = email.trim().toLowerCase();
        const user = await UserRepository.findByEmail(normalizedEmail);
        if(!user){
            throw new Error(USER_NOT_FOUND );
        }
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordMatch){
            throw new Error( INVALID_CREDENTIALS );
        }
        const token = await generateToken(user);
        const jwtRefreshToken = await generateRefreshToken(user);
        const refreshTokenHash = crypto.createHash('sha256').update(jwtRefreshToken).digest('hex');
        await RefreshTokenRepository.create({ userId: user._id, tokenHash: refreshTokenHash, deviceId: deviceId, deviceName:deviceName, expiresAt: new Date(Date.now() + authConfig.refreshTokenMillis) });
        //res.cookie('refreshToken', jwtRefreshToken, {httpOnly: true, secure: true, sameSite: 'Strict', maxAge: authConfig["refreshTokenMillis"]});
        
        //const response = createLoginResponse(user, token);
        return {
            user: {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    participationType: user.participationType,
                    familyRole: user.familyRole,
                    income: user.income
                },
                accessToken:token,refreshToken:jwtRefreshToken};
}
export const verifyRefreshTokenOrCreateNew = async (refreshToken) => {
    // create hash
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    // find refresh token in database
    const storedToken = await RefreshTokenRepository.findByTokenHash(refreshTokenHash);
    
    
    if(!storedToken){
        throw new Error('Invalid refresh token');
    }
    if(storedToken.expiresAt < new Date()){
        throw new Error('Refresh token expired');
    }
    if(storedToken.isRevoked){
        throw new Error('Refresh token revoked');
    }
    // verify jwt signature
    const payload = await verifyRefreshToken(refreshToken)
    // generate new refresh token and access token
    const user = await UserRepository.findById(payload.userId);
    if(user && payload.userId.toString() === storedToken.userId.toString() )
    {
        const newRefreshToken = await generateRefreshToken(user);
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
        const jwtAccessToken = await generateToken(user);
        await RefreshTokenRepository.create({ userId: user._id, tokenHash: newRefreshTokenHash, deviceId: storedToken.deviceId, deviceName: storedToken.deviceName, expiresAt: new Date(Date.now() + authConfig.refreshTokenMillis) });
        
        // revoke old refresh token
        await RefreshTokenRepository.revoke(storedToken._id);
        return { accessToken: jwtAccessToken, refreshToken: newRefreshToken,
            user: {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    participationType: user.participationType,
                    familyRole: user.familyRole,
                    income: user.income
                }

        };
    }else{
        throw new Error('Invalid Refresh Token, User not found!')
    }
}
