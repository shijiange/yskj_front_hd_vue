<template>
  <div id="helpcenter">
    <c-title :hide="false" text="帮助中心"></c-title>
    <div class="list">
      <ul>
        <li @click="show(key)" v-for="(val, key) in title" :key="key">
          <span>{{ val }}</span>
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <div class="message" v-if="showbox" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '100%' }">
        <header><span class="icon" @click="hide"></span>帮助详情</header>
        <div class="msgbox" v-html="msg"></div>
      </div>
    </transition>
    <a @click="show1 = true">
      <div class="sver">
        <ul>
          <li><i class="iconfont icon-kefu"></i></li>
          <li>人工客服</li>
        </ul>
        <i class="fa fa-angle-right"></i>
      </div>
    </a>
    <van-popup v-model="show1" position="center" style="width: 80%;">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cservice">
                <div class="image"><img src="../../assets/images/kf_online_contect@2x.png"/></div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div
            style="display: flex; align-items: center;"
            v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)"
          >
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`"><img src="../../assets/images/kf_tel_contect@2x.png"/></a>
              </div>

              <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;"/>
          </div>
        </div>
        <i class="iconfont icon-close11" @click="show1 = false"></i>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "../../components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      dataget: [],
      title: [],
      msgarr: [],
      msg: "",
      sharedata: "",
      cservice: "",
      showbox: false,
      show1: false,
      service_QRcode: "",
      service_mobile: ""
    };
  },
  methods: {
    init() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.show1 = false;
      this.cservice = "";
    },
    show(key) {
      this.msg = this.msgarr[key];
      this.showbox = true;
    },
    //初始化分享设置
    getData() {
      let that = this;
      $http.get("plugin.help-center.api.share.index").then((response)=> {
        if (response.result == 1) {
          that.sharedata = response.data.data;
          // that.initShare();
          that.fun.wxShare(
            "",
            {},
            {
              title: that.sharedata.title,
              imgUrl: that.sharedata.icon,
              description: that.sharedata.description
            },
            data => {
              // if (!that.fun.isTextEmpty(data.shop && data.shop.shop)) {
              //   that.initCservice(data.shop.shop.cservice); //客服重新赋值
              // }
            }
          );
          // that.initCservice("");
        }
      });
    },
    initShare() {
      let that = this;
      console.log(document.location.href);
      let _url = document.location.href;
      $http.post("member.member.wxJsSdkConfig", { url: _url }).then(
        function(response) {
          if (response.result == 1) {
          //  that.initCservice(response.data.shop.cservice);
            that.share(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.sharedata.title ? that.sharedata.title : data.shop.name;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = that.sharedata.icon ? that.sharedata.icon : data.shop.logo;
        let _desc = that.sharedata.description ? that.sharedata.description : data.shop.copyright;
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

        // if(that.fun.getWechatVersion()){
        // 	wx.updateTimelineShareData({
        // 		title: _title, // 分享标题
        // 		link: _link, // 分享链接
        // 		imgUrl: _imgUrl, // 分享图标
        // 		success: function () {
        // 			//Toast("分享成功");
        // 		},
        // 		//   cancel: function () {
        // 		//     Toast("取消分享");
        // 		//   }
        // 	});
        // 	wx.updateAppMessageShareData({
        // 		title: _title, // 分享标题
        // 		desc: _desc, // 分享描述
        // 		link: _link, // 分享链接
        // 		imgUrl: _imgUrl, // 分享图标
        // 		//type: 'link', // 分享类型,music、video或link，不填默认为link
        // 		//dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        // 		success: function () {
        // 			//Toast("分享成功");
        // 		},
        // 		//   cancel: function () {
        // 		//     Toast("取消分享");
        // 		//   }
        // 	});
        // }else{
        // 	wx.onMenuShareTimeline({
        // 		title: _title, // 分享标题
        // 		link: _link, // 分享链接
        // 		imgUrl: _imgUrl, // 分享图标
        // 		success: function () {
        // 			Toast("分享成功");
        // 		},
        // 		cancel: function () {
        // 			Toast("取消分享");
        // 		}
        // 	});
        // 	wx.onMenuShareAppMessage({
        // 		title: _title, // 分享标题
        // 		desc: _desc, // 分享描述
        // 		link: _link, // 分享链接
        // 		imgUrl: _imgUrl, // 分享图标
        // 		type: 'link', // 分享类型,music、video或link，不填默认为link
        // 		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        // 		success: function () {
        // 			Toast("分享成功");
        // 		},
        // 		cancel: function () {
        // 			Toast("取消分享");
        // 		}
        // 	});
        // }
      });
    },
    //配置客服
    initCservice(newCservice) {

      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        return;
      }
      console.log("执行", this.$store.state.temp.mailInfo);
      if (!this.fun.isTextEmpty(this.$store.state.temp.mailInfo)) {

        if (this.$store.state.temp.mailInfo.hasOwnProperty("service_QRcode")) {
          this.service_QRcode = this.$store.state.temp.mailInfo.service_QRcode;
        }
        if (this.$store.state.temp.mailInfo.hasOwnProperty("service_mobile")) {
          this.service_mobile = this.$store.state.temp.mailInfo.service_mobile;
        }
        if (!this.fun.isTextEmpty(this.$store.state.temp.mailInfo.cservice)) {
          this.cservice = this.$store.state.temp.mailInfo.cservice;
        }
      }
    },
    hide() {
      this.showbox = false;
    }
  },
  activated() {
    this.init();
    if ((this.$route.params.key === 0 || this.$route.params.key) && this.title.length > 0) {
      this.show(this.$route.params.key);
    }
  },
  created() {
    $http.get("plugin.help-center.api.content.info").then(res => {
      this.dataget = res.data.set_data;
      this.dataget.map(response => {
        this.title.push(response.title);
        this.msgarr.push(response.content);
        this.msg = this.msgarr[0];
      });
      let customer_service = res.data.customer_service;
      this.service_QRcode = customer_service.service_QRcode;
      this.service_mobile = customer_service.service_mobile;
      this.cservice = customer_service.cservice;
      if (this.$route.params.key === 0 || this.$route.params.key) {
        this.show(this.$route.params.key);
      }
    });
    this.getData();
    //this.initCservice("");
  },
  components: { cTitle }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  #helpcenter {
    table td {
      border-style: solid !important;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.3s;
    }

    .fade-enter,
    .fade-leave-to {
      transform: translateX(100%);
    }

    .list {
      margin-top: 0.625rem;

      ul {
        background-color: #fff;

        li {
          display: flex;
          justify-content: space-between;
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;
          font-size: 15px;
          border-bottom: solid 0.0625rem #ebebeb;

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      i {
        font-size: 1.5rem;
        color: #c9c9c9;
        line-height: 2.5rem;
      }
    }

    .sver {
      margin-top: 0.625rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.875rem;
      font-size: 15px;

      ul {
        display: flex;
      }

      i:first-child {
        font-size: 1.25rem;
        margin-right: 0.625rem;
        color: #666;
      }

      i {
        font-size: 1.5rem;
        color: #c9c9c9;
        line-height: 2.5rem;
      }
    }

    .message {
      width: 100%;
      position: absolute;
      background: #fff;
      top: 0;
      min-height: 100%;
      overflow: hidden;
      z-index: 999;

      .msgbox {
        line-height: 1.25rem;
        box-sizing: border-box;
        padding-top: 0.625rem;
      }

      header {
        height: 2.5rem;
        width: 100%;
        line-height: 2.5rem;
        font-size: 14px;
        font-weight: bolder;
        position: relative;
        border-bottom: solid 0.0625rem #ebebeb;

        .icon {
          position: absolute;
          display: block;
          float: left;
          width: 0.65rem;
          height: 0.65rem;
          border: solid 0.1rem rgba(0, 0, 0, 0.5);
          transform: rotate(45deg);
          border-right: transparent;
          border-top: transparent;
          margin: 0.9375rem;
        }
      }
    }

    .pop-content {
      width: 100%;
      padding: 3.1875rem 0;
      text-align: center;
      border-radius: 1.1875rem;
      background: #fff;

      .pop-top {
        display: flex;
        align-items: unset;
        justify-content: center;

        .left {
          width: 50%;
          display: flex;
          justify-content: center;

          .wrap {
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
              width: 2.625rem;
              height: 2.625rem;
              margin-bottom: 0.5rem;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .line {
          width: 1px;
          height: 1.625rem;
          background-color: #999;
        }

        .right {
          width: 50%;
          display: flex;
          justify-content: center;

          .wrap {
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
              width: 2.625rem;
              height: 2.625rem;
              margin-bottom: 0.5rem;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }

      .pop-bottom {
        margin-top: 1rem;
        width: 100%;
        display: flex;
        justify-content: center;

        .image {
          width: 50%;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .icon-close11 {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 18px;
      }
    }
  }
</style>
