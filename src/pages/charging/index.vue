<template>
<div>
    <div class='weui-loadmore weui-loadmore_line' v-if="data.length == 0">
      <div class='weui-loadmore__tips'>暂无充电记录</div>
    </div>
    <scroll-view scroll-y="true" v-if="data.length > 0" class="chargerList" >
      <i-card :title="'站点位置：' + i.road + i.estate" full v-for="i in data" :key="i">
        <view slot="content">
          <div class="czdiv">
            <span class="cztitle">充电状态</span>
            <span class="cztcontent">{{i.status == 2?'正在充电':'准备充电'}}</span>
          </div>
          <div class="czdiv">
            <span class="cztitle">充电位置</span>
            <span class="cztcontent">编号:{{i.deviceNumber}}:{{i.sockeNumber}}插座</span>
          </div>
          <div class="czdiv">
            <span class="cztitle">开始时间</span>
            <span class="cztcontent">{{i.startTime}}</span>
          </div>
          <div class="czdiv">
            <span class="cztitle">耗时</span>
            <span class="cztcontent">{{i.consumeTime}}</span>
          </div>
          <div class="czdiv">
            <span class="cztitle">消费金额</span>
            <span class="cztcontent">{{i.consumption/100}}元</span>
          </div>
        </view>
    </i-card>
    </scroll-view>
</div>
</template>

<script>
import global from "../../utils/global";
import http from "../../utils/request";
import dayjs from "dayjs";

export default {
  data() {
    return {
      data: []
    };
  },
  methods: {
    getchargeData() {
      http.get("/charge/find").then(res => {
        if (res.data.status == "success") {
          this.data = res.data.data;
          for (let i of this.data) {
            let time = i.startTime;
            time = time.substring(0, time.length - 5)
            i.startTime = dayjs(time).format("YYYY/MM/DD HH:mm:ss");
          }
        }
      });
    }
  },

  onLoad() {
    this.getchargeData();
  },
  onPullDownRefresh: function() {
    setTimeout(() => {
      this.getchargeData();
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 500);
  }
};
</script>

<style scoped>
.czdiv {
  overflow: hidden;
  margin-top: 5px;
}
.cztitle {
  opacity: 0.5;
  text-align: left;
}
.cztcontent {
  overflow: hidden;
  float: right;
  text-align: right;
}
</style>
