const express = require("express");
const bodyParser = require("body-parser");
const Rabbit = require("./rabbit.class");

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const rabmq = new Rabbit('test_queue')

rabmq.initializeQueue()

app.post('/emit-message', async (req, res) => {
    console.log(req.body.message)
    await rabmq.sendMessages(req.body.message)
    return res.json({ success: true, message: 'Emitted Successfully' })
})


app.listen(5000, () => {
    console.log('Server runs on port 5000...')
})