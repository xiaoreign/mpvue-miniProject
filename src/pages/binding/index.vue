<template>
  <div class="container">
    <div class="login" v-if="isShowMobile">
    <div class='Login-code'>
      <input class='phone-number'  type='number' name="mobile" minlength='11' maxlength='11' placeholder='请输入手机号' v-on:input='mobileInput'/>
      <input class='code-number' name="code"  type='number' minlength='6' maxlength='6' placeholder='请输入验证码'  v-on:input='codeInput'/>
      <button type='button' v-if="isshow" class="btn getauthCode" :disabled="disabled1" @click="GetAuthCode()">获取验证码</button>
      <button type="button" v-if="!isshow" class="btn gotauthCode" :disabled="!disabled1">重新获取{{count}}s</button>
    </div>
    <button class='btn login' :disabled="disabled2" @click='determine()'>确定</button>
  </div>
  <i-toast id="toast" />
  <i-message id="message" />
  </div>
</template>

<script>
import card from "@/components/card";
import http from "../../utils/request";
import global from "../../utils/global";
const { $Toast } = require("../../../static/iview/base/index");
const { $Message } = require("../../../static/iview/base/index");

const TIME_COUNT = 59;
var RegPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
var code;
export default {
  data() {
    return {
      isshow: true,
      count: "",
      timer: null,
      disabled1: true,
      disabled2: true,
      isShowMobile: true,
      Mobile:''
    };
  },

  components: {
    card
  },

  methods: {
    mobileInput(e) {
      this.Mobile = e.mp.detail.value;
      if (this.Mobile.length == 11) {
        if (!RegPhone.test(this.Mobile)) {
          wx.showModal({
            content: "请输入正确的手机号", //提示的内容,
            showCancel: false //是否显示取消按钮,
          });
        }
        this.disabled1 = false;
      } else {
        this.disabled1 = true;
      }
    },
    codeInput(e) {
      this.code = e.mp.detail.value;
      if (this.code.length == 6) {
        this.disabled2 = false;
      } else {
        this.disabled2 = true;
      }
    },
    GetAuthCode() {
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.isshow = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.isshow = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      if (this.disabled1 == false) {
        http.get("/user/bind/mobile",{mobile: this.Mobile}).then(res => {
          if (res.data.status == "success") {
            $Toast({
              content: "已发送"
            });
          } else {
            $Toast({
              content: res.data.message
            });
          }
        });
      }
    },
    determine() {
      let data = {
        mobile: this.Mobile,
        operateType: "BIND_MOBILE",
        authCode: this.code
      };
      http.post("/user/verification", data).then(res => {
        if (res.data.status == "success") {
          $Message({
            content: "绑定成功",
            type: "success"
          });
          setTimeout(()=>{
            wx.navigateBack();
          },800)
        }else{
          $Toast({
              content: res.data.message
            });
        }
      });
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
  },
  onShow: function() {
    this.Mobile = ''
    this.disabled2 = true
  }
};
</script>

<style scoped>
.containers {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
.login {
  width: 600rpx;
  height: 80rpx;
  line-height: 80rpx;
  margin-top: 30rpx;
}
.phone-number {
  font-size: 30rpx;
  border: 1px solid #dddee1;
  border-radius: 10rpx;
  display: inline-block;
  width: 560rpx;
  height: 74rpx;
  padding-left: 30rpx;
}
.code-number {
  font-size: 30rpx;
  border: 1px solid #dddee1;
  border-radius: 10rpx;
  display: inline-block;
  width: 290rpx;
  height: 74rpx;
  padding-left: 30rpx;
  margin-top: 20rpx;
}
.btn {
  color: white;
  background-color: #19be6b;
}
.getauthCode {
  font-size: 30rpx;
  width: 240rpx;
  float: right;
  margin-top: 20rpx;
  margin-right: 6rpx;
}
.gotauthCode {
  font-size: 30rpx;
  width: 240rpx;
  float: right;
  margin-top: 20rpx;
  margin-right: 6rpx;
}
button[disabled] {
  border-radius: 0px;
  background-color: #f5f5f5;
  color: #aca899;
}
</style>
