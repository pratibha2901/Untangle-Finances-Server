import User from './../../models/user.js';
import bcrypt from 'bcrypt';
import { EMAIL_ALREADY_IN_USE, INTERNAL_SERVER_ERROR } from './../../constants/errors.js';
export const registerNewUser = async(req,res,next) => {
    try{
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        // Check if the user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: EMAIL_ALREADY_IN_USE});
        }
        // Create a new user
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({ email:normalizedEmail, passwordHash:hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch(error){
        if(error.code  === 11000){
            return res.status(409).json({ message: EMAIL_ALREADY_IN_USE });
        }
        console.error('Registration error:', error);
        next(INTERNAL_SERVER_ERROR);
    }
}