<!-- 公众号二维码 -->
<template>
  <div id="U_wechatcode">
    <div class="ewm-bg" v-if="isShow">
      <div class="img-box">
        <img :src="QR_url" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      QR_url: null
    };
  },

  activated() {},

  components: {},

  computed: {},
  created() {
    this.isShow = this.$route.query.mkt_qr ? true : false;
    this.getMarketingQr();
  },
  mounted() {},

  methods: {
    getMarketingQr() {
      if (!this.$route.query.mkt_qr) {
        return;
      }
      $http
        .get("plugin.marketing-qr.frontend.qrcode.index", {
          mkt_qr: this.$route.query.mkt_qr
        })
        .then(
          response => {
            if (response.result === 1) {
              this.QR_url = response.data.qrcode;
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.ewm-bg {
  width: 100%;
  display: block;
  background-color: #fff;
  padding: 1rem 0;

  .img-box {
    margin: 0 auto;
    background:
      linear-gradient(#999, #999) left top,
      linear-gradient(#999, #999) left top,
      linear-gradient(#999, #999) right top,
      linear-gradient(#999, #999) right top,
      linear-gradient(#999, #999) right bottom,
      linear-gradient(#999, #999) right bottom,
      linear-gradient(#999, #999) left bottom,
      linear-gradient(#999, #999) left bottom;
    background-repeat: no-repeat;
    background-size: 2px 20px, 20px 2px;
    width: 10.563rem;
    height: 10.563rem;
    padding: 0.5rem;

    img {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }
}
</style>
