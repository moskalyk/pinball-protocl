# ☈ pinball-protocl ⊂ vfaas.net
an open source portion of [vfaas.net](https://vfaas.net) for the purposes of sending data with a payload in a long running process pinballing across different instances of vfaas. you can think [chaos monkey](https://www.geeksforgeeks.org/system-design/what-is-netflixs-chaos-monkey/) connectivitiy, but rather than termination, it's about lively ETL (extract, transform, load) workloads (e.g. machine learning natural intelligence, map reduce, sequencing, etc.)

## features
- [ ] `onion-like`: send data and have the data split autonomously, chipping away at work load, and passing on to next node, dynamically, with references sent back to origin in socket programming.
- [x] `fire & forget`: with a named addressable feed of content, recieve result in an 'EventEmitter' ish-or-as mailbox.
- [ ] `model-layer propogation`: callable across interfaces extending the paradigm of gossip key-value store from vfaas, allow a stringified to propagate across a subnet.
- [ ] `edge catchup & backup`: think of this as load balancing with redundancy. multiple vm's backing eachother if a node is down connected, or, requires round-robin load balancing from an orchestrator node.
- [ ] `multi-language`: 1. javascript (backend & browser) & 2. python (gpu connectivity) 3. yadda (questions?)

## spec
- naming: an [mfm](https://github.com/moskalyk/mfm) name or urbit id
- tracing: formalization of data flows, status codes, and flows from origin to source for error code and ETL updates in redux fashion
- vm: instance running per vfaas node, instantiate a cluster of language environments
- sockets: programming interfacing with status codes
- in browser: make cross platform for backend heavy memory load and in-browser for network reach 
- hoon: some hoon glue

## example: simplex
```js

const req = (datum, params) => {
    console.log(params.time)
    console.log(params.exe)
    console.log(params.dest)
    
    /*
        ** at a time and date
        let now = Date.now()
        while(true){
            if(now >= params.time){
                if(params.exe == ExeCodes.BEST) vfaas.webSocket.send(params.dest, JSON.stringify({status: StatusCodes.BASE_MESSAGE}))
            }
        }
    */
    
    /*
        ** after prolonged time
        let now = Date.now()
        while(true){
            if(now < (Date.now() - params.timeout)){
                vfaas.webSocket.send(params.dest, JSON.stringify({status: StatusCodes.BASE_MESSAGE}))
            }
        }
    */
    
}

vfaas.aPath(req)

vfaas.aBoot((boot, err) => {
    if(err) console.log(err)
    else {
        console.log('running')
        vfaas.webSocket.send('req', JSON.stringify({ status: StatusCodes.TERMINAL_MESSAGE, data: [4, 0] }), {timeout?: 30000, time?: <iso>, exe: EXE.Best, dest?: '<end>'})
    }
})


```

## testing
- written in [TricR](https://github.com/moskalyk/tricr) fashion using test configuration language (TCL) files
