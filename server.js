var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var user = require('./models/user');


app.set('view engine', 'jade');
app.use('/static', express.static('public'));

io.on('connection', function (socket) {
    
    socket.on('disconnect', function () {
        console.log('Usuario desconectado');
    });

    user.show(function (data) {
        io.emit('listar', data);
    });

    socket.on('crear', function (data) {
        user.create(data, function (rpta) {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('actualizar', (data) => {
        user.update(data, (rpta) => {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('eliminar', (data) => {
        console.log("SOCKET.ON");
        console.log(data);
        
    });
});

app.get('/', function (req, res) {
    res.render('main');
});

http.listen(port, function () {
    console.log(`Server connected in *: ${port}`);
});


