const server = require('../server/server.js');
const request = require('supertest');

describe('Test Users Route', () => {
    describe('Get /api/users', () => {
        it('Should return 200 ok and empty array', async () => {
            const res = await request(server).get('/api/users')
            expect(res.text).toEqual("[]")
            expect(res.status).toEqual(200)
         });
    });

});