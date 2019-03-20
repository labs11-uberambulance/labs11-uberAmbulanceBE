const server = require('./server.js');
const request = require('supertest');


describe('Test server is running', () => {
    describe('Get /', () => {
        it('Should return 200 ok', async () => {
            const res = await request(server).get('/')
            expect(res.status).toBe(200)
         });
    });
});