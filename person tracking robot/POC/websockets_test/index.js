const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  io.emit('chat message', {
    msg: 'wilkommen!',
    name: 'customname'
  })
  socket.on('chat message', msg => {
    console.log(msg)
	//test to see all users expect the original message sender receives this "hi" message
	socket.broadcast.emit('chat message', {msg: "hi", name: "kaas"});
    io.emit('chat message', msg)
  })
})

http.listen(3000, () => {
  console.log('listening on localhost:3000')
})
