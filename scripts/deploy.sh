#!/usr/bin/env bash
set -e

git pull origin main
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d --build
