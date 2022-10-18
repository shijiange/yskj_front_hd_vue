<template>
  <div class="page">
    <c-title title="消息通知"></c-title>

    <div class="wrapper">
      <div class="item">
        <span class="text">消息免打扰</span>
        <van-switch @change="change" v-model="checked" active-color="#f42a2a" size="20px"/>
      </div>
    </div>
  </div>
</template>

<script>

import { Toast } from "vant";

export default {
  data() {
    return {
      checked: false
    };
  },
  activated() {
    this.getSetting();
  },
  methods: {
    change(e) {
      console.log(e, this.checked);
      this.setSetting();
    },
    async setSetting() {
      let res = await $http.get("plugin.instation-message.api.message.set-member-set", {
        disturb: this.checked ? 1 : 0
      });
      Toast(res.msg);
    },
    async getSetting() {

      let res = await $http.get("plugin.instation-message.api.message.get-member-set");
      if (res.result != 1) return this.tips(reg.msg);
      if (res.data["disturb"] && res.data["disturb"] == 1) {
        this.checked = true;
      }

    }
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: rgb(250, 250, 250);
    min-height: 100vh;
    padding-bottom: 3.0625rem;
    text-align: left;
  }

  .wrapper {
    .item {
      height: 3rem;
      padding: 0 0.625rem;
      display: flex;
      align-items: center;
      background: #fff;
      justify-content: space-between;

      .text {
        font-size: 1rem;
        letter-spacing: 0.019rem;
        color: #333;
      }
    }
  }

</style>