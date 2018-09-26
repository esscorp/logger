# @esscorp/logger

Wrapper around `node-loggly-bulk`. Changes logging behavior based on environment. In development, it sends logs to the console. In production, it ignores unimportant logs and sends important ones to [Loggly](https://www.loggly.com/).

## Install

```bash
npm install @esscorp/logger --save
```

## Usage

```js
var Logger = require('@esscorp/logger');
var logger = new Logger({
	production: false,
	subdomain: '',
	token: '',
	auth: {
		username: '',
		password: ''
	},
	tags: ['']
});
```

- production (Bool) - Whether running in development or production. Determines whether to send logs to the console, loggly, or nowhere *(see [#methods](#methods))*.
- subdomain -  *(see [https://github.com/loggly/node-loggly-bulk](https://github.com/loggly/node-loggly-bulk))*
- token - *(see [https://github.com/loggly/node-loggly-bulk](https://github.com/loggly/node-loggly-bulk))*
- auth.username - *(see [https://github.com/loggly/node-loggly-bulk](https://github.com/loggly/node-loggly-bulk))*
- auth.password - *(see [https://github.com/loggly/node-loggly-bulk](https://github.com/loggly/node-loggly-bulk))*
- tags - *(see [https://github.com/loggly/node-loggly-bulk](https://github.com/loggly/node-loggly-bulk))*

## Methods

### info

In development mode, send message to console. In production mode, do nothing.

- varName (String) - Variable name.
- varValue (\*) - Variable value.

If `varName` begins with `'\* '`, `varValue` is logged in a JSON stringified form.

```js
var obj = {an: 'object'};
logger.info('* obj:', obj);
// ->  * obj: {"an":"object"}
```

### startup

In development mode, send message to console. In production mode, send message to Loggly.

- name (String) - Name of the resource which has started up. Shown in Loggly as `{startup: name}`.
- message (String) - Required source key name.
- data (Object) - Any other data to show with the message in Loggly.

```js
var name = 'SQS-PULLER';
var message = `${name}: started.'`;
var data = {
	name: 'sqs-queue-name'
};

logger.startup(name, message, data);
// -> SQS-PULLER: started.
```

### error

In development mode, send error to console. In production mode, send error to Loggly.

- err (Error||String) - Error to log. Shown in Loggly as `{message: err.stack}`. Can have custom properties added to it.
- data (Object) - Any other data to show with the message in Loggly.

```js
var err = new Error('Something happened.');
err.code = 'ERR-CODE';
var data = {
	resource_id: 1,
	url: 'https://where.this.happened'
};

logger.error(err, data);
// -> Error: Something happened.
//     at /path/file.js:10:1
//     ...
// {"code": "ERR-CODE","resource_id": 1,"url": "https://where.this.happened"}
```
