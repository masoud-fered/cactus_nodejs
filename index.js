const server = require('./server');
const router = require('./router');
const requestHandler = require('./requestHandler');

const handle = {};
handle['/api/v1/coffee'] = {
    'POST': requestHandler.createCoffee,
    'GET': requestHandler.readCoffee,
    'PUT': requestHandler.updateCoffee,
    'DELETE': requestHandler.deleteCoffee
}

server.run(router.route, handle)