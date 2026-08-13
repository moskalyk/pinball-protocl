/**
 * Enum for common status codes.
 * @readonly
 * @enum {code}
 */
const StatusCode = Object.freeze({
    BASE_MESSAGE: 30,
    INIT_PASSWORD: 52,
    TERMINAL_RESPONSE: 204,
    TERMINAL_MESSAGE: 55,
    BROADCAST: 204,
    WAKEUP: 203,
    INTERNAL_HOWDY: 201
})

module.exports = {StatusCode}
