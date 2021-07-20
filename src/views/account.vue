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
     </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ref } from 'vue'
import {callingNewEndpoint, getBalance, getUnspent, transactionBroadcast} from '../tools/ajax.js'
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
    update (val) {
      this.$emit('input', val)
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