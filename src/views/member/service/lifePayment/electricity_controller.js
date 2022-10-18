import cTitle from "components/title";
export default {
  components: { cTitle },
  data() {
    return {
      regional: "请选择省份",
      dateshow_1: false,
      columns: [],
      regiona2: "请选择城市",
      dateshow_2: false,
      columns_1: [],
      language: {}, //语言包

      userCode: "", //用户号
      popupVisible: false, //pop显示
      provicevalue: "", //省份信息
      cityvalue: "", //城市信息
      company: "", //缴费单位
      contract: "", //合同号
      sourceMoney: "", //充值金额
      goods_id: "", //商品id
      provinceoptions: [], //省份
      cityoptions: [], //城市
      keyIds: "", //缴费单位key
      slots: [
        //缴费单位数组处理
        {
          flex: 1,
          values: ["请先选择省市"],
          keyId: [0],
          className: "slot1",
          textAlign: "right"
        }
      ],
      checkDeductionList: [], //优惠信息验证数组

      form: { provicevalue: "", cityvalue: "", keyId: "" },

      MobilePhone: "", //手机号
      preOrder: "", // 预下单id
      disableds: true, //禁止提交
      score: 600, //积分
      scoreMoney: 6.0, //积分抵扣价格
      computedMoney: 0.0,
      useScore: false,
      regionoptions: [],
      poundage: 0 //手续费
    };
  },
  methods: {
    //初始化参数
    initData() {
      this.userCode = ""; //用户号
      this.popupVisible = false; //pop显示
      this.provicevalue = ""; //省份信息
      this.cityvalue = ""; //城市信息
      this.company = ""; //缴费单位
      this.contract = ""; //合同号
      this.sourceMoney = ""; //充值金额
      this.goods_id = ""; //商品id

      //处理万一没有地址数据
      var province = localStorage.getItem("province");
      if (this.fun.isTextEmpty(province)) {
        this.getAddressDataInfo(); //获取地址json数据
      }
    },

    //选择省份的响应方法
    selectProviceHandle(value) {
      console.log("---fun-ev", value);
      // this.form.provicevalue = value.areaname;
      this.cityvalue = "";
      this.cityoptions = [];
      var citys = [];
      var city = localStorage.getItem("city");
      citys = JSON.parse(city);
      // console.log(citys)
      for (let i = 0; i < citys.length; i++) {
        let item = citys[i];
        // if (item.parentid == value.id) {
        // 	this.cityoptions.push(item);
        // 	// = this.cityoptions[0].areaname;
        // }
        if (item.parentid == value) {
          this.cityoptions.push(item);
        }
      }
    },
    //选择市的响应方法
    selectCityHandle(value) {
      console.log("city----s", value);
      this.company = "";
      this.slots[0].values = "";
      // this.getPaymentCompanyList(2, this.form.provicevalue, value.areaname);
      this.getPaymentCompanyList(2, this.form.provicevalue, value);
    },
    tipChangeEvent(value) {
      // console.log(this.cityoptions.length,value);
      if (value == true) {
        if (this.cityoptions.length == 0) {
          this.$notify({
            background: "#fef0f0",
            message: "省不能为空",
            color: "#f56c6c"
          });
          // this.$message({
          // 	message: '省不能为空',
          // 	type: 'warning'
          // });
        }
      }
    },

    // 获取缴费单位清单
    // 1-水费；2-电费；3-燃气费
    getPaymentCompanyList(val, province, city) {
      if (!city) return;
      $http
        .get(
          "plugin.live.api.goods.PaymentCompanyList",
          { category: val, province, city },
          "加载中..."
        )
        .then(
          response => {
            console.log("显示", response);
            if (response.result == 1) {
              //this.items = response.data;
              if (!response.data) {
                this.company = "";
                this.slots[0].values = "";
                this.$dialog.alert({message:response.msg});

                return;
              }
              this.slots[0].values = response.data.values;
              this.slots[0].keyId = response.data.keyId;
              this.company = response.data.values[0];
              this.goods_id = response.data.goods_id;
            } else {
              this.company = "";
              this.slots[0].values = "";

            }
          },
        );
    },

    //关闭缴费公司pop
    chooseCompony() {
      this.popupVisible = !this.popupVisible;
    },
    //选择缴费公司响应方法
    onValuesChange(picker, values) {
      let i = this.slots[0].values.indexOf(values[0]);
      this.form.keyId = this.slots[0].keyId[i];
      this.keyIds = this.slots[0].keyId[i];
      picker.setColumnValue(1, values[0]);
      this.company = values[0];
    },

    //提交
    confirm() {
      if (this.fun.isTextEmpty(this.userCode)) {
        this.$dialog.alert({message:"请输入户号！"});
        return;
      }

      if (this.fun.isTextEmpty(this.provicevalue)) {
        this.$dialog.alert({message:"请选择省份"});

        return;
      }

      if (this.fun.isTextEmpty(this.cityvalue)) {
        this.$dialog.alert({message:"请选择城市"});

        return;
      }

      if (this.fun.isTextEmpty(this.company)) {
        this.$dialog.alert({message:"请选择缴费单位"});

        return;
      }

      if (this.fun.isTextEmpty(this.contract)) {
        this.$dialog.alert({message:"请输入合同号"});

        return;
      }

      if (this.fun.isTextEmpty(this.sourceMoney)) {
        this.$dialog.alert({message:"请输入充值金额"});

        return;
      }

      if (this.sourceMoney <= 0) {
        this.$dialog.alert({message:"充值金额必需大于0"});
        return;
      }

      //组装json
      let json = {
        goods_id: this.goods_id, //商品id
        account: this.userCode, //户号
        api_goods_id: this.keyIds, //缴费单位
        contract: this.contract, //合同号
        price: this.sourceMoney, //充值金额
        total: 1,
        option_id: "",
        orders: JSON.stringify(this.assembleDeduction())
      };

      let that = this;

      $http
        .get(
          "plugin.live.Frontend.Modules.Order.Controllers.goods-buy",
          json,
          "提交中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              //跳转确定优惠组合
              that.$router.push(
                that.fun.getUrl("electricityPay", {
                  para: JSON.stringify(json)
                })
              );
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }

      return deductions;
    },

    //获取地址信息
    getAddressDataInfo() {
      let that = this;
      $http
        .get(
          "member.member-address.address",
          { i: this.fun.getKeyByI(), type: this.fun.getTyep() },
          ""
        )
        .then(
          function(response) {
            if (response.result == 1) {
              var province = JSON.stringify(response.data.province);
              var city = JSON.stringify(response.data.city);
              var district = JSON.stringify(response.data.district);
              localStorage.setItem("province", province);
              localStorage.setItem("city", city);
              localStorage.setItem("district", district);

              //初始化数据
              that.initProvice();
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});

          }
        );
    },

    //初始化省数据
    initProvice() {
      var province = localStorage.getItem("province");
      var provinces = [];
      provinces = JSON.parse(province);
      this.provinceoptions = provinces;
      var arrayOfSquares = this.provinceoptions.map(function(item) {
        return item.areaname;
      });
      this.columns = arrayOfSquares;
      console.log("---swich-----", this.provinceoptions);
    },
    /*以下四个都是下拉省份选择相关方法*/
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
    },
    onConfirmbtn: function(val, index) {
      this.dateshow_1 = false;
      this.regional = val;
      var array = this.provinceoptions;
      this.provicevalue = array[index].id;
      this.cityvalue = "";
      this.cityoptions = [];
      var citys = [];
      var city = localStorage.getItem("city");
      citys = JSON.parse(city);
      // console.log(citys)
      for (let i = 0; i < citys.length; i++) {
        let item = citys[i];
        // if (item.parentid == value.id) {
        // 	this.cityoptions.push(item);
        // 	// = this.cityoptions[0].areaname;
        // }
        if (item.parentid == array[index].id) {
          this.cityoptions.push(item);
        }
      }
      var arrayOfSquares = this.cityoptions.map(function(item) {
        return item.areaname;
      });
      this.columns_1 = arrayOfSquares;
      this.regiona2 = "请选择城市";
    },
    /*以下四个都是下拉市选择相关方法*/
    seleRegional_1: function() {
      this.dateshow_2 = true;
    },
    onChange(picker, value, index) {},
    onCancelbtn_1: function(val, index) {
      this.dateshow_2 = false;
    },
    onConfirmbtn_1: function(val, index) {
      this.dateshow_2 = false;
      this.regiona2 = val;
      var array = this.cityoptions;
      this.cityvalue = array[index].id;
      this.company = "";
      this.slots[0].values = "";
      // this.getPaymentCompanyList(2, this.form.provicevalue, value.areaname);
      this.getPaymentCompanyList(2, this.form.provicevalue, array[index].id);
    }
  },
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    },
    citynull: function() {
      return this.columns_1.length > 0 ? false : true;
    }
  },
  watch: {
    getLangState(val) {
      if (val) {
        this.language = JSON.parse(sessionStorage.languageService).electricity;
      } else {
        this.language = this.$store.state.service.languageService.electricity;
      }
    }
  },

  mounted() {
    this.userCode = localStorage.getItem("tempElectri");
    // 获得省份
    this.initProvice();

    if (sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).electricity;
    } else {
      this.language = this.$store.state.service.languageService.electricity;
    }
  },

  activated() {
    this.$store.commit("onload");
    this.userCode = localStorage.getItem("tempElectri");
    this.initData();
  }
};
