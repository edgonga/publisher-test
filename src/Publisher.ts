/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as amqp from 'amqplib'

export class Publisher {
  private connection: amqp.Connection
  private channel: amqp.Channel
  private readonly queueName: string
  private readonly studentName: string

  constructor (queueName: string, studentName: string) {
    this.queueName = queueName
    this.studentName = studentName
  }

  public getProperties () {
    return {
      queue: this.queueName,
      student: this.studentName,
      connection: this.connection,
      channel: this.channel
    }
  }

  public async connectToMoodle (): Promise<void> {
    let attempts = 3
    while (attempts > 0) {
      try {
        const amqpUrl = process.env.AMQP_URL || 'amqp://localhost'
        this.connection = await amqp.connect(amqpUrl)
        this.channel = await this.connection.createChannel()
        await this.channel.assertQueue(this.queueName, { durable: false })
        return
      } catch (err) {
        console.error(`Failed to connect: ${err.message}`)
        attempts--
        const delay = Math.pow(2, 3 - attempts) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Failed to connect to the queue after multiple attepmts')
  }

  private logHomeworkPublished (homework: string): void {
    console.log(`The student ${this.studentName} has published the sprint ${this.queueName} with the following content: 
        ${homework}`)
  }

  public async publishHomework (homework: string): Promise<void> {
    try {
      this.channel.sendToQueue(this.queueName, Buffer.from(homework))
      this.logHomeworkPublished(homework)
    } catch (err) {
      console.error(`Failed to publish the homework to the queue ${this.queueName} (error: ${err.message})`)
    }
  }

  public async disconnect (): Promise<void> {
    await Promise.all([
      this.channel.close(),
      this.connection.close()
    ])
  }
}
