### Deno in docker fullstack app

Simple template wit server and esbuild pipeline for building frontend files

## Commands

`./scrips/commands.sh` accepts two keywords

`develeop` - will build image from `Dockerfile.dev` and start two porcesses for
serving files and rebuilding frontend on file changes. The app will be hosted on
`localhost:8080`

`enter_deno` - it will build image and start container leaving terminal inside
the container. Which allows to do some poking arround inside development
container. It will also give acces to deno CLI

## Integration wiht Visual Studio Code

`.devconatainer` folder consist configuration of develpment container for vsc.
It is requrired to start development using remote client vsc functionality. It
allows `deno-plugin` to run inside container without installing deno directly on
local machine.

It is usefull to use `parallel.sh` to start developmnent mode directly from
within running container

## Production

Production mode is not yet finalized. The production image will be build from
`Dockerfile` but it is still work in progress
