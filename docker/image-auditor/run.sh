#!/bin/bash

docker build -t res/auditor .
docker run --rm -p 2205:2205 -p 3030:3030 res/auditor