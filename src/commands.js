import {turnDeviceOn, turnDeviceOff} from './bluetooth'
import {getTime} from './scripts'

const commandList = [
  {
    regex: /hello/,
    response: {
      response: "hi there",
    }
  },
  {
    regex: /[\w\s]*time[\w\s]*/,
    response: {
      response: getTime(),
    }
  },
  {
    regex: /nevermind|just kidding|no/,
    response: {
      response: "ok, no problem",
    }
  },
  {
    regex: /I feel sick/,
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


