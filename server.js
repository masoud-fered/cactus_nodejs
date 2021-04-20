const http = require('http');
const url = require('url');

function run(route, handle) {
    function onRequest(request, response) {
        let body = [];
        const baseUrl = 'https://' + request.headers.host + '/';
        const myUrl = new URL(request.url, baseUrl);
        request.pathName = myUrl.pathname;
        request.queryString = url.parse(request.url, true).query;

        request.setEncoding('utf8');
        request.headers['content-type'] = 'multipart/form-data';

        request.addListener('error', (err) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/html'});
                response.write('An error occurred');
                response.end();
            }
        });

        request.addListener('data', chunk => {
            body.push(chunk);
        });

        request.addListener('end', () => {
            request.body = body;
            route(handle, response, request);
        });

    }

    http.createServer(onRequest).listen(8000);
}

module.exports = {run}