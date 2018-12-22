# Easy Toggles API

![travis build](https://travis-ci.org/wcalderipe/easy-toggles.svg?branch=master)

## Run

```shell
npm run start:dev # run with nodemon
npm run build && npm run start:prod
```

## Test

```shell
npm run test # unit and integration
npm run test:unit
npm run test:integration
```

## Docker

```shell
docker build \
  --tag easy-toggles-api \
  --build-arg BUILD_CONTEXT=. \
  --file Dockerfile .

docker run --publish 8080:8080 --rm easy-toggles-api
```

## GraphQL 

We're using GraphQL with Apollo under the hood. Try it out!

```shell
# start the server
npm run start:dev

# open the graphql playground
open http://127.0.0.1:3000/graphql
```

### Supported Query and Mutation

| Query       | Mutation          |
| ----------- | ----------------- |
| application | createApplication |
| toggle      | updateApplication |
|             | deleteApplication |

> ⚠️ at the moment, updateApplication mutation can only update the whole Application structure like a PUT in RESTful.

## RESTful

Supported RESTful endpoints

### GET /toggle

Evaluate a given context into a set of feature toggles for an application.

`GET /toggle?applicationId=foo-app-fake-id&country=BR`

#### Response

##### 200

```json
{
  "foo": true,
  "bar": false
}
```

##### 404

Application not found.

```json
{
  "code": "APPLICATION_NOT_FOUND"
}
```

### GET /health

#### Response

##### 200

```json
{
  "up": true
}
```
