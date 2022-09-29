import { ValidationError } from "express-validator"
import { CustomError } from "./custom-error"



export class RequestValidationError extends Error implements CustomError {
    statusCode = 400
    constructor( public errors: ValidationError[]){
        super()

        // Just because we are extending built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors(){
        return this.errors.map(error => {
            return { message: error.msg, field: error.param}
        })
        
    }
}