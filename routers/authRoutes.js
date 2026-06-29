import {registerNewUser} from './../controllers/authentication/registerController.js';
import {loginController} from './../controllers/authentication/loginController.js';
import {refreshController} from './../controllers/authentication/refreshController.js';
import express from 'express';
import  validateLogin from './../validators/validateLogin';
import validateRegister from './../validators/validateRegister';

const authRouter = express.Router();

authRouter.post('/register',validateRegister, registerNewUser);
authRouter.post('/login',validateLogin, loginController);
authRouter.post('/refresh-token', refreshController);

export default authRouter;