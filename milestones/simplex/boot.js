const VFAASNet = require('src/vendor/vfaas.net/')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const seg = async (datum) => {
    if(datum.status == 52){
       console.log(datum)
    }
}

vfaas.aPath(seg)

vfaas.aBoot(() => {
    console.log('listening')
    vfaas.webSocket.send('seg', JSON.stringify({msg: 'sending msg', pw: pass1, status: 52}))
})



