const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = crypto.randomBytes(64).toString('hex')
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function createCoffee(request, response) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.write("Authorization has problem.");
            response.end();
        } else {
            const coffee = {
                'id': Number(request.body.id),
                'name': request.body.name,
                'price': Number(request.body.price)
            }

            fs.readFile('./coffees.json', ((error, fileContent) => {
                const data = JSON.parse(fileContent.toString());
                data.push(coffee);
                fs.writeFile('./coffees.json', JSON.stringify(data), () => {
                });
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.write(JSON.stringify(coffee));
                response.end();
            }));
        }
    })
}

function readCoffee(request, response) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.write("Authorization has problem.");
            response.end();
        } else {
            fs.readFile('./coffees.json', ((error, fileContent) => {
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
    });
}

function updateCoffee(request, response) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.write("Authorization has problem.");
            response.end();
        } else {
            const newCoffee = {
                'id': Number(request.body.id),
                'name': request.body.name,
                'price': Number(request.body.price)
            }

            fs.readFile('./coffees.json', ((error, fileContent) => {
                const data = JSON.parse(fileContent.toString());
                response.writeHead(200, {'Content-Type': 'application/json'})

                let oldCoffee = data.find(oldCoffee => oldCoffee.id === newCoffee.id);

                if (oldCoffee === undefined) {
                    response.write("{}");
                    response.end();
                } else {
                    data[data.indexOf(oldCoffee)] = newCoffee;
                    fs.writeFile('./coffees.json', JSON.stringify(data), () => {
                    });
                    response.writeHead(200, {'Content-Type': 'application/json'})
                    response.write(JSON.stringify(newCoffee));
                    response.end();
                }
            }));
        }
    });
}

function deleteCoffee(request, response) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.write("Authorization has problem.");
            response.end();
        } else {
            fs.readFile('./coffees.json', ((error, fileContent) => {
                const id = Number(request.body.id);

                const data = JSON.parse(fileContent.toString());
                response.writeHead(200, {'Content-Type': 'application/json'})

                let coffee = data.find(coffee => coffee.id === id);

                if (coffee === undefined) {
                    response.write("{}");
                    response.end();
                } else {
                    data.splice(data.indexOf(coffee), 1);
                    fs.writeFile('./coffees.json', JSON.stringify(data), () => {
                    });
                    response.writeHead(200, {'Content-Type': 'application/json'})
                    response.write(JSON.stringify(coffee));
                }
            }));
        }
    });
}

function registerUser(request, response) {
    if (!EMAIL_REGEX.test(request.body.username)) {
        response.writeHead(401, {'Content-Type': 'application/json'})
        response.write("Username must be email");
        response.end();
    } else if (request.body.password.length < 6) {
        response.writeHead(401, {'Content-Type': 'application/json'})
        response.write("Password at least 6 characters");
        response.end();
    } else {

        fs.readFile('./users.json', (error, fileContent) => {
            const user = {
                'id': Number(request.body.id),
                'firstName': request.body.firstName,
                'lastName': request.body.lastName,
                'username': request.body.username,
                'password': crypto.createHash('md5').update(request.body.password).digest('hex'),
            }

            let data = [];
            try {
                data = JSON.parse(fileContent.toString());
            } catch (e) {

            }

            data.push(user);
            fs.writeFile('./users.json', JSON.stringify(data), () => {
            });
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.write("Your account has been successfully registered");
            response.end();

        })
    }
}

function loginUser(request, response) {
    if (!EMAIL_REGEX.test(request.body.username)) {
        response.writeHead(401, {'Content-Type': 'application/json'})
        response.write("Username must be email");
        response.end();
    } else if (request.body.password.length < 6) {
        response.writeHead(401, {'Content-Type': 'application/json'})
        response.write("Password at least 6 characters");
        response.end();
    } else {

        fs.readFile('./users.json', ((error, fileContent) => {
            const username = request.body.username;
            const hashedPassword = crypto.createHash('md5').update(request.body.password).digest('hex');

            const data = JSON.parse(fileContent.toString());
            let user = undefined;

            if (username !== null && username !== undefined) {
                user = data.find(user => user.username === username);

                if (user === undefined) {
                    response.writeHead(401, {'Content-Type': 'application/json'})
                    response.write("Username or password incorrect.");
                    response.end();
                } else {
                    if (user.password === hashedPassword) {
                        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 3600});
                        response.writeHead(200, {'Content-Type': 'application/json'})
                        response.write(`{'token': ${token}}`);
                        response.end();
                    } else {
                        response.writeHead(401, {'Content-Type': 'application/json'})
                        response.write("Username or password incorrect.");
                        response.end();
                    }
                }
            } else {
                response.writeHead(401, {'Content-Type': 'application/json'})
                response.write("Username or password incorrect.");
                response.end();
            }
        }));

    }
}

module.exports = {
    createCoffee,
    readCoffee,
    updateCoffee,
    deleteCoffee,
    registerUser,
    loginUser
}