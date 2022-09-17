#!/bin/bash

set -euo pipefail

build_develop_image () {
    docker build -t deno-develop-app -f Dockerfile.dev .
}

develop () {
    build_develop_image
    docker run -it --rm -v "$PWD:/app" -p "8080:8080" -p "8443:8443" deno-develop-app
}

enter_deno() {
    build_develop_image
    docker run -it --rm -v "$PWD:/app" -p "8080:8080" -p "8443:8443" --entrypoint /bin/bash deno-develop-app
}

$1