import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
     reason = 'Error Connecting to the Database'
    constructor(){
        super('Error Connecting to the Database')
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors(){
        return [
            { message: this.reason}
        ]
    }
}