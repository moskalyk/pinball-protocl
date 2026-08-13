const VFAASNet = require('./src/vendor/vfaas.net/')
const ErrorCodes = require('./src/errorTracing')
const StatusCodes = require('./src/statusCodes')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const seg = async (datum, params) => {
    if(datum.status == StatusCodes.INIT_PASSWORD){
       console.log(datum)
    } else if(datum.status == StatusCodes.WAKEUP){
        console.log('basic')
        console.log(datum)
        console.log('params')
        console.log(params)
    } else {
        console.log('other')
        console.log(datum)
    }
}

const broadcast = (datum) => {
    console.log('whowho')
    console.log(datum)
}

vfaas.aPath(seg, {time: 5})
vfaas.aPath(broadcast, {time: 5})

vfaas.aBoot((msg, err) => {
    console.log('listening')
    console.log(err)
    if(!err){
        vfaas.anOmit('seg', (deleteMessage) => {
            console.log('ommitted successfully')
            console.log(deleteMessage)
            vfaas.webSocket.send('seg', JSON.stringify({msg: 'sending msg', status: 52}))
        }, {force: false})
    } else if(err.code == ErrorCodes.BACKEND_PARSING_ERROR){
        console.log(err)
    }
})
