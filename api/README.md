# Easy Toggles API

## Run

```shell
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
