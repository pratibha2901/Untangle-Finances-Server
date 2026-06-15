import { jwtVerify } from 'jose';

const secret = new TextEncode().encode(process.env.JWT_SECRET);
export const authenticate = async (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try{
        const { payload } = await  jwtVerify(token,secret);
        req.user = payload;
        next();
    }catch(error){
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}