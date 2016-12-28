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
    register: (options, next) => {

        internals.server.register({
            register: Respondence,
            options: options
        }, (err) => {

            return next(err);
        });
    },
    mail: {
        from: '"Baroof" <baroof@gmail.com>',
        to: 'foobar@gmail.com',
        subject: 'Foo',
        text: 'A bar without foo is barfoo.'
    },
    init: () => {

        internals.server = new Hapi.Server();
        internals.server.connection();
        internals.server.initialize();
    }
};

describe('Registering the plugin', () => {

    beforeEach((done) => {

        internals.init();

        return done();
    });

    it('Should create default SMTP transport object', (done) => {

        const options = {
            smtp: {
                host: 'localhost',
                port: 465,
                auth: {
                    user: 'foo@gmail.com',
                    pass: 'passbar'
                }
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should create SMTP transport plugin object', (done) => {

        const options = {
            transport: {
                plugin: () => {},
                params: {
                    api_key: 'apikey',
                    domain: 'domain'
                }
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should throw an error', (done) => {

        const options = {};

        internals.register(options, (err) => {

            expect(err).to.exist();

            return done();
        });
    });

    it('Should create SMTP stub transport', (done) => {

        const options = {
            transport: {
                plugin: Stub,
                params: null
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });
});

describe('Sending email and verifying SMTP server', () => {

    it('Should send an email', (done) => {

        internals.server.plugins.respondence.send(internals.mail, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.exist();

            return done();
        });
    });

    it('Should send an email synchronously', (done) => {

        expect(internals.server.plugins.respondence.send(internals.mail)).to.not.exist();

        return done();
    });

    it('Should verify', (done) => {

        internals.server.plugins.respondence.verify((err, res) => {

            expect(err).to.not.exist();
            expect(res).to.exist();

            return done();
        });
    });

    it('Should return an error for sending email', (done) => {

        internals.init();

        const options = {
            transport: {
                plugin: Stub,
                params: {
                    error: new Error('Error.')
                }
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            internals.server.plugins.respondence.send(internals.mail, (err) => {

                expect(err).to.exist();

                return done();
            });
        });
    });

    it('Should return an verifiying error', (done) => {

        internals.server.plugins.respondence.verify((err) => {

            expect(err).to.exist();

            return done();
        });
    });
});
