//function for bluetooth connections used in App.js

export async function connect() {
  try {
    let device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [0x1111], //'00010203-0405-0607-0809-0a0b0c0d1911'
        },
      ],
      // optionalServices: ['00010203-0405-0607-0809-0a0b0c0d1910']
    })
    let server = await device.gatt.connect();
    let service = await server.getPrimaryService(0x1111);
    this.characteristic = await service.getCharacteristic(0x2222);
    console.log(this.characteristic)
    this.setState({
      connectionStatus: 'Device connected'
    })
  } catch (err) {
    console.log(err)
    this.setState({
      connectionStatus: 'Device connection failed'
    })
  }
}

//sends bytes to connected bluetooth device (on position)
export async function turnDeviceOn() {
  try {
    await this.characteristic.writeValue(
      new Uint8Array([0x01])
    )
    console.log(this.characteristic)
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
    const val = await this.characteristic.writeValue(
      new Uint8Array([0x00, 0x00])
    )
    console.log(val)
  } catch (err) {
    if (err.name === 'TypeError') {
      return 'Oh no, looks like you don\'t have a device connected. Try connecting one and try again'
    } else {
      return 'Oh no, your device got disconnected'
    }
  }
}
