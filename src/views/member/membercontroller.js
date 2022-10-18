//新装修
import U_memberasset from "components/new_diy/memberasset";
import U_membermarket from "components/new_diy/membermarket";
import U_membermerchant from "components/new_diy/membermerchant";
import U_memberorder from "components/new_diy/memberorder";
import U_memberrights from "components/new_diy/memberrights";
import U_membertool from "components/new_diy/membertool";
import U_membertop from "components/new_diy/membertop";
import U_tabcontrol from "components/new_diy/tabcontrol.vue";
import U_article from "components/new_diy/article.vue";
import U_community from "components/new_diy/community.vue";
import U_goods from "components/new_diy/goods.vue";
import U_goodsrush from "components/new_diy/goodsrush.vue";
import U_livestreaming from "components/new_diy/livestreaming.vue";
import U_shortvideo from "components/new_diy/shortvideo.vue";
import U_stores from "components/new_diy/stores.vue";
import U_bonuspool from "components/new_diy/bonusPoolsShow";
import fight_group from "components/member/fight_group.vue";

// import QRCode from 'qrcode';
import emptyImage from "@/assets/images/new_diy/image.png";
import { Toast } from "vant";
import html2canvas from "html2canvas";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
// import Fun from "../../fun";

// let isMCreated = 0;
window.memberAdvertisement = 1; //弹出周期设置为关闭网页(弹窗广告)
const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      mainCommentShow: false,
      emptyImage,
      // 新的默认模板
      order_active: "1",
      plugin_active: "1",
      order_list: [],
      pluginsList: [],
      plugin_handle_list: [],
      plugins_data: [],
      swiperOption: {
        autoplay: false,
        // loop: true,   loop模式第二轮循环的时候第一张会闪烁
        delay: 3000,
        observer: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      service: "",
      buttonClientWidth: "",
      showPopup: false,

      show_member_id: "",
      member_agent: "", // 客户自定义名称
      // 华侨币
      // coin: false,
      // coin_name: "",

      // 是否开启关系链
      relation_switch: false,
      // 二维码
      qrcode: "",
      allLoaded: false,
      // 刷新组件的运行状态
      topStatus: "",
      // 余额
      balance_value: "0.00",
      // 积分
      integral: "",
      // 优惠券
      coupon: {},
      // 会员名字
      username: "",
      // 头像
      avatar: "",
      // 余额
      credit: "",
      // 版权
      copyright: "",
      //版权图片
      copyrightImg: "",
      // 会员等级
      level_name: "",
      mobile: "",
      nickname: "",
      uid: "",

      // 海报
      poster: "",
      poster_Data: {
        poster_data: null,
        background: {}
      },
      poster_id: null, //海报id

      store_set: {
        is_cash_pay: "",
        is_open_cashier: "",
        is_write_information: ""
      },

      // is_custom: false, // 自定义参数
      // custom_title: "", // 自定义title
      custom_value: "", // 自定义值

      // is_validity: false, // 会员等级时间限制
      validity_value: "", // 会员等级时间限制 数据

      is_stroeWithdraw: false, // 门店提现

      // 供应商申请
      supplier_id: "",

      // 邀请码
      inviteCode: "",
      isshowInvit: "",
      // 是否是推广员
      isGeneralize: "",
      // 会员等级是否可点击
      isMemberGrade: false,
      // 爱心值
      love_obj: {},
      integral_show: {},

      template: "",
      // 酒店订单显示
      // is_hotel: false,
      // 酒店订单
      // hotel_order: {},
      // 酒店自定义名称
      // PageNameList: {},

      //装修
      designer: {},
      showDiy: [],
      designerStatus: false,
      member_order: {},
      // 当前的会员model
      member_item: {},
      wechat_login_mode: false,

      //提现字样
      // name_of_withdrawal_text: "",
      loadingImg: true,

      //H5端没有做的入口
      notShow: ["coupons_qrcode", "kart"],

      // 新装修数据
      isDecorate: false, //是否新装修
      clientWidth: "375",
      id: "M" + new Date().getTime(),
      popShow: false,
      advertising: {},
      components: [],
      page_id: "",
      isBottom: false,
      btnFlag: false,

      posterShow: false,
      isNewPosterPlugin: false, //是否为新海报插件
      toastPoster: null,
      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: "",

      // 默认组件数据
      btnData: {
        button_size: 40,
        over_top: 550,
        position_location: "right",
        icon_url: ""
      },
      goodsData: {
        preview_color: "#f5f5f5",
        sort_style: {
          choose_icon: "2"
        },
        padding_top: 0,
        padding_bottom: 0,
        padding_left: 10,
        padding_right: 10,
        item_radius: 5,
        show_shadow: false,
        show_border: false,
        border_color: "#BFB7B7",
        good_tag: {
          choose_icon: "0",
          image: ""
        },
        button_type: "3",
        button_title: "立即购买",
        button_bg_color: "#ff2c29",
        button_color: "#ffffff",
        content_list: ["1", "3", "4", "7"],
        show_price_text: false,
        disable_good: "0",
        goods_type: "list"
      },
      limitData: {
        preview_color: "#f5f5f5",
        sort_style: {
          choose_icon: "2"
        },
        padding_top: 0,
        padding_bottom: 0,
        padding_left: 10,
        padding_right: 10,
        item_radius: 5,
        show_shadow: false,
        show_border: false,
        border_color: "#BFB7B7",
        good_tag: {
          choose_icon: "0",
          image: ""
        },
        button_type: "3",
        button_title: "立即购买",
        button_bg_color: "#ff2c29",
        button_color: "#ffffff",
        content_list: ["1", "3", "4", "7"],
        show_price_text: false,
        disable_good: "0",
        goods_type: "list"
      },
      articleData: {
        get_style: "1",
        get_number: 999,
        article_style: "2",
        article_bg: "#f5f5f5",
        show_tab: true,
        article_tab_bg: "#ffffff",
        title_color: "#333",
        title_active_color: "#ff2c29"
      },
      storeData: {
        get_number: 999,
        preview_color: "#f5f5f5",
        font_size: 14,
        font_color: "#666666",
        border_radius: 35,
        class_font_size: 14,
        class_font_color: "#ffffff",
        class_bg_color: "#adadad",
        class_border_radius: 5,
        location_font_size: 14,
        location_font_color: "#666666",
        discount_font_size: 14,
        discount_title_color: "#ff2c29",
        discount_font_color: "#666666",
        discount_list: ["1", "2", "3", "4"],
        tag_font_size: 14,
        tag_font_color: "#666666",
        tag_bg_color: "#f3f2f2",
        tag_border_color: "#ff8400",
        tag_border_radius: 5,
        show_goods: true,
        tab_list: [],
        tab_bg_color: "#ffffff",
        tab_color: "#333333",
        tab_active_color: "#ff8400"
      },
      communityData: {
        get_style: "1",
        get_number: 999,
        preview_color: "#f5f5f5",
        tab_bg: "#ffffff",
        title_color: "#333",
        title_active_color: "#ff2c29"
      },
      videoData: {
        preview_color: "#f5f5f5",
        get_style: "1",
        get_number: 999
      },
      liveData: {
        choose_tab: "0",
        get_number: 20,
        preview_color: "#f5f5f5",
        record_id: 1,
        tab_active_color: "#ff2c29",
        tab_bg_color: "#ffffff",
        tab_color: "#333333"
      },
      groupList: [],
      groupListPage: 0,
      groupListTotalPage: 0,
      fatherTitle:''
    };
  },
  activated() {
    setTimeout(() => {
      this.member_agent =
        JSON.parse(window.localStorage.getItem("mailLanguage")) && JSON.parse(window.localStorage.getItem("mailLanguage")).agent && JSON.parse(window.localStorage.getItem("mailLanguage")).agent.agent
          ? JSON.parse(window.localStorage.getItem("mailLanguage")).agent.agent
          : "客户";
      this.$forceUpdate();
    }, 2000);
    // 太久不知道有什么用 #80291
    // if (!this.fun.isTextEmpty(window.sessionStorage.getItem("signHref"))) {
    //   window.location.href = window.sessionStorage.getItem("signHref");
    // }
    this.getMemberData();
    // }
    //提现字样
    // this.customizeIncome();
    this.showPopup = false;
    this.fun.setWXTitle($i18n.t("我的"));
    window.addEventListener("scroll", this.handleScroll);
    //zhuge.startTrack('会员中心页面停留时长');
    //通过接口获取用户信息
    this.fatherTitle = document.title;
    //console.log(document.title);
    //console.log(99999999);
        $http.get("member.member.getMemberDetailInfo", { uid: window.localStorage.uid }, " ")
        .then(response => {
          if (response.result === 1) {
            zhuge.track('进入我的页面',{
              '用户id':''+window.localStorage.uid,
              '用户昵称':response.data.nickname,
              '手机号':response.data.mobile,
              '会员等级':response.data.level_name
            });
            zhuge.identify(''+window.localStorage.uid,{
              '用户昵称':response.data.nickname,
              '手机号':response.data.mobile,
              '会员等级':response.data.level_name
            });
          }
        });
    
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {},
  /*
    会员中心插件分类：
     营销互动：客户、优惠券、二维码、评论、
     实用工具：设置、收藏、足迹、地址管理、消息通知
  */
  mounted() {
    this.buttonClientWidth = document.body.clientWidth - 56 + "px";
  },
  methods: {
    //点击头像跳转查看头像大图页面
    seeAvatarImg(userid){
      this.$router.push(this.fun.getUrl("MemberAvatar",{ id: userid }));
    },
    //修改昵称 start
    introductionInp() {
      this.mainCommentShow = true;
    },
    subMainBtn() {
      if (!this.maincomment) {
        Toast("请填写你的新昵称");
        return false;
      }
      let that = this;
      let dataJson = {};
      dataJson.nickname = that.maincomment;
      $http
        .post("member.member.updNickname", dataJson, "")
        .then(response => {
          if (response.result == 1) {
            that.nickname=that.maincomment;
            Toast(response.msg);
            that.mainCommentShow = false;
          } else {
            Toast(response.msg);
            that.mainCommentShow = false;
          }
        });
    },
    //修改昵称  end
    switch1() {
      if ($i18n.locale == "zh") {
        $i18n.locale = "en";
      } else {
        $i18n.locale = "zh";
      }
    },

    toSetting() {
      this.$router.push(this.fun.getUrl("info"));
    },
    toOrderList(order_key, item) {
      if (order_key !== "hotel_order" && item.status === 11) {
        this.$router.push(this.fun.getUrl("aftersaleslist"));
        return;
      }
      if (order_key === "order") {
        this.$router.push(this.fun.getUrl("orderlist", { status: (Number(item.status) + 1).toString() }));
      } else if (order_key === "hotel_order") {
        if (item.status === 11) {
          this.$router.push(this.fun.getUrl("hotelOrderlist", { orderType: "hotel", status: "5" }));
        } else {
          this.$router.push(this.fun.getUrl("hotelOrderlist", { orderType: "hotel", status: (Number(item.status) + 1).toString() }));
        }
      } else if (order_key === "fight_groups_order") {
        this.$router.push(this.fun.getUrl("GroupOrderlist", { orderType: "groups", status: (Number(item.status) + 2).toString() }));
      } else if (order_key === "snatch_regiment_order") {
        this.$router.push(this.fun.getUrl("orderlist", { orderType: "grabGroup", status: (Number(item.status) + 1).toString() }));
      } else if (order_key === "lease_order") {
        this.$router.push(this.fun.getUrl("lease_toyOrderlist", { orderType: "lease_toy", status: (Number(item.status) + 1).toString() }));
      } else if (order_key === "live_install_work_order") {
        // 上门安装师傅
        if (item.status === -1) {
          this.$router.push(this.fun.getUrl("installationSeverHome", {}, { status: 1 }));
        } else {
          this.$router.push(this.fun.getUrl("installationSeverHome", {}, { status: Number(item.status) }));
        }
      } else if (order_key === "live_install_order") {
        if (item.status === 3) {
          this.$router.push(this.fun.getUrl("installationSeverMemberHome", {}, { status: 5 }));
        } else {
          this.$router.push(this.fun.getUrl("installationSeverMemberHome", {}, { status: Number(item.status) + 1 }));
        }
      } else if (order_key === "aggregation_cps_order") {
        if (item.status === 3) {
          this.$router.push(this.fun.getUrl("cpsCouponList"));
        } else {
          this.$router.push(this.fun.getUrl("cpsOrderList", {}, { status: item.status }));
        }
      } else if (order_key === "group_work_order") {
        this.$router.push(this.fun.getUrl("orderlist", { status: (Number(item.status) + 1).toString(), orderType: "groupWork" }));
      }
    },
    async handlePlugin() {
      this.setLoadMore(true);
      // if(this.plugin_active==='recommend_goods') {
      //   if(!this.goodsData.list) {
      //     let {data} = await $http.get("member.member.plugin-data",{code: this.plugin_active,page: 1},"loading");
      //     this.goodsData.list = data.data;
      //   }
      // }else
      if (this.plugin_active === "limitBuy_goods") {
        if (!this.limitData.list) {
          let { data } = await $http.get("member.member.plugin-data", { code: this.plugin_active, page: 1 }, "loading");
          this.limitData.list = data.data;
        }
      } else if (this.plugin_active === "fight-groups") {
        if (this.groupList.length <= 0) {
          let { data } = await $http.get("plugin.fight-groups.frontend.controllers.fight-groups.index", { page: 1 }, "loading");
          this.groupList = data.data;
          this.groupListPage = data.current_page;
          this.groupListTotalPage = data.last_page;
        }
      } else if (this.plugin_active === "article") {
        if (!this.articleData.list) {
          let { data } = await $http.get("plugin.article.api.article.get-articles", { category_id: 0, pageSize: 12, page: 1 }, "loading");
          this.articleData.list = data.articles;
        }
      } else if (this.plugin_active === "video-share") {
        if (!this.videoData.list) {
          let { data } = await $http.get("plugin.video-share.frontend.video.getList", { page: 1 }, "loading");
          this.videoData.list = data.list;
        }
      } else if (this.plugin_active === "micro-communities") {
        if (!this.communityData.list) {
          let { data } = await $http.get("plugin.micro-communities.api.index.getStick", { trick_new: 1, page: 1 }, "loading");
          this.communityData.list = data;
        }
      } else if (this.plugin_active === "room") {
        if (!this.liveData.list) {
          let { data } = await $http.get("plugin.room.frontend.live-list.get-all-live-list", { page: 1 }, "loading");
          this.liveData.list = data;
        }
      }
      this.$forceUpdate();
    },

    async getMorePluginData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.plugin_active === "recommend_goods") {
        this.$refs.UGoods[0].loadMoreMemberData();
      } else if (this.plugin_active === "limitBuy_goods") {
        if (this.$refs.limitUGoods) {
          this.$refs.limitUGoods[0].loadMoreMemberData();
        } else {
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "fight-groups") {
        if (this.groupListPage < this.groupListTotalPage) {
          this.groupListPage += 1;
          let { data } = await $http.get("plugin.fight-groups.frontend.controllers.fight-groups.index", { page: this.groupListPage }, "loading");
          this.groupList = this.groupList.concat(data.data);
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "article") {
        if (this.$refs.U_article) {
          this.$refs.U_article[0].getMoreData();
        } else {
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "video-share") {
        if (this.$refs.U_shortvideo) {
          this.$refs.U_shortvideo[0].loadMoreMemberData();
        } else {
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "micro-communities") {
        if (this.$refs.U_community) {
          this.$refs.U_community[0].getMoreData();
        } else {
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "store-cashier") {
        if (this.$refs.U_stores) {
          this.$refs.U_stores[0].getMoreList();
        } else {
          this.setLoadMore(true);
        }
      } else if (this.plugin_active === "room") {
        this.setLoadMore(true);
      }

      this.$forceUpdate();
    },

    setLoadMore(flag) {
      this.isLoadMore = flag;
    },

    openService() {
      if (this.service.cservice || this.service.service_QRcode || this.service.service_mobile) {
        this.showPopup = true;
      } else {
        window.location.href = this.service;
      }
    },

    // new
    getMemberData() {
      $http
        .post("member.member.member-data", { v: 2 }, " ")
        .then(
          response => {
            if (response.result === 1) {
              if (this.$store.state.temp.item.is_decorate === 1) {
                this.getNewDecorate(response.data.designer.data);
                this.designerStatus = response.data.designer.status;
                window.yzdesignerStatus = this.designerStatus;
              } else {
                this.newTemplate(response.data.designer);
              }

              this.getMemberInfo(response.data);

              if (response.data.plugins_data && (!this.plugins_data.nav || this.plugins_data.nav.length <= 0)) {
                this.plugins_data = response.data.plugins_data || {};
                if (this.plugins_data.nav.length > 0) {
                  this.plugin_active = this.plugins_data.nav[0].code;
                }
                if (this.plugin_active === "recommend_goods") {
                  this.goodsData.list = this.plugins_data.data;
                } else if (this.plugin_active === "limitBuy_goods") {
                  this.limitData.list = this.plugins_data.data;
                } else {
                  this.handlePlugin();
                }
              }

              if (response.data.service) {
                this.service = response.data.service;
              }

              if (!this.fun.isTextEmpty(response.data.member.yz_member)) {
                this.custom_value = response.data.member.yz_member.custom_value;
                this.getMemberCustom(this.custom_value, response.data.member.yz_member.validity, response.data.setting.custom); // 获取自定义数据
              }
              this.wechat_login_mode = response.data.setting.wechat_login_mode;
              this.show_member_id = response.data.setting.show_member_id;
              this.getEnablePlugin(response.data.plugins);
              this.getStroeWithdraw(response.data.plugins.is_open);
              this.getMemberGrade(response.data.setting.level);
            } else {
              Toast(response.msg);
              this.template = "01";
              require("@/assets/css/icon.scss");
            }
          },
          response => {
            console.log(response.msg);
            require("@/assets/css/icon.scss");
          }
        )
        .catch(err => {
          console.error(err);
          require("@/assets/css/icon.scss");
        });
    },
    newTemplate(data) {
      // $http.get("member.member-designer.index").then(
      //   response => {
      //     if (response.result === 1) {
      this.designer = data.data;
      this.showDiy = [];
      this.designer.map((item, index, key) => {
        if (item.temp === "showdiyform") {
          this.showDiy.push(item);
        }
      });
      for (let i in this.designer) {
        this.designer[i].temp = "show" + this.designer[i].temp;
        if (this.designer[i].temp === "showlocation" || this.designer[i].temp === "showstore") {
          this.isLocation = true;
        }
      }
      // window.localStorage.setItem(
      //   "yzdesigner",
      //   JSON.stringify(this.designer)
      // );
      this.$store.commit("membertempIndex", data);
      this.designerStatus = data.status;
      window.yzdesignerStatus = this.designerStatus;
      // this.getMemberData();
      //     } else {
      //     }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    },
    getNewDecorate(data) {
      this.page_id = data.id;
      if (data.page) {
        this.total_page = data.page.total_page;
        this.current_page = data.page.current_page;
        this.lastIndex = data.page.count - 1;
      }

      let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community", "U_goodstores"];

      this.components = data.datas;
      if (this.components && this.components.length > 0) {
        this.components.map(item => {
          if (needLocations.includes(item.component_key)) {
            this.isLocation = true;
          }
        });
      }
      if (data.page_info) {
        //会员中心只有弹窗广告
        this.advertising = data.page_info.advertising_id;
        if (this.advertising.id && this.advertising.datas) {
          this.advertising.datas = JSON.parse(this.advertising.datas);
        }
      }

      if (this.advertising && this.advertising.id && window.memberAdvertisement === 1 && this.advertising.show_rule === 1) {
        window.memberAdvertisement = 0;
        this.popShow = true;
        this.$nextTick(() => {
          this.initAdvertising();
        });
      }

      this.isDecorate = true;
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", { decorate_page: this.current_page, decorate_id: this.page_id }, "..").then(response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          } else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      } else {
        console.log("加载完了");
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log("图片加载出错");
        };
      }
    },
    initAdvertising() {
      let that = this;
      this.getImg(this.advertising.image, function(scale) {
        // 图片加载完后获取图片高度
        let script = document.createElement("script");
        script.type = "text/wxtag-template";
        script.text = `<div style="width: ${that.clientWidth * 0.65}px;height: ${that.clientWidth * 0.65 * scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    closePop() {
      this.popShow = false;
    },
    turnTo() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },

    // 退出登录
    outInfo() {
      $http.get("member.logout.index").then(
        response => {
          if (response.result == 1) {
            window.localStorage.setItem("isWxLogin", -1);
            this.$store.commit("savemodel", {});
            localStorage.setItem("token", "");
            localStorage.setItem("loginUid", "");
            window.firstLogin = 0;
            clearLoginData(); // 方法在index.html
            if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
              // 聚合APP退出方法
              if (this.fun.isIosOrAndroid() === "ios") {
                toQuitIOS({ body: "toQuitIOS" });
              } else {
                toQuitAndroid();
              }
              return;
            }

            this.$dialog
              .alert({ message: response.msg })
              .then(() => {
                this.$router.push(this.fun.getUrl("login"));
              })
              .catch(() => {});
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },

    openQrCode(e) {
      this.getPoster(e);
    },
    openQrCode_old(e) {
      if (!this.poster) {
        if (!this.timer) {
          this.getPoster_oldApi(e);
          this.timer = setInterval(() => {
            this.getPoster_oldApi(e);
          }, 3000);
        } else {
          // this.$refs.hook.style.display = e;
        }
      } else {
        // this.$refs.hook.style.display = e;
        clearInterval(this.timer);
        this.toastPoster.clear();
      }
    },
    getPoster(e) {
      if (!this.fun.isTextEmpty(this.poster_Data.poster_data) || !this.fun.isTextEmpty(this.poster)) {
        this.posterShow = true;
        // this.$refs.hook.style.display = e;
        return;
      }
      let that = this;
      $http.get("member.qrcode.get-poster", {}, {}).then(
        response => {
          if (response.result === 1) {
            this.isNewPosterPlugin = response.data.new || false;
            if (response.data.center_show == 0) {
              //0 返回的默认图片
              that.poster = response.data.image_url;
              that.posterShow = true;
            } else if (response.data.center_show == 1) {
              //前端生成
              that.poster_Data.background.src = response.data.background_url || response.data.background;
              that.poster_Data.background.type = "background";
              that.poster_Data.poster_data = response.data.style_data;
              that.poster_id = response.data.id;
              that.posterShow = true;
              // that.$nextTick(() => {
              //   that.forCreateEwm();
              // });
            } else if (response.data.center_show == 2) {
              //部分关注二维码不支持跨域，走老接口
              that.toastPoster = Toast({
                duration: -1, // 持续展示 toast
                message: "正在为您生成海报中"
              });
              that.openQrCode_old(e);
            }
            // this.$refs.hook.style.display = 'block';
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.clear();
            }
          }
        }
      );
    },
    getPoster_oldApi(e) {
      $http.get("member.poster").then(
        response => {
          if (response.result === 1) {
            this.poster = response.data.image_url;
            // this.$refs.hook.style.display = e;
            if (this.poster && this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
              }
            }
          } else {
            Toast(response.msg);
            if (this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
              }
            }
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            this.posterShow = true;
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.clear();
            }
          }
        }
      );
    },

    forCreateEwm() {
      let that = this;
      //循环批量生成二维码 qr_shop（推广二维码）、qr_app_share（app分享）接口返回链接，需要前端生成二维码(注释：新海报接口返回图片)
      // this.poster_Data.style_data.forEach(function (val, index) {
      //   if (val.type == 'qr_shop' || val.type == 'qr_app_share') {
      //     that.createEwmQrc(index, val.src)
      //   }
      // });

      // 问题：截图不全；原因：滚轮滑动造成的，主要是html2canvas是根据body进行截图，若内容高度高于body时，就会出现这样的问题(大概意思就是有滚动条时造成的)
      // 解决方案：(在生成截图前，先把滚动条置顶)
      window.pageYOffset = 0;
      window.pageXOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        that.saveImg();
      }, 1500);
      // setTimeout(() => {
      //   this.loadingImg = false;
      // }, 1500);
    },
    // createEwmQrc(_index, _url) {
    //   let _ID = `ewmCanvas_${_index}`
    //   QRCode.toCanvas(document.getElementById(_ID), _url, error => {
    //     if (error) {
    //       console.log(error)
    //     } else {
    //       console.log('success:地址转化二维码成功=======================')
    //     }
    //   })
    // },
    saveImg() {
      //转化成图片
      var content = document.getElementById("code_box");
      const that = this;
      html2canvas(content, {
        useCORS: true,
        tainttest: true, //检测每张图片都已经加载完成
        height: content.offsetHeight, //注意 下面解决当页面滚动之后生成图片出现白边问题
        width: content.offsetWidth,
        scrolly: 0,
        scrollx: 0,
        backgroundColor: null // 解决生成的图片有白边
      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
        that.uploadImageM();
      });
    },
    uploadImageM(e) {
      //图片上传
      let that = this;
      this.dataURL = e;
      let uploadImage = this.fun.getRealUrl("member.qrcode.uploadLocal", { local_upload: 1, poster_id: that.poster_id, is_new: this.isNewPosterPlugin ? 1 : 0 });
      let fd = new FormData();
      fd.append("file", this.dataURItoBlob(this.dataURL));
      axios
        .post(uploadImage, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result == 1) {
            $http
              .post("member.qrcode.poster-record", { poster_id: that.poster_id, image: response.data.data.img_url, is_new: this.isNewPosterPlugin ? 1 : 0 })
              .then(response => {
                if (response.result === 1) {
                  console.log("添加海报生成记录成功");
                } else {
                  Toast(response.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },

    // 获取会员信息
    getMemberInfo(data) {
      this.supplier_id = data.member.uid;
      if (data.plugins.merchant && data.plugins.merchant.cashier) {
        this.store_set.is_open_cashier = 1;
      }
      // 供应商申请
      // this.supplier = data.member.supplier
      this.member_item = data.member;
      this.member_order = data.order;
      // 邀请码
      this.inviteCode = data.member.inviteCode.code;
      this.isshowInvit = data.member.inviteCode.status;

      // 是否有推广下线资格 0-无资格；1-有资格
      this.isGeneralize = data.member.is_agent;
      this.relation_switch = data.member.is_agent;
      this.$store.commit("savemodel", data.member);
      window.localStorage.uid = data.member.uid;

      // this.coin = data.member.coin ? data.member.coin.status : false;
      // this.coin_name = data.member.coin ? data.member.coin.coin_name : "";
      // this.MyReferrer = data.member.referral
      this.avatar = data.member.avatar;
      this.nickname = data.member.nickname;
      this.integral = data.member.integral;
      this.coupon = data.member.coupon || {};
      this.copyright = data.member.copyright;
      this.copyrightImg = data.member.copyrightImg;
      this.$store.commit("updateBanlace", {
        balance: data.member.credit2
      });
      this.uid = data.member.uid;
      this.level_name = data.member.level_name;
      this.credit = data.member.credit;
      this.mobile = data.member.mobile;

      this.love_obj = data.member.love_show;
      this.integral_show = data.member.integral_show;
      // this.is_hotel = data.plugins.is_open.is_open_hotel == 1 ? true : false;
      // if (this.is_hotel) {
      //   this.PageNameList = data.plugins.hotel;
      //   localStorage.setItem("customizeHotelHead", JSON.stringify(data.plugins.hotel));
      // }

      // 处理插件列表
      this.pluginsList = data.plugins;
      if (this.pluginsList.plugins) {
        this.pluginsList.plugins.push({
          class: "icon-zb_all_more",
          image: "",
          mini_url: "",
          name: "morePlugin",
          title: "更多工具",
          url: "morePlugin"
        });
        this.plugin_handle_list = [];
        let page = Math.ceil(this.pluginsList.plugins.length / 10); //==> 页数
        let num = 10; // ==> 每页多少个

        for (let i = 0; i < page; i++) {
          this.plugin_handle_list.push(this.pluginsList.plugins.slice(i * num, (i + 1) * num));
        }
      }

      // 处理订单列表
      let order_list = [];
      if (data.order_name) {
        for (let order_key in data.order) {
          let title = data.order_name[order_key];

          if (data.order[order_key]) {
            if (
              order_key === "order" ||
              order_key === "hotel_order" ||
              order_key === "lease_order" ||
              order_key === "live_install_order" ||
              order_key === "live_install_work_order" ||
              order_key === "group_work_order"
            ) {
              data.order[order_key].push({
                status: -1,
                status_name: "全部订单",
                total: 0,
                class: "icon-fontclass-quanbudingdan"
              });
            } else if (order_key === "aggregation_cps_order") {
              data.order[order_key].push({
                status: 0,
                status_name: "全部订单",
                total: 0,
                class: "icon-fontclass-quanbudingdan"
              });
              data.order[order_key].push({
                status: 3,
                status_name: "卡券订单",
                total: 0,
                class: "icon-fontclass-shouhou1"
              });
            }
            order_list.push({
              name: order_key,
              title: title,
              list: data.order[order_key]
            });
          }
        }
      }
      if (data.order_name && data.order_name.hasOwnProperty("ys_system")) {
        // 益生-线下订单；PS:点击直接跳转
        order_list.push({
          name: "ys_system",
          title: data.order_name["ys_system"],
          list: []
        });
      }

      this.order_list = order_list;
    },

    clickOrderTab(e) {
      if (this.order_list[e].name == "ys_system") {
        this.$router.push(this.fun.getUrl("orderlist", { orderType: "ysSystem", status: "0" }));
        return false;
      }
      // 返回 Promise 来执行异步逻辑
      return new Promise(resolve => {
        // 在 resolve 函数中返回 true 或 false
        resolve(true);
      });
    },

    //获取自定义数据 validity会员等级时间限制
    getMemberCustom(value, validity, data) {
      // if (data.is_custom == "1" && !this.fun.isTextEmpty(value)) {
      //       //   this.custom_title = data.custom_title;
      //       //   this.is_custom = true;
      //       // } else {
      //       //   this.is_custom = false;
      //       // }

      //处理会员等级时间限制
      if (data.is_validity && data.term == 1) {
        if (validity) {
          this.validity_value = validity;
        }
      }
    },

    handleTopChange(status) {
      this.topStatus = status;
    },
    loadTop() {
      this.getMemberData();
      // this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      // load more data
      this.allLoaded = true;
    },

    // 获取门店提现
    getStroeWithdraw(data) {
      if (data) {
        this.is_stroeWithdraw = data.is_store == 1 ? true : false;
      }
    },

    // 跳转至会员权益
    gotoMemberGrade() {
      if (this.isMemberGrade) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },

    // 跳转推广中心
    gotoExtension() {
      this.$router.push(this.fun.getUrl("extension"));
    },

    // 获取开启的插件列表
    getEnablePlugin(data) {
      if (data.ViewSet.member) {
        this.template = data.ViewSet.member.name;
      }
      if (this.$store.state.temp.item.is_decorate === 1) {
        if (this.$store.state.temp.item.ViewSet.member.is_default != 0) {
          this.template = this.$store.state.temp.item.ViewSet.member.code.substring(6);
        } else {
          this.template = "01";
        }
      }
      if (window.yzdesignerStatus) {
        this.template = "03";
        require("@/assets/css/member/designer.scss");
      } else {
        if (!this.template) {
          this.template = "01"; //默认为01
        }
        if (this.template === "02") {
          // 背景图片样式
          require("@/assets/css/icon.scss");
          require("@/assets/css/member/01.scss");
        } else if (this.template === "01") {
          // 阿里图标库样式
          require("@/assets/css/icon.scss");
        }
      }
    },

    // 会员权益插件是否开启
    getMemberGrade(data) {
      this.isMemberGrade = data.is_open == 1 ? true : false;
    },

    pluginGoto(item) {
      if (!item.name) {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
        return;
      }
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.name == "order-inventory") {
        this.$router.push(this.fun.getUrl("stockorderList", { stock: "stock" }));
      } else if (item.url == "liveList") {
        this.$router.push(this.fun.getUrl(item.url, { from: 1 }));
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.supplier_id
          })
        );
      } else if (item.name == "m-erweima") {
        // 海报
        this.openQrCode("block");
      } else if (item.name == "qq-advertise") {
        //跳转客户app观看广告
        this.gotoAppRevardVideo(item);
      } else {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
      }
    },
    gotoAppRevardVideo(_data) {
      //看广告视频方案：点击入口按钮，跳转到原生APP里看视频广告。
      //传参：会员ID和会员的token
      let _uid = window.localStorage.getItem("uid") || "0"; //会员id
      let _token = _data.member_token || "0"; //会员的token
      if (this.fun.getPhoneEnv() == "1") {
        // 调用IOS方法
        let _iosUid = "uid=" + _uid;
        let _iosToken = "token=" + _token;
        window.webkit.messageHandlers.revardVideo.postMessage(_iosUid, _iosToken);
      } else if (this.fun.getPhoneEnv() == "2") {
        //  调用安卓方法
        revardVideo.revardVideoClick(_uid, _token);
      }
    },
    // 复制邀请码
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function(e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    //自定义提现收入语言
    // customizeIncome() {
    //   let mailLanguage = this.fun.initMailLanguage();
    //   //自定义提现字段
    //   if (mailLanguage) {
    //     this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    //   }
    // },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 305) >= this.getScrollHeight()) {
        if (this.isLoadMore) {
          if (this.template === "03") {
            this.getMoreDecorate();
          } else if (this.template === "01") {
            this.getMorePluginData();
          }
        }
        //此处发起请求
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    }
  },
  components: {
    // 旧装修
    // showmembercenter: () => import('../../components/member/member_head'),
    // showmemberincome: () => import('../../components/member/member_head_middle'),
    // showmemberorder: () => import('../../components/member/member_head_bottom'),
    // showmemberhotelorder: () => import('../../components/member/member_order'),
    // showmembercarorder: () => import('../../components/member/member_carorder'),
    // showmemberleaseorder: () => import('../../components/member/member_lease'),
    // showmembertool: () => import('../../components/member/member_tool'),
    // showmembermerchant: () => import('../../components/member/member_merchant'),
    // showmembermarket: () => import('../../components/member/member_market'),
    // showmemberasset: () => import('../../components/member/member_asset'),
    // showmembergrouporder: () => import('../../components/member/member_fight_groups'),
    // showmembersnatchorder: () => import('../../components/member/member_grab_group'),
    // showbanner: () => import('../../components/temp/banner'),
    // showsign: () => import('../../components/temp/showsign'),
    // showmenu: () => import('../../components/temp/menu'),
    // showtitle: () => import('../../components/temp/title'),
    // showsearch: () => import('../../components/temp/search'),
    // showline: () => import('../../components/temp/line'),
    // showblank: () => import('../../components/temp/blank'),
    // showrichtext: () => import('../../components/temp/richtext'),
    // showpicture: () => import('../../components/temp/picture'),
    // showcube: () => import('../../components/temp/cube'),
    // showarea: () => import('../../components/temp/area'),
    // showshop: () => import('../../components/temp/shop'),
    // showgoods: () => import('../../components/temp/goods'),
    // shownearbygoods: () => import('../../components/temp/near_goods'),
    // shownotice: () => import('../../components/temp/notice'),
    // showlocation: () => import('../../components/temp/location'),
    // showstore: () => import('../../components/temp/stores'),
    // showcoupon: () => import('../../components/cupcon'),
    // showheadline: () => import('../../components/topline'),
    // showarticle: () => import('../../components/article'),
    // showflashsale: () => import('../../components/time_limit'),
    // showbusiness: () => import('../../components/temp/business'),
    // showassemble: () => import('../../components/time_group'),
    // showvideo: () => import('../../components/temp/video'),
    // showdiyform: () => import('../../components/temp/form'),
    // showlivestreaming: () => import('../../components/temp/livestreaming'),
    // showtogetherpurchase: () => import('../../components/temp/group_buy'),

    //新装修
    U_memberasset,
    U_membermarket,
    U_membermerchant,
    U_memberorder,
    U_memberrights,
    U_membertool,
    U_membertop,
    U_article,
    U_backup: () => import("../../components/new_diy/backup.vue"),
    U_blank: () => import("../../components/new_diy/blank.vue"),
    U_button: () => import("../../components/new_diy/button.vue"),
    U_community,
    U_coupons: () => import("../../components/new_diy/coupons.vue"),
    U_cube: () => import("../../components/new_diy/cube.vue"),
    U_deposit: () => import("../../components/new_diy/deposit.vue"),
    U_form: () => import("../../components/new_diy/form.vue"),
    U_goods,
    U_goodsgroup: () => import("../../components/new_diy/goodsgroup.vue"),
    U_goodsnearby: () => import("../../components/new_diy/goodsnearby.vue"),
    U_goodsrush,
    U_goodstores: () => import('../../components/new_diy/goodstores.vue'),
    U_headline: () => import("../../components/new_diy/headline.vue"),
    U_homedata: () => import("../../components/new_diy/homedata.vue"),
    U_line: () => import("../../components/new_diy/line.vue"),
    U_livestreaming,
    U_location: () => import("../../components/new_diy/location.vue"),
    U_lottery: () => import("../../components/new_diy/lottery.vue"),
    U_maps: () => import("../../components/new_diy/maps.vue"),
    U_notice: () => import("../../components/new_diy/notice.vue"),
    U_richtext: () => import("../../components/new_diy/richtext.vue"),
    U_search: () => import("../../components/new_diy/search.vue"),
    U_staff: () => import("../../components/new_diy/staff.vue"),
    U_shopfor: () => import("../../components/new_diy/shopfor.vue"),
    U_shortvideo,
    U_signin: () => import("../../components/new_diy/signin.vue"),
    U_simplegraph: () => import("../../components/new_diy/simplegraph.vue"),
    U_slideshow: () => import("../../components/new_diy/slideshow.vue"),
    U_stores,
    U_storesranking: () => import("../../components/new_diy/storesranking.vue"),
    U_suspendbutton: () => import("../../components/new_diy/suspendbutton.vue"),
    U_tabcontrol,
    U_title: () => import("../../components/new_diy/title.vue"),
    U_video: () => import("../../components/new_diy/video.vue"),
    U_stargroup: () => import("../../components/new_diy/stargroup.vue"),
    U_foot: () => import("../../components/new_diy/foot.vue"),

    yzGoodsposter,
    DConnectCustomerService,
    fight_group,
    U_memberYs: () => import("../../components/new_diy/ys_member.vue"),
    U_bonuspool
  }
};
