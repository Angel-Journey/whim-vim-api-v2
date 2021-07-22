#!/bin/bash

API="http://localhost:4741"
URL_PATH="/whims"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "whim": {
      "title": "'"${TITLE}"'",
      "location": "'"${LOCATION}"'",
      "time": "'"${TIME}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
