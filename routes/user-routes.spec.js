const server = require('../server/server.js');
const request = require('supertest');
const knex = require('knex');
const knexConfig = require('../knexfile.js')
const db = knex(knexConfig.testing);
const User = require('../models/user-model.js');

describe('Test Users Route', () => {
    describe('Get /api/users', () => {
        it('Should return 200 ok and empty array', async () => {
            const res = await request(server).get('/api/users')
            expect(res.text).toEqual("[]")
            expect(res.status).toEqual(200)
         });
    });
    describe('Add User', () => {
        it('Should return 200 ok and empty array', async () => {
            
         });
    });
});