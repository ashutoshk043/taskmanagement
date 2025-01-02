const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Handle connection events
client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Error:', err));

// Connect the client
(async () => {
  await client.connect();
})();

module.exports = client;
