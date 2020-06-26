#!/bin/bash

docker build -t res/musician .
docker run --rm res/musician piano