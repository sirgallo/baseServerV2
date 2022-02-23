#!/bin/bash

docker-compose -f docker-compose.mongoSingle.yml up --build -d

sleep 10

docker exec -it devdbsingle_cont /usr/scripts/mongo-init.sh
docker exec -it devdbsingle_cont screen -S initMongo kill
docker exec -it devdbsingle_cont /usr/bin/mongod -f /usr/configs/mongo.single.conf --auth

sleep 10

docker-compose -f docker-compose.dev.yml up --build 