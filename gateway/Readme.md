# Gateway

Authenticates all requests

## routes

`/gateway/register`
*POST*
```json
{
  "firstName": "Nick",
  "lastName": "Gallo",
  "email": "nickgallo97@gmail.com",
  "password": "test",
  "organization": "visible",
  "accessControlLevel": "Dev"
}
```

`/gateway/login`
*POST*
```json
{
  "email": "nickgallo97@gmail.com",
  "password": "test"
}
```