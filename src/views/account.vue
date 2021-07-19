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
      <el-button @click="click"></el-button>
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

    }
  },
  computed: mapState([
    'user',
    'networkConfigs'
  ]),
  methods: {
    click() {
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

  }

}
</script>

<style scoped>

</style>