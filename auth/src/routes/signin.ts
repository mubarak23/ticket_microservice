import express from 'express'

const router = express.Router()

router.post('/api/users/signin', (req, res) => {
    return res.send({ success: true, message: "Auth Signin for microservice"})
})

export { router as signinRouter}