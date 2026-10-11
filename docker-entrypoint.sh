#!/bin/sh
# Ensure the persistent SQLite volume is writable by the app user.
set -eu
mkdir -p /app/data
chown -R app:app /app/data
exec su-exec app node server.js
