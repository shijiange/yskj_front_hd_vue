<template>
  <div id="share">
    <div class="content" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <div class="ImgBg" :style="{'background-image':'url('+bg_image+')'}">
        <div class="top"></div>
        <div class="poster">
          <img v-if="share_poster.app_share_show == 1 && is_loaded == true" :src="share_poster.PosterUrl" style="width: 100%; height: 100%; border-radius: 0.5rem;" />
          <img v-if="share_poster.app_share_show == 0 && is_loaded == true" src="../../assets/images/share_pic_normal@2x.png" alt="" style="width: 100%; height: 100%; border-radius: 0.5rem;" />
        </div>
        <div class="button">
          <van-button type="default" round size="small" @click.native="save()" v-if="share_poster.app_share_show == 1">
            <img src="../../assets/images/share_pic@2x.png" class="icon" />
            保存图片
          </van-button>
          <van-button type="default" round size="small" @click.native="share_btn('1')">
            <img src="../../assets/images/share_link@2x.png" class="icon" />
            分享链接
          </van-button>
          <van-button type="default" round size="small" @click.native="share_btn('2')" v-if="share_poster.app_share_show == 1">
            <img src="../../assets/images/share_posters@2x.png" class="icon" />
            分享海报
          </van-button>
          <!--<van-button type="default" round size="small" @click.native="siteBack" v-if="share_poster.app_share_show != 1">-->
          <!--返回-->
          <!--</van-button>-->
        </div>
        <!-- 分享说明 -->
        <div class="content-text" v-if="share_poster.app_share_show == 1">
          <div class="title">
            <div class="line">&nbsp;</div>
            <div class="text">分享说明</div>
            <div class="line">&nbsp;</div>
          </div>
          <!-- 自定义内容 -->
          <div v-html="explain" style="margin-bottom: 50px; text-align: left; padding: 0 0.75rem;"></div>
        </div>
        <div>
          <a href="#" ref="alink" download="w3c"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Toast } from "vant";
let bg_img = require("../../assets/images/share_bg@2x.png");
export default {
  data() {
    return {
      sharetitle: "",
      sharedesc: "",
      shareimg: "",
      sharelink: "",
      share_poster: {
        PosterUrl: "",
        app_share_show: 0,
        qrUrl: ""
      },
      explain: "",
      is_loaded: false,

      bg_image:''
    };
  },
  mounted() {},
  methods: {
    save() {
      // let that = this;
      this.$dialog.alert({ message: "请长按海报保存" });
      // var alink = document.createElement("a");
      // alink.href = "https://dev4.yunzmall.com/addons/yun_shop/storage/app/public/goods/9/9-398-7540.png";
      // alink.download = "";
      // alink.click();
    },
    share_btn(x) {
      this.Sharesinit(x);
    },
    //获取分享数据
    Sharesinit(x) {
      let _url = document.location.href;
      let json = {
        url: _url
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result == 1) {
            this.Shares(response.data, x);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //设置分享内容
    Shares(data, x) {
      var that = this;
      var prrtocol = document.location.protocol;
      var domain = window.location.host;
      var sharedata = data.length && data.length == 0 ? {} : data.share;

      if (sharedata) {
        that.sharetitle = that.fun.isTextEmpty(sharedata.title) ? data.shop.shop.name : data.share.title;
        that.shareimg = that.fun.isTextEmpty(sharedata.icon) ? data.shop.shop.logo : data.share.icon;
        that.sharedesc = that.fun.isTextEmpty(sharedata.desc) ? data.shop.shop.name : data.share.desc;
      } else if (!data.length && data.shop && data.shop.shop) {
        that.sharetitle = data.shop.shop.name;
        that.shareimg = data.shop.shop.logo;
        that.sharedesc = data.shop.shop.name;
      } else {
        that.sharetitle = "";
        that.shareimg = "";
        that.sharedesc = "";
      }
      //判断分享链接还是分享海报
      if (x == 1) {
        let uid = !data.length && data.info && data.info.uid ? data.info.uid : window.localStorage.uid;
        console.log(uid);
        that.sharelink = prrtocol + "//" + domain + "/addons/yun_shop/?#" + window.localStorage.getItem("share_path") + "?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + uid;
      } else {
        that.sharelink = that.share_poster.qrUrl;
      }
      console.log(that.sharelink);
      YDB.Share(that.sharetitle, that.sharedesc, that.shareimg, that.sharelink, "Sharesback");
    },
    //返回前一页面
    siteBack() {
      YDB.GoBack();
      window.history.go(-1);
      // try {
      //   if (window.history.length <= 1) {
      //     console.log('11111')
      //     this.$router.push(this.fun.getUrl("home", {}));
      //   } else {
      //     console.log('222')
      //     YDB.GoBack();
      //     window.history.back(-1);
      //     // this.$router.go(-1);
      //   }
      // } catch (error) {
      //   console.log("返回前一页面error::::", error);
      // }

      // this.$router.push(this.fun.getUrl("home", {}));
    },
    //获得APP分享海报数据
    getSharePoster() {
      var that = this;
      $http.post("plugin.app-set.frontend.app-poster.createAppPoster", {}).then(
        function(response) {
          if (response.result == 1) {
            that.share_poster.PosterUrl = response.data.PosterUrl;
            that.share_poster.app_share_show = response.data.app_share_show ? response.data.app_share_show : 0;
            that.share_poster.qrUrl = response.data.qrUrl;
            that.is_loaded = true;
            if(response.data.bg_image){
              that.bg_image = response.data.bg_image;
            }else {
              that.bg_image = bg_img;
              console.log(that.bg_image);
            }
            if (that.share_poster.app_share_show == 1) {
              that.getShareExplain();
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 获得APP分享说明
    getShareExplain() {
      var that = this;
      $http.post("plugin.app-set.frontend.app-poster.getAppShareExplain", {}).then(
        function(response) {
          if (response.result == 1) {
            that.explain = response.data.share_explain;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  activated() {
    // this.Sharesinit();
    this.getSharePoster(); // 获得分享
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#share {
  color: #fff;
  margin-bottom: 2rem;
  min-height: 100vh;

  .ImgBg {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    padding-bottom: 2rem;

    .top {
      width: 100%;
      height: 2.5rem;
    }

    .poster {
      margin: 0 auto;
      margin-bottom: 2.5rem;
      width: 273px;
      height: 456px;
      border-radius: 0.5rem;
      border: #fff 1px solid;
    }

    .button {
      width: 293px;
      margin: 0 auto;
      padding: 1rem 0;

      .icon {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }

    .content-text {
      margin-top: 1rem;

      .title {
        display: flex;
        height: 2rem;
        width: 100%;
        flex-direction: row;
        padding: 0 0.75rem;

        .line {
          flex: 1;
          height: 2px;
          position: relative;
          top: 50%;
          background: #fff;
        }

        .text {
          line-height: 1.5rem;
          flex: 1;
          font-size: 1.5rem;
          font-weight: 800;
        }
      }
    }
  }
}

// .share_btn {
//   position: fixed;
//   bottom: 8.125rem;
//   left: calc(5%)
// }
// .black_btn {
//   position: fixed;
//   bottom: 5rem;
//   left: calc(5%)
// }
</style>
