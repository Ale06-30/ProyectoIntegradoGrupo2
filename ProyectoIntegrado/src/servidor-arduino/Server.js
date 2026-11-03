// 1. IMPORTAR LIBRERIAS
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

// 2. CREAR SERVIDOR
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(cors());

// 3. CONFIGURAR PUERTO SERIAL
// CAMBIAR! Usa COM3, COM4, etc.
const PUERTO_ARDUINO = 'COM3';

// Intentar conectar con Arduino
let serialPort;
try {
    serialPort = new SerialPort({
        path: PUERTO_ARDUINO,
        baudRate: 9600
    });
    console.log('[OK] Conectando al Arduino...');
} catch (error) {
    console.log('[ERROR] Error al conectar:', error.message);
}

// 4. ESTADO DEL SENSOR
let sensorValue = 0;

// 5. LEER DATOS DEL ARDUINO
if (serialPort) {
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (line) => {
        console.log('[ARDUINO]', line);
        
        //Leer sensor
        if (line.startsWith('SENSOR:')) {
            sensorValue = parseInt(line.split(':')[1]) || 0;
            io.emit('sensor_data', { value: sensorValue });
        }
    });

     // Error en el puerto serial
    serialPort.on('error', (error) => {
        console.log('[ERROR] Error en el puerto:', error.message);
    });

    // Puerto abierto correctamente
    serialPort.on('open', () => {
        console.log('[OK] Arduino conectado en:', PUERTO_ARDUINO);
    });
}

// 6. MANEJAR CONEXIONES DE LA APP
io.on('connection', (socket) => {
    console.log('[APP] App conectada');

    socket.emit('sensor_data', { value: sensorValue });
   socket.on('command_servo', (data) => {
        console.log('[APP] Comando Servo:', data);

        if (!data || !data.action) {
            console.log('[WARN] Accion de servo invalida:', data);
            return;
        }

        if (serialPort) {
            let comando = 'SERVO_' + data.action + '\n';
            serialPort.write(comando);
            console.log('[SEND] Enviando:', comando.trim());
        } else {
            console.log('[WARN] Arduino no conectado');
            socket.emit('error', { message: 'Arduino no conectado' });
        }
    });
    socket.on('command_led', (data) => {
        console.log('[APP] Comando:', data);

        if (!data || !data.led || !data.action) {
            console.log('[WARN] Comando invalido:', data);
            return;
        }

        if (data.action !== 'ON' && data.action !== 'OFF') {
            console.log('[WARN] Accion invalida:', data.action);
            return;
        }

        if (serialPort) {
            let comando;
            if (data.led === 1) {
                comando = 'LED1_' + data.action + '\n';
            } else if (data.led === 2) {
                comando = 'LED2_' + data.action + '\n';
            } else if (data.led === 3) {
                comando = 'LED3_' + data.action + '\n';
            } else if (data.led === 4) {
                comando = 'LED4_' + data.action + '\n';
            } else if (data.led === 5) {
                comando = 'LED5_' + data.action + '\n';
            } else if (data.led === 6) {
                comando = 'LED6_' + data.action + '\n';
            } else if (data.led === 7) {
                comando = 'LED7_' + data.action + '\n';
            } else if (data.led === 8) {
                comando = 'LED8_' + data.action + '\n';
            } else {
                console.log('[WARN] LED no valido:', data.led);
                return;
            }
            
            serialPort.write(comando);
            console.log('[SEND] Enviando:', comando.trim());
        } else {
            console.log('[WARN] Arduino no conectado');
            socket.emit('error', { message: 'Arduino no conectado' });
        }
    });

    socket.on('disconnect', () => {
        console.log('[APP] App desconectada');
    });
});

// 7. INICIAR SERVIDOR
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('SERVER ARDUINO INICIADO');
    console.log('========================================');
    console.log('Puerto:', PORT);
    console.log('Arduino:', PUERTO_ARDUINO);
    console.log('========================================');
});

// 8. MANEJAR ERRORES GENERALES
process.on('uncaughtException', (error) => {
    console.log('[ERROR] Error inesperado:', error.message);
});

process.on('SIGINT', () => {
    console.log('\n[STOP] Servidor detenido');
    if (serialPort) serialPort.close();
    process.exit();
});