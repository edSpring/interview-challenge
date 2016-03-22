# Todo Backend Test

## Intro

We are so excited that you are applying to be part of the edSpring team here at TIES!

This repo is designed for you to show us how you tackle problems. Simply fork the repo, complete the tasks listed below and make a pull request with comments about your thought process.

>By submitting a pull request you are saying that this is your own original work. Copying others work may disqualify you from continuing the interview process.

## Getting Started
On the edSpring team we use `Meteor` for our app architecture. This means our app uses javascript for the whole stack. We are also slowly adopting ECMAScript 2015 and React. You might not be super familiar with these frame works and __that is ok__, this could be a chance for you to practice your Google-Foo. So here are some steps to get you started.

First you will need to install `node` and `Meteor`.

>A great place to do this in is on [c9.io](c9.io). It is a cloud editor that will make you environment easy to setup.

After cloning the repo locally, you can change to the app directory in the terminal and run `npm install`. When it is done run the `meteor` command. Once it is running you should be able to see the app running at `localhost:3000` in your browser.

While this is running, you can run the tests by opening another terminal window, in the repo directory, and running `meteor test --driver-package avital:mocha --port 3100`. This will allow you to open a browser and see any failing tests at `localhost:3100`.

As always at edSpring we work as a team. So if you have troubles getting things setup reach out to us and we can work together to get you up and running so you can show us what you are capable of.

## Tasks

>If you are not able to do one of these tasks, __that is ok__. Write down observations, thoughts and approaches you did make as comments. If you can't do one of the tasks move on to the next one. We are more interested in your process over whether or not you put in the _"right"_ answer.

### 1. Fixing tests

When your tests run you will notice that there are some that are failing. Use your awesome skills to pinpoint the failure and get it fixed so that we can get this app into production!

### 2. Fix the user sees private tasks bug (New feature?)

With the last release there was a request for users to be able to mark tasks private. As a new feature if a task is marked private only the task owner should be able to see it.

Please update the code so that only the user that owns a private task sees the task in the list of tasks.

### 3. Add your own improvements to the app

We have really enjoyed your work on this app and now we need you to add your own little bit flare to it. Do as much or as little as you like. We are interested in the thought process behind your additions. Why did you make the changes that you did?
