import axios from 'axios'

import qs from 'qs'

let sugarPortUrl = "https://api.sugarchain.org/";
let portUrl = "https://api.blockcypher.com/v1/btc/test3/"
let API = 'Bitcoin-test'
//请求当前链信息
export const getChainInfo = (callback) =>{
    let url = portUrl + "info";
    axios.get(url).then(data => {

        callback && callback(data.data)
    })

}
//请求 一个地址的余额
export const getBalance = (address,callback) =>{
    let url = portUrl +"addrs/"+ address+ "/" + "balance"
    axios.get(url).then(data => {

        callback && callback(data.data)
    })
}

//请求 一个地址的可用输入
export const getUnspent = (address) =>{
    let url = portUrl + "addrs/" + address + "?includeScript=true"

    return new Promise((resolve, reject) => {
        axios.get(url).then(data => {
            // console.log(data.dat)
            resolve(data.data);
        })

    })
}

//提交 一个交易的广播
export const callingNewEndpoint = (Json) => {
    let url = portUrl + "txs/new";
    return new Promise((resolve, reject) => {
        axios.post(url,JSON.stringify(Json)).then(data => {
            // console.log(data.dat)
            resolve(data.data);
        })

    })
}
export const transactionBroadcast = (Json) => {
    let url = portUrl + "txs/send";
    return new Promise((resolve, reject) => {
        axios.post(url,JSON.stringify(Json)).then(data => {
            // console.log(data.dat)
            resolve(data.data);
        })

    })
}



export class SugarAjax {

}
SugarAjax.prototype.getUnspent = function (address,amount){
    let url = sugarPortUrl + "unspent/" + address + "?amount=" + amount;
    return new Promise((resolve, reject) => {
        axios.get(url).then(data => {
            resolve(data.data);
        })

    })
}
SugarAjax.prototype.broadcast = function (hex){
    let url = sugarPortUrl + "/broadcast"
    return new Promise((resolve => {
        axios.post(url,qs.stringify({raw:hex})).then(data => {
            resolve(data.data)
        })
    }))
}



// 发送登陆请求 SendLogin
// 请求头为：
// 返回体为： {
//             status:"OK" | "ERR" | ""       // 返回状态
//             err:"***"  | ""                // 返回错误信息
//         }
export const SendLogin = (EncryptedInfo,info,publicKey,callback) => {
    let url = "http://127.0.0.1:8890";
    axios.post(url,qs.stringify({
        EncryptedInfo:EncryptedInfo,
        info:info,
        publicKey:publicKey,
    })).then(data => {
        // console.log(data.dat)
        callback && callback(data.data)
    })
}
export default {
    getChainInfo,
}