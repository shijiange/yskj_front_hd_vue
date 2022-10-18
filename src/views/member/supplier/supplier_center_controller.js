import cTitle from "components/title";

export default {
  data() {
    return {
      mainInfo: "",
      cost_money: "",
      money_total: "",
      order_amount: "",
      order_count: "",
      supplier_id: "",
      mid: "",
      insuclShow: false,
      income_name_text: "",
      bannerStatus: 1,
      bannerList: [],
    };
  },

  activated() {
    this.init();
    this.getSupplierInfo();
    this.mid = this.$route.params.uid ? this.$route.params.uid : this.fun.getKeyByMid();
    this.isShowdetail();
    this.customizeIncome();
  },
  mounted() {},

  methods: {
    init() {
      this.mainInfo = "";
      this.cost_money = "";
      this.money_total = "";
      this.order_amount = "";
      this.order_count = "";
    },
    goToInfo(res) {
      if (res === "1") {
        console.log(this.mid);
        this.$router.push(this.fun.getUrl("SupInfoManage", { member_id: this.mid }));
      } else if (res === "2") {
        this.$router.push(
          this.fun.getUrl("CommodityManagement", {
            store_id: this.supplier_id,
            store: "supplier"
          })
        );
      } else if (res === "3") {
        this.$router.push(
          this.fun.getUrl("supplierOrderlist", {
            status: "0",
            orderType: "supplier"
          })
        );
      } else if (res === "4") {
        this.$router.push(
          this.fun.getUrl("supplierRecord", {
            supplier: "supplier",
            member_id: this.mid
          })
        );
      } else if (res === "5") {
        this.$router.push(
          this.fun.getUrl("supplier_withdrawals", {
            supplier: "supplier",
            member_id: this.mid
          })
        );
      } else if (res == "6") {
        this.$router.push(this.fun.getUrl("balance_manage"));
      }
    },
    // 是否显示保单
    isShowdetail() {
      $http.get("plugin.supplier.frontend.index.policyControl").then(res => {
        if (res.result == "1") {
          if (res.data == "1") {
            this.insuclShow = true;
          } else if (res.data == "0") {
            this.insuclShow = false;
          }
        }
      });
    },
    getSupplierInfo() {
      var that = this;
      var json = { member_id: this.mid };
      $http.post("plugin.supplier.frontend.index.index", json).then(
        function(response) {
          if (response.result == 1) {
            that.supplier_id = response.data.data.supplier_id;
            that.cost_money = response.data.data.cost_money;
            that.money_total = response.data.data.money_total;
            that.order_amount = response.data.data.order_amount;
            that.order_count = response.data.data.order_count;
            that.mainInfo = response.data.data.member_model;
            that.bannerStatus = response.data.data.set.banner_status;
            if (!that.fun.isTextEmpty(response.data.data.set.banner_1)) {
              that.bannerList.push(response.data.data.set.banner_1);
            }
            if (!that.fun.isTextEmpty(response.data.data.set.banner_2)) {
              that.bannerList.push(response.data.data.set.banner_2);
            }
            if (!that.fun.isTextEmpty(response.data.data.set.banner_3)) {
              that.bannerList.push(response.data.data.set.banner_3);
            }
          } else {
            if (response.data.url) {
              window.location.href = response.data.url;
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
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
