const VFAASNet = require('./src/vendor/vfaas.net/')
const ErrorCodes = require('./src/codes/errorTracing')
const StatusCodes = require('./src/codes/statusCodes')

const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const nero = async (datum, params, vf) => {
    console.log('',datum)
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
        console.log(datum.push)
        console.log(JSON.stringify({msg: 'a via', push: datum.push, status: 25}))
        vf.push(datum.push.path[datum.push.current + 1], JSON.stringify({ms: 'a via', push: datum.push, status: 25}), params)
    }
}

const form = './src/types/reqPushResParams.hoon'
// const form = './src/types/req.hoon'

vfaas.aPath(nero, form)

vfaas.aBoot((msg, err) => {
    console.log('listening on nero')
    console.log(msg)
    console.log(err)
})
