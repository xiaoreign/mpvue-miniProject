import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "附近电站",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light",
        "usingComponents": {
            "i-cell-group": "../../static/iview/cell-group/index",
            "i-cell": "../../static/iview/cell/index",
            "i-tabs": "../../static/iview/tabs/index",
            "i-tab": "../../static/iview/tab/index",
            "i-card": "../../static/iview/card/index",
            "i-button": "../../static/iview/button/index",
            "i-icon": "../../static/iview/icon/index",
            "i-toast": "../../static/iview/toast/index",
        }
    }
}