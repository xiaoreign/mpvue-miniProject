<template>
<div></div>
  

</template>

<script>
import global from "../../utils/global";
import card from "@/components/card";
export default {
  data() {
    return {
      isshow: ""
    };
  },

  components: {
    card
  },

  methods: {},

  onShow: function() {
    let url = global.state.pageName;
    if(url == '/pages/charge/main' || url == '/pages/ICrecord/main'){
      wx.switchTab({ url: '/pages/index/main' });
    }
    global.commit("scan", url);
    global.commit("setPageName", "/pages/scan/main");
  }
};
</script>

<style scoped>
</style>
