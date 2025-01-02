require('dotenv').config()
const express = require('express')
const router = require('./routes/routes')
const app = express()
const port = process.env.port
const { connectDB } = require('./common/db')


app.use(express.json()); 

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

app.get('/*', (req, res) => {
    res.send('Invalid API Path')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
