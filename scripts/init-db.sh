#!/usr/bin/env bash
set -e

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_NAME=${DB_NAME:-"bi_analytics"}

PGPASSWORD=${PGPASSWORD:-"postgrespassword"} psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ./database/schema.sql
PGPASSWORD=${PGPASSWORD:-"postgrespassword"} psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ./database/seeds/001_sample_data.sql
