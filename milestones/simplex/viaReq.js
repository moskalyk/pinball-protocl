const VFAASNet = require('./src/vendor/vfaas.net/')
const ErrorCodes = require('./src/codes/errorTracing')
const StatusCodes = require('./src/codes/statusCodes')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const req = async (datum, params) => {
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


const form = './src/types/reqResponse.hoon'
// const form = './src/types/req.hoon'

vfaas.aPath(req)
// vfaas.aPath(broadcast)

vfaas.aBoot((msg, err) => {
    console.log('listening on req')
    console.log(msg)
    console.log(err)
})
