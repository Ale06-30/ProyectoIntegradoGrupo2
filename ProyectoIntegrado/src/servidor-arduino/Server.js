
// 1. IMPORTAR LIBRERIAS
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const db = require('./config-sql/db');

// 2. CREAR SERVIDOR
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// 3. CONSULTAR PRODUCTOS ACTIVOS
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT
                id,
                nombre,
                descripcion,
                precio,
                stock,
                categoria
            FROM productos
            WHERE estado = TRUE
            ORDER BY fecha_registro DESC
        `);

        res.json(productos);

    } catch (error) {
        console.log('[ERROR] Al consultar productos:', error.message);

        res.status(500).json({
            mensaje: 'Error al consultar los productos'
        });
    }
});

// 4. REGISTRAR NUEVO PRODUCTO
app.post('/api/productos', async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria
        } = req.body;

        // VALIDAR NOMBRE
        if (
            typeof nombre !== 'string' ||
            !nombre.trim() ||
            nombre.trim().length > 150
        ) {
            return res.status(400).json({
                mensaje: 'El nombre del producto no es válido'
            });
        }

        // VALIDAR PRECIO Y STOCK
        const precioNumero = Number(precio);
        const stockNumero = Number(stock);

        if (
            precio === undefined ||
            precio === null ||
            precio === '' ||
            !Number.isFinite(precioNumero) ||
            precioNumero <= 0 ||
            precioNumero > 99999999.99
        ) {
            return res.status(400).json({
                mensaje: 'El precio debe ser mayor que cero'
            });
        }

        if (
            stock === undefined ||
            stock === null ||
            stock === '' ||
            !Number.isInteger(stockNumero) ||
            stockNumero < 0
        ) {
            return res.status(400).json({
                mensaje: 'El stock debe ser un número entero igual o mayor que cero'
            });
        }

        if (
            descripcion !== undefined &&
            descripcion !== null &&
            typeof descripcion !== 'string'
        ) {
            return res.status(400).json({
                mensaje: 'La descripción no es válida'
            });
        }

        if (
            categoria !== undefined &&
            categoria !== null &&
            typeof categoria !== 'string'
        ) {
            return res.status(400).json({
                mensaje: 'La categoría no es válida'
            });
        }

        // INSERTAR PRODUCTO EN MYSQL
        const [resultado] = await db.query(
            `INSERT INTO productos
            (nombre, descripcion, precio, stock, categoria)
            VALUES (?, ?, ?, ?, ?)`,
            [
                nombre.trim(),
                descripcion ? descripcion.trim() : null,
                precioNumero,
                stockNumero,
                categoria ? categoria.trim() : null
            ]
        );

        console.log('[OK] Producto registrado. ID:', resultado.insertId);

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.log('[ERROR] Al registrar producto:', error.message);

        res.status(500).json({
            mensaje: 'Error al registrar el producto'
        });
    }
});

// 5. CONFIGURAR PUERTO SERIAL
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

// 6. ESTADO DEL SENSOR
let sensorValue = 0;

// 7. LEER DATOS DEL ARDUINO
if (serialPort) {
    const parser = serialPort.pipe(
        new ReadlineParser({ delimiter: '\n' })
    );

    parser.on('data', (line) => {
        console.log('[ARDUINO]', line);

        // LEER SENSOR
        if (line.startsWith('SENSOR:')) {
            sensorValue = parseInt(line.split(':')[1]) || 0;
            io.emit('sensor_data', { value: sensorValue });
        }
    });

    // ERROR EN EL PUERTO SERIAL
    serialPort.on('error', (error) => {
        console.log('[ERROR] Error en el puerto:', error.message);
    });

    // PUERTO ABIERTO CORRECTAMENTE
    serialPort.on('open', () => {
        console.log('[OK] Arduino conectado en:', PUERTO_ARDUINO);
    });
}

// 8. MANEJAR CONEXIONES DE LA APP
io.on('connection', (socket) => {
    console.log('[APP] App conectada');

    socket.emit('sensor_data', { value: sensorValue });

    // CONTROL DEL SERVO
    socket.on('command_servo', (data) => {
        console.log('[APP] Comando Servo:', data);

        if (!data || !data.action) {
            console.log('[WARN] Accion de servo invalida:', data);
            return;
        }

        if (serialPort && serialPort.isOpen) {
            let comando = 'SERVO_' + data.action + '\n';
            serialPort.write(comando);

            console.log('[SEND] Enviando:', comando.trim());

        } else {
            console.log('[WARN] Arduino no conectado');
            socket.emit('error', {
                message: 'Arduino no conectado'
            });
        }
    });

    // CONTROL DE LEDS
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

        if (serialPort && serialPort.isOpen) {
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

            socket.emit('error', {
                message: 'Arduino no conectado'
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('[APP] App desconectada');
    });
});

// 9. INICIAR SERVIDOR
const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('SERVER ARDUINO INICIADO');
    console.log('========================================');
    console.log('Puerto:', PORT);
    console.log('Arduino:', PUERTO_ARDUINO);
    console.log('========================================');
});

// 10. MANEJAR ERRORES GENERALES
process.on('uncaughtException', (error) => {
    console.log('[ERROR] Error inesperado:', error.message);
});

process.on('SIGINT', () => {
    console.log('\n[STOP] Servidor detenido');

    if (serialPort && serialPort.isOpen) {
        serialPort.close();
    }

    process.exit();
});
