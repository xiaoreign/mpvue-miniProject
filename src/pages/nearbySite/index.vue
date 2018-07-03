<template>
  <div>
    
    <i-tabs :current="current"  @change="handleChange">
        <i-tab key="0" title="查看地图" style="width:30%"></i-tab>
        <i-tab key="1" title="电站列表" style="width:30%"></i-tab>
    </i-tabs>
  <div v-if="isshowList">
  <div class='weui-loadmore weui-loadmore_line' v-if="markersData.length == 0">
    <div class='weui-loadmore__tips'>该地区暂无电站</div>
  </div>
    <div class="listDiv" v-for="(item,index) in markersData" :key="index">
      <i-card :title="item.road+item.estate" @click="tocharge(item)">   
          <div slot="content">{{item.siteName}} 编号:{{item.deviceNumber}}</div>
          <div slot="footer">闲:{{item.freeNum}}      
            <div class="i-card-footer-item">预: {{item.reservationNum}}</div>
            <div class="i-card-footer-item2">充: {{item.socketNum - item.freeNum - item.reservationNum}}</div>
            <div class="i-card-footer-item3">共: {{item.socketNum}}</div>
            <i-icon class="icon-go" size="20" type="flashlight" />  
            <div @touchstart.stop="goSite(index)" class="goSite">
              <span>前往电站</span>
            </div>
          </div>
          
      </i-card>
    </div>
  </div>
    <map v-if="isshow" id="map" scale='16' :markers="markers" :longitude="lo" :latitude="la" class="map" :style="'height:'+mapHeight+'px;'" show-location></map> 
    <button v-if="issshow" open-type="openSetting"  @opensetting="handler">打开授权</button>
  <i-toast id="toast" />
  </div>
</template>

<script>
import card from "@/components/card";
import global from "../../utils/global";
import http from "../../utils/request";
const { $Toast } = require("../../../static/iview/base/index");

var markersData;
export default {
  data() {
    return {
      isshow: true,
      issshow: false,
      isshowList: false,
      isshowTab: true,
      la: "",
      lo: "",
      mapHeight: 0,
      markers: [],
      current: 0,
      markersData: "",
      mapCtx: null
    };
  },

  components: {
    card
  },

  methods: {
    // handler(e) {
    //   let that = this;
    //   let userLocation = e.mp.detail.authSetting["scope.userLocation"];

    // },
    tocharge(i) {
      if (i.deviceStatus == 1) {
        wx.navigateTo({
          url: "/pages/charge/main?deviceNumber=" + i.deviceNumber
        });
      } else if (i.deviceStatus == 2) {
        $Toast({
          content: "设备不在线"
        });
      } else if (i.deviceStatus == 3) {
        $Toast({
          content: "设备故障"
        });
      }
    },
    goSite(index) {
      wx.openLocation({
        latitude: this.markersData[index].location["latitude"], //纬度，范围为-90~90，负数表示南纬,
        longitude: this.markersData[index].location["longitude"], //经度，范围为-180~180，负数表示西经,
        scale: 15, //缩放比例，范围5~18,
        name: this.markersData[index].siteName, //位置名,
        address: this.markersData[index].address + this.markersData[index].road //地址的详细说明,
        // success: res => {}
      });
    },
    handleChange(e) {
      global.commit("setMapTab", e.mp.detail.key);
      this.current = e.mp.detail.key;
      if (this.current == 1) {
        this.isshow = false;
        this.isshowList = true;
      } else if (this.current == 0) {
        this.isshowList = false;
        this.isshow = true;
      }
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
  },

  onLoad: function() {},
  onHide() {
    this.isshow = true;
    this.issshow = false;
    this.isshowList = false;
    this.isshowTab = false;
    this.current = 0;
  },
  onShow: function() {
    this.current = global.state.tab;
    if (this.current == 1) {
      this.isshow = false;
      this.isshowList = true;
    } else if (this.current == 0) {
      this.isshowList = false;
      var res = wx.getSystemInfoSync();
      this.mapHeight = res.windowHeight - 42;
      this.isshow = true;
    }
    wx.getLocation({
      type: "gcj02",
      success: res => {
        this.la = res.latitude;
        this.lo = res.longitude;
        var latitude = parseFloat(res.latitude + "");
        var longitude = parseFloat(res.longitude + "");
        http
          .get("/map/find", {
            lon1: longitude,
            lat1: latitude,
            km: parseInt(50)
          })
          .then(res => {
            this.markersData = res.data.data.data;
            this.markers = [];
            let icon = "";
            for (let i = 0; i < this.markersData.length; i++) {
              if (this.markersData[i].deviceStatus == 1) {
                icon = "/static/images/greenSpot.png";
              } else {
                icon = "/static/images/redSpot.png";
              }
              this.markers.push({
                id: i,
                latitude: this.markersData[i].location.latitude,
                longitude: this.markersData[i].location.longitude,
                callout: {
                  content: this.markersData[i].siteName,
                  color: "black",
                  fontSize: 10,
                  borderRadius: 20,
                  bgColor: "white",
                  padding: 10,
                  display: "BYCLICK",
                  textAlign: "center"
                }
              });
            }
          });
      },
      fail: () => {
        this.isshowTab = false;
      }
    });
    global.commit("setPageName", "/pages/nearbySite/main");
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userLocation"] == false) {
          this.isshowTab = false;
          wx.showModal({
            title: "用户未授权",
            content:
              "如需正常使用地图功能，请按确定并在授权管理中选中“地理位置”，然后点按确定。刷新页面或者重新启动小程序即可正常使用。",
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: function(data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: "授权成功",
                        icon: "success",
                        duration: 5000
                      });
                    }
                  }
                });
              } else if (res.cancel) {
              }
            }
          });
        } else {
          this.isshowTab = true;
          this.issshow = false;
        }
      }
    });
  }
};
</script>

<style scoped>
.i-card-footer-item {
  position: absolute;
  left: 130rpx;
  top: 13rpx;
  color: #80848f;
  font-size: 24rpx;
}
.i-card-footer-item2 {
  position: absolute;
  left: 230rpx;
  top: 13rpx;
  color: red;
  font-size: 24rpx;
}
.i-card-footer-item3 {
  position: absolute;
  left: 330rpx;
  top: 13rpx;
  color: orange;
  font-size: 24rpx;
}
.icon-go {
  position: absolute;
  right: 138rpx;
  bottom: 36rpx;
  font-size: 24rpx;
}
.listDiv {
  margin-top: 20rpx;
  position: relative;
}
.goSite {
  height: 40px;
  width: 60px;
  line-height: 40px;
  position: absolute;
  right: 18rpx;
  bottom: 18rpx;
  z-index: 10;
}
.tabWidth {
  width: 200px !important;
}
.map {
  width: 100%;
}
</style>
