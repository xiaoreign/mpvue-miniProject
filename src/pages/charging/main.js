import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
      "navigationBarBackgroundColor": "#ffffff",
      "navigationBarTextStyle": "black",
      "navigationBarTitleText": "正在充电",
      "backgroundColor": "#eeeeee",
      "backgroundTextStyle": "light",
      "enablePullDownRefresh": true,
      "usingComponents": {
        "i-card": "../../static/iview/card/index"
      }
    }
  }