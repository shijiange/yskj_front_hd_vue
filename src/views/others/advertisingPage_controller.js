// <img src="../../assets/images/music_play.png" alt="">
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      image1: "http://t7.baidu.com/it/u=3616242789,1098670747&fm=79&app=86&f=JPEG?w=900&h=1350",
      show: false,
      list: {
        audio_link: "",
        browse_count: "",
        default: "",
        name: "",
        service_mobile: "",
        service_qr: "",
        // share_content:'',
        // share_thumb:'',
        // share_title:'',
        songStop: true
      },
      readyState: 0
    };
  },
  activated() {
    this.getdata();
    this.getQueryString("share_page_id");
    console.log(this.getQueryString("share_page_id"));
    this.autoPlayAudio2();
  },

  methods: {
    //获取链接上的某个参数的值
    getQueryString(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [,""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    getdata() {
      let that = this;
      $http
        .get(
          "plugin.share-page.frontend.share_page.index",
          { share_page_id: this.getQueryString("share_page_id") },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              this.minlist = response.data;
              if (this.list.audio_link) {
                this.autoPlay();
              }
              this.fun.setWXTitle(response.data.name);
              this.list.audio_link = response.data.audio_link;
              this.list.browse_count = response.data.browse_count;
              this.list.logo = response.data.logo;
              // this.list.name = response.data.name;
              this.list.service_mobile = response.data.service_mobile;
              this.list.service_qr = response.data.service_qr;
              // this.list.share_content = response.data.share_content;
              // this.list.share_thumb = response.data.share_thumb;
              // this.list.share_title = response.data.share_title;
              console.log(this.minlist);
              // this.initShare();
              this.fun.wxShare(
                "",
                {},
                {
                  title: that.minlist.share_title,
                  imgUrl: that.minlist.share_thumb,
                  description: that.minlist.share_content
                }
              );

            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    //分享
    initShare() {
      let that = this;
      $http
        .post("member.member.wxJsSdkConfig", {
          url:
            that.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
        })
        .then(response => {
          if (response.result === 1) {
            setTimeout(() => {
              if (response.data.config) {
                that.share(response.data);
              }
            }, 800);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(data) {
      //自定义分享
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        //开启自定义分享
        _title = that.fun.isTextEmpty(that.minlist.share_title)
          ? data.shop.share.title
          : that.minlist.share_title;
        _imgUrl = that.fun.isTextEmpty(that.minlist.share_thumb)
          ? data.share.icon
          : that.minlist.share_thumb;
        _desc = that.fun.isTextEmpty(that.minlist.share_content)
          ? data.share.desc
          : that.minlist.share_content;

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
    onLoadedmetadata(res) {
      this.readyState = this.$refs.audio.readyState;
      this.autoPlay();
    },
    // 歌曲播放
    play() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.songStop = false;
        this.$forceUpdate();
      } else {
        this.$refs.audio.pause();
        this.songStop = true;
        this.$forceUpdate();
      }
    },
    autoPlay() {
      const that = this;
      this.songStop = false;
      this.$refs.audio.play();
      if (this.fun.isWeiXin()) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          function() {
            that.$refs.audio.play();
            that.songStop = false;
          },
          false
        );
      }
    },
    autoPlayAudio2() {
      const that = this;
      wx.config({
        // 配置信息, 即使不正确也能使用 wx.ready
        debug: false,
        appId: "",
        timestamp: 1,
        nonceStr: "",
        signature: "",
        jsApiList: []
      });
      wx.ready(function() {
        that.$refs.audio.play();
      });
    },
    //分享
    shareWeixin() {
      console.log(window.localStorage.type);
      //不是微信端 不访问
      if (window.localStorage.type == 5) {
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享" });

    },
    linkTo() {
      this.show = true;
    },
    mounted() {
      this.autoPlayAudio2();
    }
  },
  components: { cTitle }
};
