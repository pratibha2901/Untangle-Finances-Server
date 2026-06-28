import RefreshToken from "./../models/refreshToken.js";

class RefreshTokenRepository {
    async findByTokenHash(tokenHash){
        return  RefreshToken.findOne({tokenHash: tokenHash});
    }
    async create(refreshTokenData){
        return RefreshToken.create(refreshTokenData);
    }
}
export default new RefreshTokenRepository();