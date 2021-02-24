const express = require('express')
const app = express()
const appPort = 3000
const path = require('path');

// const SerialPort = require('serialport');
// const port = new SerialPort('/dev/ttyS8');

app.use(express.static('public'))
app.get('/', (req, res) => {
	res.sendFile(path.resolve('public/posenet.html'));
})
app.listen(appPort, () => {
	console.log(`Example app listening at http://localhost:${appPort}`)
})