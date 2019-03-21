const server = require('../server/server.js');
const request = require('supertest');
const knex = require('knex');
const knexConfig = require('../knexfile.js')
const db = knex(knexConfig.testing);

describe('Test Users Route', () => {
    describe('Get /api/users', () => {
        it('Should return 200 ok and empty array', async () => {
            const res = await request(server).get('/api/users')
            expect(res.text).toEqual("[]")
            expect(res.status).toEqual(200)
         });
    });
    describe('Get /api/mothers', () => {
        it('Should return 200 ok and empty array', async () => {
            const moms = await db('mothers').select('google_id')
            expect(moms).toEqual([])
         });
    });
});