import {EMAIL_REQUIRED,PASSWORD_REQUIRED,INVALID_EMAIL_FORMAT } from '../../constants/errors';
import {body, validationResult} from 'express-validator';

const validateLogin = [
    body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage(EMAIL_REQUIRED)
    .isEmail()
    .withMessage(INVALID_EMAIL_FORMAT),
    body("password")
    .notEmpty()
    .withMessage(PASSWORD_REQUIRED)
    .bail()
    .isLength({min:8})
    .withMessage(MIN_PASSWORD_LENGTH)
    .bail(),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        next();
    }
];
export default validateLogin;
