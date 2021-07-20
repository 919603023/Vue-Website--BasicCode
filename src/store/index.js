import { createStore } from 'vuex'
import * as bitcoin from 'bitcoinjs-lib'
import {ECPair} from "bitcoinjs-lib";
export default createStore({
  state: {
    count: 0,
    user:{
      //用户的登陆状态
      wif:"",
      address:"",
      balance:0,
      isLogin:false,
      keyPair:ECPair,
    },
    networkConfigs : {
      'SUGAR': {
        'uri': 'sugarchain:',
        'title': 'Sugar Wallet',
        'name': 'Main Network (SUGAR)',
        'api': 'https://api.sugarchain.org',
        'ticker': 'SUGAR',
        'decimals': 8,
        'fee': 0.00001,
        'network': {
          'messagePrefix': '\x19Sugarchain Signed Message:\n',
          'bip32': {
            'public': 0x0488b21e,
            'private': 0x0488ade4
          },
          'bech32': 'sugar',
          'pubKeyHash': 0x3F,
          'scriptHash': 0x7D,
          'wif': 0x80
        }
      },
      'TUGAR': {
        'uri': 'sugarchain:',
        'title': 'Sugar Wallet',
        'name': 'Test Network (TUGAR)',
        'api': 'https://api-testnet.sugarchain.org',
        'ticker': 'TUGAR',
        'decimals': 8,
        'fee': 0.00001,
        'network': {
          'messagePrefix': '\x19Sugarchain Signed Message:\n',
          'bip32': {
            'public': 0x0488b21e,
            'private': 0x0488ade4
          },
          'bech32': 'tugar',
          'pubKeyHash': 0x42,
          'scriptHash': 0x80,
          'wif': 0xEF
        }
      }
    },

  },
  mutations: {
    increment (state) {
      state.count++ ;
    },
    setUserLogon(state,status){
      state.user.isLogin = status;
    },
    setUserWif(state,wif){
      state.user.wif = wif  ;
    },
    setUserAddress(state,address){
      state.user.address = address;
    },
    setUserBalance(state,balance){
      state.user.balance = balance
    },
    setUserKeyPair(state,keypair){
      state.user.keyPair = keypair
    }

  },
  actions: {
  },
  modules: {
  }
})
