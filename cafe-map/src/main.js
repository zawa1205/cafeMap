import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyC_9JAOx8-eRswaTLkQtv1qkpoRA7xOllI",
  authDomain: "cafemap-zawa.firebaseapp.com",
  databaseURL: "https://cafemap-zawa.firebaseio.com",
  projectId: "cafemap-zawa",
  storageBucket: "cafemap-zawa.appspot.com",
  messagingSenderId: "683160247793",
  appId: "1:683160247793:web:3ba54c0be0379d326cb850",
  measurementId: "G-SZZTNRFW7L"
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
