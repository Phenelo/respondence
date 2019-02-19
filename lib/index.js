'use strict';

const Nodemailer = require('nodemailer');
const internals = {};

internals.send = async function (options) {

    return await internals.transporter.sendMail(options);
};

internals.verify = async function () {

    await internals.transporter.verify();

    return true;
};

exports.plugin = {
    name: 'respondence',
    register: async function (server, options) {

        if (!options) {
            throw new Error('Provide an SMTP config or a transport plugin.');
        }

        internals.transporter = Nodemailer.createTransport(options);

        server.expose('send', internals.send);
        server.expose('verify', internals.verify);
    },
    pkg: require('../package.json')
};
