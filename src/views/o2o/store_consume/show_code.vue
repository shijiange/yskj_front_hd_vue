<template>
  <div>
    <c-title :hide="false" :text="'门店消费卡核销码'">
    </c-title>
    <div class="main">
      <p style="margin-bottom: 1rem;">请店长或核销员扫码核销</p>
      <canvas id="qrccode-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import QRCode from "qrcode";

var canvas = "";

export default {
  data() {
    return {
      id:'',
      card_id:''
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.card_id = this.$route.params.card_id;
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
      this.createQrc();
    });
  },
  methods: {
    createQrc() {
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/o2o/store_consume_use/" + this.id + "/" + this.card_id +  "?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid();
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
          this.show = true;
          console.log( _url);
        }
      });
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.main {
  margin-top: 3.125rem;
  font-size: 16px;
  color: #333;
}

.code {
  margin-top: 1rem;
  width: 10.9375rem;
  height: 10.9375rem;
}
</style>
