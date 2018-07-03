import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()

export default {
    // 这个字段走 app.json
    config: {
        pages: [
            '^pages/index/main',
            'pages/binding/main',
            'pages/nearbySite/main',
            'pages/scan/main',
            'pages/charging/main',
            'pages/recharge/main',
            'pages/ICrecord/main',
            'pages/record/main',
            'pages/application/main',
            'pages/about/main',
            'pages/detail/main',
            'pages/charge/main'
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black'
        },
        tabBar: {
            color: '#707070',
            borderStyle: 'white',
            backgroundColor: '#fff',
            selectedColor: "#2d8cf0",
            list: [{
                    selectedIconPath: "static/images/site_select.png",
                    iconPath: "static/images/site.png",
                    pagePath: "pages/nearbySite/main",
                    text: "附近电站"
                },
                {
                    selectedIconPath: "static/images/scan_select.png",
                    iconPath: "static/images/scan.png",
                    pagePath: "pages/scan/main",
                    text: "扫一扫"
                },
                {
                    selectedIconPath: "static/images/my_select.png",
                    iconPath: "static/images/my.png",
                    pagePath: "pages/index/main",
                    text: "个人中心"
                }
            ]
        }
    }
}