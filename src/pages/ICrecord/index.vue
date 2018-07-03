<template>
<div class='f'>

  <div class='fa'>
    <span>卡号：</span>
    <input bindblur='card' type='number' class="show" v-model.lazy="ICcard" />
    <div>
      <button class="saoma" @click="scan()">扫码识别</button>
    </div>
  </div>

  <div class='center clearfloat'>
    <p>余额：{{icBanlence}} 元</p>
  </div>
  <div class="moneyDiv">
    <div v-for="(item,index) in array" v-bind:key="item">
      <div class="chose-txt"  :data-id="index" @click="choseTxtColor(index,item.price)" :style="index === id ? 'background:url(/static/images/backgroundimg.png) right no-repeat; border:1px solid #e8580c; color:#e8580c' :'border:1rpx solid gainsboro;color:gray'">
        <text class="chose-p">{{item.price}}元</text>
      </div>
    </div>
  </div>
  <div class="btnDiv">
    <button @click="PayNow()" class='BtnSub'>立即支付{{price}}</button>
  </div>
  <i-toast id="toast" />
</div>
</template>

<script>
const { $Toast } = require("../../../static/iview/base/index");
import http from "../../utils/request";
import global from "../../utils/global";

var pay_price;
export default {
  data() {
    return {
      array: [
        { price: "5" },
        { price: "10" },
        { price: "20" },
        { price: "50" },
        { price: "100" },
        { price: "200" },
        { price: "300" },
        { price: "500" }
      ],
      price: "",
      id: "",
      ICcard: null,
      icBanlence: 0,
      orderNumber: null
    };
  },

  methods: {
    created() {},
    choseTxtColor(index, item) {
      this.id = index;
      this.price = ": " + item + "元";
      pay_price = item;
    },
    PayNow(e) {
      if (pay_price == "" || pay_price == null) {
        $Toast({
          content: "请选择充值金额",
          type: "warning"
        });
        return false;
      } else if (this.ICcard == null || this.ICcard.length < 16) {
        $Toast({
          content: "IC卡号不正确",
          type: "warning"
        });
        return false;
      }
      http
        .get("/wechat/icPay", { icNumber: this.ICcard, money: pay_price })
        .then(res => {
          if (res.data.status == "success") {
            let i = res.data.data;
            this.orderNumber = i.orderNumber;
            wx.requestPayment({
              timeStamp: i.timeStamp,
              nonceStr: i.nonceStr,
              package: i.package,
              signType: "MD5",
              paySign: i.paySign,
              success: function(res) {
                if (res.errMsg == "requestPayment:ok") {
                  $Toast({
                    content: "充值成功",
                    type: "success"
                  });
                  wx.switchTab({
                    url: "/pages/index/main"
                  });
                }
              }
            });
          }
        });
    },
    getCardData() {
      http.get("/icCard/find", { number: this.ICcard }).then(res => {
        if (res.data.status == "success") {
          this.icBanlence = res.data.data.icCardBalance / 100;
        }
      });
    },
    scan() {
      wx.scanCode({
        onlyFromCamera: true, //是否只能从相机扫码，不允许从相册选择图片,
        success: res => {
          let result = res.path; // 当needResult 为 1 时，扫码返回的结果
          wx.redirectTo({
            url: "/" + result
          });
        }
      });
    }
  },
  onShow() {
    global.commit("setPageName", "/pages/ICrecord/main");
  },
  onLoad() {
    if (this.$root.$mp.query) {
      let query = this.$root.$mp.query;
      this.ICcard = query.icCardNumber;
      let timer = setInterval(() => {
        if (global.state.token) {
          clearInterval(timer);
          this.getCardData();
        }
      }, 500);
    }
  }
};
</script>

<style scoped>
.fa {
  font-size: 14px;
  padding: 10px 20px;
}

.chose-txt {
  border-radius: 6px;
  font-size: 28rpx;
  height: 80rpx;
  width: 27.5%;
  margin: 10rpx;
  float: left;
  padding-top: 10rpx;
  margin-left: 3%;
  margin-top: 20rpx;
}
.clearfloat {
  float: none;
}
.chose-p {
  line-height: 80rpx;
  width: 100%;
  text-align: center;
  float: left;
}

.f {
  padding-top: 30px;
  height: 400px;
}

.fa span {
  float: left;
  width: 50px;
  height: 30px;
  line-height: 30px;
  color: #3c3c3c;
}

.fa .show {
  width: 380rpx;
  height: 30px;
  float: left;
  line-height: 30px;
  border: 1px solid #eee;
  border-radius: 3px;
}

.saoma {
  float: right;
  font-size: 26rpx;
  width: 170rpx;
  height: 64rpx;
  background-color: #19be6b;
  color: white;
}

.show {
  width: 100%;
  color: #666;
  background-color: #fff;
  height: auto;
}

.center {
  font-size: 14px;
  padding: 10px 20px;
  margin-top: 60rpx;
  color: #3c3c3c;
}

.BtnNumber {
  height: auto;
}
.btnDiv {
  margin-top: 20px;
}
.BtnSub {
  background-color: #19be6b;
  margin-left: 30rpx;
  font-size: 16px;
  width: 92%;
  height: 100rpx;
  line-height: 100rpx;
  color: white;
}
.moneyDiv {
  height: 400rpx;
  padding: 0 10rpx;
}
</style>
