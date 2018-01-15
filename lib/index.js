'use strict';

const Nodemailer = require('nodemailer');
const internals = {};

internals.send = function (options) {

    return new Promise((resolve, reject) => {

        internals.transporter.sendMail(options, (err, res) => {

            if (err) {

                reject(err);
            }
            else {

                resolve(res);
            }
        });
    });
};

internals.verify = function () {

    return new Promise((resolve, reject) => {

        internals.transporter.verify((err) => {

            if (err) {

                reject(err);
            }
            else {

                resolve('server ready');
            }
        });
    });
};

exports.plugin = {
    name: 'respondence',
    register: (server, options) => {
        try {
            if (options.smtp) {
                internals.transporter = Nodemailer.createTransport(options.smtp);
            }
            else if (options.transport && options.transport.plugin) {
                const transport = options.transport.plugin;
                internals.transporter = Nodemailer.createTransport(transport(options.transport.params));
            }
            else {
                throw new Error('Provide an SMTP config or a transport plugin.');
            }

            server.expose('send', internals.send);
            server.expose('verify', internals.verify);
        }
        catch (err) {

            return Promise.reject(err);
        }

        return Promise.resolve();
    },
    pkg: require('../package.json')
};
