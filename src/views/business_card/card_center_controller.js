import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      show1: false,
      cardData: {},
      cardMessage: {},
      area_name: "",
      role_name: {}
    };
  },
  activated() {
    this.show1 = false;
    this.getCardDate();
    window.scrollTo(0, 0);
  },
  methods: {
    gotoBusiness() {
      this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: this.cardMessage.id, mark: "card" }));
    },
    gotoMember() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("member"));
      } else {
        this.$router.go(-1);
      }
    },
    getCardDate() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.center.card.index",
          {},
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.cardData = response.data;
              this.cardMessage = this.cardData.has_one_card;
              this.role_name = this.cardData.role_name;
              if (this.cardData.banner) {
                this.bacImage = { backgroundImage: "url(" + this.cardData.banner + ")" };
              }
              if (this.cardData.is_street === "1" && this.cardData.area_name[0]) {
                this.area_name =
                  this.cardData.area_name[0] +
                  this.cardData.area_name[1] +
                  this.cardData.area_name[2] +
                  this.cardData.area_name[3] +
                  this.cardData.has_one_card.address;
              } else if (this.cardData.area_name[0]) {
                this.area_name =
                  this.cardData.area_name[0] +
                  this.cardData.area_name[1] +
                  this.cardData.area_name[2] +
                  this.cardData.has_one_card.address;
              }

            } else {
              this.$router.push(this.fun.getUrl("home"));
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    toPage(url) {
      console.log(url);
      this.$router.push(this.fun.getUrl(url, { card_id: this.cardMessage.id }));
    },
    //初始化分享设置 -- 没看到有用到，先注释
    // initShare() {
    //   // let _url = document.location.href;
    //   let json = {
    //     url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
    //     mid: this.fun.getKeyByMid()
    //   };
    //   $http
    //     .post("member.member.wxJsSdkConfig", json)
    //     .then(
    //       response => {
    //         if (response.result === 1) {
    //           this.share(response.data);
    //         }// else {
    //         //}
    //       },
    //       function(response) {
    //         console.log(response);
    //       }
    //     )
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // //组装分享设置
    // share(data) {
    //   let that = this;
    //   wx.config(data.config);
    //   wx.ready(function() {
    //     let _title = that.fun.isTextEmpty(that.dataInfo.title)
    //       ? "文章"
    //       : that.dataInfo.title;
    //     let _link = document.location.href;
    //     _link = that.fun.isMid(_link, data.info.uid);

    //     let _imgUrl = that.fun.isTextEmpty(that.dataInfo.thumb)
    //       ? ""
    //       : that.dataInfo.thumb;
    //     let _desc = that.fun.isTextEmpty(that.dataInfo.desc)
    //       ? "简介"
    //       : that.dataInfo.desc;
    //     wx.showOptionMenu();
    //     wx.onMenuShareTimeline({
    //       title: _title, // 分享标题
    //       link: _link, // 分享链接
    //       imgUrl: _imgUrl, // 分享图标
    //       success: function() {
    //         Toast("分享成功");
    //       },
    //       cancel: function() {
    //         Toast("取消分享");
    //       }
    //     });

    //     wx.onMenuShareAppMessage({
    //       title: _title, // 分享标题
    //       desc: _desc, // 分享描述
    //       link: _link, // 分享链接
    //       imgUrl: _imgUrl, // 分享图标
    //       type: "link", // 分享类型,music、video或link，不填默认为link
    //       dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
    //       success: function() {
    //         Toast("分享成功");
    //       },
    //       cancel: function() {
    //         Toast("取消分享");
    //       }
    //     });
    //   });
    // }
  },
  components: { cTitle }
};
