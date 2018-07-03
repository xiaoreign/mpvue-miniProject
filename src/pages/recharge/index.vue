<template>
<div>
  <div class='UserName'>  
    <text>用 户 名 : </text><open-data style="font-size:28rpx;" type="userNickName" lang="zh_CN"></open-data>
  </div>
  <div class='UserName'>
    <text>余    额：{{balance}} 元</text>
  </div>
  <div v-for="(item,index) in array" v-bind:key="item" class="moneyDiv">
    <div class="chose-txt"  :data-id="index" @click="choseTxtColor(index,item.price)" :style="index === id ? 'background:url(/static/images/backgroundimg.png) right no-repeat; border:1px solid #e8580c; color:#e8580c' :'border:1rpx solid gainsboro;color:gray'">
      <text class="chose-p">{{item.price}}元</text>
    </div>
  </div> 
  <button @click="PayNow()" class='BtnSub'>立即支付{{price}}</button>
  <div class='footer'>
    <text>  提示：【IC卡充值】 </text>
    <navigator class='Click' url='../ICrecord/main' hover-class='none'>请点击这里</navigator>
  </div>
</div>
</template>

<script>
import global from "../../utils/global"
import http from "../../utils/request";

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
      balance: ""
    };
  },

  methods: {
    created() {},

    choseTxtColor(index, item) {
      console.log(index, item);
      this.id = index;
      this.price = ": " + item + "元";
      pay_price = item;
    },
    PayNow(e) {
      console.log(pay_price);
      if (pay_price == "" || pay_price == null) {
        wx.showModal({
          content: "请选择充值金额", //提示的内容,
          showCancel: false, //是否显示取消按钮,
          success: res => {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        wx.request({
          url: hostUrl + "/wechat/gopay", //开发者服务器接口地址",
          data: {
            money: pay_price
          }, //请求的参数",
          header: {
            Authorization: "Bearer " + "vtxZHDVhIVOsqVOgwVlQjUjdOrwCOzUm"
          },
          method: "GET",
          success: res => {
            console.log(res);
            wx.showToast({
              title: "充值成功", //提示的内容,
              icon: "success", //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          },
          fail: () => {},
          complete: () => {}
        });
      }
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    // this.index = 1;
    // this.id = 999;
  },
  onLoad() {
     http.get("/wechat/infor").then(res => {
        if (res.data.status == "success") {
          this.balance = res.data.data.accountBalance
        }
     })
  },
  onUnload() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      price: 200
    });
  }
};
</script>

<style scoped>
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

block {
  display: flex;
}

.chose-p {
  line-height: 80rpx;
  width: 100%;
  height: 80rpx;
  text-align: center;
  float: left;
}

.f {
  padding-top: 30px;
}

.UserName {
  margin-top: 10px;
  color: #3c3c3c;
}

.UserName text {
  font-size: 14px;
  text-align: center;
  margin: 20px 0 0 20px;
}

.BtnSub {
  background-color: #19be6b;
  margin-left: 30rpx;
  font-size: 16px;
  width: 92%;
  height: 100rpx;
  line-height: 100rpx;
  color: white;
  margin-top: 400rpx;
}

.footer {
  font-size: 14px;
  color: #999;
  position: absolute;
  top: 90%;
  left: 20%;
}

.Click {
  margin-left: 10px;
  display: inline;
  color: #19be6b;
  font-weight: bold;
}
.moneyDiv{
  padding: 0 10rpx;
}
</style>
