import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "扫码充电",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light",
        "usingComponents": {
            "i-card": "../../static/iview/card/index",
            "i-modal": "../../static/iview/modal/index",
            "i-toast": "../../static/iview/toast/index",
            "i-message": "../../static/iview/message/index"
        }
    }
}