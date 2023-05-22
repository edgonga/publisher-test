import { Publisher } from '../app/Publisher'
import * as amqp from 'amqplib'

test('it can connect to the queue', async () => {
  const publisher = new Publisher('Finance', 'Loggie')
  await expect(publisher.connectToMoodle()).resolves.not.toThrow()
  await publisher.disconnect()
})

test('Tests that the class throws an error after failing to connect to the queue after multiple attempts', async () => {
  const publisher = new Publisher('nonExistentQueue', 'John Doe')
  await expect(publisher.connectToMoodle()).rejects.toThrow('Failed to connect to the queue after multiple attepmts')
})

test('Tests that the class logs the published homework with the student name and queue name', () => {
  const publisher = new Publisher('queue1', 'John')
  const consoleSpy = jest.spyOn(console, 'log')
  publisher.publishHomework('Homework content')
  expect(consoleSpy).toHaveBeenCalledWith(`The student John has published the sprint queue1 with the following content: 
    Homework content`)
})

test('Tests that the queue is correctly created when connecting to the queue', async () => {
  const publisher = new Publisher('queue1', 'John')
  const connectSpy = jest.spyOn(amqp, 'connect')
  const createChannelSpy = jest.spyOn(publisher.getProperties().connection, 'createChannel')
  const assertQueueSpy = jest.spyOn(publisher.getProperties().channel, 'assertQueue')
  await publisher.connectToMoodle()
  expect(connectSpy).toHaveBeenCalledWith('amqp://localhost')
  expect(createChannelSpy).toHaveBeenCalled()
  expect(assertQueueSpy).toHaveBeenCalledWith('queue1', { durable: false })
})
