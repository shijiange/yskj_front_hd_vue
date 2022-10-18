import cTitle from "components/title";
import { Toast } from 'vant';
import yzSubscribe from "components/ui_components/yz_subscribe";

export default {
  data() {
    return {
      Data: [],
      selectBol: true,
      isCheckAll: false,
      checkAll: false,
      checkList: [],
      allCheckList: [],
      unAllCheckList: [],
      datasource: [],

      // 是否提现到微信
      withdrawToWechat: 0,
      // 是否提现到支付宝
      withdrawToAlipay: 0,
      // 提现总金额
      totalwithdrawal: 0.0,
      // 手续费
      poundage: 0.0,
      // 劳务税
      servicetax: 0.0,

      // alipay
      isAlipay: false,
      alipay: {},

      // wechat
      isWechat: false,
      wechat: {},

      // yop_pay
      isyop_pay: false,
      yop_pay: {},

      //yee_pay
      isyee_pay:false,
      yee_pay:{},

      // high_light_alipay
      ishigh_light_alipay:false,
      high_light_alipay:{},

      // high_light_bank
      ishigh_light_bank:false,
      high_light_bank:{},

      // high_light_wechat
      ishigh_light_wechat:false,
      high_light_wechat:{},

      // balance
      isBalance: false,
      balance: {},

      // manual
      isManual: false,
      manual: {},

      // 是否开启劳务税 手续费 单独费率
      balance_special: false,
      // special_type: "",
      // 单独劳务费
      independent_special: 0.0,
      // 单独手续费
      independent_poundage: 0.0,

      action: "",

      msg: "",

      notice: "",

      popupVisible: false,

      isHx: false,

      converge_pay: {}, // 汇聚

      isEup: false,

      eup: {},
      show1: false,
      pay_type: "",
      clicktag: 0, // 防止快速点击
      //  汇聚需要的数据
      converge_pay_json: {},
      isHj: false,
      special_service_tax_text: "", // 自定义劳务税
      service_switch: 0, // 劳务税开关
      show2: false, // 判断
      show3: false, // 银行卡列表
      withList: [], // 银行卡列表
      checkObj: {}, // 选中的银行卡
      poundage_hj: "", // 汇聚提现手续费
      actual_amount: "", // 实际到账金额

      poundage_name: '',//手续费字样
      deduction_love: {},   //爱心值扣除
      TeamDividendModel: false,
      income_name_text:'',
      // 收入提现类型
      income_type: null,
      withType:true,
      withTypeTipsTitle:'',
      withTypeTips:'',
      withTypeTipsIcon:'',
      bankdata:{
        bankname:'',
        Province:'',
        city:'',
        branchName:'',
        card:'',
        name:''
      },
      // ['提现记录','提现规则说明','联系客户']
      toastTxt: [
        {
          name: `${this.fun.initWithdrawal()}记录`,
          url: "presentationRecord"
        },
        {
          name: `${this.fun.initWithdrawal()}规则说明`,
          url: "fa_child"
        },
        {
          name: "联系客服",
          url: "fa_child_two"
        }
      ],
      manualList:[],
      // 填写银行卡信息弹窗
      createCardShow:false,
      // 省市区选择弹窗
      addressShow_p:false,
      district: district, // 地址本地数据
      provinceData:[],
      cityData:[],
      showCityData:[],
      ProvinceId:'',
      addressShow_c:false,
      pay_typeList:[],
      all_withdraw_income:'',
      stickStatus:false,
      // 客服
      customer_service:{},
      // 规则说明
      withdraw_rich_text:{},
      // 客服显示
      customer_show:false,
      // 规则显示
      withdraw_rich_show:false,
      // 独立手续费
      // special_poundage_amount:false
      setWX:false,
      setAlipay:false,
      setinWX:'',
      setinAlipay:'',
      setinAlipayName:''
    };
  },

  activated() {
    this.income_type = null;
    this.selectBol = true;
    this.clicktag = 0;
    this.show1 = false;
    this.checkAll = false;
    this.checkList = [];
    this.allCheckList = [];
    this.unAllCheckList = [];
    this.datasource = [];
    this.totalwithdrawal = "0.00";
    this.poundage = "0.00";
    this.servicetax = "0.00";
    this.service_switch = 0;

    this.balance_special = false;
    // this.special_type = ""
    this.independent_special = "0.00";
    this.independent_poundage = "0.00";
    this.poundage_hj = "0.00";
    this.actual_amount = "0.00";

    this.getData(); // 初始化数据
    // this.getWithdrawType(); // 获取提现方式

    this.customizeIncome();
    this.dynamicTxt();
  },

  methods: {
    titleTap(e){
      console.log(e,'sasasas');
      if(e == 'fa_child'){
        this.withdraw_rich_show = true;
      }
      if(e == 'fa_child_two'){
        this.customer_show = true;
      }
    },
    onClickLeft(){
      this.withdraw_rich_show = false;
      this.customer_show = false;
    },
    numberToFix(opt) {
      if (opt) {
        const str = opt + "";    //把数字变成string类型
        if (str.indexOf(".") !== -1) {  //判断是否附带小数
          const intSum = str
            .substring(0, str.indexOf("."))
            .replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
          const dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索
          const ret = intSum + dot;
          return ret;
        } else {
          const ret = str.replace(/\B(?=(?:\d{3})+$)/g, ",");
          return ret + ".00";
        }
      } else {
        return "0.00";
      }
    },
    confirmSub(e){
      this.checkPayWay();
    },
    errorSub(err){
      console.log(err);
      this.checkPayWay();
    },
    // 单选
    selectBolfun(num) {
      num == 1 ? (this.selectBol = true) : (this.selectBol = false);
    },
    // 单选的时候显示提现金额
    getOnecePrice(){
      let income_type = [];
      this.checkList.forEach((item)=>{
        income_type.push(item.key_name);
      });
      $http.post("finance.income-withdraw.getMergeServicetax", {income_type},'loading').then(
        (response)=> {
          if (response.result === 1) {
            this.totalwithdrawal = response.data.sum_amount;
            this.poundage = response.data.poundage_amount;
            this.servicetax = response.data.servicetax_amount;
            this.independent_poundage = response.data.special_poundage_amount;
            this.independent_special = response.data.special_tax_amount;
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    getMergeServicetax(){

      if(!this.income_type) {
        Toast('请先选择提现类型');
        return;
      }
      let income_type = [];
      this.checkList.forEach((item)=>{
        income_type.push(item.key_name);
      });
      $http.post("finance.income-withdraw.getMergeServicetax", {income_type},'loading').then(
        (response)=> {
          if (response.result === 1) {
            console.log(response);
            this.totalwithdrawal = response.data.sum_amount;
            this.poundage = response.data.poundage_amount;
            this.servicetax = response.data.servicetax_amount;
            this.confirmSub();
            // this.getWithdrawType();
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );

    },

    // 获取提现方式
    getWithdrawType(key = true) {
      // if(Object.keys(this.pay_typeList).length != 0){
      //   if(key){
      //     this.show1 = true;
      //   }
      //   this.initWithdrawType(response.data);
      //   return
      // }
      $http.get("finance.income-withdraw.get-income-withdraw-mode", {income_type: this.income_type},'loading').then(
        (response)=> {
          if (response.result === 1) {
            if(key){
              this.show1 = true;
            }
            this.pay_typeList = response.data;
            this.initWithdrawType(response.data);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // 获取银行卡列表
    getwithList() {
      $http
        .get(
          "plugin.converge_pay.frontend.controllers.converge-pay-bank-card.get-bank-card-list"
        )
        .then(res => {
          if (res.result == 1) {
            res.data.map(item => {
              if (res.data.length == 0) {

                this.$dialog.alert({message:"请先去添加银行卡"});
                setTimeout(() => {
                  this.$router.push(this.fun.getUrl("bankCardInformation"));
                }, 2000);
              }
              item.check = false;
              if (
                item.receiverAccountNoEnc != "" &&
                item.receiverAccountNoEnc != null
              ) {
                item.bankName +=
                  "(" +
                  item.receiverAccountNoEnc.substring(
                    item.receiverAccountNoEnc.length - 4
                  ) +
                  ")";
              }
            });
            this.withList = res.data;
          } else {
            this.$dialog.alert({message:res.msg});

          }
        });
    },
    checkOut(item) {
      item.check = !item.check;
      this.withList.map(val => {
        if (val.id == item.id) {
          val.check = !item.check;
        } else {
          val.check = false;
        }
      });
      if (item.check == true) {
        this.show3 = false;
        this.show2 = true;
        this.checkObj = item;
      }
    },
    backTap() {
      this.show2 = false;
      this.show1 = true;
      this.show3 = false;
    },
    gotoList() {
      this.show2 = false;
      this.show1 = false;
      this.show3 = true;
    },
    // 初始化提现方式
    initWithdrawType(data) {
      // this.service_switch = data.service_switch;
      // 支付宝
      this.initAlipay(data);
      // 微信
      this.initWechat(data);
      // 余额
      this.initBalance(data);
      // 手动打款
      this.initManual(data);
      // 环迅支付
      // this.initHxbtn(data);

      // eup支付
      this.initEup(data);
      // 初始化易宝
      this.inityop_pay(data);
      // 易宝代付签约
      this.inityee_pay(data);
      // 高灯代付支付宝-签约
      this.inithigh_light_alipay(data);
      // 高灯代付银行卡-签约
      this.inithigh_light_bank(data);
      // 高灯代付微信-签约
      this.inithigh_light_wechat(data);
      // 提现到汇聚
      this.initconverge_pay(data);
    },

    // 支付宝
    initAlipay(data) {
      if (!data.alipay) {
        this.isAlipay = false;
        return;
      }
      this.isAlipay = true;
      this.alipay = data.alipay;
    },

    // 微信
    initWechat(data) {
      if (!data.wechat) {
        this.isWechat = false;
        return;
      }
      this.isWechat = true;
      this.wechat = data.wechat;
    },

    // 易宝
    inityop_pay(data) {
      if (!data.yop_pay) {
        this.isyop_pay = false;
        return;
      }
      this.isyop_pay = true;
      this.yop_pay = data.yop_pay;
    },

    // 易宝代付签约
    inityee_pay(data) {
      if (!data.yee_pay) {
        this.isyee_pay = false;
        return;
      }
      this.isyee_pay = true;
      this.yee_pay = data.yee_pay;
    },
    // 高灯代付支付宝签约
    inithigh_light_alipay(data) {
      if (!data.high_light_alipay) {
        this.ishigh_light_alipay = false;
        return;
      }
      this.ishigh_light_alipay = true;
      this.high_light_alipay = data.high_light_alipay;
    },
    // 高灯代付银行卡签约
    inithigh_light_bank(data) {
      if (!data.high_light_bank) {
        this.ishigh_light_bank = false;
        return;
      }
      this.ishigh_light_bank = true;
      this.high_light_bank = data.high_light_bank;
    },
    // 高灯代付微信签约
    inithigh_light_wechat(data) {
      if (!data.high_light_wechat) {
        this.ishigh_light_wechat = false;
        return;
      }
      this.ishigh_light_wechat = true;
      this.high_light_wechat = data.high_light_wechat;
    },


    // 余额
    initBalance(data) {
      if (!data.balance) {
        this.isBalance = false;
        return;
      }
      this.isBalance = true;
      this.balance = data.balance;
    },

    // 手动打款
    initManual(data) {
      if (!data.manual) {
        this.isManual = false;
        return;
      }
      // let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
      this.isManual = true;
      this.manual = data.manual;
      console.log(this.manual);
      // if(mailLanguage.income){
      //   this.manual.name = this.fun.initWithdrawal() + mailLanguage.income.manual_withdrawal;
      // }
    },

    // eup支付
    initEup(data) {
      if (!data.eup_pay) {
        this.isEup = false;
        return;
      }
      this.isEup = true;
      this.eup = data.eup_pay;
    },

    // 提现汇聚
    initconverge_pay(data) {
      if (!data.converge_pay) {
        this.isHj = false;
        return;
      }
      this.isHj = true;
      this.converge_pay = data.converge_pay;
    },
    // 汇聚提现
    PayWayHj() {
      if (!this.fun.isTextEmpty(this.checkObj.bankName)) {
        this.getTp();
      } else {
        this.$dialog.alert({message:"请选择银行卡"});

      }
    },
    // 提交银行卡的东西
    getTp() {
      console.log(this.checkObj);

      $http
        .post(
          "plugin.converge_pay.frontend.controllers.converge-pay-bank-card.set-bank-card",
          { set: this.checkObj }
        )
        .then(res => {
          if (res.result == 1) {
            var type = "converge_pay";
            this.withdrawToBalance(type);
          } else {
            this.$dialog.alert({message:res.msg});

          }
        });
    },
    getGconverge_pay(val) {
      $http
        .get(
          "plugin.converge_pay.frontend.controllers.converge-pay-bank-card.get-bank-card"
        )
        .then(res => {
          if (res.result == "1") {
            this.converge_pay_json = res.data;
            this.countTotalPrice();
            this.show2 = true;
            this.show1 = false;
            this.checkObj = res.data;
            this.checkObj.bankName =
              res.data.bankName +
              "(" +
              res.data.receiverAccountNoEnc.substring(
                res.data.receiverAccountNoEnc.length - 4
              ) +
              ")";
            this.getwithList(); // 获取银行卡列表
          } else {

            this.$dialog.alert({message:res.msg});
            setTimeout(() => {
              this.$router.push(this.fun.getUrl("bankCardInformation"));
            }, 2000);
          }
        });
    },
    stickChange(e){
      this.stickStatus = e;
    },
    // 初始化数据
    getData() {
      // validate_page 实名认证判断
      $http
        .get(
          "finance.income-withdraw.get-withdraw", {validate_page: 1}, "正在获取列表"
        )
        .then(
          (response)=> {
            if (response.result === 1) {
              if (response.data.shop_esign) {
                this.$dialog.alert({message:"有合同未签署"});
                this.$router.push(this.fun.getUrl('contractListPlu'));
              }
              this.all_withdraw_income = response.data.all_withdraw_income?response.data.all_withdraw_income.toFixed(2):'';
              this.service_switch = response.data.setting.service_switch;
              this.balance_special = response.data.setting.balance_special;
              this.customer_service = response.data.setting.customer_service||{};
              this.withdraw_rich_text = response.data.setting.withdraw_rich_text||{};
              this.special_type = response.data.special_type;
              this.datasource = response.data.data;
              if (response.data.deduction_love) {
                this.deduction_love = response.data.deduction_love;
              }
              this.Data = response.data.data;
              if (this.Data.length > 0) {
                this.allCheckListInit(response.data.data); // 初始化全选数据
              } else {
                this.$dialog.alert({message:"暂无可提现金额"});

              }

            } else {
              Toast(response.msg);
            }
          },
          function (response) {
            Toast(response.msg);
          }
        );
    },

    // 初始化全选数据
    allCheckListInit(data) {
      // this.allCheckList = data
      for (let i = 0; i < data.length; i++) {
        if (!data[i].can) {
          this.unAllCheckList.push(data[i]);
        } else {
          // 全选默认选中default的选项
          if(data[i].income_type === 'default') {
            this.allCheckList.push(data[i]);
          }
        }
      }
      // 判断全选状态
      this.isCheckAll = !(
        this.unAllCheckList.length === this.datasource.length
      );
    },
    //提现方式选择监听
    SelectHandle(val){
      this.dynamicTxt();
      this.show1 = false;
    },
    cardSplice(str){
      if(!str) return;
      let str_a = str.substr(0,4);
      let str_b = str.substr(str.length-4,str.length);
      return `${str_a}****${str_b}`;
    },
    dynamicTxt(){
      let list = this.pay_typeList;
      let manual;
      switch (this.pay_type) {
      case "balance":
        this.withTypeTipsTitle=`${list.balance.name}`;
        this.withTypeTipsIcon = 'iconfont icon-fontclass-fanli';
        this.withTypeTips = `通过审核后将打款到系统${list.balance.other_name}！`;
        break;
      case "wechat":
        this.withTypeTipsTitle=`${list.wechat.name}`;
        this.withTypeTipsIcon = 'iconfont icon-card_weixin';
        this.withTypeTips = `通过审核后将打款到个人微信零钱！`;
        break;
      case "manual":
        manual = this.manual;
        this.withTypeTipsIcon = 'iconfont icon-pay_otherpay';
        if(manual.manual_type == 1){
          this.withTypeTipsTitle=`${manual.name}-银行卡`;
          this.withTypeTips = `通过审核后将由工作人员打款到您的银行卡！`;
        }else if(manual.manual_type == 2){
          this.withTypeTipsTitle=`${manual.name}-微信`;
          this.withTypeTips = `通过审核后将由工作人员打款到您的微信！`;
        }else if(manual.manual_type == 3){
          this.withTypeTipsTitle=`${manual.name}-支付宝`;
          this.withTypeTips = `通过审核后将由工作人员打款到您的支付宝！`;
        }
        break;
      case "alipay":
        this.withTypeTipsIcon = 'iconfont icon-all_alipay';
        this.withTypeTips = `通过审核后将打款到个人支付宝！`;
        this.withTypeTipsTitle=`${list.alipay.name}`;
        break;
      case "high_light_alipay":
        this.withTypeTipsIcon = 'iconfont icon-all_alipay';
        this.withTypeTips = `通过审核后将打款到个人支付宝！`;
        this.withTypeTipsTitle=`${list.high_light_alipay.name}`;
        break;
      case "high_light_bank":
        this.withTypeTipsIcon = 'iconfont icon-balance_g';
        this.withTypeTipsTitle=`${list.high_light_bank.name}`;
        break;
      case "high_light_wechat":
        this.withTypeTipsIcon = 'iconfont icon-card_weixin';
        this.withTypeTipsTitle=`通过审核后将打款到个人微信零钱！`;
        break;
      case "converge_pay":
        this.withTypeTipsIcon = 'iconfont icon-pay_otherpay';
        this.withTypeTipsTitle=`${list.converge_pay.name}`;
        this.withTypeTips=`通过审核后将打款到个人银行卡！`;
        break;
      default:
        // this.withTypeTipsIcon = 'iconfont icon-fontclass-fanli';
        // this.withTypeTipsTitle='余额';
        this.pay_type = '';
        break;
      }
    },
    // 全选监听
    allSelectHandle(value) {
      if(value.length > 0) {
        this.income_type = value[0].income_type;
      }else {
        this.income_type = null;
      }
      console.log(this.selectBol,value,'ssss');
      if(value.length == 0){
        // 提现总金额
        this.totalwithdrawal = 0.0; // 初始化
        // 手续费
        this.poundage = 0.0; // 初始化
        // 劳务费手续费
        this.servicetax = 0.0; // 初始化
        // 单独劳务税
        this.independent_special = 0.0; // 初始化
        // 单独手续费
        this.independent_poundage = 0.0; // 初始化
        this.actual_amount = 0.0; // 初始化
        return;
      }
      this.getOnecePrice();
      if (!this.selectBol) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.allCheckList.length;
        // 计算总价格
        this.countTotalPrice();
      }
    },

    // 全选
    allSelect(event) {
      if (this.selectBol) {
        console.log("全选");

        // 监听全选变化
        if(event) {
          this.checkList = this.allCheckList;
          this.income_type = 'default';
        }else {
          this.checkList = [];
          this.income_type = null;
        }
        // 计算总价格
        this.countTotalPrice();
      }
    },

    // 计算总价格
    countTotalPrice() {
      this.TeamDividendModel = false;
      // 提现总金额
      this.totalwithdrawal = 0.0; // 初始化
      // 手续费
      this.poundage = 0.0; // 初始化
      // 劳务费手续费
      this.servicetax = 0.0; // 初始化
      // 单独劳务税
      this.independent_special = 0.0; // 初始化
      // 单独手续费
      this.independent_poundage = 0.0; // 初始化
      this.actual_amount = 0.0; // 初始化
      for (let i = 0; i < this.checkList.length; i++) {
        // this.totalwithdrawal += (this.checkList[i].income)
        // this.poundage += (this.checkList[i].goods.poundage)
        this.totalwithdrawal = this.floatAdd(
          this.totalwithdrawal,
          this.checkList[i].income
        );
        this.poundage = this.floatAdd(
          this.poundage,
          this.checkList[i].poundage
        );
        this.poundage_hj = this.poundage;
        this.actual_amount = this.floatAdd(
          this.actual_amount,
          this.checkList[i].actual_amount
        );
        // console.log(this.actual_amount, "实际到账金额");
        //
        // console.log(this.poundage, "手续费");

        this.servicetax = this.floatAdd(
          this.servicetax,
          this.checkList[i].servicetax
        );

        if (this.checkList[i].type.indexOf("\\TeamDividendModel") >= 0) {
          this.TeamDividendModel = true;
        }
        // 是否有单独余额劳务费
        if (this.balance_special) {
          if (this.special_type == "1") {
            // 最新
            this.independent_special = this.floatAdd(
              this.independent_special,
              this.checkList[i].special_service_tax
            );
            this.independent_poundage = this.floatAdd(
              this.independent_poundage,
              this.checkList[i].special_poundage_rate
            );
          } else {
            this.independent_special = this.floatAdd(
              this.independent_special,
              this.checkList[i].special_service_tax
            );
            this.independent_poundage = this.floatAdd(
              this.independent_poundage,
              this.checkList[i].special_poundage
            );
          }
        }
      }

      this.totalwithdrawal = Number(this.totalwithdrawal.toString()).toFixed(2);
      this.poundage = Number(this.poundage.toString()).toFixed(2);
      this.servicetax = Number(this.servicetax.toString()).toFixed(2);

      // 是否有单独余额劳务费
      if (this.balance_special) {
        // 最新
        if (this.special_type == "1") {
          this.independent_special = Number(
            this.independent_special.toString().match(/^\d+(?:\.\d{0,2})?/)
          );
          this.independent_poundage = Number(
            this.independent_poundage.toString().match(/^\d+(?:\.\d{0,2})?/)
          );
        } else {
          this.independent_special = Number(
            this.independent_special.toString().match(/^\d+(?:\.\d{0,2})?/)
          );
          this.independent_poundage = Number(
            this.independent_poundage.toString().match(/^\d+(?:\.\d{0,2})?/)
          );
        }
      }
    },

    // 浮点数加法运算
    floatAdd(arg1, arg2) {
      var r1, r2, m;
      try {
        r1 = arg1.split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (arg1 * m + arg2 * m) / m;
    },

    // 浮点数减法运算
    floatSub(arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      // 动态控制精度长度
      n = (r1 == r2) ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },

    // 验证手动打款的 设置 微信 支付 银行卡 是否完善
    checkManual(type) {
      // 验证是否选择提现数据
      if (!this.checkWithdrawToBalance()) {
        return;
      }
      var that = this;
      $http.post("finance.manual-type.is-can-submit", {}, "").then(
        function (response) {
          that.clicktag = 0;
          if (response.result === 1) {
            if (response.data.status) {
              that.withdrawToBalance(type); // 提现
            } else {
              that.setManualInfo(type, response.data.manual_type);
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function (response) {
          that.clicktag = 0;
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    // 验证易宝是否注册
    checkyop_pay(type) {
      // 验证是否选择提现数据
      if (!this.checkWithdrawToBalance()) {
        return;
      }
      var that = this;
      $http.get("plugin.yop-pay.api.yop-verification", {}, "").then(
        function (response) {
          that.clicktag = 0;
          if (response.result === 1) {
            that.withdrawToBalance(type); // 提现
          } else {
            that.$dialog.alert({message:response.msg});

            that.$router.push(that.fun.getUrl("info", {}));
          }
        },
        function (response) {
          that.clicktag = 0;
          that.$dialog.alert({message:response.msg});

        }
      );
    },

    setManualInfo(type, manual_type) {
      let msg = "";
      let routerPath = "";

      switch (manual_type) {
      case "bank":
        msg = "请先填写银行卡信息";
        routerPath = "memberBank";
        break;
      case "wechat":
        msg = "请先填写微信信息";
        routerPath = "wx";
        break;
      case "alipay":
        msg = "请先填写支付宝信息";
        routerPath = "Alipay";
        break;
      default:
        break;
      }

      // let that = this
      this.$dialog.alert({ message: msg})
        .then(() => {
          if(routerPath == 'memberBank'){
            this.getBankCard();
          }else if(routerPath == 'wx'){
            this.setWX = true;
          }else if(routerPath == 'Alipay'){
            this.setAlipay = true;
            // this.$router.push(this.fun.getUrl(routerPath));
          }
        }).catch(() => {});

    },
    addressShowProvince(){
      if(this.provinceData.length > 0){
        this.createCardShow = false;
        this.addressShow_p = true;
      }else{
        $http.post("member.member-address.address", "").then((response) => {
          if (response.result == 1) {
            this.provinceData = response.data.province;
            this.cityData = response.data.city;
            this.createCardShow = false;
            this.addressShow_p = true;
          }
        }, (response) => {
          that.$dialog.alert({ message: response.msg });
        });
      }
    },
    editUser(){
      this.getBankCard();
    },
    addressShowCity(){
      if(!this.ProvinceId){
        Toast('请先选择省');
        return;
      }
      this.createCardShow = false;
      this.addressShow_c = true;
      for(let i = 0;i<this.cityData.length;i++){
        if(this.cityData[i].parentid == this.ProvinceId){
          this.showCityData = this.showCityData.concat(this.cityData[i]);
        }
      }
    },
    addressCallback(e){
      this.bankdata.Province = e.areaname;
      this.ProvinceId = e.id;
      this.showCityData = [];
      this.bankdata.city = '';
      this.createCardShow = true;
      this.addressShow_p = false;
    },
    addressCallback_c(e){
      this.bankdata.city = e.areaname;
      this.createCardShow = true;
      this.addressShow_p = false;
    },
    onCancel(e){
      this.createCardShow = true;
      this.addressShow_p = false;
      this.addressShow_c = false;
    },
    // 获取银行卡信息
    getBankCard(){
      let json = {};
      let that = this;
      $http.post("member.bank-card.show", json, "").then((response) => {

        if (response.result == 1) {
          this.bankdata.bankname = response.data.bank_name;
          this.bankdata.card = response.data.bank_card;
          this.bankdata.name = response.data.member_name;
          this.bankdata.Province = response.data.bank_province;
          this.bankdata.city = response.data.bank_city;
          this.bankdata.branchName = response.data.bank_branch;
          this.createCardShow = true;
        } else {
          that.$dialog.alert({ message: response.msg });
        }
      }, (response) => {
        that.$dialog.alert({ message: response.msg });
      });
    },
    // 微信号设置
    bindSet(key){
      let json = {};
      if(key == 'wx'){
        if(this.fun.isTextEmpty(this.setinWX)){
          Toast('请输入微信号');
          return;
        }
        json.wx = this.setinWX;
      }else{
        if(this.fun.isTextEmpty(this.setinAlipay)){
          Toast('请输入支付宝账号');
          return;
        }
        if(this.fun.isTextEmpty(this.setinAlipayName)){
          Toast('请输入支付宝账号姓名');
          return;
        }
        json.alipay = this.setinAlipay;
        json.alipay_name = this.setinAlipayName;
      }
      $http.post("member.member.updateWxOrAli", json, "绑定中...").then((response) => {
        if (response.result == 1) {
          Toast(response.msg);
          this.setWX = false;
          this.setAlipay = false;
        } else {
          this.setWX = false;
          this.setAlipay = false;
          Toast(response.msg);
        }
      }, (response) => {
      });
    },
    // 银行卡信息提交
    bindCard(){
      if (this.fun.isTextEmpty(this.bankdata.bankname)) {
        Toast({
          message: "请输入开户行",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bankdata.Province)) {
        Toast({
          message: "请输入开户行省份",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bankdata.city)) {
        Toast({
          message: "请输入开户行城市",
          timeout: 1500
        });
        return;
      }


      if (this.fun.isTextEmpty(this.bankdata.branchName)) {
        Toast({
          message: "请输入开户行支行",
          timeout: 1500
        });
        return;
      }


      if (this.fun.isTextEmpty(this.bankdata.card)) {
        Toast({
          message: "请输入账号",
          timeout: 1500
        });
        return;
      }

      if (this.fun.isTextEmpty(this.bankdata.name)) {
        Toast({
          message: "请输入姓名",
          timeout: 1500
        });
        return;
      }


      let json = {
        "bank_card": this.bankdata.card,
        "member_name": this.bankdata.name,
        "bank_name": this.bankdata.bankname,
        "bank_province": this.bankdata.Province,
        "bank_city": this.bankdata.city,
        "bank_branch": this.bankdata.branchName
      };
      $http.post("member.bank-card.edit", json, "绑定中...").then((response) => {

        if (response.result == 1) {
          Toast(response.msg);
          this.createCardShow =  false;
          this.getWithdrawType(false);
        } else {
          Toast(response.msg);
        }
      }, (response) => {
      });
    },

    // 验证是否选择提现数据
    checkWithdrawToBalance() {
      if (
        parseFloat(this.totalwithdrawal) <= 0 ||
        this.totalwithdrawal == null
      ) {
        this.clicktag = 0;
        this.$dialog.alert({message:`${this.fun.initWithdrawal()}金额不能等于0`});

        return false;
      } else {
        return true;
      }
    },

    // 提现网络操作
    withdrawToBalance(type) {
      // 验证是否选择提现数据
      if (!this.checkWithdrawToBalance()) {
        return;
      }

      if (this.checkList.length > 0) {
        var data = {
          total: {
            amounts: this.totalwithdrawal,
            poundage: this.poundage,
            pay_way: type
          },
          withdrawal: this.checkList
        };
        // finance.Income-withdraw.save-withdraw
        $http.post("withdraw.apply.index", { data: data }, "正在提交数据").then(
          response => {
            this.clicktag = 0;
            if (response.result === 1) {
              this.$dialog.alert({message:response.msg}).then(()=>{
                this.show1 = false;
                this.totalwithdrawal = "0.00";
                this.poundage = "0.00";
                this.checkList = [];
                this.getData();
              });
              this.show2 = false;
            } else {
              this.$dialog.confirm({ message: response.msg})
                .then(() => {
                  if (response.data.status == 1) {
                    this.$router.push(this.fun.getUrl("info"));
                  }
                  if (response.data.yee_pay == 1) {
                    this.$router.push(this.fun.getUrl("YeePay"));
                  }
                  if (response.data.high_light === 1) {
                    this.$router.push(this.fun.getUrl("HighLight",{value:this.pay_type}));
                  }
                  if(response.data.love == 1){
                  // 任务编号: 46649
                    this.$router.push(this.fun.getUrl("love_index"));
                  }
                }).catch(() => {});
            }
            setTimeout(() => {
              this.clicktag = 0;
            }, 1000);
          });
      } else {
        this.clicktag = 0;
        this.$dialog.alert({message:`${this.fun.initWithdrawal()}数据不可为空`});
        this.clicktag = 0;
      }
    },

    checkEup(type) {
      // 验证是否选择提现数据
      if (!this.checkWithdrawToBalance()) {
        return;
      }
      var that = this;
      $http.post("plugin.eup-pay.api.account.pi-account", {}, "").then(
        response => {
          this.clicktag = 0;
          if (response.result == 1) {
            if (response.data.bool == 1) {
              that.withdrawToBalance(type); // 提现
            }
          } else if (response.result == 0) {

            if (response.data.bool == 0) {
              this.$dialog.alert({ message: response.msg})
                .then(() => {

                  this.$router.push(this.fun.getUrl("info"));
                }).catch(() => {});
            }
          }
        },
        function (response) {
          this.clicktag = 0;
          this.$dialog.alert({message:response.msg});

        }
      );
    },

    checkPayWay() {
      if (!this.pay_type) {
        Toast('请选择提现方式');
        return;
      }
      if (this.pay_type == "converge_pay" && this.clicktag == 1) {
        // 再次调用汇聚提现
        this.getGconverge_pay(this.yop_pay);
      }
      if (this.clicktag === 0) {
        this.clicktag = 1;
        switch (this.pay_type) {
        case "balance":
          this.withdrawToBalance(this.pay_type);
          break;
        case "wechat":
          this.withdrawToBalance(this.pay_type);
          break;
        case "manual":
          this.checkManual(this.pay_type);
          break;
        case "alipay":
          this.withdrawToBalance(this.pay_type);
          break;
        case "eup":
          this.checkEup(this.pay_type);
          break;
        case "yop_pay":
          this.checkyop_pay(this.pay_type);
          break;
        case "yee_pay":
          this.withdrawToBalance(this.pay_type);
          break;
        case "high_light_alipay":
          this.withdrawToBalance(this.pay_type);
          break;
        case "high_light_bank":
          this.withdrawToBalance(this.pay_type);
          break;
        case "high_light_wechat":
          this.withdrawToBalance(this.pay_type);
          break;
        case "converge_pay":
          this.getGconverge_pay(this.yop_pay);
          break;
        default:
          // this.checkEup(this.pay_type);
          Toast("请选择提现方式");
          break;
        }
      }
    },
    // 自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义劳务税字段
      this.special_service_tax_text = mailLanguage.income.special_service_tax;
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
      console.log(this.income_name_text);
      //自定义手续费字段
      this.poundage_name = this.fun.initMailLanguage().income.poundage_name;
      this.fun.setWXTitle(
        `${this.income_name_text}${this.fun.initWithdrawal()}`
      );
    }
  },

  components: { cTitle,yzSubscribe }
};
