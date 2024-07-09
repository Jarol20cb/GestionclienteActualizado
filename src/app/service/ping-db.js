const { Client } = require('pg');

// Configura la conexión a tu base de datos
const dbConfig = {
    user: 'gestioncliente_db_user',
    host: 'dpg-cq68ptjv2p9s73cho4kg-a',
    database: 'gestioncliente_db',
    password: 'KmDi1x6siVGFOnUQ1mTziePWyXPc1dpy',
    port: 5432, // Puerto por defecto de PostgreSQL
};

// Función para realizar la consulta simple
async function pingDatabase() {
    const client = new Client(dbConfig); // Crea el cliente de PostgreSQL

    try {
        await client.connect(); // Conecta con la base de datos
        const res = await client.query('SELECT 1'); // Ejecuta una consulta simple
        console.log('Ping enviado correctamente:', res.rows);
    } catch (err) {
        console.error('Error al enviar ping a la base de datos:', err);
    } finally {
        await client.end(); // Cierra la conexión
    }
}

// Intervalo para ejecutar la función cada 5 minutos (300,000 ms)
setInterval(pingDatabase, 300000); // Intervalo en milisegundos (300,000 ms = 5 minutos)
