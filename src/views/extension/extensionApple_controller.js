import { Toast } from "vant";
import cTitle from "components/title";
export default {
  data() {
    return {
      info_img: "",

      //-----模块
      //是否提交审核
      isCheck: false,

      //显示模块
      becomeType_1: false,
      becomeType_2: false,
      becomeType_3: false,
      becomeType_4: false,

      become_1_info_1: "",
      become_1_info_2: "",

      become_2_info_1: "0",
      become_2_info_2: "0",
      become_2_info_3: "",

      become_3_info_1: "0",
      become_3_info_2: "0",
      become_3_info_3: "",

      become_4_info_1: "",
      become_4_info_2: "",
      become_4_info_3: "",

      para_name: "",
      para_phone: "",
      para_weixin: "",

      //推广提示
      extensionTips: "",
      //专区商品
      areaGoods: [],

      income_name_text: "",
      become_term_id: [],
      become_selfmoney: ""
    };
  },

  activated() {
    this.getExtensionBanner();
    this.initExtension();
    this.customizeIncome();
  },

  mounted() {},
  methods: {
    initExtension() {
      //是否提交审核
      this.isCheck = false;

      //显示模块
      this.becomeType_1 = false;
      this.becomeType_2 = false;
      this.becomeType_3 = false;
      this.becomeType_4 = false;

      this.become_1_info_1 = "";
      this.become_1_info_2 = "";

      this.become_2_info_1 = "0";
      this.become_2_info_2 = "0";
      this.become_2_info_3 = "";

      this.become_3_info_1 = "0";
      this.become_3_info_2 = "0";
      this.become_3_info_3 = "";

      this.become_4_info_1 = "";
      this.become_4_info_2 = "";
      this.become_4_info_3 = "";

      this.para_name = "";
      this.para_phone = "";
      this.para_weixin = "";

      // this.getExtension();

      this.getExtensionInfo();
    },

    // getExtension() {
    //   let that = this;
    //   let json = { "i": this.fun.getKeyByI(), "type": this.fun.getTyep() };
    //   $http.get('member.member.getMemberRelationInfo', json).then(function (response) {
    //     console.log(response);
    //     if (response.result == 1) {
    //       that.setView(response.data);
    //     }

    //   }, function (response) {
    //     console.log(response);
    //   });
    // },

    //获取设置信息
    // getExtensionInfo() {
    //     let that = this;
    //     $http.get('member.member.agentbase', {},"...").then(function (response) {
    //         console.log(response)
    //         if (response.result == 1) {
    //             that.info_img = response.data.banner;
    //         } else {
    //             that.info_img = "";
    //         }

    //     }, function (response) {
    //         console.log(response)
    //     });
    // },
    getExtensionBanner() {
      let that = this;
      $http.get("member.member.agentbase", {}, "...").then(
        function(response) {
          if (response.result == 1) {
            that.info_img = response.data.banner;
          } else {
            that.info_img = "";
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //设置view 显示
    setView(data) {
      if (data.base_info.status == 0) {
        this.setBecomeType(data.become);
        this.setBecomeTypeView(data.become, data);
      } else if (data.base_info.status == 1) {
        //显示已申请
        this.becomeType_1 = false;
        this.becomeType_2 = false;
        this.becomeType_3 = false;
        this.becomeType_4 = false;

        this.isCheck = true;
      } else {
        this.$router.replace(this.fun.getUrl("distribution", {}));
      }
    },

    //设置类型显示
    setBecomeType(become) {
      if (become == 1) {
        this.becomeType_1 = true;
        this.becomeType_2 = false;
        this.becomeType_3 = false;
        this.becomeType_4 = false;
      } else if (become == 2 || become == 3) {
        this.becomeType_1 = false;
        this.becomeType_2 = true;
        this.becomeType_3 = true;
        this.becomeType_4 = true;
      } else {
        this.becomeType_1 = false;
        this.becomeType_2 = false;
        this.becomeType_3 = false;
        this.becomeType_4 = false;
      }
    },
    //设置类型显示view
    setBecomeTypeView(become, data) {
      if (become == 1 && data.become1) {
        this.become_1_info_1 = data.become1.parent_name;
        this.become_1_info_2 = data.become1.shop_name;
        this.para_name = data.become1.realname;
        this.para_phone = data.become1.mobile;
      } else if (become == 2 || become == 3) {
        // this.become_2_info_1 = data.become2.total;
        // this.become_2_info_2 = data.become2.cost;
        // this.become_2_info_3 = data.become2.shop_name;
        // this.getExtensionInfo();
      }
    },

    //状态1 点击
    become_1_click() {
      if (this.fun.isTextEmpty(this.para_name)) {
        Toast("请输入真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.para_phone)) {
        Toast("请输入手机号");
        return;
      }

      if (this.fun.isMoblie(this.para_phone)) {
        Toast("请输入正确的手机号");
        return;
      }

      let _mid = window.localStorage.mid;
      let json = { mid: _mid, realname: this.para_name, mobile: this.para_phone, i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      $http.get("member.member.addAgentApply", json, "提交中...").then(response => {
        if (response.result == 1) {
          this.getExtensionInfo(); //重新获取
        }
      });
    },
    //状态2 点击
    become_2_click() {
      console.log("become_2_click");
      //this.$router.push({ name: "home", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("home", {}));
    },

    //状态3 点击
    become_3_click() {
      console.log("become_3_click");
      //this.$router.push({ name: "home", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("home", {}));
    },

    //状态4 点击
    become_4_click(goods_id) {
      console.log(goods_id);
      //this.$router.push({ name: 'goods', params: { id: goods_id }, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("goods", { id: goods_id }));
    },

    //等待审核 处理
    isCheck_click() {
      //this.$router.push({ name: "home", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("home", {}));
    },

    getExtensionInfo() {
      $http
        .get("member.member.shareinfo", {})
        .then(res => {
          if (res.result == 1) {
            this.setView(res.data);
            this.become_3_info_1 = res.data.become_term.become_moneycount;
            this.become_3_info_2 = res.data.getCostTotalPrice;
            this.become_2_info_1 = res.data.become_term.become_ordercount;
            this.become_2_info_2 = res.data.getCostTotalNum;
            this.become_5_info_1 = res.data.become_selfmoney;
            this.extensionTips = res.data.tip;
            this.areaGoods = res.data.become_term.goodsinfo;
            this.become_term_id = res.data.become_term_id;
            this.become_selfmoney = res.data.become_selfmoney;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    gotoShopGood() {
      this.$router.push(this.fun.getUrl("ExtensionGoods", {}));
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};
