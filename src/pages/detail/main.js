import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
      "navigationBarBackgroundColor": "#ffffff",
      "navigationBarTextStyle": "black",
      "navigationBarTitleText": "充电明细",
      "backgroundColor": "#eeeeee",
      "backgroundTextStyle": "light",
      "usingComponents": {
        "i-button": "../../static/iview/button/index",
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-card": "../../static/iview/card/index",
        "i-page": "../../static/iview/page/index",
        "i-spin": "../../static/iview/spin/index"
      }
    }
  }