<template>
 <div class='weui-loadmore weui-loadmore_line'>
   <div class='weui-loadmore__tips'>暂无数据</div>
  </div>
</template>

<script>
import card from "@/components/card";
export default {
  data() {
    return {};
  },

  components: {
    card
  },

  methods: {
    created() {}
  },

  created() {
    // 调用应用实例的方法获取全局数据
  }
};
</script>

<style scoped>

</style>
