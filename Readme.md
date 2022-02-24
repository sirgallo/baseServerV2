# Base Dev Server, v2

## Design

```
        nginx
          |
          |
        gateway -- db
          |
          |
      whatever you like?
```

`gateway` acts as api gateway, handles auth

## Requirements 
  - docker 
  - docker-compose

## Run Api Gateway with MongoDb backend (launches docker containers)

```bash
  chmod 700 ./startupDev.sh
  ./startupDev.sh
```

## Docker health checks

every express server contains a `poll` route, that docker compose will automatically ping every `30 secs` for a healthcheck

can be used for basic health check implementation without docker

## MQ with ZeroMQ

  coming soon --> request / response pattern with zeromq broker built on top of express api

## Run just Base Server (just for fun)

```bash
  docker-compose -f docker-compose.baseServer.yml up --build
```