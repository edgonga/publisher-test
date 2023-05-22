/* eslint-disable @typescript-eslint/no-floating-promises */
import { Publisher } from './Publisher'
import { Subscriber } from './Subscriber'

const AshKetchup = new Publisher('Pokemon Biology', 'Ash Ketchup')
AshKetchup.connectToMoodle().then(() => {
  AshKetchup.publishHomework('Pikachu is a mouse')
  AshKetchup.publishHomework("Charmander don't like water")
}).finally(() => {
  AshKetchup.disconnect()
})

const ProfessorOak = new Subscriber('Pokemon Biology', 'Professor Oak')
ProfessorOak.connectToMoodle().then(() => {
  ProfessorOak.reviewingNews()
})
