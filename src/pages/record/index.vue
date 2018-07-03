<template>
  <div class="outsideDiv">
    <div class="bttn">
      <i-button type="ghost" @click="handle" shape="circle" >IC卡充值</i-button>
    </div>
    <div class='weui-loadmore weui-loadmore_line' v-if="data.length == 0">
      <div class='weui-loadmore__tips'>暂无数据</div>
    </div>
    <i-action-sheet :visible="visible" :actions="actions" @cancel="handleCancel" @iclick="handleClick" />
    <scroll-view scroll-y v-if="data.length > 0" class="chargerList" @scrolltolower="lower">
    <i-card :title="'充值类型：' + i.tradeType" full v-for="i in data" :key="i.orderNumber">
      <view slot="content">
        <div class="czdiv">
          <span class="cztitle">支付金额</span>
          <span class="cztcontent">{{i.showTradeAmount}} 元</span>
        </div>
        <div class="czdiv">
          <span class="cztitle">账户余额</span>
          <span class="cztcontent">{{i.showAccountBalance}} 元</span>
        </div>
        <div class="czdiv">
          <span class="cztitle">支付时间</span>
          <span class="cztcontent">{{i.createdAt}}</span>
        </div>
      </view>
    </i-card>
    <div class='weui-loadnomore' v-if="req.page >= totalPage">
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

export default {
  data() {
    return {
      data: [],
      visible: false,
      position: "",
      totalPage: 0,
      spinShow: false,
      actions: [
        {
          name: "IC卡充值"
        },
        {
          name: "账户充值"
        }
      ],
      req: {
        tradeType: "ICPAY",
        day: 30,
        limit: 5,
        page: 1
      },
      isHideLoadMore: true
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
      this.getPayList();
      this.visible = false;
    },
    getPayList() {
      http.get("/tradelog/user/find", this.req).then(res => {
        if (res.data.status == "success") {
          this.data = res.data.data.data;
          this.totalPage = res.data.data.pageInfo.totalPage;
          this.formatData( this.data);
        }
      });
    },
    formatData(data) {
      for (let i of data) {
        let time = i.createdAt;
        if (i.tradeType == "ACCOUNTPAY") {
          i.tradeType = "账户充值";
        } else if (data.tradeType == "ICPAY") {
          i.tradeType = "IC卡充值";
        }
        time = time.substring(0, time.length - 5)
        i.createdAt = dayjs(time).format("YYYY/MM/DD HH:mm");
      }
    }
  },
  onLoad() {
    this.req.page = 1;
    this.getPayList();
  },
  onReachBottom() {
    if (this.req.page < this.totalPage) {
      this.isHideLoadMore = false;
      http.get("/tradelog/user/find", this.req).then(res => {
        if (res.data.status == "success") {
          setTimeout(() => {
            this.req.page = this.req.page + 1;
            this.isHideLoadMore = true;
            this.formatData(res.data.data.data)
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
}

.bttn {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
}
</style>
