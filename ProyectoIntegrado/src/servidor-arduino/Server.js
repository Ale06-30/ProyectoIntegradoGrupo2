
// 1. IMPORTAR LIBRERIAS
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./config-sql/db');

// 2. CREAR SERVIDOR
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Configurar almacenamiento de imágenes de productos
const carpetaImagenes = path.join(__dirname, 'uploads', 'productos');
fs.mkdirSync(carpetaImagenes, { recursive: true });

const almacenamientoImagenes = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, carpetaImagenes);
    },
    filename: (req, file, callback) => {
        const extensiones = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };
        callback(null, `producto_${Date.now()}_${Math.round(Math.random() * 1E9)}${extensiones[file.mimetype]}`);
    }
});

const uploadImagen = multer({
    storage: almacenamientoImagenes,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

        if (tiposPermitidos.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
        }
    }
});

// Permitir que la aplicación consulte las imágenes guardadas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. CONSULTAR TODOS LOS PRODUCTOS PARA ADMINISTRACION
app.get('/api/admin/productos', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT
                id,
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                imagen,
                estado
            FROM productos
            ORDER BY fecha_registro DESC
        `);

        res.json(productos);

    } catch (error) {
        console.log('[ERROR] Al consultar inventario:', error.message);

        res.status(500).json({
            mensaje: 'Error al consultar el inventario'
        });
    }
});

// 4. HABILITAR O DESHABILITAR PRODUCTO
app.patch('/api/productos/:id/estado', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { estado } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido'
            });
        }

        if (typeof estado !== 'boolean') {
            return res.status(400).json({
                mensaje: 'El estado debe ser verdadero o falso'
            });
        }

        const [resultado] = await db.query(
            `UPDATE productos SET estado = ? WHERE id = ?`,
            [estado, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto'
            });
        }

        console.log(
            `[OK] Producto ${id}: ${estado ? 'Habilitado' : 'Deshabilitado'}`
        );

        res.json({
            mensaje: estado
                ? 'Producto habilitado correctamente'
                : 'Producto deshabilitado correctamente'
        });

    } catch (error) {
        console.log('[ERROR] Al cambiar estado:', error.message);

        res.status(500).json({
            mensaje: 'Error al cambiar el estado del producto'
        });
    }
});

// 5. CONSULTAR PRODUCTOS ACTIVOS
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT
                id,
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                imagen
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

// 6. REGISTRAR NUEVO PRODUCTO
app.post('/api/productos', uploadImagen.single('imagen'), async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria
        } = req.body;

        if (
            typeof nombre !== 'string' ||
            !nombre.trim() ||
            nombre.trim().length > 150
        ) {
            return res.status(400).json({
                mensaje: 'El nombre del producto no es válido'
            });
        }

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

        const imagen = req.file
            ? `/uploads/productos/${req.file.filename}`
            : null;

        const [resultado] = await db.query(
            `INSERT INTO productos
            (nombre, descripcion, precio, stock, categoria, imagen)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre.trim(),
                descripcion ? descripcion.trim() : null,
                precioNumero,
                stockNumero,
                categoria ? categoria.trim() : null,
                imagen
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

// 7. REGISTRAR USUARIO EN MYSQL
app.post('/api/usuarios', async (req, res) => {
    try {
        const { firebase_uid, correo } = req.body;

        if (
            typeof firebase_uid !== 'string' ||
            !firebase_uid.trim() ||
            firebase_uid.trim().length > 128 ||
            typeof correo !== 'string' ||
            !correo.trim() ||
            correo.trim().length > 150
        ) {
            return res.status(400).json({
                mensaje: 'Los datos del usuario no son válidos'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO usuarios (firebase_uid, correo)
            VALUES (?, ?)`,
            [
                firebase_uid.trim(),
                correo.trim()
            ]
        );

        console.log('[OK] Usuario registrado en MySQL. ID:', resultado.insertId);

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.log('[ERROR] Al registrar usuario:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El usuario ya está registrado en MySQL'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        });
    }
});

// 8. REGISTRAR NUEVO PEDIDO
app.post('/api/pedidos', async (req, res) => {

    let conexion;
    let transaccionIniciada = false;

    try {
        const { correo, productos } = req.body;

        if (
            typeof correo !== 'string' ||
            !correo.trim() ||
            correo.trim().length > 150
        ) {
            return res.status(400).json({
                mensaje: 'El correo no es válido'
            });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                mensaje: 'El carrito está vacío'
            });
        }

        const ids = new Set();

        for (const producto of productos) {
            const id = Number(producto.id);
            const cantidad = Number(producto.cantidad);

            if (
                !Number.isInteger(id) ||
                id <= 0 ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0 ||
                ids.has(id)
            ) {
                return res.status(400).json({
                    mensaje: 'Los productos o cantidades no son válidos'
                });
            }

            ids.add(id);
        }

        conexion = await db.getConnection();

        await conexion.beginTransaction();
        transaccionIniciada = true;

        const [usuarios] = await conexion.query(
            `SELECT id FROM usuarios WHERE correo = ?`,
            [correo.trim()]
        );

        if (usuarios.length === 0) {
            const error = new Error('No se encontró el usuario');
            error.status = 404;
            throw error;
        }

        const usuarioId = usuarios[0].id;

        let totalCentavos = 0;
        const detallesPedido = [];

        for (const producto of productos) {
            const id = Number(producto.id);
            const cantidad = Number(producto.cantidad);

            const [resultado] = await conexion.query(
                `SELECT id, precio, stock, estado
                 FROM productos
                 WHERE id = ?
                 FOR UPDATE`,
                [id]
            );

            if (resultado.length === 0) {
                const error = new Error('No se encontró un producto');
                error.status = 404;
                throw error;
            }

            const productoBD = resultado[0];

            if (!productoBD.estado) {
                const error = new Error(
                    'Uno de los productos no está disponible'
                );
                error.status = 400;
                throw error;
            }

            if (Number(productoBD.stock) < cantidad) {
                const error = new Error(
                    `Stock insuficiente para el producto ID ${id}`
                );
                error.status = 409;
                throw error;
            }

            const precioCentavos = Math.round(
                Number(productoBD.precio) * 100
            );

            const subtotalCentavos = precioCentavos * cantidad;

            totalCentavos += subtotalCentavos;

            detallesPedido.push({
                producto_id: id,
                cantidad,
                precio_unitario: (precioCentavos / 100).toFixed(2),
                subtotal: (subtotalCentavos / 100).toFixed(2)
            });
        }

        const total = (totalCentavos / 100).toFixed(2);

        const [pedido] = await conexion.query(
            `INSERT INTO pedidos (usuario_id, total, estado)
             VALUES (?, ?, ?)`,
            [usuarioId, total, 'Pendiente']
        );

        const pedidoId = pedido.insertId;

        for (const detalle of detallesPedido) {

            await conexion.query(
                `INSERT INTO detalle_pedido
                (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    pedidoId,
                    detalle.producto_id,
                    detalle.cantidad,
                    detalle.precio_unitario,
                    detalle.subtotal
                ]
            );

            const [actualizacion] = await conexion.query(
                `UPDATE productos
                 SET stock = stock - ?
                 WHERE id = ? AND stock >= ?`,
                [
                    detalle.cantidad,
                    detalle.producto_id,
                    detalle.cantidad
                ]
            );

            if (actualizacion.affectedRows !== 1) {
                const error = new Error(
                    'No se pudo actualizar el stock'
                );
                error.status = 409;
                throw error;
            }
        }

        await conexion.commit();
        transaccionIniciada = false;

        console.log('[OK] Pedido registrado. ID:', pedidoId);

        res.status(201).json({
            mensaje: 'Pedido registrado correctamente',
            id: pedidoId,
            total,
            estado: 'Pendiente'
        });

    } catch (error) {

        if (conexion && transaccionIniciada) {
            await conexion.rollback();
        }

        console.log('[ERROR] Al registrar pedido:', error.message);

        res.status(error.status || 500).json({
            mensaje: error.status
                ? error.message
                : 'Error al registrar el pedido'
        });

    } finally {

        if (conexion) {
            conexion.release();
        }
    }
});

// 9. CONSULTAR PEDIDOS
app.get('/api/pedidos', async (req, res) => {
    try {
        const [pedidos] = await db.query(`
            SELECT
                p.id,
                p.usuario_id,
                u.correo,
                p.fecha_pedido,
                p.total,
                p.estado
            FROM pedidos p
            INNER JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha_pedido DESC
        `);

        if (pedidos.length === 0) {
            return res.json([]);
        }

        const idsPedidos = pedidos.map(pedido => pedido.id);

        const [detalles] = await db.query(`
            SELECT
                dp.id,
                dp.pedido_id,
                dp.producto_id,
                pr.nombre AS nombre_producto,
                dp.cantidad,
                dp.precio_unitario,
                dp.subtotal
            FROM detalle_pedido dp
            INNER JOIN productos pr ON dp.producto_id = pr.id
            WHERE dp.pedido_id IN (?)
        `, [idsPedidos]);

        const detallesPorPedido = {};

        detalles.forEach(detalle => {
            if (!detallesPorPedido[detalle.pedido_id]) {
                detallesPorPedido[detalle.pedido_id] = [];
            }

            detallesPorPedido[detalle.pedido_id].push(detalle);
        });

        const resultado = pedidos.map(pedido => ({
            ...pedido,
            detalles: detallesPorPedido[pedido.id] || []
        }));

        res.json(resultado);

    } catch (error) {
        console.log('[ERROR] Al consultar pedidos:', error.message);

        res.status(500).json({
            mensaje: 'Error al consultar los pedidos'
        });
    }
});

// 10. ACTUALIZAR ESTADO DEL PEDIDO
app.patch('/api/pedidos/:id/estado', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { estado } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del pedido no es válido'
            });
        }

        if (estado !== 'Entregado' && estado !== 'Cancelado') {
            return res.status(400).json({
                mensaje: 'El estado solicitado no es válido'
            });
        }

        // Evitar modificar manualmente un pedido que está en la banda
        if (pedidoEnProceso === id) {
            return res.status(409).json({
                mensaje: 'El pedido está siendo procesado por Arduino'
            });
        }

        const [pedidos] = await db.query(
            `SELECT id FROM pedidos WHERE id = ?`,
            [id]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el pedido'
            });
        }

        await db.query(
            `UPDATE pedidos SET estado = ? WHERE id = ?`,
            [estado, id]
        );

        console.log('[OK] Pedido actualizado:', id, estado);

        res.json({
            mensaje: 'Estado del pedido actualizado correctamente'
        });

    } catch (error) {
        console.log('[ERROR] Al actualizar pedido:', error.message);

        res.status(500).json({
            mensaje: 'Error al actualizar el pedido'
        });
    }
});

