//function for bluetooth connections used in App.js

export async function connect() {
  try {
    let device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          name: 'light',
        },
      ],
    })
    let server = await device.gatt.connect();
    let service = await server.getPrimaryService(0x1111);
    this.characteristic = await service.getCharacteristic(0x2222);
    this.setState({
      connectionStatus: 'Device connected'
    })
  } catch (err) {
    this.setState({
      connectionStatus: 'Device connection failed'
    })
  }
}

//sends bytes to connected bluetooth device (on position)
export async function turnDeviceOn() {
  try {
    await this.characteristic.writeValue(
      new Uint8Array([0xff, 0xff])
    )
  } catch (err) {
    if (err.name === 'TypeError') {
      return 'Oh no, looks like you don\'t have a device connected. Try connecting one and try again'
    } else {
      return 'Oh no, your device got disconnected'
    }
  }
}

//sends bytes to connected bluetooth device (off position)
export async function turnDeviceOff() {
  try {
    await this.characteristic.writeValue(
      new Uint8Array([0x00, 0x00])
    )
  } catch (err) {
    if (err.name === 'TypeError') {
      return 'Oh no, looks like you don\'t have a device connected. Try connecting one and try again'
    } else {
      return 'Oh no, your device got disconnected'
    }
  }
}
