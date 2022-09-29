import { Request, Response, NextFunction } from "express"
import { RequestValidationError } from "../errors/request-validation-error"
import { DatabaseConnectionError } from "../errors/database-connection-error"

export const errorHandler = ( 
    err: Error,
    req: Request,
    res: Response,
    next:NextFunction 
       ) => {

        if(err instanceof RequestValidationError){
            console.log('Handling this error as Request Validation Error')
            // const formattedErrors = err.errors.map(error => {
            //     return { message: error.msg, field: error.param}
            // })
            return res.status(err.statusCode).send({ error: err.serializeErrors() })
        }

        if(err instanceof DatabaseConnectionError){
            console.log('Handling this error as a DB Connection Error')
            return res.status(err.statusCode).send({ errors: [ { message: err.serializeErrors() }]})
        }

        res.status(400).send({
            errors: [
                {message: "Something when wrong"}
            ]
        })
    }