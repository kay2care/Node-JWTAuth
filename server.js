require('dotenv').config()
const jwt = require('jsonwebtoken')

const express = require('express')
const app = express()
app.use(express.json())


app.get('/posts', authenticateToken, (req, res) => {
    const posts = [
        { username: "Mojuba", title: "Post 1" }, { username: "Ilori", title: "Post 2" }
    ]
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return res
            .status(401)
            .json({
                errorCode: 01,
                errorDescription: "Token Missing"
            })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res
                .status(403)
                .json({
                    errorCode: 03,
                    errorDescription: "Invalid Token"
                })
        req.user = user
        next()
    })
}

app.listen(3000)