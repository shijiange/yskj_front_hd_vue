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

import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

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
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      toi: this.fun.getKeyByI(),
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
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.shop_id = this.$route.params.shop_id;
    this.replaceShopId(this.shop_id);
    //获取微店信息
    this.getMicroShop();
    window.addEventListener("scroll", this.slider);
  },
  deactivated() {
    window.removeEventListener("scroll", this.slider);
  },

  methods: {
    //获取微店信息
    getMicroShop() {
      let that = this;
      let json = { shop_id: this.shop_id };
      $http.get("plugin.micro.frontend.controllers.MicroShop.MicroShopByShare", json, "加载中").then(response => {
        if (response.result === 1) {
          that.shopData = response.data; //微店数据

          that.setMicroShopUserInfo(response.data); //设置微店用户基础信息
          that.setBannerData(response.data); //设置广告
          that.setCategoryData(response.data); //设置分类
          // that.setGoodsData(response.data); //设置商品
          that.setIsMicroShop(response.data); //判断是否是微店主
          that.getGoodList();
          // that.initShare();
          that.fun.wxShare(
            "",
            {},
            {
              title: that.shopData.nickname,
              imgUrl: that.userImg,
              description: that.shopData.signature
            }
          );
        } else {
          that.$dialog.alert({ message: response.msg });
        }
      });
    },
    getGoodList() {
      $http
        .get("plugin.micro.frontend.controllers.MicroShop.MicroShopByShare.get-goods", {}, ".")
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
    getMoreData() {
      let urlStr = "plugin.micro.frontend.controllers.MicroShop.MicroShopByShare.get-goods";
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let json = {
          page: this.page
        };

        $http
          .post(urlStr, json, "")
          .then(response => {
            this.isLoadMore = true;
            if (response.result == 1) {
              let data = response.data;
              var nextPageData = data.goods_list.data;
              this.goodsListData = this.goodsListData.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    replaceShopId(shop_id) {
      let that = this;
      //判断是否相等
      if (this.fun.isTextEmpty(this.fun.getKeyByMicroShopId())) {
        //如果为空
        that.$router.push({ name: "micro_shop_share_home", params: { shop_id: shop_id }, query: { shop_id: shop_id, type: that.fun.getTyep(), mid: that.fun.getKeyByMid(), i: that.fun.getKeyByI() } });
      }
    },
    tohref(href) {
      if (href) {
        window.location.href = href;
      }
    },

    //设置微店用户基础信息
    setMicroShopUserInfo(data) {
      let that = this;
      that.username = data.nickname;
      that.signName = data.signature;
      that.shop_logo = data.shop_logo;
      that.shop_name = data.shop_name;
      //that.shop_name = data.nickname ;
      that.bgImg = data.shop_background;
      that.userImg = data.shop_avatar;

      //设置微信title
      that.fun.setWXTitle(data.nickname);
    },
    //设置分类
    setCategoryData(data) {
      let that = this;
      that.category = that.fun.chunk(data.category, 8);
    },

    //设置广告
    setBannerData(data) {
      let that = this;
      that.bannerData = data.carousel;
    },

    //设置商品
    setGoodsData(data) {
      this.goodsListData = data.goods_list.data;
      this.total_page = data.goods_list.last_page;
      this.page = data.goods_list.current_page;
      this.isLoadMore = true;
      if (this.goodsListData.length == 0) {
        this.isLoadMore = false;
      }
    },

    //判断是非是微店主
    setIsMicroShop(data) {
      let that = this;
      that.is_micro_shop = data.is_micro_shop;
    },

    goTop(e) {
      document.body.scrollTop = 0;
    },
    goBack() {
      this.$router.push(this.fun.getUrl("home"));
    },

    //初始化分享设置
    initShare() {
      let that = this;
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
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
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.shopData.nickname; //微店名称
        let _link =
          location.protocol +
          "//" +
          window.location.host +
          "/addons/yun_shop/#/microShopShare/home/" +
          that.shop_id +
          "/?mid=" +
          data.info.uid +
          "&i=" +
          data.info.uniacid +
          "&shop_id=" +
          that.shop_id;
        let _imgUrl = that.userImg; //用户头像
        let _desc = that.shopData.signature; //微店签名
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
    shownotice
  }
};
