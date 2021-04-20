function route(handle, response, request) {

    if (typeof handle[request.pathName] === 'object') {
        return handle[request.pathName][request.method](request, response);
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not found');
        response.end();
    }
}

module.exports = {route}