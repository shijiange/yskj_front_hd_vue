import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data: function() {
    return {
      data: [],
      bannerImgSrc: "",
      nextUrl: "",
      goodsID: "",
      signature: "",
      shoplang: ""
    };
  },
  methods: {
    //点击支付按钮 进行支付操作 同时弹出支付成功页面
    pay() {
      console.log(this.goodsID);
      if (this.fun.isTextEmpty(this.goodsID)) {
        Toast("请选择店主等级");
        return;
      }
      let that = this;
      let json = { goods_id: this.goodsID, total: 1 };
      $http.get(this.nextUrl, json, "提交中").then(
        response => {
          if (response.result === 1) {
            that.$router.push(
              that.fun.getUrl(
                "goodsorder",{},
                { tag: "-2", goodsId: that.goodsID, optionsId: "", total: "1" },
                "提交中"
              )
            );
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          Toast(response);
        }
      );
    },
    open() {
      this.$router.push(this.fun.getUrl("microShop_apply_reg_info"));
    },
    goBack() {
      this.$router.go(-1);
    },

    //请求数据 初始化页面
    init() {
      let that = this;
      $http
        .get(
          "plugin.micro.frontend.controllers.MicroShopApply.apply",
          {},
          "加载中"
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.nextUrl = response.data.create_order_api;
              that.bannerImgSrc = response.data.micro_thumb;
              that.data = response.data.levels;
              that.signature = response.data.signature;
              that.shoplang = response.data.lang;
              if (that.shoplang) {
                document.title = that.shoplang + "申请";
              }
              window.localStorage.setItem("reg_info", response.data.signature);
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  activated() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage && mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}申请`);
    } else {
      this.fun.setWXTitle("微店申请");
    }
    this.data = [];
    this.bannerImgSrc = "";
    this.nextUrl = "";
    this.goodsID = "";
    this.signature = "";

    this.init();
  },
  created() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage && mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}申请`);
    } else {
      this.fun.setWXTitle("微店申请");
    }
  },
  components: { cTitle }
};