// 11. CONFIGURAR PUERTO SERIAL
const PUERTO_ARDUINO = 'COM4';

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

// 12. ESTADO DEL SENSOR Y AUTORIZACION DE PEDIDOS
let sensorValue = 0;

let pedidoEnProceso = null;
let etapaPedido = null;
let autorizacionEnCurso = false;

// CONSULTAR SI EXISTE UN PEDIDO EN PROCESO
app.get('/api/pedidos/activo', (req, res) => {
    res.json({
        activo: pedidoEnProceso !== null,
        id: pedidoEnProceso,
        etapa: etapaPedido,
        autorizando: autorizacionEnCurso
    });
});

// 13. LEER DATOS DEL ARDUINO
if (serialPort) {
    const parser = serialPort.pipe(
        new ReadlineParser({ delimiter: '\n' })
    );

    // COLA PARA PROCESAR LOS MENSAJES EN ORDEN
    let colaMensajesArduino = Promise.resolve();

    const procesarMensajeArduino = async (line) => {
        const mensaje = line.trim();

        console.log('[ARDUINO]', mensaje);

        // DATOS DEL SENSOR EXISTENTE
        if (mensaje.startsWith('SENSOR:')) {
            sensorValue = parseInt(mensaje.split(':')[1]) || 0;
            io.emit('sensor_data', { value: sensorValue });
            return;
        }

        // SENSOR 1: CAJA DETECTADA (PREPARACION)
        if (mensaje === 'BOX_P') {

            if (!pedidoEnProceso || etapaPedido !== 'autorizado') {
                console.log('[WARN] BOX_P ignorado: no hay pedido autorizado');
                return;
            }

            const pedidoId = pedidoEnProceso;
            etapaPedido = 'actualizando_preparacion';

            try {
                const [resultado] = await db.query(
                    `UPDATE pedidos
                     SET estado = 'En preparacion'
                     WHERE id = ? AND estado = 'Pendiente'`,
                    [pedidoId]
                );

                if (resultado.affectedRows !== 1) {
                    console.log('[WARN] No se pudo actualizar el pedido:', pedidoId);

                    etapaPedido = 'autorizado';
                    return;
                }

                etapaPedido = 'preparacion';

                console.log('[OK] Pedido en preparación:', pedidoId);

                io.emit('pedido_estado_actualizado', {
                    id: pedidoId,
                    estado: 'En preparacion'
                });

            } catch (error) {
                console.log('[ERROR] Al actualizar preparación:', error.message);

                etapaPedido = 'autorizado';
            }

            return;
        }

        // SENSOR 2: CAJA ENVIADA
        if (mensaje === 'BOX_E') {

            if (!pedidoEnProceso || etapaPedido !== 'preparacion') {
                console.log('[WARN] BOX_E ignorado: no hay pedido en preparación');
                return;
            }

            const pedidoId = pedidoEnProceso;
            etapaPedido = 'actualizando_enviado';

            try {
                const [resultado] = await db.query(
                    `UPDATE pedidos
                     SET estado = 'Enviado'
                     WHERE id = ? AND estado = 'En preparacion'`,
                    [pedidoId]
                );

                if (resultado.affectedRows !== 1) {
                    console.log('[WARN] No se pudo actualizar el envío:', pedidoId);

                    etapaPedido = 'preparacion';
                    return;
                }

                console.log('[OK] Pedido enviado:', pedidoId);

                io.emit('pedido_estado_actualizado', {
                    id: pedidoId,
                    estado: 'Enviado'
                });

                // FINALIZAR AUTORIZACION
                pedidoEnProceso = null;
                etapaPedido = null;

                if (serialPort && serialPort.isOpen) {
                    serialPort.write('PEDIDO_FIN\n', (error) => {
                        if (error) {
                            console.log('[ERROR] Al finalizar pedido en Arduino:', error.message);
                        } else {
                            console.log('[SEND] PEDIDO_FIN');
                        }
                    });
                }

                console.log('[OK] Autorización liberada');

            } catch (error) {
                console.log('[ERROR] Al actualizar envío:', error.message);

                etapaPedido = 'preparacion';
            }

            return;
        }
    };

    // CADA MENSAJE ESPERA A QUE TERMINE EL ANTERIOR
    parser.on('data', (line) => {
        colaMensajesArduino = colaMensajesArduino
            .then(() => procesarMensajeArduino(line))
            .catch((error) => {
                console.log('[ERROR] Al procesar mensaje Arduino:', error.message);
            });
    });

    serialPort.on('error', (error) => {
        console.log('[ERROR] Error en el puerto:', error.message);
    });

    serialPort.on('open', () => {
        console.log('[OK] Arduino conectado en:', PUERTO_ARDUINO);
    });
}

