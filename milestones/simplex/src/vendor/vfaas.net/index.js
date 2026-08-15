
const auraChecker = (aura) => {
    if(aura == '@ud' ) return 'number'
    if(aura == '@t') return 'string'
    if(aura == '@ta') return 'string'
    if(aura == '(list @t)') return 'object'
}

let isValid = true
const typeChecker = (hoonCore, el) => { // need redo, with bunted default values too
    let isRunArray = false
    Object.entries(hoonCore).forEach(hc => {
        if(Object.keys(hc[1])[0] == 'list' && Array.isArray(el[hc[0]])){
            el[hc[0]].forEach(e => {
                const obj = {}
                obj[Object.values(hc[1])[0]] = e
                typeChecker(hoonCore, obj, isValid)
                isRunArray = true
            })
        } 

    })

    if(!isRunArray){
        Object.values(el).forEach(e => {
                // console.log(typeof e == 'object')
                // check for inner @t elements : non-abstract of 'steps'
                if(Array.isArray(e)){
                    e.forEach(q => {
                        if(hoonCore[Object.keys(el)[1]]){ // TODO: need to clean up

                            hoonCore[Object.keys(el)[1]]&& Object.entries(hoonCore[Object.keys(el)[1]]).forEach((p) => {
                                if(hoonCore[p[1]] && hoonCore[hoonCore[p[1]]]){
                                    Object.entries(q).forEach(o => {
                                        if(typeof o[1] != auraChecker(hoonCore[Object.keys(el)[1]][o[0]])){
                                            isValid = false
                                            
                                            if(hoonCore[hoonCore[p[1]]].includes('%'+o[1])){
                                                isValid = true
                                            } else {
                                                throw new Error('%'+o[1])
                                            }
                                        } else {
                                        
                                        }
                                        if(!isValid)throw new Error('inValid')

                                    })
                                }
                            })
                            
                        } else {
                            if(typeof q != auraChecker(Object.keys(el)[1])){
                                isValid = false
                                throw new Error(q)
                            }
                        }

                    })
                } else if(e != 'type'){
                e&&Object.entries(e).forEach(([k,v]) => {
                    const kvalue = hoonCore[Object.keys(el)[0]][k]
                    if(kvalue != 'object' && !kvalue.list){
                        if(typeof hoonCore[kvalue] == 'object'){
                            typeChecker(hoonCore[kvalue], v, isValid)
                        }
                        else if(typeof v != auraChecker(kvalue)){
                            console.log('falsifyyy')

                            throw new Error(kvalue)
                        }
                    } else if(kvalue && typeof v == 'object'){
                        if(v[k] == auraChecker(kvalue)){ // check for non-abstract: recipe & nutritionFacts
                            if(kvalue.list) {
                                let obj = {}
                                obj[k] = v
                                obj[kvalue.list] = 'type'
                                typeChecker(hoonCore, obj, isValid)
                            } else {
                            let obj = {}
                                obj[kvalue] = v
                                typeChecker(hoonCore, obj, isValid)
                            }
                        } else if(v){
                            if(typeof v == auraChecker(kvalue)){
                                isValid = true
                            } else {
                                isValid = false
                                console.log('falsifyyy')
                                throw new Error(kvalue)
                            }
                        }
                    }
                })
            }
        })
    }

    return isValid
}

class VFAASNetSocket {
    socket;
    notConnected
    isFrontendClient;
    deletedChannels = []
    deletedBroadcasts = []
    forms = {}
    constructor(url, protocol){
      try{
          this.notConnected = false;
         try{
             if(process) {
                // process.argv exists
                const net = require('net')
                const client = new net.Socket();
                client.setNoDelay(false)

                this.socket = client
                this.socket.connect(url.split(':')[1], url.split(':')[0], () => {
                    this.socket.write(JSON.stringify({status: 200, msg: 'Hello, server! From client.' + url.split(':')[1] + url.split(':')[0]}));
                })
            }else {
                this.socket = new WebSocket(url)
                isFrontendClient = true
            }
         } catch(err){
            this.socket = new WebSocket(protocol + "://"+url.split(':')[0] +':'+url.split(':')[1])
            this.isFrontendClient = true
         }
      }catch(err){
        this.notConnected = true;
      }
    }
    
