# Serverless Boilerplate
> An opinionated boilerplate for serverless applications.

Uses [AWS Lambda](https://aws.amazon.com/lambda/), [AWS API Gateway](https://aws.amazon.com/api-gateway/) and [Serverless Framework](https://serverless.com/).

## Pre-requisites

1. Node.js `v8.1.0` or later.<br/>You should use [nvm](https://github.com/creationix/nvm) to install it.
2. Serverless CLI v1.9.0+ or later.<br/>You can run `npm install -g serverless` to install it.
3. An AWS account.<br/>If you don't already have one, you can sign up for a [free trial](https://aws.amazon.com/s/dm/optimization/server-side-test/free-tier/free_np/) that includes 1 million free Lambda requests per month.
4. Set-up [AWS Provider Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Dependency Rebuilding

Required if Native Modules (eg. `xml-stream`) are used.

To activate this feature you have to change the following inside `package.json`:

1. Remove `predeploy`.
2. Rename `predeploy-with-rebuild` to `predeploy`.

You can find more information on this topic here:

* https://nodejs.org/api/addons.html
* https://stackoverflow.com/a/45577217/799155

## Tests

[Jest](https://jestjs.io/) is used to test this boilerplate.

```
$ npm run test
```

(**Writes tests. Tests are good!**)

## License

This project is licensed under the terms of the MIT license.
