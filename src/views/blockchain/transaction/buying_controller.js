import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      show2: false,
      asset_id: '',
      // 订单信息
      order_data: "",
      goods_price: 0,
      deduction_price: 0,
      price: 0,
      submit_active: true,
      buying: {},
      buyNum: '',
      //抵扣
      checkDeductionList: [],
      lang: {
        subscription_name:''
      },

      name: '',
      buyDataApi : '',
      buyApi: '',
    };
  },
  activated() {
    this.asset_id = this.$route.params.asset_id;
    this.getLang();
    this.initData();
    this.getBuying();
  },
  computed: {
    isMore() {
      return Number(this.buyNum) > this.buying.spare;
    }
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.fun.setWXTitle(name === 'buy'? this.lang.buy_name : this.lang.subscription_name);
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.name = this.$route.query.name;
      if(this.name === 'buy'){
        this.buyDataApi = 'plugin.asset.Frontend.Modules.Order.Controllers.buy.index';
        this.buyApi = 'plugin.asset.Frontend.Modules.Order.Controllers.buyCreate.index';
      }else{
        this.buyDataApi = 'plugin.asset.Frontend.Modules.Order.Controllers.subscription.index';
        this.buyApi = 'plugin.asset.Frontend.Modules.Order.Controllers.subscriptionCreate.index';
      }

      this.order_data = "";
      this.goods_price = 0;
      this.deduction_price = 0;
      this.price = 0;

      this.submit_active = true;
      this.show2 = false;
      this.buying = {};
      this.buyNum = '';
      this.checkDeductionList = [];
    },
    getBuying() {
      let json = this.assembleJson();
      $http.post(this.buyDataApi, json, " ").then(response => {
        if (response.result === 1) {
          this.setViewData(response.data);
        } else {
          Toast(response.msg);
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //设置界面
    setViewData(data) {
      if(this.name === 'buy'){
        this.buying = data.asset_sell_records;
        this.buyNum =this.buying.total;
        this.order_data = data.orders[0];
        this.goods_price = data.total_goods_price; //设置商品总价格
        this.deduction_price = data.total_deduction_price; //设置总抵扣价格
        this.price = data.total_price; //设置总价格（合计）
      } else {
        this.buying = data.asset_digitization;
        this.order_data = data.orders[0];
        this.goods_price = data.total_goods_price; //设置商品总价格
        this.deduction_price = data.total_deduction_price; //设置总抵扣价格
        this.price = data.total_price; //设置总价格（合计）
      }

    },

    //组装抵扣信息
    assembleDeduction() {
      let deductions = [];

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },
    //筛选抵扣
    screenDiscount(item, value) {

      //临时数据
      let _deductionItem = {};
      let tempDeduction_ids = [];

      if (value.checked) {
        //选中添加

        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              //先获取回来
              if (this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }

              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {

            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          } else {

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          }

        } else {

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          } else {
            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          }

        }

      } else {
        //取消选中
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              //先获取回来
              if (this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }
              this.checkDeductionList.splice(i, 1);
              break;
            }
          }


          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            //tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          } else {
            //tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);

          }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            //tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);
          } else {
            //tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            this.checkDeductionList.push(_deductionItem);
          }
        }
      }

    },

    //抵扣选择响应
    discountHandle(item, value) {
      this.screenDiscount(item, value);

      //重新计算
      this.getBuying();
    },

    //组装json数据
    assembleJson() {
      let json = {};
      if(this.name === 'buy'){
        json = {
          asset_sell_records_id: this.asset_id,
          orders: JSON.stringify(this.assembleDeduction()),
        };
      } else {
        json = {
          asset_id: this.asset_id,
          total: this.buyNum,
          orders: JSON.stringify(this.assembleDeduction()),
        };
      }

      return json;
    },

    //提交订单
    submit() {
      if (this.isMore) {
        Toast('超出可'+this.lang.subscription_name+'数量');
        return;
      }
      if (!this.buyNum) {
        Toast('请输入'+this.lang.subscription_name+'数量');
        return;
      }
      if (this.submit_active === true) {
        this.submit_active = false;

        let that = this;
        let json = this.assembleJson();
        $http.post(this.buyApi, json, "提交中").then((response) => {
          that.submit_active = true;
          if (response.result === 1) {
            that.$router.push(that.fun.getUrl('orderpay', {
              status: "2",
              order_ids: response.data.order_ids
            }));
          } else {
            Toast(response.msg);
          }
        }, function (response) {
          console.log(response);
        });

      }

    },

  },
  components: {cTitle}
};
