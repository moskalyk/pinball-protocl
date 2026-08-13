# simplex
a base case example of timed pinball protocl

## status codes
- `52`  : send intial password
- `204` : terminal response
- `55`  : terminal message send
- `204` : a * message
- `203` : a wakeup message
- `201` : an internal message to client vfaas

## error tracing
- error tracing, bubbled to `aBoot`. throw errors, with an array of a stack trace including error codes

- `37`  : client side backend parsing error
- `39`  : client side frontend parsing error

## executable message response
const EXE = Object.freeze({
    BEST: 0,
    ERROR: 1,
    FALLBACK: 2
})

## example
```js
vfaas.aPath(seg, {timeout?: 30000, time?: <iso>, exe: EXE.Best, dest?: '<end>'})

vfaas.webSocket.send('req', JSON.stringify({ status: 55, data: [4, 0] }))

const req = (datum, params) => {
    console.log(params.time)
    console.log(params.exe)
    console.log(params.dest)
    
    // pseudo code
    // while true
    // if time >= send on timeout for params.exe
    // .send(params.dest)
}
```
