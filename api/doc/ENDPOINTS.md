# RESTful endpoints

## Application

### POST /application

Create a new application.

#### Request body

```json
  {
    "features": [
      {
        "criteria": {
          "country": ["BR", "CL"]
        },
        "name": "foo"
      },
      {
        "criteria": {
          "country": ["AR"]
        },
        "name": "bar"
      }
    ],
    "name": "FooApp"
  }
```

#### Responses

##### 201

Application was created.

### DELETE /application/{ID}

Delete an existing application by ID.

#### Responses

##### 204

Application was deleted.

##### 404

Application not found.

## Toggle

### GET /toggle

Evaluate a given context into a set of feature toggles for an application.

#### Responses

##### 200

> Consider an evaluation for the application above.

`GET /toggle?application=FooApp&country=BR`

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

## Health check

### GET /health

#### Responses

##### 200

```json
{
  "up": true
}
```
