import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { User } from '../models/user'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error'
import jwt from 'jsonwebtoken'

const router = express.Router()


router.post('/api/users/signup', 
    [
        body('email')
        .isEmail()
        .withMessage('Email must be Valid'),
        body('password')
        .trim()
        .isLength({min: 4, max: 8})
        .withMessage('Password must be between 4 and 8')
    ],
    async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }    
    const {email, password} = req.body
    const existingUser = await User.findOne({ email })
    if(existingUser){
        console.log('Email in use')
        throw new BadRequestError('A User with the provided email already exist')
    }
    const newUser = User.build({ email, password })
    await newUser.save()
    
    // generate jsonwebtoken
    const userJwt = jwt.sign({
        id: newUser.id,
        email: newUser.email
    }, process.env.JWT_KEY!)

    //store it in the session
    req.session = {
        jwt: userJwt
    }
    return res.status(201).send({ success: true, data: newUser, message: "Auth Signup for microservice"})
})

export { router as signupRouter}