<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/account">Account</router-link>
    <logon></logon>
  </div>
  <router-view/>
</template>
<script>
import logon from './components/Logon.vue'

export default {
  name: 'App',
  components: {logon},
  data() {
    return {}

  },
  methods: {
    click() {

      this.$store.commit('increment')
    }

  }
}

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
