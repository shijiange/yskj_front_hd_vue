import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzSpecs from "components/ui_components/yz_specs";
import yzCartList from "components/ui_components/yz_cartList";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";

// import emptyImage from "@/assets/images/new_diy/image.png";
import { Toast } from "vant";

export default {
  data() {
    return {
      themeColor: "#f14e4e",
      alertFlag: false,
      showShare: false,
      showposter: false,
      showWechatshar: false,
      group: {},
      time: 0,
      deliver: {},
      goodsCartsTotal: [],
      carList: [],
      popupSpecs: false,
      showgp: false,
      goodinfo: {},
      cartsNum: 0,
      cartsTotal: 0,
      cart_ids: [],
      showCarList: false,
      isBusinessInfo: false, //是否展示商家信息

      options: [
        { name: "复制链接", icon: "link" },
        { name: "生成海报", icon: "poster" },
        { name: "分享给好友", icon: "wechat" }
      ]
    };
  },
  components: { yzGoodsPopup, yzSpecs, yzCartList, yzWechatShareImg },
  computed: {},
  // mounted() {},
  activated() {
    this.getData();
    // this.initShare();
    this.fun.wxShare(
      "",
      { mid: this.fun.getKeyByMid() },
      {
        title: this.group.title,
        imgUrl: this.group.share_img,
        description: "邀请您加入社区团购"
      }
    );
  },
  methods: {
    gotoUrl(_url, params = {}) {
      this.$router.push(this.fun.getUrl(_url, params));
    },
    changeTemplate() {
      this.isBusinessInfo = !this.isBusinessInfo;
    },
    getData() {
      $http
        .post("plugin.package-deliver.frontend.communityGroups.groupDetail", { id: this.$route.params.id, deliver_id: this.$route.params.deliver_id }, "")
        .then(response => {
          if (response.result === 1) {
            this.group = response.data.group;
            this.deliver = response.data.deliver;
            this.themeColor = response.data.group.color ? response.data.group.color : "#f14e4e";
            if (this.group.group_status == 0) {
              this.time = new Date(this.group.start_time.replace(/-/g, "/")).getTime() - new Date().getTime();
            } else if (this.group.group_status == 1) {
              this.time = new Date(this.group.end_time.replace(/-/g, "/")).getTime() - new Date().getTime();
            }
            this.getCar();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCar() {
      $http
        .get(
          "plugin.package-deliver.frontend.memberCart.index",
          {
            group_id: this.$route.params.id,
            deliver_id: this.$route.params.deliver_id
          },
          "."
        )
        .then(res => {
          if (res.result == 1) {
            this.carList = res.data;
            this.getFirstCart(res.data);
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
        .get(
          "plugin.package-deliver.frontend.communityGroups.getPoster",
          {
            group_id: this.$route.params.id,
            code_type: 1,
            get_type: 1,
            deliver_id: this.$route.params.deliver_id
          },
          ""
        )
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
            this.goodinfo.end_time = this.fun.getTimestamp(this.group.end_time);
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
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //分享面板
    onSelect(option) {
      let _link = this.fun.isMid(document.location.href, this.fun.getKeyByMid());
      if (option.name == "复制链接") {
        let message = "邀请您加入社区团购：" + _link;
        this.$copyText(message).then(
          function(e) {
            console.log(e);
            Toast("复制成功");
          },
          function(e) {
            console.log(e);
            Toast("复制失败");
          }
        );
      } else if (option.name == "生成海报") {
        this.getPoster();
      } else if (option.name == "分享给好友") {
        // this.showWechatshar = true
        this.shareWeixin();
      }
    },
    openAlert() {
      this.alertFlag = !this.alertFlag;
    },
    showgoodspecs() {
      this.popupSpecs = true;
    },
    selectOption(id) {
      this.showGoodPup(id, true);
    },
    finishTime() {
      this.group.group_status = 2;
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
          this.addCart(this.activity_gid, goodsCount, _optionsId);
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
        _url = "plugin.package-deliver.frontend.memberCart.updateNumV2";
        json = { num: num, id: id, group_id: this.$route.params.id, deliver_id: this.$route.params.deliver_id };
      } else {
        _url = "plugin.package-deliver.frontend.memberCart.destroy";
        json = { group_id: this.$route.params.id, deliver_id: this.$route.params.deliver_id };
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
    addCart(gid, total, option_id) {
      $http
        .get(
          "plugin.package-deliver.frontend.memberCart.store",
          {
            goods_id: gid,
            total: total,
            option_id: option_id,
            group_id: this.$route.params.id,
            deliver_id: this.$route.params.deliver_id
          },
          ""
        )
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
      return temp;
    },
    // // 检查购物车商品列表是否有配送方式冲突
    checkGoods() {
      // $http.get('plugin.overseas.frontend.memberCart.checkout', { cart_ids: this.cart_ids.join(',') }, "操作中").then(
      //     (response) => {
      //         if (response.result == 1) {
      //             if (response.data.need_choose == 1) {
      //                 this.dispatch_types = response.data.dispatch_types;
      //                 this.showChoose = true;
      //             } else {
      this.submitGoods();
      //             }
      //         } else {
      //             Toast(response.msg);
      //         }
      //     },
      //     function (response) {
      //         console.log(response);
      //     }
      // );
    },
    //提交订单
    submitGoods() {
      // if (this.showChoose && !this.radioChoose) {
      //     Toast("请先选择配送方式");
      //     return;
      // }
      // if (this.showChoose) {
      //     // 配送方式有冲突
      //     this.cart_ids = []
      //     for (let i = 0; i < this.dispatch_types[this.radioChoose].member_carts.length; i++) {
      //         this.cart_ids.push(this.dispatch_types[this.radioChoose].member_carts[i].id);
      //     }
      // }
      let deliver_data = {
        deliver_name: this.deliver.deliver_name,
        deliver_mobile: this.deliver.deliver_mobile,
        full_address: this.deliver.full_address,
        id: this.deliver.id
      };

      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: "communityBuy",
            package_deliver_id: this.$route.params.deliver_id,
            group_id: this.$route.params.id,
            // changeSelfCarry: JSON.stringify(deliver_data),//改为在下单页请求接口
            cart_ids: this.cart_ids.join(",")
          }
        )
      );
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
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
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 7) {
        this.appShare();
        return;
      } else {
        this.showWechatshar = true;
        return;
      }
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
      let uid = window.localStorage.getItem("uid");
      var that = this;
      var _title = that.group.title;
      var _link = document.location.href;
      _link = that.fun.isMid(_link, uid);

      var _imgUrl = that.group.share_img;
      var _desc = "邀请您加入社区团购";
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        try {
          _title = that.group.title;
        } catch (error) {
          _title = data.shop.shop.name;
        }
        try {
          _imgUrl = that.group.share_img;
        } catch (error) {
          _imgUrl = data.shop.icon;
        }
        try {
          _desc = "邀请您加入社区团购";
        } catch (error) {
          _desc = data.shop.shop.name;
        }
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
