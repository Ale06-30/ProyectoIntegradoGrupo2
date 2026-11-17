const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '301185Gato#',
    database: 'almacen',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Comprobar conexión
pool.getConnection()
    .then((conexion) => {
        console.log('[OK] Conectado a MySQL correctamente');
        conexion.release();
    })
    .catch((error) => {
        console.log('[ERROR] No se pudo conectar a MySQL:', error.message);
    });

module.exports = pool;