import express, { Request, Response} from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'
import { Token } from '../services/token'

const router = express.Router()

router.post('/api/users/signin',
    [
        body('email')
        .isEmail()
        .withMessage('Email must be Valid'),
        body('password')
        .trim()
        .notEmpty()
        .withMessage('You Must Supply a Password')
    ],
    validateRequest,
 async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if(!existingUser){
        throw new BadRequestError('Invalid Request')
    }

    const passwordMatch = await Password.compare(existingUser.password, password)
    if(!passwordMatch){
        throw new BadRequestError('Invalid Request')
    }

     // generate jsonwebtoken
    //  const userJwt = jwt.sign({
    //     id: existingUser.id,
    //     email: existingUser.email
    // }, process.env.JWT_KEY!)
    const userJwt = await Token.generateToken(existingUser)
    req.session = {
        jwt:  userJwt
    }

    return res.status(200).send(existingUser)
})

export { router as signinRouter}