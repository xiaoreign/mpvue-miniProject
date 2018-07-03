import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "绑定手机号",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light",
        "usingComponents": {
            "i-toast": "../../static/iview/toast/index",
            "i-message": "../../static/iview/message/index"
        }
    },
}