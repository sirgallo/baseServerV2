# Gateway

Authenticates all requests

## routes

`/gateway/register`
*POST*
```json
{
  "firstName": "any",
  "lastName": "any",
  "email": "any@gmail.com",
  "password": "testPass",
  "organization": "test",
  "accessControlLevel": "Dev"
}
```

`/gateway/login`
*POST*
```json
{
  "email": "any@gmail.com",
  "password": "testPass"
}
```