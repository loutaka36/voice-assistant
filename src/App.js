import React from 'react';
import './App.css';
import {returnResponse, returnFollowUpResponse} from './commands'
import {connect} from './bluetooth'
import {Button} from 'semantic-ui-react'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: '',
      inquiring: false,
      followUpId: null,
      connectionStatus: 'Device not connected',
      speechResults: '',
      poweredOn: false
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
    this.handlePower = this.handlePower.bind(this)
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
      if (this.state.poweredOn) {
        this.recognition.start();
      }
    }
    recognition.onresult = async event => { //sets up logic for talking back
      const result = event.results[0][0].transcript;
      this.setState({
        speechResults: result
      })
      console.log(result);

      if (result === 'hey Baymax' && !this.state.inquiring) { //all request must start with 'hey Baymax'
        let phrase = new SpeechSynthesisUtterance('yes?')
        this.baymax.speak(phrase)
        this.setState({
          displayText: 'Yes?',
          inquiring: true
        })

      } else if (this.state.inquiring && !this.state.followUpId) { //if there is not follow up pending
        let {response, followUpId, exec} = returnResponse(result);
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
          if (typeof response === 'function') {
            response = response()
          }
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

  componentWillUnmount() {
    this.recognition.abort()
  }

  handlePower() {
    if (this.state.poweredOn) {
      this.recognition.stop()
      let phrase = new SpeechSynthesisUtterance('goodbye')
      this.baymax.speak(phrase)
      this.setState({
        poweredOn: false,
        displayText: 'goodbye',
        speechResults: ''
      })
    } else {
      this.recognition.start()
      let phrase = new SpeechSynthesisUtterance('Hi, I am Baymax, your personal assistant. Say "Hey Baymax" if you need anything.')
      this.baymax.speak(phrase)
      this.setState({
        poweredOn: true,
        displayText: 'Hi, I am Baymax, your personal assistant. Say "Hey Baymax" if you need anything.',
        speechResults: ''
      })
    }
  }

  render() {
    let topEyelid
    let bottomEyelid
    if (this.state.poweredOn) {
      topEyelid = "eyelid-top"
      bottomEyelid = "eyelid-bottom"
    } else {
      topEyelid = "eyelid-top-inactive"
      bottomEyelid = "eyelid-bottom-inactive"
    }

    return (
      <div className="App">
        <div className="baymax-container">
          <div className="baymax"></div>
          <div className={topEyelid}></div>
          <div className={bottomEyelid}></div>
        </div>
        <div>
          {this.state.displayText}
        </div>
        <div className="user-input">
          <div className="user-input_label">Your Input:</div>
          <div className="user-input_results">{this.state.speechResults}</div>
        </div>
        <Button className="power" onClick={this.handlePower}>{this.state.poweredOn ? 'Shut Down' : "Power On"}</Button>
        <div>
          <Button onClick={connect.bind(this)}>Connect To Device</Button>
          <div className="connection-status">{this.state.connectionStatus}</div>
        </div>
      </div>
    );
  }
}

export default App;

