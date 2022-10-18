import { scrollMixin } from "../../../utils/mixin";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Dialog, Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  components: { yzWechatShareImg },
  data() {
    return {
      currentTime: parseInt(new Date().getTime() / 1000),
      listData: [],
      title: "开团",
      pages: "open",

      nickname: "",
      dividend_name: "",
      avatar: "",
      is_self: 0,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      shareData: {},
      member_id: 0,
      showWechatshar: false
    };
  },
  mounted() {
    console.log(this.$store.state.temp);
  },
  activated() {
    this.initData();
    if (this.$route.query.pages && this.$route.query.pages == "join") {
      this.pages = this.$route.query.pages;
      this.title = "参团";
      this.fun.setWXTitle("参团");
    }

    if (this.$route.query.member_id && this.$route.query.member_id > 0) {
      this.member_id = this.$route.query.member_id;
    } else {
      this.member_id = window.localStorage.uid;
    }
    this.getData();
    console.log("执行", this.member_id);
  },
  methods: {
    initData() {
      this.title = "开团";
      this.pages = "open";
    },
    getData() {
      this.page = 1;
      this.isLoadMore = true;
      let url = "plugin.star-spell.frontend.index.myOpenTeam";
      if (this.pages == "join") {
        url = "plugin.star-spell.frontend.index.myJoinTeam";
      }
      $http.post(url, { member_id: this.member_id }, "").then(res => {
        if (res.result != 1) {
          Toast(res.msg);
          return;
        }
        this.avatar = res.data.avatar;
        this.dividend_name = res.data.dividend_name;
        this.nickname = res.data.nickname;
        this.is_self = res.data.is_self;
        if (this.is_self == 0) {
          this.title = "我的" + this.title;
          this.fun.setWXTitle(this.title);
        }
        this.total_page = res.data.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
        this.listData = res.data.data;
        this.shareData = res.data.share;
        // this.initShare();
        this.fun.wxShare(
          "",
          { uid: this.member_id },
          {
            title: this.shareData.share_title,
            imgUrl: this.shareData.share_img,
            description: this.shareData.share_describe
          }
        );


        console.log(res);
      });


    },

    gotoOrderDetail(id) {
      this.$router.push(this.fun.getUrl("orderdetail", { order_id: id, orderType: "shop" }));
    },

    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let url = "plugin.star-spell.frontend.index.myOpenTeam";
        if (this.pages == "join") {
          url = "plugin.star-spell.frontend.index.myJoinTeam";
        }
        $http
          .get(url, {
            page: this.page,
            member_id: this.member_id
          })
          .then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    },
    gotoGroupDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGroupDetails", { id }));
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        Dialog.alert({
          title: "提示",
          message: "请在微信内打开"
        });
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appShare();
        return;
      }
      this.showWechatshar = true;
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
      $http.post("member.member.wxJsSdkConfig", json).then(
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
      var that = this;
      let _title = that.shareData.share_title;


      let _imgUrl = that.shareData.share_img;
      let _desc = that.shareData.share_describe;
      let _link = document.location.href;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //初始化分享设置
    initShare() {

      console.log(that.member_id);
      let json = {
        url:
          that.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        uid: that.member_id
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data) {
      let that = this;
      console.log("调用分享");
      wx.config(data.config);
      wx.ready(function() {
        let _titles = that.shareData.share_title;
        let _imgUrls = that.shareData.share_img;
        let _descs = that.shareData.share_describe;

        let _links = "";


        _links = document.location.href;
        _links = that.fun.isMid(_links, data.info.uid);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            that.showWechatshar = false;
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            that.showWechatshar = false;
            Toast("拼团商品分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    }


  }
};