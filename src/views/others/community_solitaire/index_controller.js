import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzSpecs from "components/ui_components/yz_specs";
import yzCartList from "components/ui_components/yz_cartList";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import yzMyinfo from "components/ui_components/yz_myinfo";

import emptyImage from "@/assets/images/new_diy/image.png";
import { Toast, Dialog } from "vant";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      emptyImage,
      showWechatshar: false,
      poster_url: null,
      showposter: false,
      goodsCartsTotal: [],
      cartsNum: 0,
      cartsTotal: 0,
      info: {},
      showCarList: false,
      popupSpecs: false,
      activity_gid: null, //上一次点击查看详情的商品id
      goodinfo: {},
      list: [],
      carList: [],
      showShare: false,
      showgp: false,

      showChoose: false,
      dispatch_types: [],
      radioChoose: null,
      cart_ids: [],

      options: [
        { name: "复制接龙", icon: "link" },
        { name: "生成海报", icon: "poster" },
        { name: "分享给好友", icon: "wechat" }
      ],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      showFrom: false
    };
  },
  components: { yzGoodsPopup, yzSpecs, yzCartList, yzWechatShareImg, yzMyinfo },
  computed: {},
  activated() {
    this.getData();
    //
  },
  methods: {
    showCarListM() {
      this.showCarList = true;
    },
    getData() {
      $http
        .get("plugin.community-relay.frontend.activity.activity-detail", { activity_id: this.$route.params.id }, ".")
        .then(res => {
          if (res.result == 1) {
            this.info = res.data;
            this.info.end_time = Number(res.data.end_time + "000");
            this.info.start_time = Number(res.data.start_time + "000");
            this.getBuyer();
            this.getCar();
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getBuyer() {
      $http
        .get("plugin.community-relay.frontend.activity.activity-buyer", { activity_id: this.$route.params.id }, ".")
        .then(res => {
          if (res.result == 1) {
            this.list = res.data.data;
            this.isLoadMore = true;
            this.total_page = res.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = { activity_id: this.$route.params.id };
        this.page = this.page + 1;

        _json.page = this.page;
        $http.get("plugin.community-relay.frontend.activity.activity-buyer", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    getCar() {
      $http
        .get("plugin.community-relay.frontend.activity.activity-cart", { activity_id: this.$route.params.id }, ".")
        .then(res => {
          if (res.result == 1) {
            this.carList = res.data;
            this.getFirstCart(res.data);
            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: this.info.activity_name,
                description: "距离活动结束还剩" + this.fun.timeCountDown(this.info.end_time)
              }
            );
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPoster() {
      $http
        .get("plugin.community-relay.frontend.activity.get-poster", { activity_id: this.$route.params.id, code_type: 1, get_type: 1 }, "")
        .then(res => {
          if (res.result == 1) {
            this.poster_url = res.data;
            this.showShare = false;
            this.showposter = true;
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showGoodPup(_id, status) {
      if (this.activity_gid == _id) {
        if (!status) {
          this.showgp = true;
        } else {
          this.popupSpecs = true;
        }
        return;
      }
      this.activity_gid = _id;
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: Number(_id) }, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodinfo = res.data.get_goods;
            this.goodinfo.end_time = this.info.end_time;
            if (res.data.get_goods.content) {
              let str = this.goodinfo.content.replace(/src=\"http:/gi, 'src="https:');
              this.goodinfo.content = str;
            } else {
              this.goodinfo.content = "暂无该商品详情";
            }
            setTimeout(() => {
              if (!status) {
                this.showgp = true;
              } else {
                this.popupSpecs = true;
              }
            }, 800);
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //分享面板
    onSelect(option) {
      if (option.name == "复制接龙") {
        let message = "立即参与接龙：" + document.location.href;
        this.$copyText(message).then(
          function(e) {
            console.log(e);
          },
          function(e) {
            console.log(e);
          }
        );
      } else if (option.name == "生成海报") {
        this.getPoster();
      } else if (option.name == "分享给好友") {
        if (this.fun.getTyep() == 7) {
          this.appSharesinit();
          return;
        }
        this.showWechatshar = true;
      }
    },
    showgoodspecs() {
      this.popupSpecs = true;
    },
    selectOption(id) {
      this.showGoodPup(id, true);
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype, id) {
      console.log("规格弹窗关闭了=====", _optionsId, goodsCount, clicktype, id);
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        if (id) {
          // 有购物车记录
          this.updateCart(id, goodsCount);
        } else {
          // 新加入购物车
          this.addCartRequest(this.activity_gid, goodsCount, _optionsId);
        }
      }
    },
    addGoods(e) {
      console.log("加一 ", e);
      this.updateCart(e.id, e.total + 1);
    },
    reduceGoods(e) {
      console.log("减一 ", e);
      this.updateCart(e.id, e.total - 1);
    },
    blurCart(e) {
      console.log("失去焦点了", e);
      this.updateCart(e.id, e.total);
    },
    updateCart(id, num) {
      let json = {};
      let _url = "";
      if (num != 0) {
        _url = "member.member-cart.updateNumV2";
        json = { num: num, id: id };
      } else {
        _url = "member.member-cart.destroy";
        json.ids = id;
      }
      $http
        .get(_url, json, "")
        .then(res => {
          Toast(res.msg);
          this.getCar();
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirmRrom(data) {
      this.addCart(data.gid, data.total, data.option_id);
    },
    //加入购物车网络操作
    addCartRequest(gid, total, option_id) {
      let that = this;
      let goods = [];
      goods.push(gid);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              Dialog.alert({
                title: "提示",
                message: "购买跨境商品,请补充您的个人信息"
              }).then(() => {
                that.mydata = {
                  gid: gid,
                  total: total,
                  option_id: option_id
                };
                that.showFrom = true;
              });
            } else {
              that.addCart(gid, total, option_id);
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
          that.isGoods = false;
        }
      );
    },
    addCart(gid, total, option_id) {
      $http
        .get("member.member-cart.store", { goods_id: gid, total: total, option_id: option_id }, "")
        .then(res => {
          Toast(res.msg);
          this.getCar();
        })
        .catch(error => {
          Toast(res.msg);
          console.log(error);
        });
    },
    // 计算购物车数量和总金额
    getFirstCart(data) {
      this.carts = data;
      // this.goodsCarts = [];
      this.cartsNum = 0;
      this.cartsTotal = 0;
      this.carts.forEach(item => {
        // this.$set(this.goodsCarts, item.goods_id, item);
        // if (
        //     item.goods_id === this.goodsInfo.id &&
        //     item.option_id === optionsId
        // ) {
        //     this.popNum = item.total;
        //     this.popCard = item;
        // }
        this.cartsNum += item.total;
        this.cartsTotal += item.total * item.goods.price;
      });
      this.goodsCartsTotal = this.calculateTotal(this.carts);
      this.cartsTotal = parseFloat(this.cartsTotal).toFixed(2);
    },
    //不同规格的同一商品求和
    calculateTotal(arr) {
      // let newArr = [];
      let temp = {};
      // let newArr2 = [];
      for (let i in arr) {
        if (arr.hasOwnProperty(i)) {
          let key = arr[i].goods_id;
          this.cart_ids.push(arr[i].id);
          if (temp[key]) {
            let good_id = temp[key].goods_id;
            temp[key].goods_id = good_id;
            temp[key].total = temp[key].total + arr[i].total;
          } else {
            temp[key] = {};
            temp[key].goods_id = arr[i].goods_id;
            temp[key].total = arr[i].total;
            temp[key].id = arr[i].id;
          }
        }
      }
      // for (let k in temp) {
      //     newArr.push(temp[k]);
      // }
      // newArr.forEach(item => {
      //     this.$set(newArr2, item.goods_id, item);
      // });
      // console.log('aaaaaaa', temp)
      return temp;
    },
    // 检查购物车商品列表是否有配送方式冲突
    checkGoods() {
      $http.get("plugin.overseas.frontend.memberCart.checkout", { cart_ids: this.cart_ids.join(",") }, "操作中").then(
        response => {
          if (response.result == 1) {
            if (response.data.need_choose == 1) {
              this.dispatch_types = response.data.dispatch_types;
              this.showChoose = true;
            } else {
              this.submitGoods();
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //提交订单
    submitGoods() {
      if (this.showChoose && !this.radioChoose) {
        Toast("请先选择配送方式");
        return;
      }
      if (this.showChoose) {
        // 配送方式有冲突
        this.cart_ids = [];
        for (let i = 0; i < this.dispatch_types[this.radioChoose].member_carts.length; i++) {
          this.cart_ids.push(this.dispatch_types[this.radioChoose].member_carts[i].id);
        }
      }

      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: "-1",
            cart_ids: this.cart_ids.join(",")
          }
        )
      );
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config && response.data.config.appId) {
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
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url
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
      var _title = that.info.activity_name;
      var _link = that.fun.isMid(document.location.href, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(data.shop.share.icon) ? data.shop.icon : data.shop.share.icon;
      var _desc = "距离活动结束还剩" + this.fun.timeCountDown(this.info.end_time);
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.info.activity_name;
        let _imgUrl = that.fun.isTextEmpty(data.shop.share.icon) ? data.shop.icon : data.shop.share.icon;
        let _desc = "距离活动结束还剩" + that.fun.timeCountDown(that.info.end_time);

        let _link = that.fun.isMid(document.location.href, data.info.uid);

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
  }
};
