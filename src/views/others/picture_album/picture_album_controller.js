import Turn from "components/turn/turn";
import { Toast } from 'vant';

export default {
  components: { Turn },
  data() {
    return {
      manuals: [],
      currentIndex: 0,

      manualWidth: innerWidth,
      manualHeight: innerHeight,
      member: {},
      picture_album: {},
      show: false,
      show1: false,
      show2: false,
      showFirst: false,
      songStop: true,
      goods_id: "",
      readyState: 0, //音频是否加载完成
      showData: false,
    };
  },
  mounted() {
    let innerWidth = document.body.clientWidth;
    let innerHeight = document.body.clientHeight;
    if (this.fun.getPhoneEnv() == 3) {
      innerWidth = 375 - parseInt(375 * 0.15);
      innerHeight = 700 - parseInt(700 * 0.2);
    } else {
      innerWidth = innerWidth - parseInt(innerWidth * 0.15);
      innerHeight = innerHeight - parseInt(innerHeight * 0.2);
    }
    this.manualWidth = innerWidth;
    this.manualHeight = innerHeight;
  },
  activated() {
    this.showData = false;
    this.show = false;
    this.show1 = false;
    this.show2 = false;
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.picture-album.frontend.controllers.picture-album.get-activity-by-id", {
        mark_id: this.fun.getKey("mark_id"),
        mid: this.fun.getKeyByMid()
      }, "").then(response => {
        if (response.result === 1) {
          if (response.data.member) {
            this.member = response.data.member;
          }
          this.picture_album = response.data.picture_album;
          this.manuals = response.data.picture;
          this.goods_id = this.manuals[0].goods_id;
          this.showData = true;
          this.showFirst = true;
          // this.initShare();
          this.fun.wxShare(
            "",
            {},
            {
              link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/picture_album?mark=picture_album&mark_id=" + this.fun.getKey("mark_id") + "&i=" + this.fun.getKeyByI() + "&share_tag=2&mid=" + this.member.member_id,
              title: this.picture_album.title,
              imgUrl: this.picture_album.share_picture,
              description: this.picture_album.describe
            }
          );
          this.fun.setWXTitle(this.picture_album.picture_name);
        } else {
          Toast(response.msg);
          this.showFirst = false;
          this.showData = false;
        }
      },
      function (response) {
        console.log(response);
      }
      );
    },
    handleToggleControl(e) {
      // console.log('handleToggleControl', this.manualClickTimer, Date.now())
      this.show = !this.show;
      if (!this.show) {
        this.showFirst = false;
      }
      if (this.manualClickTimer) {
        clearTimeout(this.manualClickTimer);
        this.manualClickTimer = null;
        if (this.manuals.length) {
          this.handleDoubleClick(e);
        }
        return;
      }

      this.manualClickTimer = setTimeout(() => {
        clearTimeout(this.manualClickTimer);
        this.manualClickTimer = null;
      }, 200);
    },
    handleTurnPrev({ to, from }) {
      if (to < 0) {
        Toast({ message: "已经是第一页了", duration: 1000 });
        return;
      }
      this.goods_id = this.manuals[to].goods_id;
    },
    handleTurnNext({ to, from }) {
      if (to >= this.manuals.length) {
        Toast({ message: "已经是最后一页了", duration: 1000 });
        return;
      }
      this.goods_id = this.manuals[to].goods_id;
    },
    handleTurnChange(page) {
      this.currentIndex = page;
      this.showFirst = false;
      this.show = false;
    },
    handleSwitchManual(index) {
      if (index === this.currentIndex) return;
      this.$refs["turn"].toPage(index);
      this.currentIndex = index;
      this.goods_id = this.manuals[this.currentIndex].goods_id;
      this.show = false;
    },
    handleTurning() {
      // this.playAudio();
    },
    handleDoubleClick(e) {
      // console.log('handleDoubleClick')
      const index = this.currentIndex;
      const item = this.manuals[index];
      wx.previewImage({
        current: item.picture_image,
        urls: [item.picture_image]
      });
    },
    toCard() {
      if (this.member.business_id != 0) {
        this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: this.member.business_id, mark: 'card' }));
      }
    },
    gotoUrl(str, params) {
      if (str == "goods" && params.id == 0) {
        return;
      }
      this.$router.push(this.fun.getUrl(str, params));
    },
    play() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.songStop = false;
      } else {
        this.$refs.audio.pause();
        this.songStop = true;
      }
    },
    onLoadedmetadata(res) {
      this.readyState = this.$refs.audio.readyState;
      this.autoPlay();
    },
    autoPlay() {
      const that = this;
      this.songStop = false;
      this.$refs.audio.play();
      if (this.fun.isWeiXin()) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          function () {
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
      wx.ready(function () {
        that.$refs.audio.play();
      });
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      }
      this.$dialog.alert({message:"请点击右上角微信分享"});

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
            if (response.data.config) {
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        that.$refs.audio.play();
        that.songStop = false;
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        _title = that.fun.isTextEmpty(
          that.picture_album.title
        )
          ? data.share.title
          : that.picture_album.title;

        _imgUrl = that.fun.isTextEmpty(
          that.picture_album.share_picture
        )
          ? data.share.icon
          : that.picture_album.share_picture;

        _desc = that.fun.isTextEmpty(that.picture_album.describe)
          ? data.share.desc
          : that.picture_album.describe;

        let _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/picture_album?mark=picture_album&mark_id=" + that.fun.getKey("mark_id") + "&i=" + that.fun.getKeyByI() + "&share_tag=2&mid=" + that.member.member_id;
        // _link = that.fun.isMid(_link, data.info.uid);

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
    }
  },
  beforeCreate() { },
  beforeDestroy() {
  },
  computed: {}
};
