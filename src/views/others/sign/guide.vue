<template>
  <div class="white">
    <!--<c-title :hide="false" :text="show == 'identify'?'认证引导':'购买引导'">-->
    <!--</c-title>-->
    <!--<div style="height: 40px"></div>-->
    <div style="padding: 10px;" v-html="content"></div>
    <div style="height: 3.5rem;"></div>
    <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <p class="sure" v-if="show == 'identify'" @click="toSign">立即认证</p>
      <p class="sure" v-if="show == 'good'" @click="toBuy">立即购买</p>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      show: "",
      content: "",
      Buy: {},
      Sign: {}
    };
  },
  activated() {
    this.show = this.$route.params.show;
    if (this.show == "good") {
      this.fun.setWXTitle("电子合同");
      this.getBuyData();
    } else {
      this.fun.setWXTitle("认证引导");
      this.getSignData();
    }
  },
  methods: {
    toBuy() {
      // if (this.Buy.has_buy == 1) {
      //   this.$router.push(this.fun.getUrl("signIndex"));
      // } else {
      this.$router.push(this.fun.getUrl("goods", { id: this.Buy.activity_goods_id }));
      // }
    },
    toSign() {
      if (this.Sign.person_status == 1) {
        this.$router.push(this.fun.getUrl("signCompany"));
      } else {
        this.$router.push(this.fun.getUrl("personBank"));
      }
    },
    getBuyData() {
      $http
        .get("plugin.yun-sign.frontend.h5.activity.get-info", {}, "...").then(response => {
          if (response.result === 1) {
            this.Buy = response.data;
            this.content = this.Buy.desc;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
        );
    },
    getSignData() {
      $http
        .get("plugin.yun-sign.frontend.h5.auth.get-desc", {}, "...").then(response => {
          if (response.result === 1) {
            this.Sign = response.data;
            this.content = this.Sign.desc;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
        );
    },
    //初始化分享设置
    initShare() {
      let json = {
        url:
            this.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            this.share(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.showVideo.title)
          ? "向导"
          : that.showVideo.title;
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.showVideo.cover)
          ? data.share.icon
          : that.showVideo.cover;
        let _desc = that.fun.isTextEmpty(that.showVideo.title)
          ? data.share.desc
          : ``;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .white {
    background: white;
    height: 100vh;
  }

  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;

    .sure {
      font-size: 18px;
      line-height: 2.25rem;
      width: 80%;
      margin: 10px auto;
      height: 2.25rem;
      background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
      border-radius: 20px;
      color: #fff;
    }
  }

  .pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
