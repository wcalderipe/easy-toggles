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
|             | updateApplication |
|             | deleteApplication |

> ⚠️ at the moment, updateApplication mutation can only update the whole Application structure like a PUT in RESTful.
