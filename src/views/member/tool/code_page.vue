<template>
  <div>
    <c-title :hide="false" :text="title">
    </c-title>


    <div class="topBox" v-if="info.avatar_image">
      <img :src="info.avatar_image"
           alt="">
      <span>{{info.username}}</span>
    </div>
    <div class="ewmBox" v-show="success">
      <canvas id="qrccode-canvas"></canvas>
    </div>
    <div>
      <p style="font-size: 16px; font-weight: bold; margin-bottom: 1rem;" v-show="title==='会员卡号'">{{info.uid}}</p>
      <p style="font-size: 16px; font-weight: bold;">向收银员出示{{title}}</p>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import cTitle from "components/title";
import { Toast } from 'vant';

var canvas = "";
export default {
  data() {
    return {
      info: {},
      title: "",
      success: false,
      timer: null
    };
  },
  mounted() {
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
    });
  },
  activated() {
    this.info = {};
    this.title = "";
    this.success = false;
    if(this.$route.name === "codePage"){
      this.title = "支付码";
      this.getPayCode();
    }else{
      this.title = "会员卡号";
      this.getMemberCode();
    }
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    freshCode () {
      this.timer = setInterval(()=>{
        this.getPayCode();
      },60000);
    },
    getMemberCode() {
      $http.get("member.member-qr-code.member-code", {}, "loading").then(
        (response) => {
          if (response.result === 1) {
            this.info = response.data;
            this.$nextTick(function() {
              this.createQrc(this.info.uid.toString());
            });
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          Toast(response.msg);
        }
      );
    },
    getPayCode() {
      $http.get("member.member-qr-code.pay-code", {}, "loading").then(
        (response) => {
          if (response.result === 1) {
            this.info = response.data;
            if (!this.timer) {
              this.freshCode();
            }
            this.$nextTick(function() {
              this.createQrc(this.info.code);
            });
          } else {
            if (this.timer) {
              clearInterval(this.timer);
            }
            Toast(response.msg);
          }
        },
        function(response) {
          if (this.timer) {
            clearInterval(this.timer);
          }
          Toast(response.msg);
        }
      );
    },
    createQrc(_url) {
      const that = this;
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
          that.success = true;
        }
      });
    }
  },
  // watch: {
  //   $route(to, from) {
  //     this.$nextTick(function() {
  //       this.createQrc();
  //     });
  //   }
  // },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .topBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 17.25rem;
    margin: 1rem auto;

    img {
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 100%;
      margin: 0 0.5rem 0 0;
    }

    span {
      display: inline-block;
      color: #515a63;
      font-size: 18px;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
      text-align: left;
    }
  }

  .ewmBox {
    width: 17.25rem;
    // height: 11.25rem;
    border: 1px solid #e4e4e4;
    border-radius: 5%;
    background: #fff;
    overflow: hidden;
    margin: 2rem auto;

    p {
      color: #666;
      margin: 0.3rem auto 0;
    }

    #qrccode-canvas {
      width: 16.875rem !important;
      height: 16.875rem !important;
    }
  }
</style>
