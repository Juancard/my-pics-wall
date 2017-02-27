# My Pics Wall!

## Overview

Here are the specific user stories implemented for this project:
- User Story: As an unauthenticated user, I can login with Twitter.
- User Story: As an authenticated user, I can link to images.
- User Story: As an authenticated user, I can delete images that I've linked to.
- User Story: As an authenticated user, I can see a Pinterest-style wall of all the images I've linked to.
- User Story: As an unauthenticated user, I can browse other users' walls of images.
- User Story: As an authenticated user, if I upload an image that is broken, it will be replaced by a placeholder image.

# Quick Start Guide

### Prerequisites

In order to use my-pics-wall, you must have the following installed:

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [MongoDB](http://www.mongodb.org/)
- [Git](https://git-scm.com/)

### Installation & Startup

To install this app, simply enter the below in the terminal window:

```bash
$ git clone https://github.com/Juancard/my-pics-wall your-project
```

To install the dependencies, enter the following in your terminal:

```
$ cd your-project
$ npm install
```

This will install the my-pics-wall components into the `your-project` directory.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
MONGO_URI=mongodb://localhost:27017/my-pics-wall
NODE_ENV='development'
PORT=8080
TWITTER_KEY=your-client-id-here
TWITTER_SECRET=your-client-secret-here
APP_URL=http://localhost:8080/
```

### Starting the App

To start the app, make sure you're in the project directory and type `node server.js` into the terminal. This will start the Node server and connect to MongoDB.

You should the following messages within the terminal window:

```
Node.js listening on port 8080...
```

Next, open your browser and enter `http://localhost:8080/`. Congrats, you're up and running!

## License

MIT License. [Click here for more information.](LICENSE.md)
