import {SignJWT} from 'jose';

const generateToken = async (user) => {
   const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
   const token =await new SignJWT({userId: user._id, email: user.email, participationType: user.participationType, familyRole: user.familyRole})
   .setProtectedHeader({alg:'HS256'})
   .setIssuedAt()
   .setExpirationTime('15m')
   .sign(secretKey);
    return token;
}
const generateRefreshToken = async (user) => {
    const refreshSecret = new TextEncode().encode(process.env.REFRESH_SECRET);
    const refreshToken = await new SignJWT({userId: user._id, email: user.email})
    .setProtectedHeader({alg:'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(refreshSecret);
    return refreshToken;
}