const fs = require('fs');

function createCoffee(request, response) {
    const coffee = {
        'id': Number(request.body.id),
        'name': request.body.name,
        'price': Number(request.body.price)
    }

    fs.readFile('./data.json', ((error, fileContent) => {
        const data = JSON.parse(fileContent.toString());
        data.push(coffee);
        fs.writeFile('./data.json', JSON.stringify(data), () => {
        });
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.write(JSON.stringify(coffee));
        response.end();
    }));
}

function readCoffee(request, response) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const id = Number(request.queryString.id);
        const data = JSON.parse(fileContent.toString());
        let coffee = undefined;

        response.writeHead(200, {'Content-Type': 'application/json'})

        if (id > 0) {
            coffee = data.find(coffee => coffee.id === id);

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

function updateCoffee(request, response) {
    const newCoffee = {
        'id': Number(request.body.id),
        'name': request.body.name,
        'price': Number(request.body.price)
    }

    fs.readFile('./data.json', ((error, fileContent) => {
        const data = JSON.parse(fileContent.toString());
        response.writeHead(200, {'Content-Type': 'application/json'})

        let oldCoffee = data.find(oldCoffee => oldCoffee.id === newCoffee.id);

        if (oldCoffee === undefined) {
            response.write("{}");
            response.end();
        } else {
            data[data.indexOf(oldCoffee)] = newCoffee;
            fs.writeFile('./data.json', JSON.stringify(data), () => {
            });
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.write(JSON.stringify(newCoffee));
            response.end();
        }
    }));
}

function deleteCoffee(request, response) {
    fs.readFile('./data.json', ((error, fileContent) => {
        const id = Number(request.body.id);

        const data = JSON.parse(fileContent.toString());
        response.writeHead(200, {'Content-Type': 'application/json'})

        let coffee = data.find(coffee => coffee.id === id);

        if (coffee === undefined) {
            response.write("{}");
            response.end();
        } else {
            data.splice(data.indexOf(coffee), 1);
            fs.writeFile('./data.json', JSON.stringify(data), () => {
            });
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.write(JSON.stringify(coffee));
        }
    }));
}

module.exports = {
    createCoffee,
    readCoffee,
    updateCoffee,
    deleteCoffee
}