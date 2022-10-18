<template>
  <div>
    <c-title :hide="false" :text="Detail.share_title">
    </c-title>
    <!--<iframe :src="url" style="width: 100vw;height: 100vh;border: none;"></iframe>-->
    <div v-html="url" style="text-align: left;"></div>
    <div class="fixed-box" @click="showConcat = true"><i class="iconfont icon-all_service"></i><span class="text">联系客服</span></div>
    <div class="fixed-box2" @click="goUrl">
      <img class="logo-box" :src="Detail.logo"  alt="">
      <p class="text">查看详情</p>
    </div>

    <van-popup v-model="showConcat" round closeable>
      <div class="concat-box">
        <p class="title">联系方式</p>
        <div class="popupClass">
          <div class="popup-item">
            <i class="iconfont icon-promote_contactpreson"></i> <p>{{Detail.name}}</p>
          </div>
          <a class="popup-item" :href="'tel:'+ Detail.phone">
            <i class="iconfont icon-promote_callnum"></i> <p>{{Detail.phone}}</p>
          </a>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      Detail: {},
      id: '',
      url: '',
      phone: '',
      showConcat: false,
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.setMeta();
    this.getData();
  },
  methods: {
    setMeta() {
      let head = document.getElementsByTagName('head');
      let description = document.createElement('meta');
      description.name = 'referrer';
      description.content = 'no-referrer';
      head[0].appendChild(description);
    },
    goUrl() {
      if(this.Detail.type == 1) {
        this.$router.push(this.fun.getUrl("home"));
      }else if(this.Detail.type == 2) {
        this.$router.push(this.fun.getUrl("category"));
      }else {
        this.$router.push(this.fun.getUrl("goods",{id: this.Detail.goods_id}));
      }
    },
    getData() {
      $http.post('plugin.promotion-assistant.api.assistant.get-details', {id: this.id}, ' ').then(
        response => {
          if (response.result === 1) {
            this.Detail = response.data;
            if(this.Detail.html) {
              let html = this.Detail.html;
              html = html.replace(/data-src/g, "src").replace(/href=/g, "hre=")
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/visibility: hidden/g, "visibility: visible");
              this.url = html;
            }else {
              Toast('填写链接有误');
            }
            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: this.Detail.share_title,
                imgUrl: this.Detail.share_img,
                description: this.Detail.share_desc
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //分享
    initShare() {
      let json = {
        url:
            this.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => {});
    },
    share(data) {
      let that = this;

      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.Detail.share_title)
          ? data.share.title
          : that.Detail.share_title;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, that.Detail.member_id);

        let _imgUrl = that.fun.isTextEmpty(that.Detail.share_img)
          ? data.share.icon
          : that.Detail.share_img;
        let _desc = that.fun.isTextEmpty(that.Detail.share_desc)
          ? data.share.desc
          : that.Detail.share_desc;

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
    },
    // getURL(url = 'https://mp.weixin.qq.com/s/SRsbuzurtVRds4Wf3HYIuw') {
    //   let showSrc = 'https://cors-anywhere.herokuapp.com/'+ url;
    //   $http.fetch( showSrc ).then((response)=>{
    //     let html = response.data;
    //     html = html.replace(/data-src/g, "src").replace(/href=/g, "hre=")
    //       .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/visibility: hidden/g, "visibility: visible");
    //     let html_src = html;
    //     this.url = html_src
    //   },(err)=>{console.log(err);});
    // }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fixed-box {
    display: flex;
    vertical-align: center;
    padding-left: 0.2rem;
    color: white;
    position: fixed;
    right: 0;
    top: 37%;
    background-color: #ff6333;
    border-radius: 10px 0 0 10px;

    .text {
      display: inline-block;
      line-height: 1.5rem;
      margin-left: 0.2rem;
    }
  }

  .fixed-box2 {
    color: white;
    position: fixed;
    right: 0;
    top: 44%;
    width: 5rem;

    .logo-box {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      object-fit: cover;
    }

    .text {
      margin-top: -15px;
      position: fixed;
      z-index: 10;
      width: 5rem;
      background-color: #ff6333;
      border-radius: 10px;
    }
  }

  .concat-box {
    width: 17rem;
    padding: 1rem;

    .title {
      font-size: 16px;
      line-height: 1.5rem;
      font-weight: bold;
    }

    .popupClass {
      text-align: left;
      margin-top: 1rem;
    }

    .popup-item {
      display: flex;
      background-color: #f7f9fc;
      border-radius: 5px;
      padding: 0.5rem 1rem;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 1rem;

      p {
        align-self: center;
        margin-left: 0.5rem;
      }
    }

    .icon-promote_contactpreson {
      color: #06e5ae;
      font-size: 34px;
    }

    .icon-promote_callnum {
      color: #1890ff;
      font-size: 34px;
    }
  }
</style>
