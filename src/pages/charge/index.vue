<template>
<div>
    <i-card :title="siteData.chargerOperationMode == 1?siteData.estate+siteData.siteName:siteData.address" >
        <div slot="content" style="font-size:28rpx;" v-if="siteData.chargeMode == 1">收费方式:&nbsp;&nbsp;{{siteData.energyPriceStrategy/100}}元/度电</div>
        <div slot="content" style="font-size:28rpx;" v-if="siteData.chargeMode == 2">收费方式:&nbsp;&nbsp;{{siteData.chargeTimeStrategy/60}}小时/元</div>
        <div slot="content" style="font-size:28rpx;" v-if="siteData.chargeMode == 3"> 收费方式:&nbsp;&nbsp;免费充{{siteData.freeEnergyStrategy/1000}}度电</div>
         <!-- <div slot="content" style="font-size:28rpx;margin:20rpx 0 0 0;">账户余额:&nbsp;&nbsp;{{balance}}</div> -->
    </i-card>
 <div class="gridborder">
  <div class="gird">
      <div v-for="(item,index) in socketList" :key="item.id" class="grid-item"
      v-bind:class="{ active: item.socketStatus == 2, select: index == ReservatedSocket-1 }"
      @click="choseSocket(index,item)" :style="index+1 === socketId && item.socketStatus !== 2 ? 'background-image: url(http://scwc.j1st.io/statics/images/selected-plug.svg);background-size:100%;background-repeat:no-repeat;background-position:-2rpx 53%;box-sizing: border-box;border: 0;color:white' :''">
      <span class="socketNumber">{{index+1}}</span>

    </div>
  </div>
 </div>

     <i-card :title="'预缴'+ price +'元'">
        <div slot="content" style="font-size:28rpx;">充满后自动退还余额</div>
    </i-card>
  <div v-for="(item,index) in array" v-bind:key="item">
    <div class="chose-txt"  :data-id="index" @click="choseTxtColor(index,item.price)" :style="index === id ? 'background:url(http://scwc.j1st.io/statics/images/choose.svg) right no-repeat; border:1px solid #e8580c; color:#e8580c' :'border:1rpx solid gainsboro;color:gray'">
      <text class="chose-p">{{item.price}}</text>
    </div>
  </div>
    <input class="custom" @input="InputPrice($event)" :value="inputprice" placeholder="自定义"/>
    <div class="buttonDiv">
      <button class="btn-charging" @click="charger">开始充电</button>
      <button class="btn" @click="appointmentCharge" :disabled="isReservated">开始预约</button>
      <button class="btn-cancel" @click="appointmentCancel" :disabled="!isReservated">取消预约</button>
    </div>
    <div class="time">预约有效时间为6小时</div>
    <!-- <i-modal title="支付" :visible="visible" :actions="actions" @iclick="handlePayType">
      <view>请选择支付方式</view>
    </i-modal> -->
    <i-toast id="toast" />
    <i-message id="message" />
</div>
</template>

<script>
import global from "../../utils/global";
import http from "../../utils/request";
const { $Toast } = require("../../../static/iview/base/index");
const { $Message } = require("../../../static/iview/base/index");

