const mysql = require('mysql2/promise');
require('dotenv').config();

const primaryDatabase = process.env.DB_NAME || 'sistema-topico';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: primaryDatabase,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = mysql.createPool(dbConfig);

// Helper function to get an active working pool (handling database name fallback if needed)
async function getWorkingPool() {
    try {
        const conn = await pool.getConnection();
        conn.release();
        return pool;
    } catch (err) {
        // If database does not exist, try alternative database names imported in MySQL (e.g. bd_topico_instituto or sistema_topico)
        if (err.code === 'ER_BAD_DB_ERROR') {
            const fallbackDBs = ['bd_topico_instituto', 'sistema_topico', 'sistema-topico'];
            for (const altDb of fallbackDBs) {
                try {
                    const altConfig = { ...dbConfig, database: altDb };
                    const altPool = mysql.createPool(altConfig);
                    const conn = await altPool.getConnection();
                    conn.release();
                    console.log(`[MySQL] Conectado exitosamente a la base de datos alternativa: '${altDb}'`);
                    pool = altPool;
                    return pool;
                } catch (altErr) {
                    // Continue checking
                }
            }
        }
        throw err;
    }
}

async function query(sql, params) {
    const activePool = await getWorkingPool();
    const [rows, fields] = await activePool.execute(sql, params);
    return rows;
}

module.exports = {
    pool,
    query,
    getWorkingPool
};
