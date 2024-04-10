const { app } = require('@azure/functions');
const cars = require('./cars.json');

// app.http('message', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         context.log(`Http function processed request for url "${request.url}"`);

//         const name = request.query.get('name') || await request.text() || 'world';

//         return { body: `Hello, ${name}!` };
//     }
// });

// app.http('cars', {
//     methods: ['GET','POST'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         context.log(`Http function processed request for url "${request.url}"`);
//         return {
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(cars)
//         };
//     }
// });

app.http('cars', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log(`Http function processed request for url "${req.url}"`);

        switch (req.method) {
            case 'GET':
                return {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cars)
                };
            case 'POST': 
                const newCar = await req.json();
                cars.push(newCar);
                return {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCar)
                };
            default:
                return {
                    status: 405,
                    body: 'Method Not Allowed'
                };
        }
    }
});

app.http('cars-del', {
    methods: ['GET', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        context.log(`Http function processed request for url "${req.url}"`);

        switch (req.method) {
            case 'DELETE':
                const body = await req.json();
                const id = body["index"];
                if (id !== -1) {
                    cars.splice(id, 1);
                    return {
                        status: 200,
                        body: JSON.stringify(cars)
                    };
                } else {
                    return {
                        status: 404,
                        body: 'Car Not Found'
                    };
                }
            default:
                return {
                    status: 405,
                    body: 'Method Not Allowed'
                };
        }
    }
});

module.exports = app;