var siteData;
var chargerNumber;
var socketNumber;
var socketStatus;
var status;
export default {
  data() {
    return {
      spinShow: true,
      isshow: "",
      siteData: "",
      socketList: "",
      array: [{ price: "2" }, { price: "5" }],
      price: 2,
      id: 0,
      inputprice: "",
      socketId: null,
      visible: false,
      balance: 0,
      isReservated: false,
      ReservatedSocket: null,
      actions: [
        {
          name: "账户余额",
          color: "#2d8cf0"
        },
        {
          name: "微信支付",
          color: "#19be6b"
        },
        {
          name: "取消"
        }
      ]
    };
  },
  methods: {
    getData() {
      let number = this.$root.$mp.query["deviceNumber"];
      this.isReservated = false;
      this.ReservatedSocket = null;
      http
        .get("device/number", {
          number: number
        })
        .then(res => {
          this.siteData = res.data.data;
          this.socketList = res.data.data.socketList;
          for (let i of this.socketList) {
            if (i.reservationUserNumber == this.userNumber) {
              this.isReservated = true;
              this.ReservatedSocket = i.socketNumber;
              this.socketId = i.socketNumber;
            }
          }
        });
    },
    choseTxtColor(index, item) {
      this.id = index;
      this.price = item;
      this.inputprice = "";
    },
    choseSocket(index, item) {
      if (item.socketStatus != 2) {
        if (!this.isReservated) this.socketId = index + 1;
      }
    },
    InputPrice(e) {
      this.price = e.mp.detail.value;
      this.inputprice = e.mp.detail.value;
      this.id = 123;
    },
    charger() {
      let req = {
        number: chargerNumber,
        socketNumber: this.socketId,
        payType: 6,
        money: this.price * 100
      };
      if (this.socketId != null && this.socketId >= 0 && this.price) {
        http
          .get("/wechat/applets/charge/pay", { money: req.money })
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
                    wx.showLoading({
                      title: "准备中",
                      mask: true
                    });
                    http.post("/wechat/start/charge", req).then(res => {
                      if (res.data.status == "success") {
                        wx.navigateTo({
                          url: "/pages/charging/main"
                        });
                        setTimeout(() => {
                          wx.hideLoading();
                        }, 2000);
                      }
                    });
                  }
                }
              });
            }
          });
      } else {
        $Toast({
          content: "请选择插座",
          type: "error"
        });
      }
    },
    handlePayType(e) {
      let index = e.mp.detail.index;
      if (index === 0) {
      } else if (index === 1) {
      } else if (index === 2) {
        this.visible = false;
      }
    },
    appointmentCharge() {
      let that = this;
      if (this.socketId == null) {
        $Toast({
          content: "请选择预约插座",
          type: "warning"
        });
      } else {
        http
          .get("/wechat/reservation", {
            chargerNumber: chargerNumber,
            socketNumber: this.socketId,
            flag: 1
          })
          .then(res => {
            if (res.data.status == "success") {
              $Message({
                content: "成功预约",
                type: "success"
              });
              that.getData();
            } else if (
              res.data.code == 5005 ||
              res.data.message == "用户预约数量超限"
            ) {
              $Message({
                content: res.data.message,
                type: "warning"
              });
            } else if (
              res.data.message == "此电站插孔已被占用" ||
              res.data.code == 5002
            ) {
              $Message({
                content: res.data.message,
                type: "warning"
              });
            }
          });
      }
    },
    appointmentCancel() {
      if (this.socketId == null) {
        $Toast({
          content: "请选择取消预约插座",
          type: "warning"
        });
      } else {
        http
          .get("/wechat/reservation", {
            chargerNumber: chargerNumber,
            socketNumber: this.socketId,
            flag: 0
          })
          .then(res => {
            console.log(res);
            if (res.data.status == "success") {
              $Message({
                content: "已成功取消预约",
                type: "success"
              });
              this.getData();
            } else if (
              res.data.message == "此电站插孔已被占用" ||
              res.data.code == 5002
            ) {
              $Message({
                content: res.data.message,
                type: "warning"
              });
            }
          });
      }
    },
    StartCharging() {
      if (
        this.price !== null &&
        chargerNumber != null &&
        socketNumber != null
      ) {
        http
          .post("/wechat/start/charge", {
            number: chargerNumber,
            socketNumber: socketNumber,
            money: this.price,
            payType: 1
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 6001 || res.data.message == "账户余额不足") {
              $Message({
                content: res.data.message,
                type: "warning"
              });
            } else if (res.data.data == true && res.data.status == "success") {
              status = true;
              $Message({
                content: "正在充电",
                type: "success"
              });
              wx.redirectTo({ url: "../charging/main" });
            }
          });
      } else if (this.price == null) {
        wx.showModal({
          title: "提示",
          content: "请选择充电金额",
          showCancel: false
        });
      } else if (socketNumber == null) {
        wx.showModal({
          title: "提示",
          content: "请选择插座",
          showCancel: false
        });
      }
    }
  },

  onLoad() {
    chargerNumber = this.$root.$mp.query["deviceNumber"];
    global.commit("setPageName", "/pages/charge/main");
    let timer = setInterval(() => {
      if (global.state.token) {
        clearInterval(timer);
        this.spinShow = false;
        http.get("/wechat/infor").then(res => {
          if (res.data.status == "success") {
            this.balance = res.data.data.accountBalance;
            this.userNumber = res.data.data.userNumber;
            this.getData();
          }
        });
      }
    }, 500);
  }
};
</script>

<style scoped>
.outSide {
  padding: 0 32rpx 0 32rpx;
}

.gridborder {
  margin-top: 22rpx;
  padding: 0 32rpx 0 32rpx;
  height: 580rpx;
}
.gird {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.grid-item {
  padding: 10rpx 10rpx;
  width: 23%;
  height: 102rpx;
  margin-bottom: 12rpx;
  box-sizing: border-box;
  background-image: url(http://scwc.j1st.io/statics/images/plug.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -1px 50%;
  border: 0;
  color: gray;
}
.i-grid {
  border-top: 1rpx solid #e9eaec;
  border-left: 1rpx solid #e9eaec;
  overflow: hidden;
}
.chose-p {
  line-height: 80rpx;
  width: 100%;
  text-align: center;
  float: left;
}
.chose-txt {
  border-radius: 6px;
  font-size: 28rpx;
  height: 80rpx;
  width: 27.5%;
  /* margin: 10rpx; */
  float: left;
  padding-top: 10rpx;
  margin-left: 34rpx;
  margin-top: 20rpx;
}
.custom {
  border: 1px solid gainsboro;
  border-radius: 6px;
  font-size: 28rpx;
  height: 80rpx;
  width: 202rpx;
  margin: 10rpx;
  float: left;
  padding-top: 10rpx;
  margin-left: 3%;
  margin-top: 20rpx;
  margin-bottom: 10px;
  text-align: center;
}
.btn-charging {
  font-size: 16px;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #19be6b;
  color: white;
}
.btn {
  font-size: 16px;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #19be6b;
  color: white;
  width: 240rpx;
  margin: 16rpx 0 10rpx 0rpx;
  float: left;
}
.btn-cancel {
  font-size: 16px;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #19be6b;
  color: white;
  width: 240rpx;
  margin-top: 16rpx;
  float: right;
}
.time {
  clear: both;
  color: rgb(160, 158, 158);
  font-size: 28rpx;
  width: 100%;
  text-align: center;
  margin: 20rpx 0 30rpx 0;
}
.active {
  background-image: url(http://scwc.j1st.io/statics/images/charging-plug.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -1px 48%;
  box-sizing: border-box;
  border: 0;
}
.socketNumber {
  margin-left: 15rpx;
  line-height: 75rpx;
}
.active .socketNumber {
  color: #13ae67;
}
.buttonDiv {
  padding: 0 32rpx;
}
.select {
  background-image: url(http://scwc.j1st.io/statics/images/selected-plug.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -2rpx 53%;
  box-sizing: border-box;
  border: 0;
  color: white;
}
</style>
