// Require the framework and instantiate it
const fastify = require('fastify')();

const path = require('path');

const AutoLoad = require('fastify-autoload');

fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({prefix: ''})
});
// Run the server
fastify.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }else{
        console.log(`Server is running on ${fastify.server.address().port}`);
    }
});