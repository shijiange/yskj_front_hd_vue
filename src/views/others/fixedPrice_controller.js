import yzSpecs from "components/ui_components/yz_specs";
import yzCartList from "components/ui_components/yz_cartList";
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      loading: false,
      // 分享到微信
      showWechatshar: false,
      goodsList: [], //商品列表
      isLoadMore: true, //判断是否要加载更多的标识
      page: 1, //当前的页数
      total_page: 0, //总共有多少页
      params: [],
      // 规则详情
      rulesShow: false,
      // 分享
      showShare: false,
      // 购物车规则弹窗
      cartSpecs: false,
      // 顶部的默认状态
      topDefault: "",
      // 自定义图片
      custom_thumb_url: "",
      //   customThumb: 0,
      customThumbUrl: "",
      startTime: "",
      endTime: "",
      // 商品详情弹窗
      showgp: false,
      // 当前的本地时间
      nowTime: "",
      timeLength: "",
      shootFlag: false,
      activityStatus: false,
      noMore: true,
      // 商品规格信息
      getSpecsInfo: {},
      goodinfo: {},
      info: {},
      popCard: {},
      popupSpecs: false,
      goodsId: "",
      cardFlag: false,
      allTotal: 0,
      posterFlag: false,
      num: "",
      posterUrl: "",
      cartsNum: 0,
      cartsTotal: 0,
      cart: [],
      cart_ids: [],
      goodsCartsTotal: [],
      addReduce: false,
      // 提示弹窗
      hintShow: false,
      // 购物车列表弹窗
      showCarList: false,
      carList: [],
      showChoose: false,
      dispatch_types: [],
      radioChoose: null,
      activity_gid: "",
      // 更多
      moreFlag: true,
      activityData: [],
      extension_poster: "",
      showShareData: [
        { name: "复制链接", icon: require("../../assets/images/link.png") },
        { name: "分享海报", icon: require("../../assets/images/poster.png") },
        { name: "微信", icon: "wechat" }
      ]
    };
  },
  mounted() {},
  methods: {
    //  引入分页的方法
    getData() {
      $http
        .get("plugin.pack-fixed-price.api.goods.get-goods-list", { page: this.page, id: this.$route.params.id }, "正在获取参与活动的商品的信息")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.goodsList = response.data.data;
            // this.getSpecsInfo = response.data.data
          } else {
            Toast(response.msg);
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
        this.page = this.page + 1;
        $http.get("plugin.pack-fixed-price.api.goods.get-goods-list", { page: this.page, id: this.$route.params.id }, "加载中").then(
          response => {
            that.isLoadMore = true;

            if (response.result === 1) {
              var myData = response.data.data;
              that.goodsList = that.goodsList.concat(myData); //数组拼接
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
    // 开枪倒计时完成时
    finish() {
      if (this.timeLength) {
        this.getActivityInfo();
      }
    },
    // 获取活动信息
    getActivityInfo() {
      var that = this;
      $http.post("plugin.pack-fixed-price.api.activity.get", { id: this.$route.params.id }, "正在获取活动信息...").then(
        function(response) {
          if (response.result === 1) {
            that.activityData = response.data;
            that.info = response.data;
            // 自定义图片
            that.custom_thumb_url = response.data.custom_thumb_url;
            that.startTime = that.timeFormat(response.data.start_at * 1000);
            that.endTime = that.timeFormat(response.data.end_at * 1000);
            if (new Date().getTime() < response.data.start_at * 1000) {
              // 倒计时换成当前时间距离开抢时间倒计时
              that.shootFlag = true;
              that.timeLength = response.data.start_at * 1000 - new Date().getTime();
            }
            if (new Date().getTime() > response.data.start_at * 1000) {
              // 倒计时换成当前时间距离据活动结束时间倒计时
              that.shootFlag = false;
              that.timeLength = response.data.end_at * 1000 - new Date().getTime();
            }
            that.topDefault = response.data.rule;
            let times = response.data.end_at * 1000 - new Date().getTime();
            if (times == 0) {
              that.activityStatus = true;
            }
            that.loading = true;
            // that.initShare();
            that.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid() },
              {
                title: that.activityData.activity_name,
                imgUrl: that.activityData.custom_thumb_url,
                description: that.activityData.pack_price + "元任选" + that.activityData.goods_count + "件商品"
              }
            );
          } else if (response.result == 0) {
            that.activityStatus = true;
          }
        },
        function(response) {
          // error callback
        }
      );
    },

    close_yz_specs_popup(_optionsId, goodsCount, clicktype, id) {
      // console.log('规格弹窗关闭了=====', _optionsId, goodsCount, clicktype, id)
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        if (id) {
          //有购物车记录
          this.updateCart(id, goodsCount);
        } else {
          // 加入购物车
          this.addCart(this.activity_gid, goodsCount, _optionsId);
        }
      }
    },

    // 获取购物车的信息
    getCar() {
      $http.post("plugin.pack-fixed-price.api.member-cart.index", { id: this.$route.params.id }, "加载中").then(
        response => {
          if (response.result === 1) {
            this.getFirstCart(response.data);
            this.carList = response.data;
          }
        },
        function(response) {
          // error callback
        }
      );
    },

    // 添加到购物车
    addCart(gid, total, option_id) {
      $http
        .get("plugin.pack-fixed-price.api.member-cart.store", { goods_id: gid, total: total, option_id: option_id, id: this.$route.params.id }, "")
        .then(res => {
          console.log(res);
          if (res.result == 1) {
            this.getCar();
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 计算购物车数量和总金额
    getFirstCart(data) {
      this.carts = data;
      this.cartsNum = 0;
      this.cartsTotal = 0;
      this.carts.forEach(item => {
        this.cartsNum += item.total;
        this.cartsTotal += item.total * item.goods.price;
      });
      this.goodsCartsTotal = this.calculateTotal(this.carts);
      this.cartsTotal = parseFloat(this.cartsTotal).toFixed(2);
    },

    // 不同规格的同一商品求和
    calculateTotal(arr) {
      // let newArr = [];
      let temp = {};
      // let newArr2 = [];
      this.cart_ids = [];
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

    // 点击增加按钮
    addGoods(e) {
      this.updateCart(e.id, e.total + 1);
    },

    // 点击减少按钮
    reduceGoods(e) {
      this.updateCart(e.id, e.total - 1);
    },
    // 更新购物车按钮
    updateCart(id, num) {
      let json = {};
      let _url = "";
      if (num != 0) {
        _url = "plugin.pack-fixed-price.api.member-cart.update-num";
        json = { num: num, id: id };
      } else {
        _url = "plugin.pack-fixed-price.api.member-cart.destroy";
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
    showgoodspecs() {
      this.popupSpecs = true;
    },

    // 购物车列表弹窗事件
    carListClick(data) {
      console.log("执行", data);
      console.log(this.showCarList);
      this.showCarList = !this.showCarList;
      console.log(this.showCarList);
    },
    carListClose(flag) {
      this.showCarList = flag;
    },
    //多规格
    selectOption(id) {
      this.showGoodPup(id, true);
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
            let nowtime = new Date().getTime() / 1000;
            if (nowtime < this.info.start_at) {
              this.goodinfo.end_time = this.info.start_at;
            } else {
              this.goodinfo.end_time = this.info.end_at;
            }

            if (this.goodinfo.content) {
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

    // 购物车商品检测
    checkGoods() {
      if (this.cartsNum == 0) {
        //购物车为0,不能跳转
        Toast("请选择商品");
        return;
      }
      console.log(this.cart_ids.join(","));
      $http.get("plugin.pack-fixed-price.api.checkout.index", { cart_ids: this.cart_ids.join(",") }, "检测中").then(
        response => {
          console.log(response, "商品检测");
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

    // 跳转到订单页
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
            tag: "-10", //一口价的判断标识
            cart_ids: this.cart_ids.join(",")
          }
        )
      );
    },

    // 点击规则详情
    rulesDetailClick() {
      this.rulesShow = true;
    },
    knowClick() {
      this.rulesShow = false;
      this.hintShow = false;
    },
    shareClick() {
      this.showShare = true;
    },
    // 提示
    hintClick() {
      this.hintShow = true;
    },

    // 获取海报
    getPoster() {
      $http.get("plugin.pack-fixed-price.api.poster.get-poster", { id: this.$route.params.id }, "加载中").then(
        response => {
          if (response.result === 1) {
            this.extension_poster = response.data.extension_poster;
            if (this.extension_poster) {
              this.posterFlag = true;
              this.showShare = false;
            }
          } else {
            Toast(res.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 参数 ：option options的信息 index:下标
    onSelect(option, index) {
      var that = this;
      if (index == 0) {
        let copyUrl = that.fun.isMid(document.location.href, window.localStorage.getItem("uid"));
        console.log(copyUrl);
        this.$copyText(copyUrl).then(
          //复制链接到黏贴版
          function(e) {
            Toast("复制成功");
            that.showShare = false;
          }
        );
      }
      if (index == 1) {
        this.getPoster();
      }

      if (index == 2) {
        this.showWechatshar = true;
      }
    },

    moreClick() {
      this.moreFlag = !this.moreFlag;
      console.log(this.showCarList);
    },

    goMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },

    // 活动结束点击去首页
    goHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    //把时间戳转换成字符串的格式
    timeFormat(timestamp) {
      var time = new Date(timestamp);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return year + "." + this.addZero(month) + "." + this.addZero(date) + " " + this.addZero(hours) + ":" + this.addZero(minutes) + ":" + this.addZero(seconds);
    },
    //时间补0
    addZero(num) {
      return num < 10 ? "0" + num : num;
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
            if (response.data.config) {
              this.share(response.data);
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
      console.log(that.activityData.custom_thumb_url != "" ? that.activityData.custom_thumb_url : data.shop.shop.logo_url);
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        _title = that.activityData.activity_name;
        _imgUrl = that.activityData.custom_thumb_url != "" ? that.activityData.custom_thumb_url : data.shop.shop.logo_url; //如果是图案，取商城的logo图
        _desc = that.activityData.pack_price + "元任选" + that.activityData.goods_count + "件商品";
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            // Toast("分享成功");
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

  activated() {
    this.activityStatus = false;
    this.extension_poster = "";
    this.getActivityInfo();
    this.getData();
    this.getCar();
  },

  components: {
    yzSpecs,
    yzCartList,
    yzWechatShareImg,
    yzGoodsPopup
  }
};
