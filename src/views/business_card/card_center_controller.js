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
    //????????????????????? -- ??????????????????????????????
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
    // //??????????????????
    // share(data) {
    //   let that = this;
    //   wx.config(data.config);
    //   wx.ready(function() {
    //     let _title = that.fun.isTextEmpty(that.dataInfo.title)
    //       ? "??????"
    //       : that.dataInfo.title;
    //     let _link = document.location.href;
    //     _link = that.fun.isMid(_link, data.info.uid);

    //     let _imgUrl = that.fun.isTextEmpty(that.dataInfo.thumb)
    //       ? ""
    //       : that.dataInfo.thumb;
    //     let _desc = that.fun.isTextEmpty(that.dataInfo.desc)
    //       ? "??????"
    //       : that.dataInfo.desc;
    //     wx.showOptionMenu();
    //     wx.onMenuShareTimeline({
    //       title: _title, // ????????????
    //       link: _link, // ????????????
    //       imgUrl: _imgUrl, // ????????????
    //       success: function() {
    //         Toast("????????????");
    //       },
    //       cancel: function() {
    //         Toast("????????????");
    //       }
    //     });

    //     wx.onMenuShareAppMessage({
    //       title: _title, // ????????????
    //       desc: _desc, // ????????????
    //       link: _link, // ????????????
    //       imgUrl: _imgUrl, // ????????????
    //       type: "link", // ????????????,music???video???link??????????????????link
    //       dataUrl: "", // ??????type???music???video??????????????????????????????????????????
    //       success: function() {
    //         Toast("????????????");
    //       },
    //       cancel: function() {
    //         Toast("????????????");
    //       }
    //     });
    //   });
    // }
  },
  components: { cTitle }
};
