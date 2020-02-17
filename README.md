# Baymax - your personal assistant

## A Voice Assistant That Talks To You

Meet Baymax, your personal assistant. You can ask him anything by saying "Hey Baymax". He handles a variety of health related questions as well as the ability to handle bluetooth connected devices.

<image alt="main page" src="./main.png" width="300px">

This project was built using Google Chrome’s SpeechRecognition API, SpeechSynthesis API, and Web Bluetooth API.

## Features

* Takes advantage of Google Chrome's SpeechRecognition API to convert speech to a string and uses regular expressions to find key words to formulate a response.

* Uses Google Chrome's SpeechSynthesis API to return an audible response to the user.

* Google Chrome's Web Bluetooth API allows bluetooth peripherals to be connected to the application.

## Demo

Please go [here](https://loutaka36.github.io/voice-assistant/) for a demo of the application.

**Note: you must be using Google Chrome or another compatible browser to run the application**

## Running From Source

Clone this repository. You must have node and npm installed globally on your machine.

Installation:

`npm install`

Start application:

`npm run start`

## Project Information

This project was built during a four day hackathon at [Fullstack Academy](https://www.fullstackacademy.com) in Chicago. Explore a new technology and built an app in a short amount of time.
