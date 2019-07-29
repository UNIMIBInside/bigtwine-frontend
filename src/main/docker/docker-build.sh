#!/bin/sh

docker build -t bigtwine/frontend . \
    && docker tag bigtwine/frontend 535233662260.dkr.ecr.eu-central-1.amazonaws.com/bigtwine/frontend
