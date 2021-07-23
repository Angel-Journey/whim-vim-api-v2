#!/bin/sh

API="http://localhost:4741"
URL_PATH="/whims"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "whim": {
      "title": "'"${TITLE}"'",
      "location": "'"${LOCATION}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
