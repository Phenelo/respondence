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

        internals.server.register({
            register: Respondence,
            options: options
        })
            .then(() => {

                return Promise.resolve();
            })
            .catch((err) => {

                return Promise.resolve(err);
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

        internals.register(options)
            .then(() => {

                return done();
            })
            .catch((err) => {

                expect(err).to.exist();

                return done();
            });
    });

    it('Should throw an error', (done) => {

        const options = {};

        internals.register(options)
            .then(() => {

                return done();
            })
            .catch((err) => {

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

        internals.register(options)
            .then(() => {

                return done();
            })
            .catch((err) => {

                expect(err).to.exist();

                return done();
            });
    });
});

describe('Sending email and verifying SMTP server', () => {

    it('Should send an email', (done) => {

        internals.server.plugins.respondence.send(internals.mail)
            .then((res) => {

                expect(res).to.exist();

                return done();
            })
            .catch((err) => {

                expect(err).to.not.exist();

                return done();
            });
    });

    it('Should send an email synchronously', (done) => {

        internals.server.plugins.respondence.send(internals.mail)
            .then((res) => {

                expect(res).to.exist();

                return done();
            })
            .catch((err) => {

                expect(err).to.not.exist();

                return done();
            });
    });

    it('Should verify', (done) => {

        internals.server.plugins.respondence.verify()
            .then((res) => {

                expect(res).to.exist();

                return done();
            })
            .catch((err) => {

                expect(err).to.not.exist();

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

        internals.register(options)
            .then(() => {

                internals.server.plugins.respondence.send(internals.mail)
                    .then(() => {

                        return done();
                    })
                    .catch((err) => {

                        expect(err).to.exist();

                        return done();
                    });
            })
            .catch((err) => {

                expect(err).to.not.exist();

                return done();
            });
    });

    it('Should return an verifiying error', (done) => {

        internals.server.plugins.respondence.verify()
            .then(() => {

                return done();
            })
            .catch((err) => {

                expect(err).to.exist();

                return done();
            });
    });
});
