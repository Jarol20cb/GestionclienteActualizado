const { Client } = require('pg');

// Configura la conexión a tu base de datos
const dbConfig = {
    user: 'gestioncliente_db_user',
    host: 'dpg-cq68ptjv2p9s73cho4kg-a.oregon-postgres.render.com',
    database: 'gestioncliente_db',
    password: 'KmDi1x6siVGFOnUQ1mTziePWyXPc1dpy',
    port: 5432,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 60000,
    ssl: {
        rejectUnauthorized: false
    }
};

// Función para realizar la consulta simple
async function pingDatabase() {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        const res = await client.query('SELECT 1');
        console.log('Ping enviado correctamente:', res.rows);
    } catch (err) {
        console.error('Error al enviar ping a la base de datos:', err);
        setTimeout(pingDatabase, 5000);
    } finally {
        try {
            await client.end();
        } catch (err) {
            console.error('Error al cerrar la conexión:', err);
        }
    }
}

// Función para iniciar el intervalo
function startPing() {
    pingDatabase();
    setInterval(pingDatabase, 20000); // Intervalo en milisegundos (20,000 ms = 20 segundos)
}

// Inicia el proceso de ping
startPing();
