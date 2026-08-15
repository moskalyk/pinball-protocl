const VFAASNet = require('./src/vendor/vfaas.net/')
const ErrorCodes = require('./src/codes/errorTracing')
const StatusCodes = require('./src/codes/statusCodes')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const seg = async (datum, params) => {
    if(datum.status == StatusCodes.INIT_PASSWORD){
       console.log('800')
       console.log(datum)
    } else if(datum.status == StatusCodes.WAKEUP){
        console.log('basic')
        console.log(datum)
    } else {
        console.log('other')
        console.log(datum)
        console.log(params)
    }
}

// const broadcast = (datum) => {
//     console.log('whowho')
//     console.log(datum)
// }

const form = './src/types/reqResponse.hoon'
// const form = './src/types/req.hoon'

vfaas.aPath(seg, form)
// vfaas.aPath(broadcast)

vfaas.aBoot((msg, err) => {
    console.log('listening')
    console.log(err)
    if(!err){
        vfaas.anOmit('seg', (deleteMessage) => {
            console.log('ommitted successfully')
            console.log(deleteMessage)
            vfaas.webSocket.send('seg', JSON.stringify({bas: [8,2,5], status: 52}), {time: 5})
        }, {force: false})
    } else if(err.code == ErrorCodes.BACKEND_PARSING_ERROR){
        console.log(err)
    }
})
