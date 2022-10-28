import express, {Request, Response} from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'
import jwt from 'jsonwebtoken'
import { Token } from '../services/token'

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
    validateRequest,
    async (req: Request, res: Response) => {   
    const {email, password} = req.body
    const existingUser = await User.findOne({ email })
    if(existingUser){
        console.log('Email in use')
        throw new BadRequestError('A User with the provided email already exist')
    }
    const newUser = User.build({ email, password })
    await newUser.save()
    
    // generate jsonwebtoken
    // const userJwt = jwt.sign({
    //     id: newUser.id,
    //     email: newUser.email
    // }, process.env.JWT_KEY!)
    const userJwt = await Token.generateToken(newUser)
    //store it in the session
    req.session = {
        jwt: userJwt
    }
    return res.status(201).send({ success: true, data: newUser, message: "Auth Signup for microservice"})
})

export { router as signupRouter}