#!/bin/bash

NB_MUSICIANS=10

docker-compose up -d auditor monitor

echo ""
echo "------------------------------------------------"
echo " Monitor is deployed to http://localhost:5000/  "
echo "------------------------------------------------"
echo ""
echo "Press enter to launch $NB_MUSICIANS random musicians..."
read

instruments=(piano violin flute drum trumpet)
for i in $(seq 1 $NB_MUSICIANS); 
do
    docker-compose run --rm -d musician ${instruments[$(($RANDOM % 5))]}
done

echo ""
echo "You can stop every containers with 'docker-compose down'"
echo "You can stop musicians with 'docker stop \$(docker ps -q --filter ancestor=res/musician)'"
echo "You can start a new musician with 'docker-compose run -d --rm musician <instrument>'"
