# @esscorp/logger

Wrapper around `node-loggly-bulk`. In development, it sends logs to the console. In production, it sends logs to [Loggly](https://www.loggly.com/).

## Install

```bash
npm install @esscorp/logger --save
```

## Usage

```js
var Logger = require('@esscorp/logger');
var logger = new Logger({
	subdomain: '',
	token: '',
	auth: {
		username: '',
		password: ''
	},
	tags: ['']
});
```
