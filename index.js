const server = require('./server');
const router = require('./router');
const requestHandler = require('./requestHandler');

const handle = {};
handle['/api/v1/coffees'] = {
    'POST': requestHandler.createCoffee,
    'GET': requestHandler.readCoffee,
    'PUT': requestHandler.updateCoffee,
    'DELETE': requestHandler.deleteCoffee
}
handle['/api/v1/users/register'] = {
    'POST': requestHandler.registerUser
}
handle['/api/v1/users/login'] = {
    'POST': requestHandler.loginUser
}

server.run(router.route, handle)