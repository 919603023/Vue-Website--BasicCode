var EC = require('elliptic').ec;
const ec = new EC('secp256k1')
window.ec  = ec;

function Sign( privateKey ,msg){

    if ( typeof privateKey != "string")
    {
        throw "PrivateKey is not string"
    }
    if ( typeof msg != "string")
    {
        throw "msg is not string"
    }

    let _msg = bitcoin.crypto.sha256(msg)
    let _key = ec.keyFromPrivate(privateKey,'hex')
    let signature =  _key.sign(_msg)
    let msgSign = Buffer.from(signature.toDER()).toString('hex')
    return msgSign
}
function Veify(publicKey,msg ,msgSign){
    if ( typeof publicKey != "string")
    {
        throw "PrivateKey is not string"
    }
    if ( typeof msg != "string")
    {
        throw "msg is not string"
    }
    if ( typeof msgSign != "string")
    {
        throw "msgSign is not string"
    }

    let _key = ec.keyFromPublic(publicKey,'hex')

    let _msg = bitcoin.crypto.sha256(msg)

    return  _key.verify(_msg,msgSign)
}
export {
    ec,
    Sign,
    Veify
}