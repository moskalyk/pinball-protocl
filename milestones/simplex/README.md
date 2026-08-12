# simplex
a base case example of timed pinball protocl

## status codes
- `52`  : send intial password
- `204` : terminal response
- `55`  : terminal message send

## error tracing
- error tracing, bubbled to `aBoot`. throw errors, with an array of a stack trace including error codes

const EXE = Object.freeze({
    BEST: 0,
    ERROR: 1,
    FALLBACK: 2
})

## example
```js
vfaas.webSocket.send('req', JSON.stringify({ status: 55, data: [4, 0] }), {timeout?: 30000, time?: <iso>, exe: EXE.Best, dest?: '<end>'})

const req = (datum, params) => {
    console.log(params.time)
    console.log(params.exe)
    console.log(params.)
    
    // pseudo code
    // while true
    // if time >= send on timeout for params.exe
    // .send(params.dest)
}
```

## individual channel refactor
TODO
