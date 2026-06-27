import User from './../models/user.js';

class UserRepository {
    async findByEmail(email){
        return User.findOne({email: email.toLowerCase()}).select('+passwordHash');
    }
    async findById(id){
        return User.findOne({_id:id});
    }
    async create(userData){
        return User.create(userData);
    }
    async update(userId, userData){
        return User.findByIdAndUpdate(userId, userData, {new:true,lean:true,runValidators:true});
    }
    async delete(userId){
    }
}
export default new UserRepository();
