
const{ io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen')); 
bands.addBand(new Band('Metallica')); 
bands.addBand(new Band('AC/DC')); 
bands.addBand(new Band('Los Caracoles')); 

console.log(bands);

//Mensajes de sockets
io.on('connection', client => {    
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands()) // cuando se usa cliente, envia el mensaje a todos los clientes menos al que lo origina

    client.on('disconnect', () => { 
        console.log('Cliente desconectado')
     });

    client.on('mensaje' , (payload)=> {
        console.log('Mensaje', payload)

        //io.emit('mensaje', {admin: 'Nuevo mensjae'});
        
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()) // io.emit envia el mensaje a todos los clientes
    });

    client.on('add-band', (payload) => {
        
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands()) // io.emit envia el mensaje a todos los clientes
    });

    client.on('delete-band', (payload) => {
        
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()) // io.emit envia el mensaje a todos los clientes
    });

    // client.on('emitir-mensaje' , (payload)=> {        
    //     console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);
        
    // });
  });