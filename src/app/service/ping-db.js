const { Client } = require('pg');

// Configura la conexión a tu base de datos
const dbConfig = {
    user: 'tu-usuario',
    host: 'tu-host-de-base-de-datos',
    database: 'tu-nombre-de-base-de-datos',
    password: 'tu-contraseña',
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
