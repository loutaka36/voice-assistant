import {turnDeviceOn, turnDeviceOff} from './bluetooth'
import {getTime, getGreeting} from './scripts'

const commandList = [
  {
    regex: /hello|hi|howdy|yo|sup|what's up|hey|aloha/,
    response: {
      response: getGreeting,
    }
  },
  {
    regex: /fist bump/,
    response: {
      response: 'FA LALALA',
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
      response: "it's not my problem that you're forgetful. why don't you go ask Siri or Alexa to do that for you",
    }
  },
  {
    regex: /pain|hurts|hurt/,
    response: {
      response: "on a scale of 1 to 10, how would you rate your pain?",
      followUpId: 2
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
    if (inquiry.match("head")) {
      return "put some ice on it"
    } else {
      return 'Sorry, I don\'t know about that. I think WebMD might be able to help you.'
    }
  },
  2: (inquiry) => {
    if (inquiry.match(/ten|10/)) {
      return 'that\'s very severe. Please call an ambulance right away'
    } else if (inquiry.match(/seven|eight|nine|7|8|9/)){
      return 'that doesn\'t sound good. You need to go to a hopsital.'
    } else if (inquiry.match(/four|five|six|4|5|6/)) {
      return 'ouch. some pain medications such as advil may help. If you don\'t see improvement, I would go see a doctor.'
    } else if (inquiry.match(/one|two|three|1|2|3/)) {
      return 'doesn\'t seem too serious. I suggest taking it easy for now.'
    } else {
      return 'your response didn\'t make sense to me. I will assume that you are not hurt'
    }
  }
}

export const returnFollowUpResponse = (inquiry, followUpId) => {
  if (followUpList[followUpId]) {
    return followUpList[followUpId](inquiry)
  }
  return 'Sorry, I don\'t understand what you just said'
}


