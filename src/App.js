import React from 'react';
import './App.css';
import {returnResponse, returnFollowUpResponse} from './commands'
import {connect, turnDeviceOn, turnDeviceOff} from './bluetooth'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: '',
      inquiring: false,
      followUpId: null,
      connectionStatus: 'Device not connected'
    }

    const SpeechRecognition = window.SpeechRecognition
    || window.webkitSpeechRecognition
    || window.mozSpeechRecognition
    || window.msSpeechRecognition
    || window.oSpeechRecognition;

    if (SpeechRecognition != null) {
      this.recognition = this.createRecognition(SpeechRecognition)
      this.baymax = this.createBaymaxVoice()
    } else {
      window.alert('The current browser does not support the SpeechRecognition API.')
    }

    this.characteristic = null;
  }

  createRecognition(SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang =  'en-US';
    recognition.onstart = () => {
      console.log("Listening!")
    }
    recognition.onend = () => {
      console.log("Stopping");
      this.recognition.start();
    }
    recognition.onresult = async event => { //sets up logic for talking back
      const result = event.results[0][0].transcript;
      console.log(result);

      if (result === 'hey' && !this.state.inquiring) { //all request must start with 'hey Baymax'
        let phrase = new SpeechSynthesisUtterance('yes?')
        this.baymax.speak(phrase)
        this.setState({
          displayText: 'Yes?',
          inquiring: true
        })

      } else if (this.state.inquiring && !this.state.followUpId) { //if there is not follow up pending
        const {response, followUpId, exec} = returnResponse(result);
        if (exec && !followUpId) { //if there is an executable and no followup Id
          let error = await exec.bind(this)()
          if (error === 'Oh no, your device got disconnected') {
            let phrase = new SpeechSynthesisUtterance(error)
            this.baymax.speak(phrase)
            this.setState({
              displayText: error,
              inquiring: false,
              connectionStatus: "Device disconnected"
            })
          } else if (error) {
            let phrase = new SpeechSynthesisUtterance(error)
            this.baymax.speak(phrase)
            this.setState({
              displayText: error,
              inquiring: false,
            })
          } else {
            let phrase = new SpeechSynthesisUtterance(response)
            this.baymax.speak(phrase)
            this.setState({
            displayText: response,
            inquiring: false,
            })
          }
        } else if (exec && followUpId) { // if there is an executable and follow up Id
          let error = await exec.bind(this)()
          if (error) {
            let phrase = new SpeechSynthesisUtterance(error)
            this.baymax.speak(phrase)
            this.setState({
              displayText: error,
              inquiring: false,
            })
          } else {
            let phrase = new SpeechSynthesisUtterance(response)
            this.baymax.speak(phrase)
            this.setState({
              displayText: response,
              inquiring: true,
              followUpId
            })
          }
        } else if (followUpId) {
          let phrase = new SpeechSynthesisUtterance(response)
            this.baymax.speak(phrase)
            this.setState({
              displayText: response,
              inquiring: true,
              followUpId
            })
        } else {
          let phrase = new SpeechSynthesisUtterance(response)
          this.baymax.speak(phrase)
          this.setState({
            displayText: response,
            inquiring: false,
          })
        }

      } else if (this.state.inquiring && this.state.followUpId) { //if there is a follow up pending
        const response = returnFollowUpResponse(result, this.state.followUpId);
        let phrase = new SpeechSynthesisUtterance(response)
        this.baymax.speak(phrase)
        this.setState({
          displayText: response,
          inquiring: false,
          followUpId: null
        });
      }
      this.recognition.stop()
    }
    return recognition;
  }

  createBaymaxVoice() { //creates speech synthesis object
    const baymax = window.speechSynthesis

    return baymax;
  }

  componentDidMount() {
    let phrase = new SpeechSynthesisUtterance("Hi, I am Baymax, your personal assistant. Talk to me if you need anything.")
    this.baymax.speak(phrase)
    this.recognition.start();
  }

  render() {
    return (
      <div className="App">
        <div>
          Baymax
        </div>
        <div>
          {this.state.displayText}
        </div>
        <button onClick={connect.bind(this)}>Connect To Device</button>
        <button onClick={turnDeviceOn.bind(this)}>Turn on</button>
        <button onClick={turnDeviceOff.bind(this)}>Turn off</button>
        <div>{this.state.connectionStatus}</div>
      </div>
    );
  }
}

export default App;
