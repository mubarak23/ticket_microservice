import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
app.set('trust proxy', true)
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
)

app.use(json())

// app.get('/api/users/currentuser', (req, res) =>{
//     return res.send('Auth MicroService')
// })

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
   // console.log(process.env.JWT_KEY)
    if(!process.env.JWT_KEY){
        throw new Error('JWT KEY property is not define')
    }

   try{
    await mongoose.connect('mongodb://127.0.0.1:27017/tickets?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0')
    console.log('connection to Mongodb was successful')
   }catch(e){
    console.log(e)
   }

   app.listen(3030, () => {
    console.log('listening on port 3030 !!!')
})

}

start()


// kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml