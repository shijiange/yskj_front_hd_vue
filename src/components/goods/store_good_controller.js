// import { mapState } from 'vuex';
import { Toast, Dialog } from "vant";
import { Swipe, SwipeItem } from "components/meswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import cLive from "components/goods/children/liveList";
import cMyswipe from "components/myswipe";
import floatOrder from "components/goods/children/float_order";
import BScroll from "better-scroll";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import invitation from "components/goods/children/invitation";
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";

var clicktag = 0;
var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;

// const SUBMIT_ACTION_CART = "-1"; //添加到购物车
// const SUBMIT_ACTION_BUY = "-2"; //立即购买
var submitActionTag = "";

var goods_id = "";

var share_tag = "-1";
var videoLinkTimer = null;

//商品详情
var currentTabIndex = "0";
//标记 防止重复加载
var is_first_content = false;
var is_second_content = false;
var is_third_content = false;

var start = 0;
var last_distance = 0;
//商品详情

//wx.config(response.data.js); 微信认证
export default {
  props: ["goods_id", "goods_type", "goods_info_store", "showDis", "show8", "is_room", "wx_video_link", "toker"],
  data() {
    return {
      // 拓客卡
      customer_development: [],
      effective_time: [],
      effective_day: [],
      many_list: [],
      time_interval: [],
      once_list: [],
      active: 0,
      // 拓客卡tabs
      showBigImg: false,
      bigImages: [], //商品详情富文本图片预览
      show1: false,
      service_QRcode: "",
      service_mobile: "",
      //live more
      isLoadMore: true,
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [], //直播间列表
      goods_info: {},
      openVip: "2",
      //是否是o2o
      is_o2o: false,
      salesCount: "", //销量
      integral: window.localStorage.integral,
      title: "商品详情",
      hoet: false,
      goodTop: false,
      radio: "",
      goodsInfo: {},
      goods_plugin: {},
      popThumb: "",
      popStock: 0,
      popPrice: 0,
      goodsDescription: "",
      goodsCount: 1,
      favorite: false,
      isGoods: false,
      cservice: "",
      //商品详情
      first_content: "",
      second_content: "",
      third_content: [],
      activeName: "first",
      show: true,
      //商品详情
      isAddCart: false,
      popupSpecs2: false, //无规格选择商品数量
      isGoodsLove: false, //是否显示爱心值
      goods_love_cash: 0, //爱心值 现金
      goods_love_deduction: 0, //爱心值抵扣
      goods_love_name: "", //爱心值title
      showMember: true, //是否可以进入会员权益页面
      popTitle: "",
      popNum: "",

      //海报显隐
      posterShow: false,
      posterImg: null,
      //活动显示隐藏
      activityShow: false,
      //商城活动
      activityItem: {},

      //商城活动默认第一个
      firstActivityBtn: "",
      //商城活动默认第一个内容
      firstActivityCon: "",

      //商城活动点击开关
      activitySwitch: false,

      //底部margin值开关
      isMarginBottom: false,

      //是否租赁商品
      isRent: false,

      isRight: false,

      //立即购买
      isRentBuyShow: false,

      //限时购开始时间
      beginTime: 0,

      //显示购结束时间

      endTime: 0,

      endTimeStr: "",

      //限时购开关
      isBuy: false,

      isTime: false,
      //限时购据开始时间开关
      isBegTime: false,
      begTimeStr: "",
      //o2o购物车显示

      showCart: false,

      //底部购物车
      cartsNum: 0,
      carts: [],
      cartsTotal: 0.0,

      goodsCarts: [],

      //购物车id
      card_id: 0,

      //o2o商品数量
      o2oCount: 0,

      //门店名字
      o2oName: "",

      //门店电话

      o2oPhone: "",

      o2oLat: "",

      o2olng: "",

      timeLimit: "",

      //柜子商品--开始
      isCup: true,
      //柜子商品--结束

      isMiniApp: false,
      store_id: "",

      specid: "", //规格ID
      goodsCartsTotal: [],
      show2: false,
      // showDis: true, //控制加入购物车的显示
      // show8: false, //控制过期的显示

      OldGoodsNum: "", //保存获取input焦点时的商品数量

      showGood: false,
      store_service: "",

      showParameter: false, //商品参数弹窗

      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,
      commentLimit: [], //评论组件，设置最新5条评论
      favorable_rate: "100%", //好评率
      labelList: {}, //服务标签
      goodDetail: {},

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,
      is_invite: -1, //判断是否需要跳转邀请页面

      // showComment: false,
      notLogin: false,

      showShare: false, //分享弹窗
      showVideoLink: false,
      article_url: "", //视频号链接

      // 门店预约商品
      showCalendar: false,
      calendar_data: "",
      reserve_goods: false,
      reserveDayArr: [],
      reserveJson: {},
      arrjson: [],
      noneArr: [],

      limitedTimeCustomName: "限时购", //* 限时购自定义名称
      isMultiSpecs: false, //多规格商品是否显示会员价
      specsVIPPrc: null //规格商品会员价
    };
  },

  activated() {
    //alert('activated')
    window.scroll(0, 0);
    this.posterShow = false;
    this.slider();
    this.goodTop = false;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }

    this.initData1();

    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    //门店购物车id
    this.card_id = this.$route.params.cartId;

    goods_id = this.$route.params.id;
    this.is_o2o = true; // 就是门店商品

    //柜子商品
    if (!this.fun.isTextEmpty(this.$route.params.mark)) {
      this.isCup = false;
    } else {
      this.isCup = true;
    }

    //初始化客服参数
    this.initCservice("");
    //商品详情 初始化参数
    this.initData();

    // this.getStoreService();
    this.getGoodsPage(this.goods_info_store);
    // this.getData(); //获取数据
    // this.isFavorite(); //获取是否收藏
    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  mounted() {
    this.posterShow = false;
    this.slider();
    this.goodTop = false;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }

    this.initData1();

    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    //门店购物车id
    this.card_id = this.$route.params.cartId;

    goods_id = this.$route.params.id;
    this.is_o2o = true; // 就是门店商品

    //柜子商品
    if (!this.fun.isTextEmpty(this.$route.params.mark)) {
      this.isCup = false;
    } else {
      this.isCup = true;
    }

    //初始化客服参数
    this.initCservice("");
    //商品详情 初始化参数
    this.initData();

    // this.getStoreService();
    this.getGoodsPage(this.goods_info_store);
    // this.getData(); //获取数据
    // this.isFavorite(); //获取是否收藏
    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },
  deactivated() {
    if (videoLinkTimer) {
      clearTimeout(videoLinkTimer);
    }
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);
    window.removeEventListener("scroll", this.throttleFn);
  },
  methods: {
    formatter(day) {
      let month = day.date.getMonth() + 1;
      let date = day.date.getDate();
      // let status = false;
      if (month < 10) {
        month = `0${month}`;
      }
      if (date < 10) {
        date = `0${date}`;
      }
      if (!day.type) {
        // 默认日期
        day.bottomInfo = "不可预约";
        day.className = "calendar_data";
      }

      // for(let i =0;i<this.reserveDayArr.length;i++){
      //   if(`${month}-${date}` == this.reserveDayArr[i].date){
      //     day.bottomInfo = '可预约';
      //     day.className = 'calendar_data';
      //   }
      // }
      if (this.noneArr) {
        for (let k = 0; k < this.noneArr.length; k++) {
          if (`${month}-${date}` == this.noneArr[k]) {
            day.bottomInfo = "可预约";
            day.className = "calendar_data";
          }
        }
      }
      if (day.bottomInfo != "可预约") {
        day.bottomInfo = "不可预约";
        day.type = "disabled";
      }
      return day;
    },
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirmCalendar(date) {
      this.calendar_data = this.formatDate(date);
      let selectTime = Date.parse(this.calendar_data) / 1000;
      let timeArr = this.reserveDayArr;
      let selectStatus = false;
      let obj = [];
      // let json = {
      //   is_reserve:'',
      //   number:'',
      //   id:'',
      //   option_id:''
      // };
      for (let i = 0; i < timeArr.length; i++) {
        if (selectTime == timeArr[i].time) {
          obj.push(timeArr[i]);
          selectStatus = true;
          // json.is_reserve = timeArr[i].is_reserve;
          // json.number = timeArr[i].number;
          // json.id = timeArr[i].id;
          // json.option_id = timeArr[i].option_id;
        }
      }
      // 可以选的时间
      if (selectStatus) {
        this.showCalendar = false;
        this.reserveJson = obj;
        this.show2 = true;
      } else {
        // 不可以预约的时间
        this.calendar_data = "";
        Toast("所选日期不可预约");
      }
    },
    tapReserve() {
      // this.showCalendar = true
      this.arrjson = [];
      $http.get("plugin.store-reserve.frontend.date.getOptionDate", { option_id: optionsId, goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            // console.log("response.result", response.result);
            this.showCalendar = true;
            this.reserveDayArr = response.data;
            let arr = [];
            let strArr = [];
            let no = 0;
            if (this.reserveDayArr.length > 0) {
              this.reserveDayArr.forEach((element, ind, arrs) => {
                if (arr.length == 0) {
                  arr.push(element);
                } else {
                  // arr数组有存在time一样的对象时，比较一下is_reserve看他是不是false
                  if (arr[no].time == element.time) {
                    if (arr[no].is_reserve) {
                      // 如果原来存在数组is_reserve为true的话，这个天数默认为true
                      arr[no] = element;
                      arr[no].is_reserve = true;
                    } else {
                      //如果原来的数组is_reserve为false的话还有机会
                      if (element.is_reserve == false) {
                        // 传进来的数组为false保持为false
                        arr[no] = element;
                      } else {
                        // 传进来的数组为true的话没有机会了
                        arr[no] = element;
                        arr[no].is_reserve = true;
                      }
                    }
                  } else {
                    no = no + 1;
                    arr.push(element);
                  }
                }
              });
            }
            for (let k = 0; k < arr.length; k++) {
              if (arr[k].is_reserve) {
                strArr.push(String(arr[k].date));
              }
            }
            console.log(strArr);
            this.noneArr = strArr;
          } else {
            if (response.msg == "没有规格id") {
              this.$dialog.alert({ message: "请选择规格" });
            } else {
              this.$dialog.alert({ message: response.msg });
            }
          }
        },
        response => {}
      );
    },
    confirmTap() {
      let that = this;
      // let has_many_options = this.goodsInfo.has_many_options;
      let json = this.reserveJson;
      this.arrjson = [];
      // let checkStatus = false;
      for (let i = 0; i < json.length; i++) {
        if (json[i].option_id == optionsId) {
          this.arrjson = json[i];
        }
      }

      if (!this.arrjson.id) {
        Toast("请选择日期");
        return;
      }
      if (!optionsId) {
        Toast("请选择规格");
        return;
      }

      $http.get("plugin.store-reserve.frontend.goods.verify", { option_id: optionsId, goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            that.$router.push(
              that.fun.getUrl(
                "goodsorder",
                {},
                {
                  tag: "reserve",
                  goodsId: this.goodsInfo.id,
                  optionsId: optionsId,
                  total: 1,
                  date_id: this.arrjson.id,
                  store_id: this.store_id
                }
              )
            );
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        response => {}
      );
    },
    gotohuiyuan() {
      if (this.goods_plugin.selfbuy_discount && this.goods_plugin.selfbuy_discount.link_to_level_page && this.goods_plugin.selfbuy_discount.link_to_level_page.show == 1) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },
    getStoreService(data) {
      // $http
      //   .get("plugin.store-cashier.frontend.store.store.getStoreService", {
      //     store_id: this.store_id
      //   })
      //   .then(
      //     response => {
      //       if (response.result === 1) {
      if (data) {
        this.store_service = data.store_service;
      }

      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   response => {}
      // );
    },
    initData1() {
      this.is_invite = -1;
      this.showBigImg = false;
      this.store_service = "";
      this.showGood = false;
      this.notLogin = false;
      //初始化一下参数
      this.goodsInfo = {};
      this.goods_plugin = {};
      this.isGoods = false;
      this.goodsCount = 1;
      this.popupSpecs2 = false;
      this.isGoodsLove = false;
      this.isMarginBottom = false;

      this.isRent = false;
      this.isRentBuyShow = false;

      submitActionTag = "";
      optionsId = "";
      specsManage = [];
      optionsMaxCount = 1;

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      // this.showComment = false;
      this.showPageB = false;
      this.showMember = true;
      this.recordsList = [];
      this.isBegTime = false;
      this.show2 = false;
    },
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
      });
    },
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName == "IMG") {
          this.bigImages = [];
          this.bigImages.push($event.target.currentSrc);
          this.showBigImg = true;
        }
      }
    },
    trggleCart() {
      if (this.carts.length === 0) {
        return;
      }
      // if (!this.cartScroll) {
      //   this._initScrollCart()
      // } else {
      //   this.cartScroll.refresh()
      // }
      this.showCart = !this.showCart;
    },
    //跳转门店商品的详情
    goToGoodsO2O(goods) {
      if (this.showDis) {
        this.$router.push(
          this.fun.getUrl("goodsO2O", {
            id: goods.goods_id,
            tag: "o2o",
            store_id: this.store_id
          })
        );
      }
    },
    updateCart1(id, num, flag) {
      // updateCart1触发这个方法的都是已经加入购物车的商品
      // id可能是购物车id  也可能是商品id  根据flag判断
      let request_id = id;
      let total = 0;
      this.carts.forEach(item => {
        if(flag === 'good') {
          if (item.goods_id == id) {
            total = item.total;
            request_id = item.id;
          }
        }else {
          if (item.id == id) {
            total = item.total;
          }
        }
      });
      console.log('request_id...', request_id);
      if (num < 0) {
        if (total + num <= 0) {
          if (clicktag === 0) {
            clicktag = 1;
            this.delItemByCart1(request_id);
            setTimeout(function() {
              clicktag = 0;
            }, 500);
          }
          return;
        }
        if (clicktag === 0) {
          clicktag = 1;
          this.updateCartRequest(request_id, num);
          setTimeout(function() {
            clicktag = 0;
          }, 500);
        }
      } else {
        if (specsManage.length == this.goodsInfo.has_many_specs.length && this.popNum == optionsMaxCount) {
          Toast("数量超出范围");
          console.log("max=" + this.popNum);
          return;
        }
        if (clicktag === 0) {
          clicktag = 1;
          this.updateCartRequest(request_id, num);
          setTimeout(function() {
            clicktag = 0;
          }, 500);
        }
      }
    },
    updateCartRequest(id, num, goods_id) {
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.updateNum", {
          id: id,
          num: num,
          store_id: this.store_id,
          goods_id: goods_id //id空的使用一定要传goods_id
        })
        .then(
          response => {
            if (response.result == 1) {
              // console.log("response.result", response.result);
              if (num < 0) {
                this.popNum--;
              } else {
                this.popNum++;
              }
            } else {
              this.$dialog.alert({ message: response.msg });
            }
            this.getCart();
          },
          response => {}
        );
    },
    delItemByCart1(cart_id) {
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.destroy", {
          store_id: this.store_id,
          ids: cart_id
        },"删除中...")
        .then(response => {
          if (response.result == 1) {
            this.getCart();
            this.popNum--;
            this.showCart = false;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    //添加有规格商品到购物车
    async addGood() {
      if (await this.checkInviter()) {
        return;
      }

      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      this.show2 = true;
      this.initPopView1(); //初始化弹窗view
    },
    //不同规格的同一商品求和
    calculateTotal1(arr) {
      let newArr = []; // 保存求和后的购物车数量列表
      let temp = {};
      let newArr2 = [];
      for (let i in arr) {
        let key = arr[i].goods_id;
        if (temp[key]) {
          temp[key].total = temp[key].total + arr[i].total; //id相同则把数量相加
        } else {
          temp[key] = {};
          temp[key].goods_id = arr[i].goods_id;
          temp[key].total = arr[i].total;
        }
      }
      for (let k in temp) {
        newArr.push(temp[k]);
      }
      newArr.forEach(item => {
        this.$set(newArr2, item.goods_id, item);
      });
      return newArr2;
    },

    // 关闭弹窗
    close() {
      this.show2 = false;
      //确认后清空数值
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
    },
    //弹窗提交确认
    submitAction1() {
      if (specsManage.length < this.goodsInfo.has_many_specs.length) {
        //请选择规格
        this.show2 = false;
        Toast(this.goodsDescription);
        return;
      }

      //处理参数
      this.addCartRequest1(this.goodsInfo.id, optionsId);
    },
    //加入购物车网络操作
    addCartRequest1(_goodsId, _optionsId) {
      if (optionsMaxCount === 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }

      let json = {
        goods_id: _goodsId,
        total: 1,
        option_id: _optionsId,
        store_id: this.store_id
      };
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.store", json, "添加中...")
        .then(response => {
          if (response.result === 1) {
            console.log("添加购物车成功");
            this.popNum++;
            this.getCart();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //初始化弹窗view
    initPopView1() {
      optionsId = "";
      specsManage = [];
      this.specid = "";
      this.popNum = 0;
      if (this.goodsInfo.has_option === 1) {
        this.isShowMultiSpecsMemPrice(); //是否需要显示多规格会员价
        //是否有规格
        this.popTitle = this.goodsInfo.title; //设置默认图片
        this.popThumb = this.goodsInfo.thumb; //设置商品名
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.popCard = {};
        if (!this.specid.length) {
          this.popPrice = this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
        }

        this.goodsDescription = "请选择";
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
        }

        if (!optionsId) {
          // 默认选择第一个
          for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
            this.selectSpecs1(this.goodsInfo.has_many_specs[i].specitem[0], this.goodsInfo.has_many_specs[i].specitem[0].id);
          }
        }
      } else {
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock; //设置最大购买量
      }
    },
    isShowMultiSpecsMemPrice() {
      //判断是否需要显示多规格会员价【#70785】
      //注释代码 this.goodsInfo.is_open_micro && Number(this.goodsInfo.is_open_micro) == 1
      //注释原因：后端解释和价格权限插件冲突了 [#80547]
      let _is_open_micro = 0;
      if (this.goods_plugin) _is_open_micro = this.goods_plugin?.member_price?.is_open_micro || 0;
      if (Number(_is_open_micro) == 1 && this.goodsInfo.has_option == 1) {
        this.isMultiSpecs = true;
      } else {
        this.isMultiSpecs = false;
      }
    },

    //界面选择规格触发事件
    selectSpecs1(data, id) {
      // if (this.specid.length < 1) {
      //   this.specid.push(id);//对其他数据筛选 不筛选同级
      // }

      //处理选择池
      this.manageSpecs1(data);

      //处理规格组合选择状态
      this.setGoodsSpecs1(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo1(id);

      //判断当前购买总量与库存的关系
      this.getMaxCount1();
      if (this.reserve_goods) {
        // 预约商品选择规格
        let json = this.reserveJson;
        this.arrjson = [];
        // let checkStatus = false;
        for (let i = 0; i < json.length; i++) {
          if (json[i].option_id == optionsId) {
            console.log(json[i]);
            this.arrjson = json[i];
          }
        }
      }
    },

    //判断当前购买总量与库存的关系
    getMaxCount1() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        if (optionsMaxCount == 0) {
          //库存不足
          this.popNum = 0;
        }
        if (this.popNum > optionsMaxCount) {
          this.popNum = optionsMaxCount;
        }
      }
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo1(id) {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length === this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        console.log("goodsSpecs", goodsSpecs);
        this.specid = goodsSpecs;
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (goodsSpecs === this.setGoodsSpecsBySort1(this.goodsInfo.has_many_options[i].specs)) {
            this.popmPrice = this.goodsInfo.has_many_options[i].market_price; //设置价格
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.popNum = 0;
            }

            if (this.isMultiSpecs) this.getMemberPrice(optionsId);
            break;
          }
        }

        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].goods_id === this.goodsInfo.id && this.carts[i].option_id === optionsId) {
            this.popNum = this.carts[i].total;
            this.popCard = this.carts[i];
            break;
          }
          this.popNum = 0;
          this.popCard = {};
        }
      } else {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        this.specid = goodsSpecs;
      }
      console.log(this.specid);
    },

    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort1(specs) {
      let _specs = specs.split("_"); //先变成数组
      //_specs.sort();//排序
      _specs.sort(function(a, b) {
        return a - b;
      });

      // 在组装回去
      let goodsSpecs = "";
      for (let j = 0; j < _specs.length; j++) {
        goodsSpecs += _specs[j] + "_";
      }
      goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"

      return goodsSpecs;
    },

    //处理选择池
    manageSpecs1(data) {
      var specsObject = new Object();
      specsObject.id = data.id;
      specsObject.specid = data.specid;
      specsObject.title = data.title;

      if (specsManage.length > 0) {
        for (let i = 0; i < specsManage.length; i++) {
          if (specsManage[i].specid == specsObject.specid) {
            specsManage.splice(i, 1);
          }
        }
        specsManage.push(specsObject);
      } else {
        specsManage.push(specsObject);
      }

      //排序
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
      this.setGoodsDescription1();
    },

    //处理goodsDescription 数据
    setGoodsDescription1() {
      var description = "";
      //相等代表全选了 体现语句
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id != specsManage[j].specid) {
              description += this.goodsInfo.has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },

    //处理规格组合选择状态 过滤数据
    setGoodsSpecs1(specs) {
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        if (specs.specid != this.goodsInfo.has_many_specs[i].id) {
          this.setGoodsSpecsStatus1(this.goodsInfo.has_many_specs[i].specitem, specs.id);
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus1(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        // console.log(this.goodsInfo.has_many_options[i].specs);
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goodsInfo.has_many_options[i]);
            return;
          }
        }
      }

      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
                return;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
                return;
              }
            }
          }
        }
      }

      // console.log(options);
    },

    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
      }
    },

    gotoMiniAppCs() {
      var params = "";
      var path = "/pages/cs/index" + params;
      //通过JSSDK的api使小程序跳转到指定的小程序页面
      wx.miniProgram.navigateTo({ url: path });
    },

    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        // if (top < that.$refs.goodinfo.offsetTop) {
        //   that.goodTop = false;
        // } else {
        //   that.goodTop = true;
        // }
        if (top < 40) {
          that.hoet = false;
        } else {
          that.hoet = true;
        }
        //滑动到底部禁止反弹
        if (document.documentElement.scrollHeight == document.documentElement.clientHeight + top) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);

          document.addEventListener("touchmove", this.move, false);
        }
      };
    },

    goto() {
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (share_tag == "-1") {
        this.$router.go(-1);
      } else {
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },

    handleTopChange(status) {
      this.topStatus = status;
    },

    //更新
    loadTop() {
      this.$refs.loadmore.onTopLoaded();
    },

    // 加载更多
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      this.$router.push(
        this.fun.getUrl("goodstab", {
          id: this.$route.params.id,
          goods: this.goodsInfo
        })
      );
      //this.$router.push('/goods/goodstabs/' + this.$route.params.id);
    },

    getGoodsPage(data) {
      //是否是预约商品
      this.reserve_goods = data.reserve_goods;

      // data全部数据
      this.goods_info = data.get_goods;

      // 数据更改plugin
      this.goods_plugin = data.plugin || {};
      if (this.fun.getPhoneEnv() == 3) {
        this.getDetailData();
        this.showPageB = true;
      }
      this.getData(data.get_goods);
      this.service_QRcode = data.service_QRcode;
      this.service_mobile = data.service_mobile;
      this.cservice = data.cservice;
      this.getStoreService(data.store_service);
      this.init(data.get_store_info);
      this.getFirstCart(data.member_cart);
      this.showGood = true;
      if (data.is_favorite) {
        this.favorite = data.is_favorite.status == 1 ? true : false;
      }

      // 客服
      this.service_QRcode = data.customer_service.service_QRcode;
      this.service_mobile = data.customer_service.service_mobile;
      this.cservice = data.customer_service.cservice;

      if (this.goods_plugin.customer_development) {
        // 拓客卡
        this.customer_development = this.goods_plugin.customer_development;
        this.effective_time = this.goods_plugin.customer_development.effective_time;
        this.effective_day = this.goods_plugin.customer_development.effective_day;
        this.many_list = this.goods_plugin.customer_development.many_list;
        this.time_interval = this.goods_plugin.customer_development.time_interval;
        this.once_list = this.goods_plugin.customer_development.once_list;
      }

      // 标签
      this.labelList = this.goods_plugin.label || [];

      // 租赁商品
      if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy)) {
        this.isRent = this.goods_plugin.lease_toy.is_lease == 1 ? true : false;
        this.isRentBuyShow = this.goods_plugin.lease_toy.immed_goods_id == 0 ? false : true;
        if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy.is_rights)) {
          this.isRight = this.goods_plugin.lease_toy.is_rights == 1 ? true : false;
        }
      }
    },

    //获取数据
    getData(data) {
      // get_goods数据

      //* 限时购，后台自定义限时购显示的文案
      if (data.has_one_goods_limit_buy && data.has_one_goods_limit_buy.status === 1) {
        if (data.has_one_goods_limit_buy.display_name) {
          this.limitedTimeCustomName = data.has_one_goods_limit_buy.display_name;
        }
      }
      this.goodsInfo = data;
      this.salesCount = parseInt(this.goodsInfo.show_sales) + parseInt(this.goodsInfo.virtual_sales);
      if (this.goodsInfo.member_discount) {
        if (this.fun.isTextEmpty(this.goodsInfo.member_discount.discount)) {
          this.openVip = 1;
        } else {
          this.openVip = this.goodsInfo.member_discount.discount;
        }
      }

      this.initPopView(); //初始化弹窗view
      this.initPopView2(); //初始化弹窗view2 无规格
      this.fun.wxShare(
        "",
        { goods_id: goods_id },
        {
          title: !this.goodsInfo.has_one_share || this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_title) ? this.goodsInfo.title : this.goodsInfo.has_one_share.share_title,
          imgUrl: !this.goodsInfo.has_one_share || this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_one_share.share_thumb,
          description: !this.goodsInfo.has_one_share || this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_desc) ? "" : this.goodsInfo.has_one_share.share_desc
        },
        data => {
          if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
            this.initCservice(data.shop.shop.cservice); //客服重新赋值
          }
        }
      );
      this.setDataByTabIndex(); //设置商品详情
      this.setIsAddCart(); //判断是否能加入购物车
      this.setIsLove(); //判断是否有爱心值
      this.commentLimit = data.get_comment;
      this.favorable_rate = data.favorable_rate;
      this.isGoods = true;

      wx.miniProgram &&
        wx.miniProgram.postMessage({
          data: { goods_title: this.goodsInfo.title }
        });

      this.isMarginBottom = this.fun.isTextEmpty(data.show_push) ? false : true;

      if (!this.fun.isTextEmpty(data.has_one_goods_limit_buy)) {
        this.isBuy = data.has_one_goods_limit_buy.status == 1 ? true : false;

        this.beginTime = data.has_one_goods_limit_buy.start_time;

        if (this.isBuy) {
          this.timeCompare(this.beginTime);
        }

        // console.log(that.isTime);

        this.endTime = parseInt(data.has_one_goods_limit_buy.end_time) * 1000;

        this.endTimeStr = this.endTime - new Date().getTime();

        this.timeLimit = data.has_one_goods_limit_buy.status;
      }

      // console.log(that.isRent);

      if (data.goods_sale) {
        //商城活动
        if (data.goods_sale.sale_count != 0) {
          this.firstActivityBtn = data.goods_sale.first_strip_key.name;
          if (data.goods_sale.first_strip_key.type == "array") {
            data.goods_sale.first_strip_key.value.forEach((item, index) => {
              if (index == 0) {
                this.firstActivityCon += item;
              } else {
                this.firstActivityCon += "," + item;
              }
            });
          } else {
            this.firstActivityCon = data.goods_sale.first_strip_key.value;
          }

          this.activitySwitch = true;
          this.activityItem = data.goods_sale;
          this.showDefaultActivity(data.goods_sale);
        } else {
          this.activitySwitch = false;
        }
      }

      //     } else {
      //       console.log(response.msg);
      //       that.isGoods = false;

      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //     that.isGoods = false;
      //   }
      // );
    },

    //初始化弹窗view
    initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock; //设置默认库存
      if (this.goodsInfo.has_option == 1) {
        this.popPrice = this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
      } else {
        this.popPrice = this.goodsInfo.price; //设置默认价格
      }

      this.goodsDescription = "选择";
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
      }
    },

    initPopView2() {
      if (this.goodsInfo.has_option != 1) {
        this.popThumb = this.goodsInfo.thumb; //设置默认图片
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.popPrice = this.goodsInfo.price; //设置默认价格
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock; //设置最大购买量
      }
    },

    //立即购买网络操作
    buyNowRequest(_goodsId, _optionsId, _total) {
      if (this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(_optionsId)) {
        //规格商品需optionsId 才能下单
        Toast("请选择规格");
        return;
      }
      if (optionsMaxCount == 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }
      if (_total <= 0) {
        Toast("请选择商品数量");
        return;
      }

      //请求保税商品接口
      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        function(response) {
          if (response.result == 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买此商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: submitActionTag,
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    })
                  );
                })
                .catch(() => {});
            } else {
              if (!that.isCup) {
                //柜子商品
                if (that.isRent) {
                  //柜子商品 --租
                  that.$router.push(
                    that.fun.getUrl(
                      "goodsorder",
                      {},
                      {
                        tag: "rentBuy",
                        goodsId: _goodsId,
                        optionsId: _optionsId,
                        total: _total,
                        mark: that.$route.params.mark
                      }
                    )
                  );
                } else {
                  //柜子商品 --买
                  that.$router.push(
                    that.fun.getUrl(
                      "goodsorder",
                      {},
                      {
                        tag: submitActionTag,
                        goodsId: _goodsId,
                        optionsId: _optionsId,
                        total: _total,
                        mark: that.$route.params.mark
                      }
                    )
                  );
                }
              } else {
                //普通商品
                that.$router.push(
                  that.fun.getUrl(
                    "goodsorder",
                    {},
                    {
                      tag: submitActionTag,
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    }
                  )
                );
              }
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //界面选择规格触发事件
    selectSpecs(data) {
      console.log("selectSpecs");
      // var specid = data.specid; //对其他数据筛选 不筛选同级
      //console.log(specid);
      //处理选择池
      this.manageSpecs(data);

      //处理规格组合选择状态
      this.setGoodsSpecs(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo();

      //判断当前购买总量与库存的关系
      this.getMaxCount();
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (optionsMaxCount == 0) {
          //库存不足
          this.goodsCount = 0;
        }
        if (this.goodsCount > optionsMaxCount) {
          this.goodsCount = optionsMaxCount;
        }
      }
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log("goodsSpecs", goodsSpecs);
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (goodsSpecs == this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)) {
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.goodsCount = 1;
            }

            break;
          }
        }
      }
    },

    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort(specs) {
      let _specs = specs.split("_"); //先变成数组
      //_specs.sort();//排序
      _specs.sort(function(a, b) {
        return a - b;
      });

      // 在组装回去
      let goodsSpecs = "";
      for (let j = 0; j < _specs.length; j++) {
        goodsSpecs += _specs[j] + "_";
      }
      goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"

      return goodsSpecs;
    },

    //处理选择池
    manageSpecs(data) {
      var specsObject = new Object();
      specsObject.id = data.id;
      specsObject.specid = data.specid;
      specsObject.title = data.title;

      if (specsManage.length > 0) {
        for (let i = 0; i < specsManage.length; i++) {
          if (specsManage[i].specid == specsObject.specid) {
            specsManage.splice(i, 1);
          }
        }
        specsManage.push(specsObject);
      } else {
        specsManage.push(specsObject);
      }

      //排序
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
      this.setGoodsDescription();
    },

    //处理goodsDescription 数据
    setGoodsDescription() {
      var description = "";
      //相等代表全选了 体现语句
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id != specsManage[j].specid) {
              description += this.goodsInfo.has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },

    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        if (specs.specid != this.goodsInfo.has_many_specs[i].id) {
          this.setGoodsSpecsStatus(this.goodsInfo.has_many_specs[i].specitem, specs.id);
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        // console.log(this.goodsInfo.has_many_options[i].specs);
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goodsInfo.has_many_options[i]);
          }
        }
      }

      //关键处理方式 后期要优化 效率低
      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
              }
            }
          }
        }
      }

      // console.log(options);
    },

    //增加
    addGoods() {
      console.log("增加");
      if (specsManage.length == this.goodsInfo.has_many_specs.length && this.goodsCount == optionsMaxCount) {
        Toast("数量超出范围");
        console.log("max=" + this.goodsCount);
        return;
      }
      this.goodsCount++;
    },

    //减少
    reduceGoods() {
      if (this.goodsCount == 1 || this.goodsCount == 0) {
        return;
      }

      this.goodsCount--;
    },

    //判断是否收藏
    isFavorite() {
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.isFavorite", json).then(
        function(response) {
          // console.log(response)
          if (response.result == 1) {
            //已收藏
            that.favorite = response.data.status == 1 ? true : false;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //收藏操作
    onFavorite(isFavorite) {
      if (!this.isGoods) {
        Toast("商品已下架或不存在");
        return;
      }
      isFavorite ? this.removeFavorite() : this.addFavorite();
      console.log(isFavorite);
    },

    //添加收藏
    addFavorite() {
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.store", json, "处理中").then(
        function(response) {
          // console.log(response)
          if (response.result == 1) {
            that.favorite = true;
            Toast("收藏成功");
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    clearCart() {
      let destroyCarts = [];
      this.carts.forEach(item => {
        destroyCarts.push(item.id);
      });
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.destroy", {
          store_id: this.store_id,
          ids: destroyCarts
        })
        .then(response => {
          if (response.result == 1) {
            this.getCart();
            this.showCart = false;
            this.popNum = 0;
          } else {
            //alert('无商品');
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    //移除收藏
    removeFavorite() {
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.destroy", json, "处理中").then(
        function(response) {
          // console.log(response)
          if (response.result == 1) {
            that.favorite = false;
            Toast("取消收藏");
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //足迹记录
    footSet(_goods_id, _store_id) {
      if (!this.isGoods) {
        return;
      }

      let json = {
        goods_id: _goods_id,
        mid: this.fun.getKeyByMid(),
        owner_id: _store_id,
        mark: this.fun.getKey("mark"),
        mark_id: this.fun.getKey("mark_id")
      };
      $http.get("member.member-history.store", json).then(
        function(response) {
          console.log(response.msg);
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
      } else if (this.fun.getTyep() == 7 || this.fun.isCPS()) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享" });
    },

    //app获取分享数据
    appSharesinit() {
      $http.post("member.member.wxJsSdkConfig", { url: document.location.href }).then(
        response => {
          if (response.result == 1) {
            this.appShare(response.data);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      let uid = window.localStorage.getItem("uid");
      let _title = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_title) ? this.goodsInfo.title : this.goodsInfo.has_one_share.share_title;
      let _link = document.location.href + "&share_tag=2";
      _link = this.fun.isMid(_link, uid);

      let _imgUrl = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_one_share.share_thumb;
      let _desc = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_desc) ? (data && data.shop ? data.shop.shop.name : "") : this.goodsInfo.has_one_share.share_desc;
      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/goods/${this.$route.params.id}?i=${this.fun.getKeyByI()}&mid=${uid}`, // 分享链接
        imgUrl: _imgUrl // 分享图标
      };
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          shareByH5IOS({ body: "shareByH5IOS", json: JSON.stringify(json) });
        } else {
          shareByH5Android(JSON.stringify(json));
        }
      } else {
        YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
      }
    },

    isShowSharePopup() {
      this.showShare = true;
    },
    // 生成视频号链接
    getVideoLink() {
      if (videoLinkTimer) {
        clearTimeout(videoLinkTimer);
      }
      $http
        .get("plugin.wx-video-link.frontend.index.index", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            if (this.fun.isTextEmpty(response.data.article_url)) {
              //为空则需要继续请求，直到返回数据
              videoLinkTimer = setTimeout(() => {
                this.getVideoLink();
              }, 3000);
            } else {
              clearTimeout(videoLinkTimer);
              this.article_url = response.data.article_url;
              this.showVideoLink = true;
              this.showShare = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 复制链接
    onCopy() {
      this.showVideoLink = false;
      Toast({
        message: "复制成功",
        position: "bottom",
        duration: 2000
      });
      this.article_url = "";
    },
    //初始化商品详情参数
    initData() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.show1 = false;
      this.cservice = "";
      this.salesCount = "";
      this.firstActivityCon = "";
      this.openVip = "2";
      currentTabIndex = "0";
      is_first_content = false;
      is_second_content = false;
      is_third_content = false;

      this.first_content = "";
      this.second_content = "";
      this.third_content = [];
      this.activeName = "first";
      this.show = true;

      this.isAddCart = false;

      this.posterImg = null;

      this.isRentBuyShow = false;
      this.beginTime = 0;

      this.endTime = 0;

      this.endTimeStr = "";

      this.isBuy = false;
      this.cartsNum = 0;

      this.carts = [];
      this.recordsList = [];
      this.cartsTotal = 0.0;
      this.goodsCarts = [];
    },

    //设置选择后的数据
    setDataByTabIndex() {
      console.log("setDataByTabIndex");
      if (currentTabIndex == "0" && !is_first_content) {
        is_first_content = true;
        if (this.goodsInfo.content) {
          let str = this.goodsInfo.content.replace(/src=\"http:/gi, 'src="https:');
          this.goodsInfo.content = str;
        }
        this.first_content = this.goodsInfo.content;
      } else if (currentTabIndex == "1" && !is_second_content) {
        is_second_content = true;
        this.second_content = this.goodsInfo.has_many_params;
      } else if (currentTabIndex == "2" && !is_third_content) {
        is_third_content = true;
        //获取评论
        this.getCommentData();
      }
    },

    //tab 点击
    handleClick(tab, event) {
      //点击同tab 不刷新界面
      if (currentTabIndex == tab) {
        return;
      }

      currentTabIndex = tab;
      this.setDataByTabIndex();
    },

    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: goods_id,
        page: 1,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      // console.log(json);
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        function(response) {
          // console.log(response.data)
          if (response.result == 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            if (!that.third_content) {
              that.third_content = [];
            }
            that.third_content = [...that.third_content, ...response.data.data];
            // that.showComment = true;
            is_third_content = true;
            // that.$emit("showComment", true);
            that.$store.commit("setShowComment", true);
          } else {
            is_third_content = false; //复位
          }
        },
        function(response) {
          is_third_content = false; //复位
          console.log(response);
        }
      );
    },

    //跳转评论详情
    toContentInfo(data) {
      this.$router.push(
        this.fun.getUrl("CommentDetails", {
          order_id: data.order_id,
          goods_id: data.goods_id,
          comment_id: data.id,
          uid: data.uid
        })
      );
    },

    //跳转购物车
    gotoCart() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    gotoCart1() {
      this.$router.push(this.fun.getUrl("cart", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },

    //判断是否能加入购物车
    setIsAddCart() {
      //为空是老数据默认值问题
      if (this.fun.isTextEmpty(this.goodsInfo.buy_way) || this.goodsInfo.buy_way == "0") {
        this.isAddCart = true;
      }

      //不能加入 金币产品
      if (this.goodsInfo.buy_way == 1) {
        this.isAddCart = false;
      }
    },

    //无规格选择 增加数量
    showPopView2() {
      this.popupSpecs2 = true;
    },

    hidePopView2() {
      this.popupSpecs2 = false;
    },

    //新处理立即购买
    buyNowNew() {
      this.hidePopView2();
      //处理参数

      this.buyNowRequest(goods_id, optionsId, this.goodsCount);
    },

    //是否有爱心值
    setIsLove() {
      if (this.goods_plugin.goods_love) {
        this.isGoodsLove = true;
        let love_cash = this.goodsInfo.price - this.goods_plugin.goods_love.amountOfMoney;
        this.goods_love_cash = Number(love_cash.toString().match(/^\d+(?:\.\d{0,2})?/));
        this.goods_love_deduction = this.goods_plugin.goods_love.amountOfCoin;
        this.goods_love_name = this.goods_plugin.goods_love.name;
      } else {
        this.isGoodsLove = false;
      }
    },

    //跳转优惠券领取
    gotoCoupon() {
      //console.log("点击优惠券")
      //this.$router.push(this.fun.getUrl("couponStore"));
      this.$router.push(
        this.fun.getUrl("StoreCoupon", {
          id: this.store_id
        })
      );
    },
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        $http
          .get("goods.goods-poster.new-goods-poster", { id: this.$route.params.id, storeid: this.store_id }, "加载中")
          .then(response => {
            toastPoster.clear();
            if (response.result === 1) {
              this.posterImg = response.data;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({ message: response.msg });
            }
          })
          .catch(error => {
            toastPoster.clear();
            console.log(error);
          });
      }
    },

    activityShowFun() {
      this.activityShow = true;
    },

    //显示商城活动默认活动
    showDefaultActivity(val) {
      if (val.first_strip_key == "coupon") {
        this.firstActivityBtn = "购买返券";
        this.firstActivityCon = "商品订单完成返优惠券";
      } else if (val.first_strip_key == "deduction_proportion" || val.first_strip_key == "award_proportion") {
        this.firstActivityBtn = val.love_name;
        this.firstActivityCon = "最高抵扣" + val.love_name + val.deduction_proportion + ",购买赠送" + val.award_proportion + val.love_name;
      } else if (val.first_strip_key == "max_point_deduct" || val.first_strip_key == "point") {
        this.firstActivityBtn = val.point_name;
        this.firstActivityCon = "最高抵扣" + val.point_name + val.max_point_deduct + ",购买赠送" + val.point + val.point_name;
      } else if (val.first_strip_key == "ed_full") {
        this.firstActivityBtn = "满减";
        this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_full + "立减{{$i18n.t('money')}}" + val.ed_reduction + "";
      } else if (val.first_strip_key == "ed_money" || val.first_strip_key == "ed_num") {
        this.firstActivityBtn = "包邮";
        if (val.first_strip_key == "ed_money" && val.ed_num == 0) {
          this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_money + "元包邮";
        } else if (val.first_strip_key == "ed_num" && val.ed_money == 0) {
          this.firstActivityCon = "本商品满" + val.ed_num + "件包邮";
        } else {
          this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_money + "元包邮" + ",满" + val.ed_num + "件包邮";
        }
      } else if (val.first_strip_key == "award_balance") {
        this.firstActivityBtn = "余额";
        this.firstActivityCon = "购买赠送余额" + val.award_balance + "元";
      } else {
        return;
      }
    },

    //推广商品跳转
    pushGoodGoto(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val.id }));
    },

    o2oCart() {
      this.o2oCartShow = true;
    },

    o2oGotoOrder() {
      this.o2oCartShow = false;

      if (this.fun.isTextEmpty(this.store_id)) {
        this.$dialog.alert({ message: "门店参数错误" });
        return;
      }

      if (this.goodsCount == 0 && this.goodsCount < 0) {
        this.$dialog.alert({ message: "数量不能小于1" });
        return;
      }

      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.store", {
          goods_id: goods_id,
          total: this.goodsCount,
          store_id: this.store_id
        })
        .then(response => {
          if (response.result == 1) {
            this.$router.push(
              this.fun.getUrl(
                "goodsorder",
                {},
                {
                  store_id: this.store_id,
                  tag: "store"
                }
              )
            );
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },

    goShowCart() {
      if (!this.showCart && this.cartsNum > 0) {
        // if (!this.cartScroll) {
        //   this._initScrollCart()
        // } else {
        //   this.cartScroll.refresh()
        // }
        this.showCart = true;
      } else {
        this.showCart = false;
      }
    },

    getFirstCart(data) {
      if (!data) {
        this.carts = [];
        this.goodsCarts = [];
        this.cartsNum = 0;
        this.cartsTotal = 0;
        this.notLogin = true;
        return;
      }
      this.carts = data;
      this.goodsCarts = [];
      this.cartsNum = 0;
      this.cartsTotal = 0;

      this.carts.forEach(item => {
        this.$set(this.goodsCarts, item.goods_id, item);
        this.cartsNum += item.total;
        this.cartsTotal += item.total * item.goods.price;
      });

      let good = this.carts.find(item => item.goods_id == this.$route.params.id);
      if (good == undefined) {
        this.o2oCount = 0;
      }
      this.carts.forEach(item => {
        if (item.goods_id == this.$route.params.id) {
          this.o2oCount = item.total;
        }
        if (item.goods_id === this.goodsInfo.id && item.option_id === optionsId) {
          this.popNum = item.total;
          this.popCard = item;
        }
      });

      this.goodsCartsTotal = this.calculateTotal1(this.carts);
      this.cartsTotal = parseFloat(this.cartsTotal).toFixed(2);
    },

    getCart(goods) {
      // console.log('getCart...');
      // console.log('goods...', goods);

      $http.get("plugin.store-cashier.frontend.shoppingCart.member-cart.index", { store_id: this.store_id }, "加载中").then(response => {
        if (response.result == 1) {
          this.carts = response.data;
          this.goodsCarts = [];
          this.cartsNum = 0;
          this.cartsTotal = 0;
          this.carts.forEach(item => {
            this.$set(this.goodsCarts, item.goods_id, item);
            if (goods && goods.id == item.goods_id) {
              goods.buyNum = item.total;
            }
            this.cartsNum += item.total;
            // console.log(this.cartsNum);
            // console.log(item);
            this.cartsTotal += item.total * item.goods.price;
          });

          //计算当前商品数量

          // console.log(this.carts);

          let good = this.carts.find(item => item.goods_id == this.$route.params.id);
          // console.log(good);
          if (good == undefined) {
            this.o2oCount = 0;
          }
          this.carts.forEach(item => {
            if (item.goods_id == this.$route.params.id) {
              this.o2oCount = item.total;
            }
            if (item.goods_id === this.goodsInfo.id && item.option_id === optionsId) {
              this.popNum = item.total;
              this.popCard = item;
            }
          });
          this.goodsCartsTotal = this.calculateTotal1(this.carts);
          this.cartsTotal = parseFloat(this.cartsTotal).toFixed(2);
          // console.log('cart.result', response.data);
          // console.log('goodsCarts...', this.goodsCarts);

          //获取购物车id
        } else {
          //Toast("请输入提货人信息");
          //return;
        }
      });
    },

    //检查是否开启邀请页面
    async checkInviter() {
      if (this.is_invite === -1) {
        let response = await $http.get("member.member.isValidatePageGoods", {});
        if (response.result === 1) {
          this.is_invite = response.data.is_invite;
          if (this.goodsInfo.has_one_invite_page && this.goodsInfo.has_one_invite_page.status === 1 && response.data.is_invite === 0) {
            this.$router.push(this.fun.getUrl("Inviter", {}, { fromGood: 1 }));
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    async addCart1(goods) {
      if (await this.checkInviter()) {
        return;
      }

      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }

      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.store",
          {
            goods_id: goods.id,
            total: 1,
            store_id: this.store_id
          },
          "加载中"
        )
        .then(
          response => {
            if (response.result == 1) {
              //goods.buyNum += 1;
              this.getCart();
            } else {
              this.$dialog.alert({ message: response.msg });
            }
          }
        );
    },
    toBuy(goods) {
      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: "-2",
            goodsId: goods.id,
            optionsId: optionsId,
            total: 1,
            store_id: this.store_id
          }
        )
      );
    },

    init(data) {
      // get_store_info门店数据

      // var that = this;
      // $http
      //   .get(
      //     "plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id",
      //     { store_id: this.store_id }
      //   )
      //   .then(response => {
      //     if (response.result == 1) {
      //       this.getCart();
      this.store_id = data.store_id;
      this.o2oName = data.store_name;
      this.o2oPhone = "tel:" + data.store_mobile;
      this.o2oLat = data.lat;
      this.o2oLng = data.lng;
      // console.log(this.o2oPhone);
      //   } else {
      //     if (response.msg == "该商家已过期,去看看其他的吧") {
      //       this.showDis = false;
      //       this.show8 = true;
      //     }
      //   }
      // }),
      // response => {
      //   //alert('网络错误，请稍后再试！')
      // };
    },
    // 过期商品显示 跳转到首页
    goTOHome() {
      this.show8 = false;
      this.$router.push(this.fun.getUrl("o2oHome"));
    },

    isHasDifferType(data) {
      //门店购物车提交结算的时候，要判断当前购物车中是否同时存在普通商品和安装服务商品，如果同时存在，要弹框提示
      // 商品不是安装服务商品，直接没有live_install这个字段
      let open_state = 0; //有安装服务的商品
      let clone_state = 0; //没安装服务的商品
      let plugin_name = "";
      data.forEach(item => {
        if (item.live_install && item.live_install.open_state == 1) {
          open_state += 1;
          plugin_name = item.live_install.plugin_name;
        } else {
          clone_state += 1;
        }
      });
      if (open_state != 0 && clone_state != 0) {
        //都有值说明存在 两种 不同商品类型，提示框显示
        Dialog.confirm({
          title: "提示",
          message: `普通商品与${plugin_name}商品一同下单将无法享受${plugin_name}，是否继续下单？`
        })
          .then(() => {
            this.goodsOrder(data, true);
          })
          .catch(() => {});
        return false;
      }
      return true;
    },
    async goodsOrder(val, status) {
      if (await this.checkInviter()) {
        return;
      }
      let sum = 0;
      if (!status && !this.isHasDifferType(val)) {
        return;
      }
      this.carts.forEach(val => {
        sum += val.total;
      });

      if (sum == 0) {
        return;
      }

      // console.log(sum);
      if (val.length == 0 || this.carts.length == 0) {
        return;
      } else {
        this.$router.push(
          this.fun.getUrl(
            "goodsorder",
            {},
            {
              store_id: this.store_id,
              tag: "store"
            }
          )
        );
      }
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.o2oLng, this.o2oLat);
      this.fun.goToWXAdress(point, this.o2oName, "详细地址");
    },

    //获取时间-限时购
    timeCompare(begin) {
      let beginTime = parseInt(begin) * 1000;

      let now = new Date().getTime();
      if (now >= beginTime) {
        this.isTime = true;
      } else {
        this.isTime = false;
        this.isBegTime = true;
        this.begTimeStr = beginTime - now;
      }
    },

    //品牌跳转
    toBrandDetail(val) {
      this.$router.push(this.fun.getUrl("GoodsBrand", { id: val }));
    },

    //租赁立即购买

    toRentBuy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },

    gotoList() {
      this.$router.push(
        this.fun.getUrl("o2oStore_v2", {
          store_id: this.store_id
        })
      );
    },
    //获取焦点时 商品数量
    clickCount(data) {
      this.OldGoodsNum = Number(data);
    },
    //失去焦点时
    changeCount(data, id, flag) {
      // console.log("失去焦点时",data, id,this.OldGoodsNum)
      let changeNum = Number(data);
      if (changeNum < 0) {
        Toast("商品数量不能为负数");
        this.getCart();
        return;
      }
      if ((changeNum == this.OldGoodsNum)) {
        return;
      }
      //console.log("oldNum",this.OldGoodsNum)
      if (changeNum < this.OldGoodsNum) {
        let lowerNum = this.OldGoodsNum - changeNum;
        //console.log("减少了",lowerNum)
        this.updateCart1(id, -lowerNum, flag);
      } else if (changeNum > this.OldGoodsNum) {
        let addNum = changeNum - this.OldGoodsNum;
        //console.log("增加了",addNum)
        this.updateCart1(id, addNum, flag);
      }
    },
    gotoMemberGradeList(o) {
      if (o == "1") {
        this.$router.push(this.fun.getUrl("MemberGradeList", {}));
      }
    },

    //==========================================================================================================
    getDetailData(index, tag) {
      // $http
      //   .post(
      //     "goods.goods.show-Push",
      //     {
      //       id: goods_id,
      //       mark: this.fun.getKey("mark"),
      //       mark_id: this.fun.getKey("mark_id")
      //     },
      //     ""
      //   )
      //   .then(response => {
      //     if (response.result === 1) {
      if (this.goods_info.content) {
        this.goodDetail.content = this.goods_info.content;
      }
      if (this.goods_info.show_push) {
        this.goodDetail.show_push = this.goods_info.show_push;
      }
      this.showPageB = true;
      if (tag) {
        this.$nextTick(() => {
          let jump = document.getElementsByClassName("section");
          setTimeout(() => {
            // 获取需要滚动的距离
            let total = jump[index].offsetTop - 50;
            // Chrome
            document.body.scrollTop = total;
            // Firefox
            document.documentElement.scrollTop = total;
            // Safari
            window.pageYOffset = total;
          }, 200);
        });
      }
      //   } else {

      //   }
      // })
      // .catch(err => {
      //   this.isPullUp = false;
      //   this.showPageB = false;
      //   this.showGood = true;
      //   console.log(err);
      // });
    },
    begTimeBtn() {
      this.isTime = true;
      this.isBegTime = false;
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop + 55;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    },
    throttleFn() {
      // 节流
      let that = this;
      let interval = 150;
      that.now = +new Date();
      if (that.last && that.now - that.last < interval) {
        clearTimeout(that.timer);
        that.timer = setTimeout(() => {
          that.last = that.now;
          that.dataScroll();
        }, interval);
      } else {
        that.last = that.now;
        that.dataScroll();
      }
    },
    handleTouchstart(e) {
      start = e.changedTouches[0].pageY;
    },
    handleTouchmove(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      const move_distance = last_distance + cur_move;
      if (last_distance > 0) {
        this.isPullUp = false;
        document.getElementById("main").style.cssText = `transition-duration:400ms;transform:translateY(0);`;
        last_distance = 0;
      } else if (move_distance < 0 && move_distance > -(0 + 65)) {
        document.getElementById("main").style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = false;
      } else if (move_distance <= -(0 + 65)) {
        document.getElementById("main").style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = true;
      }
    },
    handleTouchend(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      last_distance += cur_move;
      document.getElementById("main").style.cssText = `transition-duration:400ms;transform:translateY(0);`;
      if (last_distance > 0) {
        this.isPullUp = false;

        last_distance = 0;
      } else if (last_distance < 0 && last_distance > -(0 + 65)) {
        this.isPullUp = false;
        last_distance = 0;
      } else if (last_distance <= -(0 + 65)) {
        //切换到下一个页面
        console.log("切换到下一个页面");
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
        last_distance = 0;
        if (!this.showPageB) {
          this.getDetailData();
        }
      }
    },
    dataScroll() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
        //此处发起请求
        if (!this.showPageB) {
          console.log("触底了");
          document.getElementById("main").addEventListener("touchstart", this.handleTouchstart);
          document.getElementById("main").addEventListener("touchmove", this.handleTouchmove);
          document.getElementById("main").addEventListener("touchend", this.handleTouchend);
        }
      } else {
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
      }
    },
    jump(index) {
      if ((index == 2 || index == 3) && !this.showPageB) {
        this.getDetailData(index, true);
        return;
      }
      setTimeout(() => {
        this.$nextTick(() => {
          let jump = document.getElementsByClassName("section");
          // 获取需要滚动的距离
          let total = jump[index].offsetTop - 50;
          // Chrome
          document.body.scrollTop = total;
          // Firefox
          document.documentElement.scrollTop = total;
          // Safari
          window.pageYOffset = total;
        });
      }, 20);
    },
    loadSroll() {
      let that = this;
      var sections = document.getElementsByClassName("section");
      for (let i = sections.length - 1; i >= 0; i--) {
        if (that.scroll >= sections[i].offsetTop - 100) {
          that.currentClass = i;
          return;
        }
      }
    },
    FromTo(data) {
      // this.$router.push(this.fun.getUrl("GoodsComment", { id: goods_id }));
      if (!is_third_content) {
        this.getCommentData();
      } else {
        // this.showComment = true;
        // this.$emit("showComment", true);
        this.$store.commit("setShowComment", true);
      }
    },
    CloseComment() {
      // this.showComment = false;
      // this.$emit("showComment", false);
      this.$store.commit("setShowComment", false);
    },
    getLiveList(more) {
      let that = this;
      if (!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (more && this.live_page >= this.total_page) {
        that.showMoreLive = false;
        console.log("没有更多直播间数据！");
        return;
      } else {
        that.live_page = more ? that.live_page + 1 : 1;
        $http
          .post("goods.goods.get-room", { goods_id: that.$route.params.id, page: that.live_page }, "")
          .then(response => {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              if (!more && that.total_page >= 2) {
                that.showMoreLive = true;
              }
              that.recordsList = [...that.recordsList, ...response.data.data];
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getMemberPrice(_optionsId) {
      if (!_optionsId) return;
      this.specsVIPPrc = 0;
      $http
        .post("goods.other-info.option-vpi-price", { option_id: _optionsId }, null, true)
        .then(res => {
          if (res.result == 1) {
            this.specsVIPPrc = res.data.vip_price || null;
          } else {
            this.specsVIPPrc = null;
          }
        })
        .catch(error => {
          this.specsVIPPrc = null;
          console.log(error);
        });
    }
  },

  watch: {
    $route(to, from) {
      console.log(to);
      // 对路由变化作出响应...

      if (to.name == "goods" && from.name == "goods") {
        this.slider();
        this.goodTop = false;
        if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
          share_tag = this.fun.getKey("share_tag");
        }

        //初始化一下参数
        this.goodsInfo = {};
        this.isGoods = false;
        this.goodsCount = 1;
        this.popupSpecs2 = false;
        this.isGoodsLove = false;

        submitActionTag = "";
        optionsId = "";
        specsManage = [];
        optionsMaxCount = 1;

        this.cartsNum = 0;

        goods_id = this.$route.params.id;

        console.log("watch:", goods_id);
        this.is_o2o = true; // 就是门店商品

        //初始化客服参数
        this.initCservice("");
        //商品详情 初始化参数
        this.initData();

        this.getGoodsPage(this.goods_info_store);
        // this.getData(); //获取数据
        // this.isFavorite(); //获取是否收藏
        this.footSet(goods_id); //设置足迹数据
      }
    },
    "goods_info_store.member_cart"(newone, oldone) {
      this.getFirstCart(newone);
    },
    scroll() {
      this.loadSroll();
    }
  },

  components: { Swipe, SwipeItem, cMyswipe, cLive, cComment, cCommentlist, floatOrder, yzGoodsposter, invitation, DConnectCustomerService },

  computed: {
    minicartStyle: function() {
      if (this.showCart) {
        return "display: none;transform: translateY(-100%)";
      } else {
        return "display: block;transform: translateY(0)";
      }
    },
    leftPrice() {
      if (this.showCart) {
        return "transform: translateX(-60px);";
      }
    },
    showLogo: function() {
      if (this.showCart) {
        return "show";
      }
    },
    showComment() {
      return this.$store.state.isShomegGoodComment;
    }
  }
};
