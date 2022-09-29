import express from 'express'

const app = express()

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
    return res.send({ success: true, message: "Auth Signout for microservice"})
})

export { router as signoutRouter}