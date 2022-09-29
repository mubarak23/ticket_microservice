import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'

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
    (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).send(errors.array())
        // throw new Error("Invalid Email and Password")
        throw new RequestValidationError(errors.array())
    }    
    const {email, password} = req.body
    console.log('Sigup a new user')
    
   //  throw new Error('Error connecting to the database')
   throw new DatabaseConnectionError()
    return res.send({ success: true, message: "Auth Signup for microservice"})
})

export { router as signupRouter}