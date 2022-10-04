import mongoose from "mongoose"
import { Password } from '../services/password'

// an interface that description the 
// properties that is use to create a new user

interface UserAttrs {
    email: string,
    password: string
}

// an interfcae that describe the properties that
// are require to create a new User
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;

}

// an interface that describe the properties
// that a user document has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
        done()
    }
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('Users', userSchema)

User.build({
    email: "test@gmail.com",
    password: "thtieehdr"
})





export { User }
