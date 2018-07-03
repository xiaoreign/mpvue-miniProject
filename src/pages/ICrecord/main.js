import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
      "navigationBarBackgroundColor": "#ffffff",
      "navigationBarTextStyle": "black",
      "navigationBarTitleText": "IC卡充值",
      "backgroundColor": "#eeeeee",
      "backgroundTextStyle": "light",
      "usingComponents": {
        "i-button": "../../static/iview/button/index",
        "i-toast": "../../static/iview/toast/index"
      }
    }
  }