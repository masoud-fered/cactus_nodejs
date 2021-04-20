const fs = require('fs');

function createCoffee(response, coffee) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const data = JSON.parse(fileContent.toString());
        data.push(coffee);
        fs.writeFile('./data.json', data, () => {});
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.write(JSON.stringify(coffee));
        response.end();
    }));
}

function readCoffee(request, response) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const id = Number(request.queryString.id);
        const name = request.queryString.name;
        const data = JSON.parse(fileContent.toString());
        response.writeHead(200, {'Content-Type': 'application/json'})

        if (id > 0 || name != null || name !== undefined) {
            let coffee = undefined;

            if (id > 0) {
                coffee = data.find(coffee => coffee.id === id);
            } else if (name != null || name !== undefined) {
                coffee = data.find(coffee => coffee.name === name);
            }

            if (coffee === undefined) {
                response.write("{}");
            } else {
                response.write(JSON.stringify(coffee));
            }

        } else {
            response.write(fileContent);
        }
        response.end();
    }));
}

function updateCoffee(request, response, newCoffee) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const id = Number(request.queryString.id);
        const name = request.queryString.name;
        const data = JSON.parse(fileContent.toString());
        response.writeHead(200, {'Content-Type': 'application/json'})

        if (id > 0 || name != null || name !== undefined) {
            let oldCoffee = undefined;

            if (id > 0) {
                oldCoffee = data.find(oldCoffee => oldCoffee.id === id);
            } else if (name != null || name !== undefined) {
                oldCoffee = data.find(oldCoffee => oldCoffee.name === name);
            }

            if (oldCoffee === undefined) {
                response.write("{}");
            } else {
                data[data.indexOf(oldCoffee)] = newCoffee;
                fs.writeFile('./data.json', data, () => {});
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.write(JSON.stringify(newCoffee));
                response.end();
            }
        }
    }));
}

function deleteCoffee(request, response) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const id = Number(request.queryString.id);
        const name = request.queryString.name;
        const data = JSON.parse(fileContent.toString());
        response.writeHead(200, {'Content-Type': 'application/json'})

        if (id > 0 || name != null || name !== undefined) {
            let coffee = undefined;

            if (id > 0) {
                coffee = data.find(coffee => coffee.id === id);
            } else if (name != null || name !== undefined) {
                coffee = data.find(coffee => coffee.name === name);
            }

            if (coffee === undefined) {
                response.write("{}");
            } else {
                data.splice(data.indexOf(coffee), 1);
                fs.writeFile('./data.json', JSON.stringify(data), () => {});
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.write(JSON.stringify(coffee));
                response.end();
            }
        }
    }));
}

module.exports = {
    createCoffee,
    readCoffee,
    updateCoffee,
    deleteCoffee
}