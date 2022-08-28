FROM denoland/deno:latest

COPY . ./app
WORKDIR /app

RUN ["deno", "--version"]