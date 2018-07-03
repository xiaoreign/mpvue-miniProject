<template>
 <div class='fa'>
  <div>
    <input type='number' placeholder='请输入手机号' />
    <input type='number' placeholder='请输入订单号' />
  </div>
  <textarea placeholder='请输入备注信息' maxlength='200'></textarea>
  <button @click='Btn_submit()'>提交</button>
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
    created() {},
    Btn_submit(){
      console.log("提交申请")
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
  }
};
</script>

<style scoped>
input {
  font-size: 16px;
  border: 1px solid #eee;
  padding: 10px;
  margin-top: 10px;
}

.fa {
  padding: 10px 20px;
  margin-top: 10px;
}

textarea {
  margin-top: 10px;
  border: 1px solid #eee;
  FONT-SIZE: 16px;
  padding: 10px;
}

button {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  color: white;
  background-color: #09bb07;
  margin-top: 20px;
}

</style>
