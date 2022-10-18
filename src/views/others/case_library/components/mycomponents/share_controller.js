import { Toast } from 'vant';
import emptyImage from '../../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage,
      share_show: false,
      link: '',
      uid: '',
      posterShow: false,
      img_url: ''
    };
  },
  activated() {
    this.share_show = false;
    this.link = '';
  },
  mounted() {},
  methods: {
    openShare() {
      if (!this.uid) {
        // this.initShare();
        this.fun.wxShare(
          "",
          { mid: this.fun.getKeyByMid() },
          {
            title: this.title,
            imgUrl:  this.img,
            description: this.desc
          },
          data => {
            if (data.info && data.info != null) {
              this.uid = data.info.uid;
              let _link = document.location.href;
              this.link = this.fun.isMid(_link, data.info.uid);
            }
          }
        );
      } else {
        this.share_show = true;
      }
    },
    closeShare() {
      this.share_show = false;
    },
    // 生成海报
    creatPoster() {
      let that = this;
      that.share_show = false;
      let url = '';
      let json = { id: this.id };
      if (that.type == 'case') {
        url = 'plugin.case-library.api.release.get-case-poster';
      } else if (that.type == 'subject') {
        url = 'plugin.case-library.api.release.get-special-poster';
      }
      $http.post(url, json, '').then(
        response => {
          if (response.result === 1) {
            that.posterShow = true;
            that.img_url = response.data.url;
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    //初始化分享设置
    initShare() {
      let that = this;
      let json = {
        url: this.fun.isIosOrAndroid() === 'android' ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              console.log(response.data.info);
              if (response.data.info && response.data.info != null) {
                that.uid = response.data.info.uid;
                let _link = document.location.href;
                that.link = that.fun.isMid(_link, response.data.info.uid);
              }
              that.share_show = true;
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appShare();
        return;
      }
      this.$dialog.alert({message:'请点击右上角微信分享'});
      this.share_show = false;
    },
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      let uid = window.localStorage.getItem("uid");
      var that = this;
      let _link = document.location.href + '&share_tag=2';
      _link = that.fun.isMid(_link, uid);
      let _title = that.title;
      let _imgUrl = that.img;
      let _desc = that.desc;
      YDB.Share(_title, _desc, _imgUrl, _link, 'Sharesback');
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.title;
        let _imgUrl = that.img;
        let _desc = that.desc;

        let _link = document.location.href + '&share_tag=2';
        _link = that.fun.isMid(_link, data.info.uid);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });
      });
    },
    onCopy() {
      Toast({
        message: '复制成功',
        position: 'center',
        duration: 5000
      });
      this.closeShare();
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: [] //这样可以指定默认的值
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    id: {
      type: Number || String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  }
};
