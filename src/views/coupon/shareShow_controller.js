import cTitle from "components/title";
import { Toast } from 'vant';
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      result: ['a'],
      showShare: false,
      info: [],
      avatar: '',
      posterLogo: '',
      posterName: '',
      qr_code: '',
      posterShow: false,
      loadingImg: true,
      logo: '',
      mark_id: '',
      mid: '',
      dataURL: '',
      fontsize: '',
      is_belongs_to_coupon: ''
    };
  },
  methods: {
    close() {
      this.showShare = false;
    },
    shareVideo() {
      this.showShare = true;
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
            this.wxJsSdkConfig = response.data;
            console.log('刚进', this.wxJsSdkConfig);
            this.share(this.wxJsSdkConfig);
          } //else {
          //}
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data) {
      console.log(data);
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        // let _title = `${data.info.nickname}向您分享${info.belongs_to_coupon.name}`
        let _title = '';
        try {
          _title = `${data.info.nickname}向您分享${this.is_belongs_to_coupon.name}`;
        } catch (error) {
          _title = `向您分享优惠券`;
        }

        let _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/coupon/shareGet?i=" + that.fun.getKeyByI() + '&mark_id=' + that.mark_id;
        _link = that.fun.isMid(_link, data.info.uid);
        console.log(_link);
        let _imgUrl = data.share.icon;
        let _desc = data.share.desc;
        console.log(_title, _link, _imgUrl, _desc);
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
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
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
    showPoster() {
      console.log(this.data.dataURL);
      if (this.fun.isTextEmpty(this.data.dataURL)) {
        Toast('加载中');
      } else {
        this.posterShow = true;
      }
    },
    getPoster() {
      window.pageYOffset = 0;
      window.pageXOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      var that = this;
      if (!this.fun.isTextEmpty(this.dataURL)) {
        that.posterShow = true;
        return;
      }
      $http.post("plugin.share-coupons.Frontend.controllers.list.poster", { mark_id: that.mark_id }).then(
        response => {
          if (response.result === 1) {
            console.log(response.data);
            let res = response.data;
            that.avatar = res.avatar;
            that.posterLogo = res.logo;
            that.posterName = res.nickname;
            that.qr_code = res.qr_code;
            that.posterShow = true;
            setTimeout(() => {
              this.saveImg();
              console.log(that.dataURL, '创建base64图片');
              this.loadingImg = false;
            }, 1000);
            // setTimeout(() => {
            //   this.loadingImg = false;
            // }, 1000);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );

    },
    getdata() {
      var that = this;
      let json = {
        record_id: this.info.id,
        combine: this.info.combine,
        num: this.info.num
      };
      $http.post("plugin.share-coupons.Frontend.controllers.list.choose-coupon", json).then(
        response => {
          if (response.result === 1) {
            console.log(response);
            let res = response.data;
            that.logo = res.logo;
            that.mark_id = res.mark_id;
            that.mid = res.mid;
            // that.initShare();
            this.fun.wxShare(
              "",
              { },
              {
                title: `向您分享${this.is_belongs_to_coupon.name}`,
                link:that.fun.getSiteRoot() + "/addons/yun_shop/?menu#/coupon/shareGet?i=" + that.fun.getKeyByI() + '&mark_id=' + that.mark_id,
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    saveImg() {
      var content = document.getElementById("img_box");
      const that = this;
      html2canvas(content, {
        useCORS: true, // 【重要】开启跨域配置
        // allowTaint: true,//允许跨域图片
        backgroundColor: null,// 解决生成的图片有白边

      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
      });
    },
    init() {
      this.avatar = '',
      this.posterLogo = '';
      this.posterName = '';
      this.qr_code = '';
      this.loadingImg = true;
      this.posterShow = false;
      this.fontsize = 0;
      this.dataURL = '';
    }
  },
  activated() {
    window.pageYOffset = 0;
    window.pageXOffset = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    this.init();
    this.info = this.$route.params.info;
    if (!this.info) {
      this.$router.push(this.fun.getUrl("coupon", {}));
      return;
    }
    if (this.info) {
      this.is_belongs_to_coupon = this.$route.params.info.belongs_to_coupon;
      console.log(this.info);
      if (this.info.belongs_to_coupon.name.length >= 7) {
        this.fontsize = '0.8rem';
      } else {
        this.fontsize = '1.41rem';
      }
      this.getdata();
    }
  },
  mounted() { },
  components: { cTitle }
};