
import jwt from 'jsonwebtoken'
export class Token {
// generate jsonwebtoken
    static async generateToken(exitingUser: any){
        const userJwt = jwt.sign({
            id: exitingUser.id,
            email: exitingUser.email
        }, process.env.JWT_KEY!)
        
        return userJwt
    }
}