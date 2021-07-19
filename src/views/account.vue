<template>
  <div>
    <div>
      <p>
        地址： {{user.address}}
        <br>
        余额： {{user.balance}}
      </p>
    </div>
    <p>

    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getBalance} from '../tools/ajax.js'
export default {
  name: "account",
  data(){
    return{
      timer:Object,
      oldAddress:""
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

    getBalance() {
      if (this.user.address === "")
      {
        return
      }
      let that;
      that = this
        getBalance(this.user.address,function (data){

        console.log(data)
          if (data.error == null){
            //返回无错
            let balance = Number(data.result.balance) / Math.pow(10, 8)
            that.$store.commit('setUserBalance',balance)
          }
      })

      // this.$store.commit('increment')
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