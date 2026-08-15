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
    console.log(params.timing)
    console.log(params.exe)
    console.log(params.dest)
    
    /*
        ** at a time and date
        let now = Date.now()
        do{
            if(now >= params.time){
                if(params.exe == ExeCodes.BEST) vfaas.webSocket.send(params.dest, JSON.stringify({status: StatusCodes.BASE_MESSAGE}))
            }
        }while(now < params.time)
    */
    
    /*
        ** after prolonged time
        let now = Date.now()
        let fired = false
        while(true && !fired){
            if(now < (Date.now() - params.timing)){
                vfaas.aPath(params.dest, JSON.stringify({status: StatusCodes.BASE_MESSAGE}))
                fired = true
            }
        }
    */
    
}

const form = './requestResponse.hoon'
vfaas.aPath(req, form)

vfaas.aBoot((boot, err) => {
    if(err) console.log(err)
    else {
        console.log('running')
        const params = {timing: Date.now() + 60*1000}
        vfaas.webSocket.send('req', JSON.stringify({ status: StatusCodes.TERMINAL_MESSAGE, data: [4, 0] }), params)
    }
})


```

## when `via`, `vf.push`

```js
// node 1
vfaas.via('.nero.req.', JSON.stringify({bas: [8,2,5], status: 52}), {time: 5})

// node 2
const nero = async (datum, params, vf) => {
    if(datum.status == StatusCodes.INIT_PASSWORD){
       console.log(datum)
    } else if(datum.status == StatusCodes.WAKEUP){
        console.log('basic')
        console.log(datum)
    } else if(datum.status == StatusCode.TERMINAL_RESPONSE){
        vf.push(datum.msg.path[datum.msg.current + 1], JSON.stringify({msg: 'a via', status: 25}), params)
    }
}

// node 3
const req = (datum, params) => ...
```

## testing
- written in [TricR](https://github.com/moskalyk/tricr) fashion using test configuration language (TCL) files
