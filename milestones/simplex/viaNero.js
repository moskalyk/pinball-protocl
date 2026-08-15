const VFAASNet = require('./src/vendor/vfaas.net/')
const ErrorCodes = require('./src/codes/errorTracing')
const StatusCodes = require('./src/codes/statusCodes')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const nero = async (datum, params, vf) => {
    console.log('DATUM', datum)
    if(datum.status == StatusCodes.INIT_PASSWORD){
       console.log('800')
       console.log(datum)
    } else if(datum.status == StatusCodes.WAKEUP){
        console.log('basic')
        console.log(datum)
    } else if(datum.status == 204){
        console.log('too')
        console.log(datum)
        console.log(params)
        console.log(datum.msg.path[datum.msg.current + 1])
        vf.push(datum.msg.path[datum.msg.current + 1], JSON.stringify({msg: 'a via', status: 25}), params)
    }
}

const form = './src/types/reqResponse.hoon'
// const form = './src/types/req.hoon'

vfaas.aPath(nero)

vfaas.aBoot((msg, err) => {
    console.log('listening on nero')
    console.log(msg)
    console.log(err)
})