// 14. MANEJAR CONEXIONES DE LA APP
io.on('connection', (socket) => {
    console.log('[APP] App conectada');

    socket.emit('sensor_data', { value: sensorValue });

    // AUTORIZAR PROCESAMIENTO DE UN PEDIDO
    socket.on('procesar_pedido', async (data) => {

        if (autorizacionEnCurso || pedidoEnProceso !== null) {
            socket.emit('pedido_procesamiento', {
                exitoso: false,
                mensaje: 'Ya existe un pedido en proceso'
            });
            return;
        }

        const pedidoId = Number(data?.id);

        if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
            socket.emit('pedido_procesamiento', {
                exitoso: false,
                mensaje: 'ID de pedido no válido'
            });
            return;
        }

        if (!serialPort || !serialPort.isOpen) {
            socket.emit('pedido_procesamiento', {
                exitoso: false,
                mensaje: 'Arduino no está conectado'
            });
            return;
        }

        autorizacionEnCurso = true;

        try {
            const [pedidos] = await db.query(
                `SELECT id, estado
                 FROM pedidos
                 WHERE id = ?`,
                [pedidoId]
            );

            if (pedidos.length === 0) {
                socket.emit('pedido_procesamiento', {
                    exitoso: false,
                    mensaje: 'No se encontró el pedido'
                });
                return;
            }

            if (pedidos[0].estado !== 'Pendiente') {
                socket.emit('pedido_procesamiento', {
                    exitoso: false,
                    mensaje: 'El pedido no está pendiente'
                });
                return;
            }

            // AUTORIZAR PEDIDO
            pedidoEnProceso = pedidoId;
            etapaPedido = 'autorizado';

            // Esperar confirmación de escritura serial
            await new Promise((resolve, reject) => {
                serialPort.write(`PEDIDO_${pedidoId}\n`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            console.log('[OK] Pedido autorizado:', pedidoId);

            socket.emit('pedido_procesamiento', {
                exitoso: true,
                id: pedidoId,
                mensaje: 'Pedido autorizado correctamente'
            });

        } catch (error) {
            console.log('[ERROR] Al autorizar pedido:', error.message);

            pedidoEnProceso = null;
            etapaPedido = null;

            socket.emit('pedido_procesamiento', {
                exitoso: false,
                mensaje: 'Error al autorizar el pedido'
            });

        } finally {
            autorizacionEnCurso = false;
        }
    });

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

// 15. INICIAR SERVIDOR
const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('SERVER ARDUINO INICIADO');
    console.log('========================================');
    console.log('Puerto:', PORT);
    console.log('Arduino:', PUERTO_ARDUINO);
    console.log('========================================');
});

// 16. MANEJAR ERRORES GENERALES
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
