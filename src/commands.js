import {turnDeviceOn, turnDeviceOff} from './bluetooth'
import {getTime, getGreeting} from './scripts'

const commandList = [
  {
    regex: /hello|hi|howdy|yo|sup|what\'s up|hey|aloha/,
    response: {
      response: getGreeting,
    }
  },
  {
    regex: /[\w\s]*directions[\w\s]*to[\w\s]*|[\w\s]*navigate[\w\s]*to[\w\s]*/,
    response: {
      response: "um, I'm not google maps, you can figure that out yourself",
    }
  },
  {
    regex: /[\w\s]*remind[\w\s]*me[\w\s]*|[\w\s]*set[\w\s]*reminder[\w\s]*/,
    response: {
      response: "uh, it's not my problem that you're forgetful. why don't you go ask Siri or Alexa to do that for you",
    }
  },
  {
    regex: /[\w\s]*time[\w\s]*/,
    response: {
      response: getTime,
    }
  },
  {
    regex: /nevermind|just kidding|no/,
    response: {
      response: "ok, no problem",
    }
  },
  {
    regex: /[\w\s]*sick[\w\s]*/,
    response: {
      response: "oh no, what are you symptoms?",
      followUpId: 1
    }
  },
  {
    regex: /[\w\s]*light(?:s)?[\w\s]*on[\w\s]*|[\w\s]*on[\w\s]*light(?:s)?[\w\s]*/,
    response: {
      response: "ok, I'll turn them on",
      exec: turnDeviceOn
    }
  },
  {
    regex: /[\w\s]*light(?:s)?[\w\s]*off[\w\s]*|[\w\s]*off[\w\s]*light(?:s)?[\w\s]*/,
    response: {
      response: "ok, I'll turn them off",
      exec: turnDeviceOff
    }
  },
]

export const returnResponse = (inquiry) => {
  for (let command of commandList) {
    if (inquiry.match(command.regex)) {
      return command.response
    }
  }
  return {
    response: 'Sorry, I don\'t understand what you just said'
  }
}

const followUpList = {
  1: (inquiry) => {
    if (inquiry === "head") {
      return "put some ice on it"
    } else {
      return "i feel bad"
    }
  }
}

export const returnFollowUpResponse = (inquiry, followUpId) => {
  if (followUpList[followUpId]) {
    return followUpList[followUpId](inquiry)
  }
  return 'Sorry, I don\'t understand what you just said'
}


