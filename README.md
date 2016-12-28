# respondence
[![Build Status](https://travis-ci.org/Phenelo/respondence.svg?branch=master)](https://travis-ci.org/Phenelo/respondence)
[![Coverage Status](https://coveralls.io/repos/github/Phenelo/respondence/badge.svg?branch=master)](https://coveralls.io/github/Phenelo/respondence)
[![Code Climate](https://codeclimate.com/github/Phenelo/respondence/badges/gpa.svg)](https://codeclimate.com/github/Phenelo/respondence)
[![NPM Version](https://badge.fury.io/js/respondence.svg)](https://www.npmjs.com/knekshelf)
[![Dependency Status](https://david-dm.org/Phenelo/respondence.svg)](https://david-dm.org/Phenelo/respondence)<br>
[![Known Vulnerabilities](https://snyk.io/test/github/phenelo/respondence/badge.svg)](https://snyk.io/test/github/phenelo/respondence)
[![NSP Status](https://nodesecurity.io/orgs/nelo/projects/7e4937e5-bd13-4f84-83ad-bfe18041831d/badge)](https://nodesecurity.io/orgs/nelo/projects/7e4937e5-bd13-4f84-83ad-bfe18041831d)

A simple hapijs plugin for sending e-mails. Uses [nodemailer](https://github.com/nodemailer/nodemailer).

## Usage
```js
const Respondence = require('respondence');
const server = new Hapi.Server();

server.register({
    register: Respondence,
    options: {
        smtp: 'smtps://user%40gmail.com:pass@smtp.gmail.com'
    }
});
```

## Sending email
```js
const mail = {
     from: '"Baroof" <baroof@gmail.com>',
     to: 'foobar@gmail.com',
     subject: 'Foo',
     text: 'A bar without foo is barfoo.'
},

request.server.plugins.respondence.send(mail, (err, res) => {

    if (err) {
        console.log(err);

        return reply(err);
    }

    return reply(res);
});
```

## Verifying SMTP connection
```js

request.server.plugins.respondence.verify((err, res) => {

    if (err) {
        console.log(err);

        return reply(err);
    }

    return reply(res); // Server ready.
});
```

## Registering with a transport plugin
```js
const Mailgun = require('nodemailer-mailgun-transport');

server.register({
    register: Respondence,
    options: {
        plugin: Mailgun,
        params: {
            auth: {
                api_key: 'api-key1234567890',
                domain: '1234567890.mailgun.org'
            }
        }
    }
});
```
See more transport plugins [here](https://github.com/nodemailer/nodemailer#send-using-a-transport-plugin) and
[nodemailer](https://github.com/nodemailer/nodemailer) for more information.

## Contributing
* Include 100% test coverage.
* Follow the [Hapi coding conventions](http://hapijs.com/styleguide)
* Submit an issue first for significant changes.


