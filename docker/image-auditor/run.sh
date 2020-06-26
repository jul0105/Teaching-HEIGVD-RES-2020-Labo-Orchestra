#!/bin/bash

docker build -t res/auditor .
docker run --rm -p 2205:2205 res/auditor