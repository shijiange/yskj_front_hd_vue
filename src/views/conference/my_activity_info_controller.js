// import { mapState, mapMutations } from 'vuex';
import cTitle from "../../components/title";
// import District from 'ydui-district/dist/gov_province_city_area_id';
import { Toast } from "vant";

// var haveShop = false;

export default {
  data() {
    return {
      id: "",
      datas: []
    };
  },

  mounted() {},
  methods: {
    //获取会务活动的分享设置信息
    getShareData() {
      let that = this;
      $http
        .get("plugin.conference.api.conference-activity.get-share-info", {
          id: that.id
        })
        .then(
          response => {
            if (response.result === 1) {
              that.shareInfo = response.data;
              // that.initShare(); //初始化分享设置
              this.fun.wxShare(
                "",
                {},
                {
                  title: this.shareInfo.share_title,
                  imgUrl: this.shareInfo.share_icon,
                  description: this.shareInfo.share_desc
                }
              );
            } else {
              console.log(response.msg);
            }
          },
          response => {}
        );
    },
    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          console.log(response);
          if (response.result == 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          } // else {
          //}
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
        let _title = that.shareInfo.share_title;
        let _imgUrl = that.shareInfo.share_icon;
        let _desc = that.shareInfo.share_desc;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        wx.showOptionMenu();
        // wx.updateTimelineShareData({
        //   title: _title, // 分享标题
        //   link: _link, // 分享链接
        //   imgUrl: _imgUrl, // 分享图标
        //   success: function () {
        //     //Toast("分享成功");
        //   }
        // });
        // wx.updateAppMessageShareData({
        //   title: _title, // 分享标题
        //   desc: _desc, // 分享描述
        //   link: _link, // 分享链接
        //   imgUrl: _imgUrl, // 分享图标
        //   //type: 'link', // 分享类型,music、video或link，不填默认为link
        //   //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //   success: function () {
        //     //Toast("分享成功");
        //   }
        // });
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
    //获取数据
    getMyActivityInfo() {
      this.datas = [];
      var that = this;
      $http.get("plugin.conference.api.conference-activity.get-enrol-data", { conference_id: this.id }, "加载中...").then(
        function(response) {
          if (response.result == 1) {
            var dataList = response.data;
            console.log(response);

            for (let j = 0; j < dataList.length; j++) {
              let dataItem = new Object();
              dataItem.title = dataList[j].name;
              dataItem.is_image = dataList[j].is_image;
              console.log(dataList[j].value, dataList[j].is_image);
              if (dataList[j].is_image == 1) {
                dataItem.value = dataList[j].value;
              } else {
                if (dataList[j].value instanceof Array) {
                  let value = "";
                  for (let i = 0; i < dataList[j].value.length; i++) {
                    value += dataList[j].value[i] + " ";
                  }
                  dataItem.value = value;
                } else {
                  dataItem.value = dataList[j].value;
                }
              }

              that.datas.push(dataItem);
              console.log(dataItem);
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    }
  },
  activated() {
    this.id = this.$route.params.id;
    this.datas = []; //初始化
    this.getMyActivityInfo();
    this.getShareData();
  },
  created() {},
  components: { cTitle }
};
