<template>
  <div>
    <div>
      <p>
        地址： {{user.address}}
        <br>
        余额： {{user.balance}}
      </p>
    </div>

     <div>
       <el-input v-model="Send.SendAddress"> </el-input>
       <el-input   v-model="Send.SendCount" ></el-input>
       <el-input  v-model="Send.SendFee"  ></el-input>

       <el-button @click="send">转账</el-button>
       <el-button @click="SugarTest">测试</el-button>
     </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ref } from 'vue'
import {callingNewEndpoint, getBalance, getUnspent, SugarAjax, transactionBroadcast} from '../tools/ajax.js'
import {getScriptType} from "@/tools/bitcoin_tran.js";
import {$} from "element-plus/es/utils/util";
import {fromBase58Check,fromBech32} from "bitcoinjs-lib/src/address";
export default {
  name: "account",
  data(){
    return{
      timer:Object,
      oldAddress:"",
      sendAddress:'sugar1q7t5q4cpz67dswaqgwu5w5s5c0s5txzfyqz9vyd',
      Send:{
        SendAddress:"",
        SendCount:"",
        SendFee:"",
      }
    }
  },
  computed: mapState([
    'user',
    'networkConfigs'
  ]),
  setup() {

  },
  watch:{
    user:  { handler (newV) {   //这个函数一个是输入的新值，一个是原来的值

        if (newV.address !== "" && this.oldAddress  === "") {
          this.getBalance()
        }
        this.oldAddress = newV.address
      },
      deep: true
    },
  },

  methods: {
    async  SugarTest()
    {
      //测试suger币的交易
      //创建钥匙句柄
      let fee = 10001;
      let network = this.networkConfigs["SUGAR"]["network"]
      let keyPair = bitcoin.ECPair.fromWIF("L5Q6qyMCS1NWKDMkGSLQ4GyGvtUUfDCSES1x4YuQGxahnjy4pxe9",network)
      let payment = bitcoin.payments.p2wpkh({pubkey:keyPair.publicKey,network:network})
      //目的地
      let outaddress = [{address:payment.address,amount:500000}]

      //获取输入
      await  SugarAjax.prototype.getUnspent(payment.address, Number(outaddress[0].amount + fee)).then(data =>{
        console.log(data.result)
        console.log("结果共有：",data.result.length)
        //创建付款句柄
        let txb = new bitcoin.TransactionBuilder(network)
        txb.setVersion(2)
        let amount = 0;
        let i = 0;
        for (let j = 0 ; j < outaddress.length; j++ ){
          amount = amount + outaddress[j].amount
          txb.addOutput(outaddress[j].address, outaddress[j].amount)
          console.log("增加输出：",outaddress[j].address,"金额:",outaddress[j].amount)
        }
        let value = 0;
        for (let j = 0; j < data.result.length; j++){
          // let txid = "5911091e6121b4dfc9792ca9bb26270967ceba1b277b5d3338f7efa774074ead"
          // let index = 25
          // let script = Buffer.from("001402c55b1ed693e90171bdd43545370aee0b9659e2", 'hex')
          value = value + data.result[j].value
          txb.addInput(data.result[j].txid,data.result[j].index,null,payment.output)
          console.log("增加输入:",data.result[j].txid,"\n","index：",data.result[j].index,"\n","数量：",data.result[j].value)
        }
        let change = value - amount - fee
        txb.addOutput(payment.address, change)
        for (let j = 0; j < data.result.length; j++){
          //bech32地址
          txb.sign(j, keyPair, null, null, data.result[j].value, null)
        }

        let tx = txb.build()
        console.log(tx.toHex())
      })













    },
    test(){
      let _msg = bitcoin.crypto.sha256(Buffer.from("hello"))
      console.log(_msg)
      // console.log(this.user.keyPair.privateKey.toString('hex'))
      if(this.user.keyPair !== null){
      let a = bitcoin.script.signature.encode(  this.user.keyPair.sign(_msg),0x01)
        a[a.length - 1] = 0x03;
      console.log("更改后为", a)
        let sign = bitcoin.script.signature.decode(a)

        console.log( this.user.keyPair.verify(_msg,sign.signature))

      }
    },
    checkAddress(address){
      let back

      try {
        back  = fromBase58Check(address)
      }catch (err){
        try {
          back = fromBech32(address)
        }catch (err)
        {
          return false
        }
        return  true
      }
      return true
    },
    getBalance() {
      if (this.user.address === "")
      {
        return
      }
      let that;
      that = this
        getBalance(this.user.address,function (data){

        console.log(data)
          if (data.error == undefined){
            //返回无错
            let balance = Number(data.final_balance) / Math.pow(10, 8)
            that.$store.commit('setUserBalance',balance)
          }
      })

      // this.$store.commit('increment')
    },

    send: async function () {
      //广播
      if( !this.checkAddress(this.Send.SendAddress))
      {
        console.log("地址格式不正确")
        return
      }
      let SendCount =  Number(this.Send.SendCount) * Math.pow(10,5)
      if( typeof SendCount !== 'number')
      {
        console.log("发送的数量不正确")
        return
      }


      const keyBuffer = Buffer.from(this.user.keyPair.privateKey.toString('hex'), 'hex')
      let keys = bitcoin.ECPair.fromPrivateKey(keyBuffer)
      let json ={
        "inputs":
        [
            {
              "addresses":
                [
                   this.user.address
                ]
            }
        ],
        "outputs":
              [
                  {
                    "addresses":
                                [this.Send.SendAddress],
                    "value":
                              SendCount
                  }
              ]
      }
      console.log(this.Send)

      await callingNewEndpoint(json).then( async function (tmptx){
        if(tmptx.error == undefined){
          tmptx.pubkeys = [];
          tmptx.signatures = tmptx.tosign.map(function (tosign, n) {
            tmptx.pubkeys.push(keys.publicKey.toString('hex'));
            return bitcoin.script.signature.encode(
                keys.sign(Buffer.from(tosign, "hex")),
                0x01,
            ).toString("hex").slice(0, -2);
        })
          await  transactionBroadcast(tmptx).then(function (data){
           if(data.hash !== undefined)
              console.log("数据",data);
          })
        }
        else{

        }
      })
      //   txb.addInput(this.sendAddress,0.1)
      //    getUnspent(this.user.address,0.1,function (data){
      //      console.log(data)
      //    })
    }
  },
  mounted() {
    let that = this
    this.getBalance()
    this.timer = setInterval(function (){
      that.getBalance()
    },600*1000)
  },
}
</script>

<style scoped>

</style>