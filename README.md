# Nui Full-Stack Coding Challenge

This repo was made to deliver a coding challenge for a Full-Stack role at Nui Care.

## Description

The idea is to provide a backend that shows the user what care services they are eligible for based on their situation.

The endpoints available from this API can be tested using the rest client of your choice, thought I recommend the [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VSCode. There are files defined in the [restClient](https://github.com/felipefa/nui-challenge-api/tree/main/restClient) folder that can be used to test the endpoints.

The application was built using the following technologies:

- [Fastify](https://www.fastify.io/)
- [Firebase](https://firebase.google.com/)
- [Jest](https://jestjs.io/)
- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev)

## How to run

Before running the application, you will need to get the service account file from the Firebase project from Nui. Then simply follow the steps below:

- Create a new `.env` file based on the `.env.example` file.

- Install the dependencies:

```bash
pnpm install
```

- Run the application:

```bash
pnpm run dev
```

## How to run the tests

Simply run the following command:

```bash
pnpm run test
```
