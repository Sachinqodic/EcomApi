import redis from 'redis';




const client = redis.createClient({
        host: '127.0.0.1',
        port: 6379

});


client.on("error", (err) => {
    console.error('Redis error:', err);
})

await client.connect();

export default client;



