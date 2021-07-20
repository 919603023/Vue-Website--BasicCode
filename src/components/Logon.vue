<template>
<!--      登陆组件
      实现了登陆与退出登陆功能
-->
  <div>
    <div v-if="user.isLogin === false">
    <el-input v-model="wif" ></el-input>
    <el-button @click="click_logon(true)">点击登陆</el-button>
  </div>
    <div v-else>
    {{user.address}}
    <el-button @click="click_logon(false)">点击注销</el-button>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getChainInfo, SendLogin} from '../tools/ajax.js'
import {ec,Sign,Veify} from '../tools/elliptic.js'
export default {
  name: "Logon",
  data(){
    return{
      // wif:"KxBP7fBxW5gxt3YKd2qeBb9ZP9pDdPQQtkCQhjjmXD2P4FsV4SGy",
      wif:"cVvaG2Dky65wuGXFYhkbcsqUXpdVe7oUbkW932jxpBjweUD1Fbmz",
      wif2:"cR3GjTpeCNUnhwhw3wwzLaTSkh5cAKpzkrTHpfMGqRnzvnPvLXYP",
      MyServer:false,
    }
  },
  computed: mapState([
    // map this.count to store.state.count
    'user',
    'networkConfigs'
  ]),
  methods:{

    click_logon(state){

      if(state === true)
      {
        //登陆

        let address ;
        let keyPair ;
        try {
          keyPair = bitcoin.ECPair.fromWIF(this.wif, bitcoin.networks.testnet)

           address = bitcoin.payments.p2pkh({
            pubkey:keyPair.publicKey,
             network:bitcoin.networks.testnet
           });


        }
        catch (error)
        {
          console.log("出错了",error)
          return
        }


        //wif 没有错申请登陆

        let that;
        that = this;
        //签名
        if(this.MyServer == true){
          let msgHash = Sign(keyPair.privateKey.toString('hex'),"hello")
          SendLogin(msgHash,"hello",keyPair.publicKey.toString('hex'),function (data){
          //发送登陆请求
          console.log(data)
          if(data.status === "OK"){
            //登陆成功
            that.$store.commit('setUserLogon',true)
            that.$store.commit('setUserWif',that.wif)
            that.$store.commit('setUserAddress',address.address)
            that.$store.commit('setUserKeyPair',keyPair)
          }
          else {
            //登陆失败
            console.log("出错了",data.err)

          }
        })
        }
        else {
          that.$store.commit('setUserLogon',true)
          that.$store.commit('setUserWif',that.wif)
          that.$store.commit('setUserAddress',address.address)
          that.$store.commit('setUserKeyPair',keyPair)
        }

      }
      else if (state == false)
      {
        //注销
        this.$store.commit('setUserLogon',false) ;
        this.$store.commit('setUserWif',"")     ;
        this.$store.commit('setUserAddress',"");
        this.$store.commit('setUserKeyPair',null)
      }

    }
  }

}
</script>

<style scoped>

</style>