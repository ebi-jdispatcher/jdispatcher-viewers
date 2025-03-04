#!/bin/bash

DOCS_DIR="${1}"
NEW_URL="/jdispatcher-viewers/index.html"

# Find all .html files recursively
find "$DOCS_DIR" -type f -name "*.html" | while read -r FILE; do
  if [ -f "$FILE" ]; then
    sed -i "s|<a href=\"index.html\"|<a href=\"$NEW_URL\"|" "$FILE"
    sed -i "s|<a href=\"../index.html\"|<a href=\"$NEW_URL\"|" "$FILE"
    echo "Updated $FILE"
  else
    echo "File not found: $FILE"
  fi
done
