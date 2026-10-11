#!/bin/bash
# DISABLED: unsafe webhook auto-deploy (docker-compose down + docker system prune).
# Do not install or expose this on shared hosting.
echo "$(date): Refusing deploy-webhook.sh — disabled for safety" >&2
exit 1
