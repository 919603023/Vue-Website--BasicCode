import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
import VueAxios from 'vue-axios'
import ElementPlus from "element-plus"
import 'element-plus/lib/theme-chalk/index.css';
import * as bitcoin from 'bitcoinjs-lib'

window.bitcoin = bitcoin

createApp(App)
    .use(store)
    .use(VueAxios,axios)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
