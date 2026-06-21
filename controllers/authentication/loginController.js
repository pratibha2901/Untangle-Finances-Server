import { USER_NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../constants/errors.js';
import User from "./../../models/user.js";
import { SignJWT }  from 'jose';
import bcrypt from 'bcrypt';
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
        if(!user){
            return res.status(404).json({ error: USER_NOT_FOUND });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordMatch){
            return res.status(401).json({ error: INVALID_CREDENTIALS });
        }
        const token = await generateToken(user);
        const response = createLoginResponse(user, token);
        return res.status(201).json({ response });
    } catch (error) {
        console.error('Login error:', error);
        next(INTERNAL_SERVER_ERROR);
      }
}
const generateToken = async (user) => {
   const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
   const token =await new SignJWT({userId: user._id, email: user.email})
   .setProtectedHeader({alg:'HS256'})
   .setIssuedAt()
   .setExpirationTime('15m')
   .sign(secretKey);
    return token;
}
const createLoginResponse = (user, token) => {
    return {
        token,        
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
