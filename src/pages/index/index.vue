<template>
<div style="background:#eee;height:100%;border-top: 1px solid #eee" class="spin-article">
  <div class='header'>
   <div class="userinfo-avatar">
      <open-data  style="margin-top:50rpx;" type="userAvatarUrl"></open-data>
   </div>
   <div class="userinfo_name">
      <open-data type="userNickName"></open-data>
   </div>
  </div>
  <div style="margin-top:10px">
    <i-cell-group>
        <i-cell title="绑定手机号" is-link url="../binding/main" :value="data.mobile"></i-cell>
        <i-cell title="正在充电" is-link  url="../charging/main" :value="chargeStr"></i-cell>
        <!-- <i-cell title="账户充值" is-link url="../recharge/main" :value="'余额: ' + data.accountBalance + '元'"></i-cell> -->
        <i-cell title="IC卡充值" is-link url="../ICrecord/main"></i-cell>
        <i-cell title="充值记录" is-link url="../record/main"></i-cell>
        <i-cell title="充电明细" is-link url="../detail/main"></i-cell>
        <i-cell title="运营申请" is-link url="../application/main"></i-cell>
        <i-cell title="关于我们" is-link url="../about/main" only-tap-footer ></i-cell>
        <i-cell > </i-cell>
    </i-cell-group>
  </div>
  <i-spin size="large" fix v-if="spinShow" custom>
    <view class="loading"></view>
  </i-spin>
  <i-modal title="获取微信授权信息" :visible="isValidated" :actions="actions" @iclick="getUserInfo">
    <view>微信登录需要获取您的用户信息</view>
</i-modal>
</div>
    
</template>

<script>
import global from "../../utils/global";
import http from "../../utils/request";
import Vue from "vue";

export default {
  data() {
    return {
      spinShow: true,
      isValidated: false,
      price: 0,
      data: {
        accountBalance: 0
      },
      chargeData: [],
      chargeStr: "",
      current: "/pages/index/main",
      actions: [
        {
          name: "设置"
        }
      ]
    };
  },
  methods: {
    getUserInfo() {
      this.isValidated = false;
    },
    getInfo() {
      let that = this;
      http.get("/wechat/infor").then(res => {
        if (res.data.status == "success") {
          this.data = res.data.data;
          global.commit("setBalance", this.data.accountBalance);
          if (this.data.isValidated) {
          } else {
            wx.getSetting({
              success: res => {
                if (res.authSetting["scope.userInfo"]) {
                  wx.getUserInfo({
                    success: res => {
                      http.post("/wechat/applets/user/update", res.userInfo);
                    },
                    fail: res => {}
                  });
                } else {
                  that.isValidated = true;
                }
              }
            });
          }
        }
      });
    },
    getchargeData() {
      http.get("/charge/find").then(res => {
        if (res.data.status == "success") {
          if (res.data.data.length > 0) {
            this.chargeData = res.data.data[0];
            this.chargeStr =
              "编号:" +
              this.chargeData.deviceNumber +
              ":" +
              this.chargeData.sockeNumber +
              "插座";
          } else {
            this.chargeStr = "";
          }
        }
      });
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
  },
  onShow() {
    global.commit("setPageName", "/pages/index/main");
    let timer = setInterval(() => {
      if (global.state.token) {
        clearInterval(timer);
        this.spinShow = false;
        this.getInfo();
        this.getchargeData();
      }
    }, 500);
  },
  onPullDownRefresh: function() {
    setTimeout(() => {
      http.get("/wechat/infor").then(res => {
        if (res.data.status == "success") {
          this.data = res.data.data;
          global.commit("setBalance", this.data.accountBalance);
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
      });
    }, 500);
  }
};
</script>

<style scoped>
.userinfo-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  border: 2px solid #faf0e6;
  z-index: 1;
  margin: 0 auto;
  position: relative;
  top: 50rpx;
}
.userinfo_name {
  /* color: ; */
  margin: 80rpx 0 0 0;
  z-index: 1;
}
.header {
  width: 100%;
  height: 320rpx;
  text-align: center;
  /* background: url("../../../static/images/bc_qdyl.png"); */
  background: #fff;
}
.framess {
  font-family: "Microsoft YaHei";
}
.framess .weui-cell__bd navigator {
  padding: 0px 15px;
}
.framess .weui-cell__bd {
  font-size: 14px;
}
.item {
  height: 100px;
  text-align: center;
}

label {
  padding: 0px 10px;
}
</style>
