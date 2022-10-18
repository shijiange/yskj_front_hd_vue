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
      language: {},
      goods: [], //固话费用集合
      fixedPhone: "", //固话号
      popupVisible: false, //pop显示
      provicevalue: "", //省份信息
      cityvalue: "", //城市信息
      provinceoptions: [], //省份
      cityoptions: [], //城市
      form: { provicevalue: "", cityvalue: "", keyId: "" },
      itemId: "", //被选中的id
      currentItem: "", //当前选择的规格
      checkDeductionList: [], //优惠信息验证数组

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
      company: "",
      disableds: true, //禁止提交
      score: 600,
      scoreMoney: 6.0,
      computedMoney: 0.0,
      sourceMoney: 0.0,
      useScore: false
    };
  },
  methods: {
    //初始化参数
    initData() {
      this.itemId = ""; //选择id
      this.currentItem = ""; //当前选择的规格
      this.provicevalue = ""; //省份信息
      this.cityvalue = ""; //城市信息
      this.goods_id = ""; //商品id
      this.fixedPhone = ""; //固话号
      this.checkDeductionList = []; //优惠信息验证数组
      this.goods = []; //话费规格集合

      //处理万一没有地址数据
      var province = localStorage.getItem("province");
      if (this.fun.isTextEmpty(province)) {
        this.getAddressDataInfo(); //获取地址json数据
      }
    },

    //选择规格处理
    selectStyle(e, item) {
      console.log(item);
      this.itemId = item.itemId;
      this.currentItem = item;
    },
    //选择省份的响应方法
    selectProviceHandle(value) {
      console.log(this.provinceoptions);
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
    // 1-固话；2-宽带
    getPaymentCompanyList(val, province, city) {
      let that = this;
      if (!city) return;
      $http
        .get(
          "plugin.phone.api.goods.directRecharge",
          { category: val, province, city },
          "加载中..."
        )
        .then(
          response => {
            if (response.result == 1) {
              that.goods = []; //清空数据

              that.goods = response.data;
              that.goods_id = response.data[0].goods_id; //组建goods_id
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
          }
        );
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
    },

    chooseCompony() {
      this.popupVisible = !this.popupVisible;
    },
    onValuesChange(picker, values) {
      picker.setColumnValue(1, values[0]);
      this.company = values[0];
    },

    confirm() {
      if (this.fun.isTextEmpty(this.fixedPhone)) {
        this.$dialog.alert({message:"请输入固定电话号码!"});
        return;
      }

      if (this.fun.isTextEmpty(this.provicevalue)) {
        this.$dialog.alert({message:"请选择省份!"});
        
        return;
      }

      if (this.fun.isTextEmpty(this.cityvalue)) {
        this.$dialog.alert({message:"请选择城市!"});
        
        return;
      }

      if (
        this.fun.isTextEmpty(this.itemId) ||
        this.fun.isTextEmpty(this.currentItem)
      ) {
        this.$dialog.alert({message:"请选择充值面额!"});
       
        return;
      }

      //组装json
      let json = {
        goods_id: this.goods_id, //商品id
        account: this.fixedPhone, //固话号
        api_goods_id: this.currentItem.itemId, //规格id
        price: this.currentItem.price, //充值金额
        total: 1,
        option_id: "",
        orders: JSON.stringify(this.assembleDeduction())
      };

      let that = this;

      $http
        .get(
          "plugin.phone.Frontend.Modules.Order.Controllers.goods-buy",
          json,
          "提交中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              //跳转确定优惠组合
              that.$router.push(
                that.fun.getUrl("fixedTelephonePay", {
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
    /*以下四个都是下拉省份选择相关方法*/
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) {},
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
        this.language = JSON.parse(
          sessionStorage.languageService
        ).fixedTelephone;
      } else {
        this.language = this.$store.state.service.languageService.fixedTelephone;
      }
    }
  },

  mounted() {
    // 获得省份
    this.initProvice();
    if (sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).fixedTelephone;
    } else {
      this.language = this.$store.state.service.languageService.fixedTelephone;
    }
  },

  activated() {
    this.$store.commit("onload");
    this.initData();
  }
};
