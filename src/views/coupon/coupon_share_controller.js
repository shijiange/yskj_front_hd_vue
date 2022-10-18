import cTitle from "components/title";
import { Toast } from 'vant';
const SHARE_URL = "coupon.share-coupon.share";

export default {
  data() {
    return {
      coupon_num: "",
      shareObj: {},
      url: ""
    };
  },
  activated() {
    this.initData();
    this.getShareInfo();
  },
  methods: {
    initData() {
      this.coupon_num = "";
      this.shareObj = {};
      this.url = "";
    },
    getShareInfo() {
      $http
        .get(SHARE_URL, { order_ids: this.$route.params.order_id }, "...")
        .then(res => {
          if (res.result === 1) {
            this.coupon_num = res.data.coupon_num;
            this.url = `${location.protocol}//${
              location.host
            }/addons/yun_shop/?menu#/coupon/get_coupon/${
              this.$route.params.order_id
            }?i=${this.fun.getKeyByI()}&type=${this.fun.getTyep()}`;
            this.shareObj = res.data.set;
            // this.initShare();
            this.fun.wxShare(
              "",
              {mid: this.fun.getKeyByMid()},
              {
                link:this.url,
                title: this.shareObj.share_title,
                imgUrl: this.shareObj.banner,
                description: this.shareObj.share_desc
              }
            );
          } else {
            Toast(res.msg);
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //初始化分享设置
    initShare() {
      //不是微信端 不访问
      let token = this.fun.getToken();
      if (token) {
        this.wxLocationGet();
        return;
      }

      if (window.localStorage.type == 5) {
        return;
      }
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };

      //console.log("json", json);
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(res => {
          if (res.result === 1) {
            this.share(res.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        //let _link = location.protocol + '//' + location.host + location.pathname + '?i=' + that.fun.getKeyByI() + "&type=" + that.fun.getTyep() + "&mid=" + data.info.uid;
        //let _link = document.location.href + "&mid=" + data.info.uid;

        let _link = that.url;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = "";
        let _desc = "";

        _title = that.fun.isTextEmpty(that.shareObj.share_title)
          ? data.shop.shop.name
          : that.shareObj.share_title;
        _imgUrl = that.fun.isTextEmpty(that.shareObj.banner)
          ? data.shop.icon
          : that.shareObj.banner;
        _desc = that.fun.isTextEmpty(that.shareObj.share_desc)
          ? data.shop.name
          : that.shareObj.share_desc;

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

    shareClick() {
      this.$dialog.alert({message:'请点击右上角分享按钮'});

    }
  },
  components: { cTitle }
};
