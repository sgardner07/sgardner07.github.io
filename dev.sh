#!/usr/bin/env bash
# Local dev server with live reload. Site opens at http://localhost:8080
# and the browser auto-refreshes whenever you save a file.
cd "$(dirname "$0")"
npx --yes live-server --port=8080 --ignore=.git
