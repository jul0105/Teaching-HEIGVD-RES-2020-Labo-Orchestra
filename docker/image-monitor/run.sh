#!/bin/bash

docker build -t res/monitor .
docker run --rm -p 5000:5000 res/monitor