    send(channel, message, params) {
    
    
        // params
        if(!params.hasOwnProperty('time')) params.time = null
        if(!params.hasOwnProperty('timing')) params.timing = 0
        if(!params.hasOwnProperty('exe')) params.exe = -1
        if(!params.hasOwnProperty('dest')) params.dest = 'undefined'
        
        const fs = require('fs')
        const CompilerProducer = require('./types/coreCompiler.js')
        
        fs.readFile(__dirname + './types/params.hoon', (err, c) => {
            if(err) throw new Error('hoon params')

            const cp = new CompilerProducer()
            const typeJSON = cp.compiler(c.toString(), 0)
            
			try {
			    typeChecker(typeJSON, {parameters: params}, true)
			}catch(err){
			    throw new Error('bad parameters')
			}

			if(!isValid) throw new Error('bad parameters')
			const m = JSON.parse(message)
            m.params = params
            m.channel = channel
            try {
                const tempMCheck = m
                delete tempMCheck.params
                typeChecker(this.forms[channel].response, tempMCheck, true)
                if(this.isFrontendClient) this.socket.send(JSON.stringify({channel: channel, msg: m, params: params, status: JSON.parse(message).status}))
                else this.socket.write(JSON.stringify({channel: channel, msg: m, params: params}))
            } catch(err){
                throw new Error('bad response')
            }

        })
    }
    
    on(channel, func, errCB, typeJSON) {
        if(this.isFrontendClient){
            this.socket.onmessage = event => {
                try{
                    const d = JSON.parse(event.data)
                    console.log()
                    if(d.channel == channel) func(d)
                    else if(d.channel == '*') func(d)
                }catch(err){
                    errCB(null, { stack: [39], err: err })
                }
            }
        } else {
            this.forms[channel] = typeJSON 
            this.socket.on('data', (datum) => {
                // prevent double messages
                const re = /\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g
                let msg;
                let runner
                const messages = []
                while ((runner = re.exec(datum)) !== null) {
                    messages.push(runner[0])
                }
                
                const processMessage = async (msg) => {
                    try {
                        const data = JSON.parse(msg)
                        console.log('channel',data)
                        if(data.status == 201){
                            this.socket.write(JSON.stringify({channel: '*', msg: 'message'}))
                        } else {
                            if(!this.deletedChannels.includes(data.channel) && channel == data.channel){
                                func(data, data.params)
                            } else if(!this.deletedBroadcasts.includes(channel) && data.channel == '*') {
                                func(data, data.params)
                            }
                        }
                    }catch(err){
                        errCB(null, { stack: [37], err: err })
                    }
                }
                
                messages.map((m) => {
                    if(m.msg == 'connection created') {
                        console.log('ak')
                    } else {
                        processMessage(m)
                    }
                })
            })
        }
    }
    
    delete(channel, cb, force) {
        this.deletedChannels.push(channel)
        if(force) this.deletedBroadcasts.push(channel)
        cb()
    }
}

class VFAASNet {
  webSocket;
  bootCB;
  constructor({protocol, host, port }) {
    this.webSocket = new VFAASNetSocket(`${host}:${port}`, protocol)
    this.bootCB = () =>  {
      console.log('please connect a path')
    } ;
  }

  aBoot(cb) {
    const msg = 'connection created'
    this.bootCB = cb
    if(this.webSocket.isFrontendClient){
        this.webSocket.socket.onopen = () => {
            cb({boot: this, msg: msg}, null)
        }
    } else {
        this.webSocket.socket.on('connect', () => {
            console.log('client connected')
            cb({boot: this, msg: msg}, null)
        })
    }
  }

  aPath(func, form) {
    do{
        console.log('running')
    }while(this.bootCB == null)
    console.log('outta', this.bootCB)
        if(form){
            const fs = require('fs')
            const CompilerProducer = require('./types/coreCompiler.js')

            fs.readFile(__dirname +'/../../../' +form, (err, c) => {
                if(err) {console.log(err);throw new Error('error reading form')}
                const cp = new CompilerProducer()
                const typeJSON = cp.compiler(c.toString(), 0)
			    let val = func.name
                this.webSocket.on(val, (message, params) => {
                    console.log('message',message);
                    try {
                        if(typeJSON.hasOwnProperty('response')) {
                            typeChecker({request: typeJSON.request}, {request: message}, true)
                        } 
			        }catch(err){
			            console.log(err)
			            throw new Error('bad request shape')
			        }
			        if(!isValid) throw new Error('bad request shape')
                    func(message, params)
                },this.bootCB, typeJSON)
                return this
	        })
	    } else {
            let val = func.name
            setTimeout(() => this.webSocket.on(val, (message, params) => {console.log('message',message);func(message, params)}, this.bootCB), 0)
            return this
        }
  }
  
  anOmit(funcName, cb, options = {force: false}) {
      this.webSocket.delete(funcName, () => {
        cb({msg: 'deleted ' + funcName}) 
      }, options.force)
  }

  aLeave(){
      if(this.webSocket.isFrontendClient){
          this.webSocket.socket.onclose = () => {
              console.log('server disconnected')
          }
      }else {
        this.webSocket.socket.on('disconnection', () => console.log('user disconnected')) // convert to 'a' user
      }
  }
}

try {
    if(process != undefined) module.exports = VFAASNet
} catch(err){
    window.VFAASNet = VFAASNet
}
