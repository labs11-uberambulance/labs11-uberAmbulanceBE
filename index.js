require('dotenv').config(); 
    
const server = require('./server/server.js');

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port} ===\n`);
});