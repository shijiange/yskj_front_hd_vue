<!-- 用于非移动端时右上角的二维码提示 -->
<template>
  <div id="qrCode">
    <div class="topBox">
      <img :src="$store.state.temp.mailInfo ? $store.state.temp.mailInfo.logo : ''" alt="" />
      <span>{{ $store.state.temp.mailInfo ? $store.state.temp.mailInfo.name : '' }}</span>
    </div>
    <div class="ewmBox">
      <p>手机微信“扫一扫”</p>
      <canvas id="qrccode-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
var canvas = '';
export default {
  data() {
    return {
      info: {}
    };
  },
  mounted() {
    // this.init()
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById('qrccode-canvas');
      //   this.createQrc();
    });
  },
  methods: {
    init() {
      this.info = this.$store.state.temp.mailInfo;
    },
    createQrc() {
      let _url = document.location.href;
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.$nextTick(function() {
        this.createQrc();
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#qrCode {
  position: fixed;
  width: 11.25rem;
  left: 50%;
  margin-left: 220px;
  top: 20%;

  .topBox {
    display: flex;
    align-items: center;

    img {
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 100%;
      margin-left: 0.5rem;
    }

    span {
      color: #515a63;
      font-size: 18px;
      flex: 1;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
      padding-left: 0.8rem;
      text-align: left;
    }
  }

  .ewmBox {
    width: 11.25rem;
    // height: 11.25rem;
    border: 1px solid #e4e4e4;
    border-radius: 5%;
    background: #fff;
    overflow: hidden;
    margin-top: 0.8rem;

    p {
      color: #666;
      margin: 0.3rem auto 0;
    }

    #qrccode-canvas {
      width: 9.875rem !important;
      height: 9.875rem !important;
    }
  }
}
</style>
