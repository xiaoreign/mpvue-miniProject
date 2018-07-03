import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
      "navigationBarBackgroundColor": "#ffffff",
      "navigationBarTextStyle": "black",
      "navigationBarTitleText": "充值记录",
      "backgroundColor": "#eeeeee",
      "backgroundTextStyle": "light",
      "usingComponents": {
        "i-button": "../../static/iview/button/index",
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-card": "../../static/iview/card/index"
      }
    }
  }