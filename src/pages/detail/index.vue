<template>
  <div class="outsideDiv">
    <div class="bttn">
      <i-button type="ghost" @click="handle" shape="circle" >近一个月</i-button>
    </div>
    <div class='weui-loadmore weui-loadmore_line' v-if="data.length == 0">
      <div class='weui-loadmore__tips'>暂无数据</div>
    </div>
    <i-action-sheet :visible="visible" :actions="actions" @cancel="handleCancel" @iclick="handleClick" />
    <scroll-view scroll-y="true" v-if="data.length > 0" class="chargerList" >
    <i-card :title="'站点位置：' + i.road + i.siteName" full v-for="i in data" :key="i.orderNumber">
      <view slot="content">
        <div class="czdiv">
          <span class="cztitle">开始时间</span>
          <span class="cztcontent">{{i.startTime}}</span>
        </div>
        <div class="czdiv">
          <span class="cztitle">充电位置</span>
          <span class="cztcontent">编号:{{i.deviceNumber}}:{{i.sockeNumber}}插座</span>
        </div>
        <div class="czdiv">
          <span class="cztitle">耗时</span>
          <span class="cztcontent">{{i.consumeTime}}分钟</span>
        </div>
        <div class="czdiv">
          <span class="cztitle">消费金额</span>
          <span class="cztcontent">{{i.consumption}}元</span>
        </div>
      </view>
    </i-card>
     <div class='weui-loadnomore' v-if="req.page == totalPage">
      <div class='weui-loadmore__tips' style="opacity: 0.5">暂无更多数据</div>
    </div>
    <view class="weui-loadmore" :hidden="isHideLoadMore">
      <view class="weui-loading"></view>
      <view class="weui-loadmore__tips" style="opacity: 0.5">正在加载</view>
    </view>
    </scroll-view>
  </div>

</template>

<script>
import http from "../../utils/request";
import dayjs from "dayjs";
var touchDot = 0; //触摸时的原点
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = ""; // 记录/清理时间记录
export default {
  data() {
    return {
      data: [],
      visible: false,
      position: "",
      totalPage: 0,
      spinShow: false,
      isHideLoadMore: true,
      actions: [
        {
          name: "近1个月"
        },
        {
          name: "近3个月"
        },
        {
          name: "近6个月"
        }
      ],
      req: {
        tradeType: "CHARGE",
        day: 30,
        limit: 4,
        page: 1
      }
    };
  },

  methods: {
    handle() {
      this.visible = true;
    },
    handleClick() {},
    handleCancel() {
      this.visible = false;
    },
    handleClick(e) {
      let type = "";
      if (e.mp.detail.index == 0) {
        this.req.day = 30;
      } else if (e.mp.detail.index == 1) {
        this.req.day = 60;
      } else if (e.mp.detail.index == 2) {
        this.req.day = 180;
      }
      this.getChargerList();
      this.visible = false;
    },
    getChargerList() {
      http.get("/charginglogs/user", this.req).then(res => {
        if (res.data.status == "success") {
          // this.data = res.data.data;
          this.data = res.data.data.chargeInfo;
          this.totalPage = res.data.data.pageInfo.totalPage;
          this.formatData(this.data);
        }
      });
    },
    formatData(data) {
      for (let i of data) {
        let time = i.startTime;
        time = time.substring(0, time.length - 5)
        i.startTime = dayjs(time).format("YYYY/MM/DD HH:mm");
      }
    }
  },
  onLoad() {
    this.req.page = 1;
    this.getChargerList();
  },
  onReachBottom() {
    if (this.req.page < this.totalPage) {
      this.isHideLoadMore = false;
      http.get("/charginglogs/user", this.req).then(res => {
        if (res.data.status == "success") {
          setTimeout(() => {
            this.req.page = this.req.page + 1;
            this.isHideLoadMore = true;
            this.formatData(res.data.data.data);
            this.data.push(...res.data.data.data);
          }, 600);
        }
      });
    }
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
.chargerList {
  position: relative;
  top: 130rpx;
  width: 100%;
  height: 80%;
  overflow-y: auto;
  padding-bottom: 40rpx;
}

.bttn {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
}
</style>
