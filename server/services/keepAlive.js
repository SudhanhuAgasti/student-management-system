const http = require('http');
const https = require('https');

const initKeepAlive = () => {
    // Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
    const interval = 14 * 60 * 1000;
    
    setInterval(() => {
        const url = process.env.SERVER_URL || process.env.VITE_API_URL;
        
        if (!url) {
            console.log('Keep-alive: No SERVER_URL found in environment variables. Skipping ping.');
            return;
        }

        const protocol = url.startsWith('https') ? https : http;
        
        console.log(`Keep-alive: Pinging ${url} to stay awake...`);
        
        protocol.get(url, (res) => {
            console.log(`Keep-alive: Ping successful, status code: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`Keep-alive: Ping failed - ${err.message}`);
        });
    }, interval);
};

module.exports = { initKeepAlive };
