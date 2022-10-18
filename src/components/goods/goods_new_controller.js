import U_backup from "components/new_diy/backup";
import goodSwipe from "components/goods/children/goodSwipe"; //轮播
import floatOrder from "components/goods/children/float_order"; // 订单飘窗
import countDown from "components/goods/children/countDown"; //倒计时
import priceTitleRepertorySales from "components/goods/children/priceTitleRepertorySales"; //标题。价格
import groupWork from "components/goods/children/plugin/groupWork"; //0.1元新拼团
import goodStep from "components/goods/children/goodStep"; //玩法步骤
import participateHistory from "components/goods/children/participateHistory"; // 拼团记录
import grabGroupResult from "components/goods/children/plugin/grabGroupResult"; //抢团结果流程步骤
import selfParameterServicetag from "components/goods/children/selfParameterServicetag"; //商品挂件列表
import groupList from "components/goods/children/plugin/groupList"; //开团列表
import snatchRegimentList from "components/goods/children/plugin/snatchRegimentList"; //抢团插件，抢团开团列表
import o2oModel from "components/goods/children/plugin/o2oModel"; //门店信息插件（门店拼团）
import zhpGroup from "components/goods/children/plugin/zhp-group-lottery"; //珍惠拼插件
import invitationAndLive from "components/goods/children/plugin/invitationAndLive"; //微贴和直播
import projectCard from "components/goods/children/plugin/projectCard"; //项目核销插件
import cFreightpricing from "components/goods/children/freightPricing"; //运费插件
import appointmentPlugin from "components/goods/children/plugin/appointment"; //预约商品
import producerM from "components/goods/children/plugin/producerM"; //厂家管理插件
import cComment from "components/goods/children/comment"; // 评论
import cCommentlist from "components/goods/children/commentList";
import guessLike from "components/goods/children/guessLike"; //猜你喜欢
import supplierModel from "components/goods/children/plugin/supplierModel"; //供应商插件
import goodSpecs from "components/goods/children/goodSpecs"; //规格弹窗
import goodsAction from "components/goods/children/goodsAction"; //商品导航
import groupTotal from "components/goods/children/groupTotal"; //小猪欢欢二期 拼团人数
import timeAppointment from "components/goods/children/timeAppointment";//分时预约

