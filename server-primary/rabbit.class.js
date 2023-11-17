const amqplib = require('amqplib')

class Rabbit {
    constructor (queue) {
        this.queue = queue
    }

    async initializeQueue() {
        this.connection = await amqplib.connect({
            protocol: 'amqp',
            hostname: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest'
        })
        this.channel = await this.connection.createChannel()
        this.channel.prefetch(1, true)
        this.openQueue = await this.channel.assertQueue(this.queue, { durable: true })
    }

    async sendMessages(message, encoding='utf-8') {
        this.channel.sendToQueue(this.queue, Buffer.isBuffer(message) ? message : Buffer.from(message, encoding))
        return true
    }

    async retriveMessage (cb) {
        try {
            await this.channel.consume(this.queue, async (message) => {
                let toBeAcknowledged = await cb(message)
                if (toBeAcknowledged) {
                    this.channel.ack(message, true)
                }
            })
            
        } catch (err) {
            console.log(err)
        }
    }

    async closeChannel () {
        this.channel.close()
    }

}

module.exports = Rabbit