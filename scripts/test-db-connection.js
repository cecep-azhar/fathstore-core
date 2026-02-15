const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgres://postgres:password@localhost:5432/fathstore',
});

async function checkConnection() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
}

checkConnection();
