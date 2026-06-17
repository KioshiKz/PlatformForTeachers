#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py check --deploy --fail-level ERROR
python manage.py collectstatic --noinput
python manage.py migrate
