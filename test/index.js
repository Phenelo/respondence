'use strict';

const Respondence = require('../lib');
const Stub = require('nodemailer-stub-transport');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const internals = {
    register: async function (options) {

        await internals.server.register({
            plugin: Respondence,
            options
        });
    },
    mail: {
        from: '"Baroof" <baroof@gmail.com>',
        to: 'foobar@gmail.com',
        subject: 'Foo',
        text: 'A bar without foo is barfoo.'
    },
    init: async function () {

        internals.server = new Hapi.Server();
        await internals.server.start();
    }
};

describe('Registering the plugin', async () => {

    beforeEach(async (done) => {

        await internals.init();

        return done;
    });

    it('Should create default SMTP transport object', async (done) => {

        const options = {
            host: 'localhost',
            port: 465
        };

        await internals.register(options);
        expect(internals.server.plugins.respondence).to.exist();

        return done;
    });

    it('Should throw an error', async (done) => {

        try {
            await internals.register();
        }
        catch (err) {
            expect(err).to.exist();
        }

        return done;
    });

    it('Should create SMTP stub transport', async (done) => {

        const options = {
            host: 'localhost',
            port: 465,
            transport: {
                plugin: Stub,
                params: null
            }
        };

        await internals.register(options);
        expect(internals.server.plugins.respondence).to.exist();

        return done;
    });
});