import { tabScroll } from "components/goods/children/mixin/tabScroll"; //计算顶部导航
var goods_id = "";
export default {
  props: ["goods_id", "goods_type", "parent_showBigImg", "goods_info", "is_room", "wx_video_link","fatherTitle"],
  mixins: [tabScroll], //计算顶部导航
  data() {
    return {
      showGood: false, //页面显示
      is_third_content: false,
      imgStart: 0,
      showBigImg: false,
      child_showBigImg: false,
      bigImages: [], //商品详情富文本图片预览
      service_QRcode: "",
      service_mobile: "",
      //live more
      isLoadMore: true,
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [], //直播间列表
      min_micro: [], //微社区帖子数组
      tabList: [], //微贴和直播
      // 初始评论页数
      commentPage: 1,
      // 是否有更多评论
      noMoreComment: false,
      //是否是o2o
      hoet: false,
      goodTop: false,
      popupSpecs: false,
      goodsInfo: {}, //get_goods数据
      goods_plugin: {}, // 插件的数据

      popStock: 0,
      goodsCount: 1,

      favorite: false,
      isGoods: false,
      cservice: "",
      //商品详情
      third_content: [],

      //底部margin值开关
      isMarginBottom: false,

      //是否租赁商品
      isRent: false,
      isRight: false,
      //立即购买
      isRentBuyShow: false,
      // isShowCellNumber: false, //是否显示已选

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

      //购物车id 门店拼团
      card_id: 0,
      isShowDetail: false, //是否展开商品详情
      // 滑动相关
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,

      // showComment: false,
      commentLimit: [], //评论组件，设置最新5条评论
      totalComment: "", //总评论数
      is_show_default_praise: 0, // 是否显示 默认好评已隐藏
      favorable_rate: "100%", //好评率
      goodDetail: {},  //猜你喜欢和详情数据

      timer: null, //throttleFn方法节流，减少性能开支
      freight_pricing: {}, //运费插件
      // 一口价的数据
      hasActivity: false,
      // 应用市场
      prdocut_market: {},
      //供应商
      supplierData: {},

      luck_draw: {}, //新抽奖抽奖luck-draw悬浮按钮
      isShow_memberDiscount: true, //会员折扣模块显隐
      isShow_brand: true, // 品牌介绍
      stepConfig: {}, //组件goodStep配置信息

      team: [], //抢团插件，开团列表数组
      btnFlag: false, //显示回到顶部
      btnData: {
        button_size: 40,
        over_top: 500,
        position_location: "right",
        icon_url: "https://www.yunzmall.com//min_img/icon-fontclass-zhiding.png"
      },
      // 海报按钮
      btnData2: {
        button_size: 40,
        over_top: 450,
        position_location: "right",
        icon_url: "https://www.yunzmall.com//min_img/bc_eweima.png"
      },

      producer_info: [], //厂家管理
      levelModel: 0, //新零售插件，代理销售等级
      isFavoriteIcon: false, //是否显示收藏
      is_handleScroll: 0, // 计算保存页面高度
      showParameter: false, //商品参数展示
      is_member_enter:true,
      isTimeAppiont:false
    };
  },
  activated() {
    this.initPages(); //页面初始化配置
  },
  mounted() {
    this.initPages(); //页面初始化配置
  },
  watch: {
    scroll() {
      this.loadSroll();
    },
    parent_showBigImg(newValue){
      if(!newValue) {
        this.child_showBigImg = false;
      }
    }
  },
  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);

    document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
    document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
    document.getElementById("main").removeEventListener("touchend", this.handleTouchend);

    window.removeEventListener("scroll", this.throttleFn);
    let arrinfo = {
      id: Number(goods_id),
      top: this.is_handleScroll
    };
    if (window.scrollArr.length < 3) {
      window.scrollArr.push(arrinfo);
    } else {
      console.log("删了第一个，直接插入最后一个-------------------------");
      window.scrollArr.shift();
      window.scrollArr.push(arrinfo);
    }
  },
  computed: {
    showComment() {
      return this.$store.state.isShomegGoodComment;
    },
    appointmentLang() {
      if (this.$store.state.shopLanguage.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  },
  methods: {
    initPages() {
      this.is_member_enter = this.goods_info.get_goods && this.goods_info.get_goods.is_member_enter == 1?true:false;
      let noRequestName = ["GroupGoods", "grab_group", "managementGoods", "newRetailSalesGood", "zhpGroup", "groupWorkGood"];
      if (noRequestName.indexOf(this.goods_type) > -1) {
        //在组件内独立请求详情页数据，后面接口优化整合
        this.getComponentData(); //获取数据
      } else {
        this.initComponents();
        this.isFavoriteIcon = true;
      }
      // if (this.goods_type == "supplierGoods" || this.goods_type == "goods") {
      //   this.isShowCellNumber = true;
      // }
      if(this.goods_type == 'reserve_simple_goods'){
        this.isTimeAppiont = true;
      }
      this.handleScroll();
      for (let iterator of window.scrollArr) {
        if (iterator.id == goods_id) {
          if (iterator.top > 0) {
            this.getDetailData();
            setTimeout(() => {
              window.scrollTo(0, iterator.top);
            }, 100);
          }
        }
      }
    },
    // 监听滚动条
    handleScroll() {
      window.addEventListener("scroll", this.windowScroll);
    },
    windowScroll() {
      let scroll = document.documentElement && document.documentElement.scrollTop;
      this.is_handleScroll = scroll;
    },
    getComponentData() {
      // key: this.goods_type
      // value: 对应调用的Methob
      let enums = new Map([
        ["GroupGoods", "getComponent_groupGoods"],
        ["grab_group", "getComponent_grabGroup"],
        ["managementGoods", "getComponent_managementGoods"],
        ["newRetailSalesGood", "getComponent_newRetail"],
        ["zhpGroup", "getComponent_zhpGroup"],
        ["groupWorkGood", "getComponent_groupWork"]
      ]);
      let handleType = enums.get(this.goods_type);
      this[handleType]();
    },
    // 拼团组件 start =================
    getComponent_groupGoods() {
      let that = this;

      this.stepConfig = {
        title: "拼团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数顺利成团"]
      };

      this.activity = this.$route.params.id; //
      this.fight_groups = this.$route.query.fight_groups !== undefined ? this.$route.query.fight_groups : "";
      let json = {};
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.id = this.$route.params.id;
        json.fight_groups_goods_id = that.fight_groups;
      } else {
        json.id = this.$route.params.id;
      }
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.get-goods";
      if (this.$route.params.store_id && Number(this.$route.params.store_id) != 0) {
        json.store_id = this.$route.params.store_id;
        _url = "plugin.fight-groups.frontend.store.frontend-fight-groups-goods.get-goods";
      }
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            this.goods_info = response.data;
            this.goods_info.get_goods = response.data.goods_info;
            this.goodsInfo = response.data.goods_info;
            this.initComponents();
            this.goods_id = this.goodsInfo.id;
            goods_id = this.goodsInfo.id;
            this.favorable_rate = response.data.goods_info.favorable_rate ? response.data.goods_info.favorable_rate : null;
            this.commentLimit = response.data.goods_info.favorable_rate ? response.data.goods_info.get_comment.data : [];
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.fun.isTextEmpty(this.goods_info.share_title) ? this.goods_info.title : this.goods_info.share_title,
                imgUrl: this.goodsInfo.thumb,
                description: this.goods_info.share_content
              }
            );
            if (that.goods_info.is_lottery && that.goods_info.lottery_desc) {
              that.goods_info.lottery_desc = that.goods_info.lottery_desc.replace(/\n/g, "<br>");
            }
            // 客服
            if (response.data.store) {
              this.service_QRcode = response.data.store.service_QRcode;
              this.service_mobile = response.data.store.service_mobile;
              this.cservice = response.data.store.cservice;
            }
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    showGroupList() {
      //显示参团列表组件
      if (this.goods_info.display_team.length == 0) {
        this.$toast("抱歉，暂无更多可参与的团");
        return;
      }
      this.$refs.groupList.showGroupMore();
    },
    // 抢团组件  ==========

    // 抢团插件  =========================
    getComponent_grabGroup() {
      let that = this;
      let json = {
        art: "goodsDetail",
        goods_id: this.$route.params.id
      };
      this.stepConfig = {
        title: "抢团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数抢团"]
      };
      $http.get("plugin.snatch-regiment.api.index.getSnatchData", json, "").then(
        response => {
          this.showGood = true;
          if (response.result === 1) {
            this.goods_info = response.data.goodsDetail;
            this.goods_info.get_goods = response.data.goodsDetail.goods;
            this.goodsInfo = this.goods_info.get_goods;
            this.goodsInfo.price = this.goodsInfo.price_num;
            this.initComponents();
            this.team = response.data.goodsDetail.team;
            this.cservice = response.data.goodsDetail.custom_service;
            this.goods_info.get_goods.thumb = [response.data.goodsDetail.goods.thumb];
            this.commentLimit = response.data.goodsDetail.comment.data;
            this.leader_partake = response.data.goodsDetail.leader_partake;
            this.istimestamp = this.timestamp < this.goods_info.get_goods.start_time ? Number(this.goods_info.get_goods.start_time) : Number(this.goods_info.get_goods.end_time);
            this.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid(), goods_id: goods_id },
              {
                title: that.fun.isTextEmpty(that.goods_info.get_goods.share_title) ? that.goods_info.get_goods.title : that.goods_info.get_goods.share_title,
                imgUrl: that.fun.isTextEmpty(that.goods_info.get_goods.share_thumb) ? that.goods_info.get_goods.thumb[0] : that.goods_info.get_goods.share_thumb,
                description: that.fun.isTextEmpty(that.goods_info.get_goods.share_desc) ? "邀请您加入抢团活动" : that.goods_info.get_goods.share_desc
              }
            );
            console.log("limit_num=======", this.goodsInfo.limit_num);
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    //厂家管理插件  ==============
    getComponent_managementGoods() {
      let that = this;
      let json = {
        id: this.$route.params.id,
        producer_id: this.$route.params.kid
      };
      $http.post("plugin.producer.frontend.goods.getGoodsPage", json, " ").then(
        function(res) {
          if (res.result === 1) {
            if (res.data.get_goods.plugin_id == 44) {
              const jd_iframe = document.createElement("script");
              jd_iframe.type = "text/javascript";
              jd_iframe.src = "https://open.jxhh.com/iframechild.js";
              document.body.appendChild(jd_iframe);
            }
            that.producer_info = res.data.producer_info;
            that.goods_info = res.data;
            that.is_room = res.data.is_room ? res.data.is_room : 0;
            that.initComponents();
            console.log("goods_type", that.goods_type);
          } else {
            that.$dialog.alert({ message: res.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        function(res) {
          console.log(res);
        }
      );
    },

    //新零售插件  ====================
    getComponent_newRetail() {
      $http
        .post(
          "plugin.new-retail.frontend.index.goodsDetail",
          {
            goods_id: this.$route.params.id,
            is_retail_goods: this.$route.params.mode
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.goods_info = response.data.goods;
            this.goods_info.get_goods = response.data.goods;
            this.goodsInfo = this.goods_info.get_goods;
            this.initComponents();
            this.commentLimit = response.data.goods.comment.data;
          } else {
            this.$toast.fail({
              message: response.msg,
              onClose: () => {
                if (window.history.length <= 1) {
                  this.$router.push(this.fun.getUrl("home", {}));
                } else {
                  this.$router.go(-1);
                }
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickLevelModel(item) {
      // 点击等级套餐,数量、价格变为套餐设定的
      this.$refs.goodSku.popPrice = item.level_unit_total_price;
      this.$refs.goodSku.goodsCount = item.level_num;
    },

    //珍惠拼插件（zhp-group-lottery）
    getComponent_zhpGroup() {
      //拼团活动id
      $http
        .post("plugin.zhp-group-lottery.frontend.goods.get-goods", { id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            goods_id = response.data.goods_id;
            this.goods_info = response.data;
            this.initComponents();
            if (response.data.start_time) {
              //活动未开始才返回 start_time
              this.timeCompare(response.data.start_time);
            } else if (response.data.end_time) {
              //活动进行中才返回end_time
              let timestamp = Date.parse(new Date()) / 1000;
              if (timestamp < response.data.end_time) this.isTime = true;
            }
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.goods_info.title,
                imgUrl: this.goods_info.get_goods.thumb,
                description: ""
              }
            );
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //0.1元拼团
    getComponent_groupWork() {
      this.stepConfig = {
        title: "拼团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数顺利成团"]
      };
      $http
        .post("plugin.group-work.frontend.modules.goods.controllers.detail.index", { record_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            goods_id = response.data.goods_id;
            this.goods_info = response.data;
            this.goods_info.get_goods = response.data.goods_info;
            this.goodsInfo = this.goods_info.get_goods;
            console.log(this.goods_info);
            this.initComponents();
            if (response.data.start_time) {
              //活动未开始才返回 start_time
              this.timeCompare(response.data.start_time);
            } else if (response.data.end_time) {
              //活动进行中才返回end_time
              let timestamp = Date.parse(new Date()) / 1000;
              if (timestamp < response.data.end_time) this.isTime = true;
            }
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.goods_info.share_title,
                imgUrl: this.goods_info.get_goods.thumb,
                description: this.goods_info.share_content
              }
            );
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    deactivatedShowGood() {
      this.showGood = false;
    },
    initComponents() {
      this.posterShow = false;
      this.goodTop = false;

      this.supplierData = { id: 0 };

      //门店购物车id
      this.card_id = this.$route.params.cartId;
      goods_id = this.$route.params.id;

      //初始化客服参数
      this.initCservice("");
      //商品详情 初始化参数
      this.initData();

      // 处理data的数据
      this.getGoodsPage(this.goods_info);

      if (this.is_room == 1) {
        this.getLiveList();
      }
      this.$nextTick(() => {
        window.addEventListener("scroll", this.throttleFn);
      });
    },
    //初始化客服参数
    initCservice(newCservice, QRcode, mobile) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        if (!this.fun.isTextEmpty(QRcode)) {
          this.service_QRcode = QRcode;
        }
        if (!this.fun.isTextEmpty(mobile)) {
          this.service_mobile = mobile;
        }
      }
    },
    //初始化商品详情参数
    initData() {
      this.showGood = false;
      //初始化一下参数
      this.showBigImg = false;
      this.$emit('setShowBigImg',this.showBigImg);
      this.goodsInfo = {};
      this.goods_plugin = {};
      this.isGoods = false;
      this.goodsCount = 1;
      this.popupSpecs = false;
      this.isGoodsLove = false;
      this.isMarginBottom = false;

      this.isRent = false;

      this.isRentBuyShow = false;
      this.commentPage = 1; //由于首次进来执行getCommentData后该参数已经变为2，所以在每次进入需要先初始化这个参数为1，否则会获取不到数据

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      // this.showComment = false;
      this.showPageB = false;
      this.recordsList = [];
      this.min_micro = [];
      this.tabList = [];
      this.prdocut_market = {};

      this.configShow(); //处理组件模块显隐条件集合方法

      this.service_mobile = "";
      this.service_QRcode = "";
      this.cservice = "";
      this.firstActivityCon = "";

      this.is_third_content = false;

      this.firstActivityCon = "";
      this.third_content = [];

      this.isAddCart = false;

      this.posterImg = null;

      this.isRentBuyShow = false;
      this.beginTime = 0;

      this.endTime = 0;

      this.endTimeStr = "";

      this.isBuy = false;

      this.isBegTime = false;
      this.showPageB = false;
      this.isPullUp = false;
    },
    configShow() {
      if (this.goods_type == "hotelGoods" || this.goods_type == "GroupGoods" || this.goods_type == "zhpGroup") {
        this.isShow_memberDiscount = false;
      }
      if (this.goods_type == "hotelGoods" || this.goods_type == "GroupGoods" || this.goods_type == "zhpGroup") {
        this.isShow_brand = false;
      }
    },
    getGoodsPage(data) {
      // data全部数据
      this.getData(data.get_goods);

      // 数据更改plugin
      this.goods_plugin = data.plugin || {};

      if (data.customer_service) {
        // 客服
        this.service_QRcode = data.customer_service.service_QRcode;
        this.service_mobile = data.customer_service.service_mobile;
        this.cservice = data.customer_service.cservice;
      }

      this.luck_draw = data.plugin ? data.plugin.luck_draw : data.luck_draw || {};

      this.slider();
      if (data.is_favorite) {
        this.favorite = data.is_favorite.status == 1 ? true : false;
      }
      if (data.plugin && data.plugin.freight_pricing) {
        this.freight_pricing = data.plugin.freight_pricing || {};
      }

      // 租赁商品
      if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy)) {
        this.isRent = this.goods_plugin.lease_toy.is_lease == 1 ? true : false;
        this.isRentBuyShow = this.goods_plugin.lease_toy.immed_goods_id == 0 ? false : true;
        if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy.is_rights)) {
          this.isRight = this.goods_plugin.lease_toy.is_rights == 1 ? true : false;
        }
      }

      console.log("isRent222:", this.isRent);
      console.log("isRentBuyShow11:", this.isRentBuyShow);

      if (this.goods_plugin.prdocut_market) {
        // 应用市场
        this.prdocut_market = this.goods_plugin.prdocut_market;
      }

      // 一口价
      if (this.goods_plugin.pack_fixed_price && this.goods_plugin.pack_fixed_price.id) {
        this.hasActivity = true;
      } else {
        //商品未参加一口价
        this.hasActivity = false;
      }

      if (this.goods_info.plugin && this.goods_info.plugin.micro_communities) {
        let num_list = [];
        for(let i=0;i<this.goods_info.plugin.micro_communities.list.length; i++) {
          num_list.push(this.goods_info.plugin.micro_communities.list[i].has_many_image.length);
        }

        //计算最长的图片数组长度   不断递归整合到this.min_micro
        let maxLength = Math.max(...num_list);
        let index = 0;

        this.handleMicro(index, maxLength - 1);

        // this.min_micro再重新分成6张一组
        let list = [];
        for(let i=0;i<this.min_micro.length;) {
          list.push(this.min_micro.slice(i, i + 6));
          i += 6;
        }
        this.min_micro = list;
        if(this.min_micro.length > 0) {
          this.tabList.push({id: 1,name: '关联微贴'});
        }

      }

      this.$nextTick(()=>{
        this.showGood = true;
      });
    },
    handleMicro(index, maxLength) {
      // 处理微社区帖子的图片数据
      let img_list = [];
      for(let i=0;i<this.goods_info.plugin.micro_communities.list.length; i++) {
        if(this.goods_info.plugin.micro_communities.list[i].has_many_image && this.goods_info.plugin.micro_communities.list[i].has_many_image[index]) {
          img_list.push(this.goods_info.plugin.micro_communities.list[i].has_many_image[index]);
        }
      }
      this.min_micro.push(...img_list);
      if(index < maxLength && this.min_micro.length < 12) {
        index++;
        this.handleMicro(index, maxLength);
      }
    },
    //处理get_goods数据
    getData(data) {
      this.goodsInfo = data;
      if(data.detail_show == '0'){
        this.showPageB = false;
      }else{
        this.getDetailData();
        this.showPageB = true;
      }
      if (this.fun.getPhoneEnv() == 3) {
        this.getDetailData();
        this.showPageB = true;
      }

      if (this.goods_info.get_goods.plugin_id == 44) {
        this.getJHSupplier();
      }

      if (this.goods_info.get_goods.plugin_id == 120) {
        this.getYZSupplier();
      }

      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid(), goods_id: goods_id },
        {
          title: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_title ? this.goodsInfo.has_one_share.share_title : this.goodsInfo.title,
          imgUrl: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_thumb ? this.goodsInfo.has_one_share.share_thumb : this.goodsInfo.thumb,
          description: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_desc ? this.goodsInfo.has_one_share.share_desc : ""
        },
        data => {
          if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
            this.initCservice(data.shop.shop.cservice); //客服重新赋值
          }
        }
      );
      if (data.comment) {
        this.commentLimit = data.comment.data;
        this.totalComment = data.comment.total_summary ? data.comment.total_summary : 0;
      } else if (data.get_comment) {
        this.commentLimit = data.get_comment.data;
        this.totalComment = data.get_comment.total_summary ? data.get_comment.total_summary : 0;
        this.is_show_default_praise = data.get_comment.is_show_good_reputation_text;
      }

      if (this.goodsInfo.show_push) {
        // 猜你喜欢
        let list = [];
        for(let i=0;i<this.goodsInfo.show_push.length;) {
          list.push(this.goodsInfo.show_push.slice(i, i + 6));
          i += 6;
        }
        this.goodDetail.show_push = list;
      }

      this.favorable_rate = data.favorable_rate;
      this.isGoods = true;

      try {
        wx.miniProgram && wx.miniProgram.postMessage({
          data: { goods_title: this.goodsInfo.title }
        });
      } catch (error) {
        console.log('wx.miniProgram：：：error',error);
      }

      this.isMarginBottom = this.fun.isTextEmpty(data.show_push) ? false : true;

      //限时购
      if (!this.fun.isTextEmpty(data.has_one_goods_limit_buy)) {
        this.isBuy = data.has_one_goods_limit_buy.status == 1 ? true : false;
        this.beginTime = data.has_one_goods_limit_buy.start_time;

        if (this.isBuy) {
          this.timeCompare(this.beginTime);
        }

        console.log("isTime:", this.isTime);

        this.endTime = new Date(parseInt(data.has_one_goods_limit_buy.end_time) * 1000);
        this.endTimeStr = String(this.endTime);
      }
      console.log("isBuy:", this.isBuy);

      //供应商
      if (data.supplier) {
        this.supplierData = data.supplier;
      }
    },
    getDetailData(index, tag) {
      // 商品详情处理
      if (this.goodsInfo.content) {
        let str = this.goodsInfo.content.replace(/src=\"http:/gi, 'src="https:');
        this.goodDetail.content = str;
      }
      this.bigImages = this.getImgSrc(this.goodsInfo.content);
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
    },
    getJHSupplier() {
      let that = this;
      //聚合供应链的商品 根据用户默认地址判断是否有库存可购买，如果没库存不满足购买条件可提示或下单按钮灰色。
      $http.get("plugin.jd-supply.frontend.goods.option", { goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            let options_address = response.data;
            that.getArrEqual(options_address, that.goodsInfo.has_many_options);
          }
        });
    },
    getYZSupplier() {
      //芸众供应链的商品 根据用户默认地址判断是否有库存可购买，如果没库存不满足购买条件可提示或下单按钮灰色。
      $http.get("plugin.yz-supply.frontend.goods.option", { goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            let options_address = response.data;
            this.getArrEqual(options_address, this.goodsInfo.has_many_options);
          }
        });
    },
    getArrEqual(arr1, arr2) {
      //聚合供应链的商品，plugin.jd-supply.frontend.goods.option接口返回为1的才去取库存，返回为0的就库存直接是0
      for (let i = 0; i < arr2.length; i++) {
        if (arr1[arr2[i].id] == 0) {
          this.goodsInfo.has_many_options[i].stock = 0;
        }
      }
      this.popStock = this.goodsInfo.has_many_options[0].stock; //设置库存
    },
    //获取时间-限时购
    timeCompare(begin) {
      let beginTime = parseInt(begin) * 1000;

      let now = Date.parse(new Date());
      // console.log(parseInt(begin) * 1000);
      // console.log(now, beginTime);
      if (now >= beginTime) {
        this.isTime = true;
      } else {
        this.isTime = false;
        this.isBegTime = true;
        this.begTimeStr = String(beginTime - now);
      }
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;

        that.hoet = top <= 40 ? false : true;
        that.btnFlag = top > 120 ? true : false;

        //滑动到底部禁止反弹
        if (document.documentElement.scrollHeight == document.documentElement.clientHeight + top) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);
          document.addEventListener("touchmove", this.move, false);
        }
      };
    },
    getLiveList(more) {
      if (!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (more && this.live_page >= this.total_page) {
        this.showMoreLive = false;
        console.log("没有更多直播间数据！");
      } else {
        this.live_page = more ? this.live_page + 1 : 1;
        $http
          .post("goods.goods.get-room", { goods_id: this.$route.params.id, page: this.live_page }, "")
          .then(response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              if (!more && this.total_page >= 2) {
                this.showMoreLive = true;
              }
              let list = [];
              for(let i=0;i<response.data.data.length;) {
                list.push(response.data.data.slice(i, i + 2));
                i += 2;
              }
              this.recordsList = [...this.recordsList, ...list];
              if(this.recordsList.length > 0) {
                this.tabList.push({id: 2,name: '直播间'});
              }

            } else {
              this.$toast(response.msg);
            }
          });
      }
    },

    move(event) {
      // 判断默认行为是否可以被禁用
      if (event.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    begTimeBtn() {
      this.isTime = true;
      this.isBegTime = false;
    },
    timeEnd() {
      this.goods_info.status = "2";
    },
    FromTo(data) {
      // this.$router.push(this.fun.getUrl("GoodsComment", { id: goods_id }));
      // if (!this.is_third_content) {
      //   this.getCommentData();
      // } else {
      //   // this.showComment = true;
      //   // this.$emit("showComment", true);
      //   this.$store.commit("setShowComment", true);
      // }
      this.$router.push(this.fun.getUrl("goodsComment",{gid:goods_id,istype:'comment'}));
    },
    //获取评论数据
    // getCommentData() {
    //   let that = this;
    //   let json = {
    //     goods_id: goods_id,
    //     page: this.commentPage
    //   };
    //   $http.get("goods.comment.get-comment", json, "获取中...").then(
    //     (response)=> {
    //       if (response.result === 1) {
    //         if (response.data.data.length < 20) {
    //           that.noMoreComment = true;
    //         }
    //         that.commentPage += 1;
    //         if (!that.third_content) {
    //           that.third_content = [];
    //         }
    //         that.third_content = [...that.third_content, ...response.data.data];
    //         // that.showComment = true;
    //         this.is_third_content = true;
    //         // that.$emit("showComment", true);
    //         that.$store.commit("setShowComment", true);
    //         // that.third_content = response.data.data;
    //       } else {
    //         this.is_third_content = false; //复位
    //       }
    //     },
    //     (response)=> {
    //       this.is_third_content = false; //复位
    //       console.log(response);
    //     }
    //   );
    // },
    CloseComment() {
      // this.showComment = false;
      this.$store.commit("setShowComment", false);
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype, cardId, optionsMaxCount, level_id, option_level_id) {
      // 选择规格
      // optionsId = _optionsId;
      this.goodsCount = goodsCount;
      this.popupSpecs = false;
      if (clicktype == 1) {
        //clicktype == 1 点击确认按钮
        // level_id 拼团层级id
        //点击确认按钮
        if (this.goods_type == "grab_group" && this.$refs.goodSku.popPrice == 0) {
          this.$dialog.alert({ message: "开团/参团金额不正确，不能为0" });
          return;
        }
        if (this.goods_type == "newRetailSalesGood") {
          if (this.$refs.goodSku.popPrice == 0 || this.goodsInfo.price == 0) {
            this.$toast("价格设置有误，请联系客服！");
            return;
          }
          if (this.$route.params.mode == 2 && this.levelModel == 0) {
            this.$toast("请选择等级套餐！");
            return;
          }
          this.$refs.goodsAction.levelModel = this.levelModel;
        }

        this.$refs.goodsAction.submitAction(_optionsId, goodsCount, cardId, optionsMaxCount, level_id, option_level_id);
      }
    },
    pushCart(item){
      $http.post("member.member-cart.store", { goods_id: item.goods_id,total:'1',option_id:item.goods_option_id }).then(
        response => {
          if (response.result == 1) {
            this.$toast(response.msg);
          }else{
            this.$toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    popupModeshowChild(data) {
      // 规格组件弹窗显隐
      this.popupSpecs = data;
    },
    // 立即购买
    buyNow() {
      this.$refs.goodsAction.buyNow();
    },
    showCustomer() {
      //显示客服
      this.$refs.goodsAction.clickChat();
    },
    setShowBigImg(data) {
      this.child_showBigImg = data;
      this.$emit('setShowBigImg',data);
    },
    // 分时预约组件数据
    getTimeAppointment(e){
      console.log(e);
      this.$refs.goodsAction.reserveData = e;
    },
    // 处理富文本图片
    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName == "IMG" && $event.target.parentElement.nodeName !== "A") {
          for (let i = 0; i < this.bigImages.length; i++) {
            // 编程式
            if ($event.target.currentSrc.indexOf(this.bigImages[i]) > -1) {
              this.imgStart = i;
              this.showBigImg = true;
              this.$emit('setShowBigImg',this.showBigImg);
              return;
            }
          }
        }
      }
    },
    getImgSrc(richtext) {
      let imgList = [];
      richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },
    // 收藏
    onFavorite(e) {
      this.$refs.goodsAction.onFavorite(e);
    },
    changeFavorite(e) {
      this.favorite = e;
    },
    postShow() {
      // 显示海报
      this.$nextTick(()=> {
        this.$refs.priceTitleRepertorySales.postShow();
      });
    },
    //APP分享
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
    appSharesinit() {
      // app获取分享数据中的data.shop.shop.name
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
      let _title,
        _imgUrl,
        _desc = "";
      let _link = document.location.href + "&share_tag=2";
      _link = this.fun.isMid(_link, uid);
      try {
        if (this.$route.name == "GroupGoods") {
          // 拼团插件分享
          _title = this.fun.isTextEmpty(this.goods_info.share_title) ? this.goods_info.title : this.goods_info.share_title;
          // _link = this.goods_info.share_url;
          _imgUrl = this.goodsInfo.thumb;
          _desc = this.goods_info.share_content;
        }else if (this.$route.name == "grab_group") {
          // 抢团插件分享
          _title = this.fun.isTextEmpty(this.goods_info.get_goods.share_title) ? this.goods_info.get_goods.title : this.goods_info.get_goods.share_title;
          _imgUrl = this.fun.isTextEmpty(this.goods_info.get_goods.share_thumb) ? this.goods_info.get_goods.thumb[0] : this.goods_info.get_goods.share_thumb;
          _desc = this.fun.isTextEmpty(this.goods_info.get_goods.share_desc) ? "邀请您加入抢团活动" : this.goods_info.get_goods.share_desc;
        } else if (this.goods_type == "groupWorkGood") {
          _title = this.goods_info.share_title;
          _imgUrl = this.goods_info.get_goods.thumb;
          _desc = this.goods_info.share_content;
        } else {
          _title = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_title) ? this.goodsInfo.title : this.goodsInfo.has_one_share.share_title;
          _imgUrl = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_one_share.share_thumb;
          _desc = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_desc) ? (data && data.shop ? data.shop.shop.name:'') : this.goodsInfo.has_one_share.share_desc;
        }
      }catch (e) {
        console.log(e);
        _title = this.goodsInfo.title;
        _imgUrl = this.goodsInfo.thumb;
        _desc = this.goodsInfo.title;
      }


      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/${window.location.href.match(/#\/(\S*)\?/)[1]}?i=${this.fun.getKeyByI()}&mid=${uid}`, // 分享链接
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

    // 跳转
    goto() {
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    gotoLuckDraw() {
      this.$router.push(this.fun.getUrl("luckyDraw", { tag: "activity" }, { gid: this.$route.params.id }));
    },
    //品牌跳转
    toBrandDetail(val) {
      this.$router.push(this.fun.getUrl("GoodsBrand", { id: val }));
    },
    // 群活码跳转
    toGroupCode() {
      if(this.goods_plugin.group_code.jump_mode === 'home') {
        this.$router.push(this.fun.getUrl("groupCode"));
      }else if(this.goods_plugin.group_code.code_url){
        window.location.href = this.goods_plugin.group_code.code_url;
      }
    },
    //租赁立即购买
    toRentBuy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    // gotoList() {
    //   this.$router.push(
    //     this.fun.getUrl("o2oStore_v2", {
    //       store_id: this.$route.params.store_id
    //     })
    //   );
    // },
    //跳转评论详情
    // toContentInfo(data) {
    //   this.$router.push(
    //     this.fun.getUrl("CommentDetails", {
    //       order_id: data.order_id,
    //       goods_id: data.goods_id,
    //       comment_id: data.id,
    //       uid: data.uid
    //     })
    //   );
    // },

  },
  components: {
    U_backup,
    goodSwipe,
    floatOrder,
    countDown,
    priceTitleRepertorySales,
    groupWork,
    goodStep,
    participateHistory,
    grabGroupResult,
    selfParameterServicetag,
    groupList,
    snatchRegimentList,
    o2oModel,
    zhpGroup,
    invitationAndLive,
    projectCard,
    cFreightpricing,
    appointmentPlugin,
    producerM,
    cComment,
    cCommentlist,
    guessLike,
    supplierModel,
    goodSpecs,
    goodsAction,
    groupTotal,
    timeAppointment
  }
};