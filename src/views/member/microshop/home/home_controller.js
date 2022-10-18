// import { mapState } from "vuex";
import cTitle from "components/title";
import cMent from "components/ment_microshop";
import cGoodsList from "components/goodsList";
import banner from "components/temp/banner";
import showbanner from "components/temp/banner";
import showmenu from "components/temp/menu";
import showtitle from "components/temp/title";
import showsearch from "components/temp/search";
import showline from "components/temp/line";
import showblank from "components/temp/blank";
import showrichtext from "components/temp/richtext";
import showpicture from "components/temp/picture";
import showcube from "components/temp/cube";
import showarea from "components/temp/area";
import showshop from "components/temp/shop";
import showgoods from "components/temp/goods";
import shownotice from "components/temp/notice";

import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "c-swipe";
import { Toast } from "vant";
import { scrollMixin } from "../../../../utils/mixin"; //引入加载更多
require("c-swipe/dist/swipe.css");
var items = [
  {
    id: "M1491471961972",
    temp: "showsearch",
    params: {
      placeholder: "",
      style: "style2",
      color: "#000",
      bgcolor: "#FFF",
      bordercolor: "#fa1f24",
      searchurl: "",
      uniacid: "6"
    },
    data: "",
    other: "",
    content: ""
  }
];

export default {
  mixins: [scrollMixin],
  data() {
    return {
      tempshare: null,
      username: "用户昵称",
      signName: "个性签名",
      category: [],
      carousel: [],
      goodsListData: [],
      ads: [],
      bannerData: [],
      userImg: "",
      shop_logo: "",
      shop_name: "",
      shop_id: "",
      bgImg: "",
      isCategory: false,
      amout: true,
      index2: 1,
      other: "",
      content: "",
      show: true,
      tempData: items,
      oftemp: false,
      dftempData: false,
      follow: false,
      isfollow: true,
      havaShop: false, //是否已有商品
      shopData: {}, //微店信息
      clientWidths: "",
      // more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.getMicroShop();
    }
  },
  mounted() {
    window.MHomeScrollTop = 0;
  },
  beforeRouteLeave(to, from, next) {
    window.MHomeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  activated() {
    this.isLoadMore = true;
    this.page = 1;
    this.total_page = 0;
    window.addEventListener("scroll", this.slider);
    if (window.location.href.indexOf("#/microShop/home") > -1) {
      setTimeout(() => {
        window.scrollTo(0, window.MHomeScrollTop);
      }, 200);
    }

    if (this.$route.params.fromHome === 1) {
      this.getMicroShop();
    } else {
      this.fun.setWXTitle(this.shopData.nickname);
    }
    this.clientWidths = document.body.clientWidth;
  },
  deactivated() {
    window.document.removeEventListener("scroll", this.slider, false);
  },

  methods: {
    //获取微店信息
    getMicroShop() {
      let that = this;
      that.isLoadMore = false;
      $http.get("plugin.micro.frontend.controllers.MicroShop.default", {}, "加载中").then(
        function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            that.fun.setWXTitle(response.data.nickname);
            that.shopData = response.data; //微店数据
            that.setMicroShopUserInfo(response.data); //设置微店用户基础信息
            that.setBannerData(response.data); //设置广告
            that.setCategoryData(response.data); //设置分类
            // that.setGoodsData(response.data); //设置商品
            that.shop_id = response.data.shop_id; //设置商店id
            that.getGoodList(that.shop_id);
            that.replaceShopId(that.shop_id);
            console.log(document.location.href + "&share_tag=2");
            // that.initShare(); //分享设置
            let _link =
              location.protocol +
              "//" +
              window.location.host +
              "/addons/yun_shop/?menu#/microShopShare/home/" +
              that.shop_id +
              "/?mid=" +
              that.fun.getKeyByMid() +
              "&i=" +
              that.fun.getKeyByI() +
              "&shop_id=" +
              that.shop_id;
            that.fun.wxShare(
              "",
              {},
              {
                title: that.shopData.nickname,
                imgUrl: that.userImg,
                description: that.shopData.signature,
                link: _link
              }
            );
          } else {
            that.$dialog
              .confirm({ message: "您暂时无微店,点击确定申请?" })
              .then(() => {
                that.$router.push(that.fun.getUrl("microShop_apply", {}));
              })
              .catch(() => {});
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getGoodList(shop_id) {
      $http
        .get("plugin.micro.frontend.controllers.MicroShop.MicroShopByShare.get-goods", {shop_id: shop_id}, ".")
        .then(response => {
          if (response.result == 1) {
            this.setGoodsData(response.data); //设置商品
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //替换shop_id
    replaceShopId(shop_id) {
      let that = this;
      //判断是否相等
      if (this.fun.isTextEmpty(this.fun.getKeyByMicroShopId())) {
        //如果为空
        that.$router.push({
          name: "microShop_home",
          query: {
            shop_id: shop_id,
            type: that.fun.getTyep(),
            mid: that.fun.getKeyByMid(),
            i: that.fun.getKeyByI()
          }
        });
      }
    },

    //设置微店用户基础信息
    setMicroShopUserInfo(data) {
      let that = this;
      that.username = data.nickname;
      that.signName = data.signature;
      that.shop_logo = data.shop_logo;
      that.shop_name = data.shop_name;
      //that.shop_name = data.nickname;
      that.bgImg = data.shop_background;
      that.userImg = data.shop_avatar;
      //设置微信title
      that.fun.setWXTitle(data.nickname);
    },

    //设置分类
    setCategoryData(data) {
      if (this.fun.isTextEmpty(data.category) || data.category.length == 0) {
        this.isCategory = false;
        return;
      }
      this.isCategory = true;
      let that = this;
      that.category = that.fun.chunk(data.category, 8);
    },

    tohref(href) {
      if (href) {
        window.location.href = href;
      }
    },

    //设置广告
    setBannerData(data) {
      let that = this;
      that.bannerData = data.carousel;
    },

    //设置商品
    setGoodsData(data) {
      let that = this;
      console.log(data);
      if (!data.goods_list) return;
      that.goodsListData = data.goods_list.data;
      that.total_page = data.goods_list.last_page;
      that.page = data.goods_list.current_page;
    },

    goTop(e) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    goBack() {
      //this.$router.push(this.fun.getUrl('home'));
      this.$router.go(-1);
    },

    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.micro.frontend.controllers.MicroShop.MicroShopByShare.get-goods",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                var myData = response.data.goods_list.data;
                that.goodsListData = that.goodsListData.concat(myData); //数组拼接
                that.isLoadMore = true;
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },

    //初始化分享设置
    initShare() {
      let that = this;

      $http
        .post("member.member.wxJsSdkConfig", {
          url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.tempshare = response.data;
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
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.shopData.nickname; //微店名称
        let _link =
          location.protocol +
          "//" +
          window.location.host +
          "/addons/yun_shop/?menu#/microShopShare/home/" +
          that.shop_id +
          "/?mid=" +
          data.info.uid +
          "&i=" +
          data.info.uniacid +
          "&shop_id=" +
          that.shop_id;
        let _imgUrl = that.userImg; //用户头像
        let _desc = that.shopData.signature; //微店签名

        console.log(_link);

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
          //desc: '描述内容提要', // 分享描述
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
    }
  },

  components: {
    cTitle,
    cMent,
    cGoodsList,
    banner,
    showbanner,
    showmenu,
    showtitle,
    showsearch,
    showline,
    showblank,
    showrichtext,
    showpicture,
    showcube,
    showarea,
    showshop,
    showgoods,
    shownotice,
    cMyswipe,
    Swipe,
    SwipeItem
  }
};
