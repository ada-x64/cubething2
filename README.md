# cubething2

This is the source code for Phoenix Ada Rose Mandala's personal website. Feel free to use it.

## static files

... are hosted in a submodule. You'll need to create your own (it doesn't have to be a submodule, you can just popualte the folder). Follow the errors to discover what you're missing :)

## deployment

```
docker build -t ${USERNAME}/${CONTAINER} .
docker run -it --init --network host ${USERNAME}/${CONTAINER}
```

By default the server runs in production mode.

## system requirements

nodejs
pandoc
docker (for deployment testing)
