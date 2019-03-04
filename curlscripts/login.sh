#!/bin/sh

AT=$(curl -X \
    POST http://127.0.0.1:5000/users/signin \
    --header "Content-Type: application/json" \
    --data '{"username": "admin", "password": "admin"}' | cut -d '"' -f4)

echo "logged in: $AT" >&2
