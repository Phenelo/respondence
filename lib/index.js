'use strict';

const Nodemailer = require('nodemailer');
const internals = {};

internals.send = function (options, next) {

    internals.transporter.sendMail(options, (err, res) => {

        if (err) {

            return next(err);
        }

        if (!next) {

            return res;
        }

        return next(null, res);
    });
};

internals.verify = function (next) {

    internals.transporter.verify((err) => {

        if (err) {

            return next(err);
        }

        return next(null, 'Server ready.');
    });
};


exports.register = (server, options, next) => {

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

        return next(err);
    }

    return next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};
