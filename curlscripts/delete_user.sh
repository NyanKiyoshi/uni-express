. ./login.sh

curl -X \
    DELETE http://127.0.0.1:5000/users/1 \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $AT" -v
