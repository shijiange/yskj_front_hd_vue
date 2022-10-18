import { Toast } from 'vant';
import yzAddressList from "components/ui_components/yz_addressList/index";

const TAG_ACTION_CART = "channel_freedom"; // 渠道商（自由发货）购物车结算
var _root_tag = ""; // 0 直接购买 1购物车结算
var currentAddId = "";
var currentAddress = {};
var _cart_ids = [];

var clicktag = 0;

export default {
  data() {
    return {
      integral: window.localStorage.integral,
      order_data: "",
      goodsInfo: {},
      realname: "", // 收件人
      mobile: "",
      address: "",
      price: 0,
      showAddress: false,
      // 其他抵扣
      checkDeductionList: [],
      submit_active: true,
      defaultAddress: {},

      // 留言
      note: [],
    };
  },

  activated() {
    this.initData();
    // 接收参数
    _root_tag = this.$route.params.tag;

    console.log("_root_tag", _root_tag);
    if (this.fun.isTextEmpty(_root_tag)) {
      // 为空跳回
      this.$router.push(this.fun.getUrl("home", {}));
    }

    if (_root_tag == TAG_ACTION_CART) {
      _cart_ids = this.$route.params.cart_ids;
      this.getDataActionCart(); // 购物车结算
    }

  },

  methods: {
    //初始化数据
    initData() {
      this.order_data = [];
      this.goodsInfo = {};
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";
      this.price = 0;
      this.showAddress = false;
      // 抵扣
      this.checkDeductionList = [];
      this.submit_active = true;
      this.defaultAddress = {};

      this.note = [];

      currentAddId = "";
      currentAddress = {};

      _cart_ids = [];
    },

    // 购物车结算
    getDataActionCart() {
      let that = this;
      let json = {
        dispatch_type_id: 1,
        channel_type: 3,
        cart_ids: _cart_ids,
        member_coupon_ids: [],
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress)) //encodeURIComponent为了解决地址#号问题
      };

      let _URL_ActionCart = "plugin.channel.frontend.freedom-cart-buy.index";

      $http.get(_URL_ActionCart, json, "生成中").then(
        (response)=> {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.setViewData(response.data); // 设置界面
            that.setAddressViewData(
              response.data.dispatch.default_member_address
            ); // 设置地址界面
          } else {
            Toast(response.msg);
            that.$router.go(-1);
          }
        },
        (response)=> {
          console.log(response);
        }
      );
    },

    // 设置界面
    setViewData(data) {
      // console.log(data, '参数data')
      this.order_data = data.orders;
      this.price = data.total_price; // 设置总价格（合计）
    },

    // 设置地址界面
    setAddressViewData(model) {
      if (model == undefined || model == "" || model == []) {
        return;
      }

      // 设置地址id
      currentAddId = model.id;
      currentAddress = model;

      this.realname = this.fun.isTextEmpty(model.username)
        ? "" : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? "" : model.province + " " +
        model.city + " " + model.district + " " +
        (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") +
        model.address;
    },

    // 选择地址后重新计算数据
    requestByAddress() {
      // 重新计算
      if (_root_tag == TAG_ACTION_CART) {
        this.order_data = "";
        this.getDataActionCart(); // 购物车结算
      }
    },

    showAddressFun() {
      this.showAddress = true;
    },

    // 增加/修改地址
    confirmSelectAddress(item) {
      this.setAddressViewData(item);
      this.requestByAddress(); // 选择地址后重新计算
      this.showAddress = false;
    },

    // 普通商品提交订单
    submit() {
      console.log("state===res", this.submit_active);
      if (this.submit_active == true) {
        this.submit_active = false;

        if (!this.order_data[0].need_address) {
          if (this.fun.isTextEmpty(currentAddId)) {
            Toast("请选择收货地址");
            this.submit_active = true;
            return;
          }
        }

        let that = this;
        let json = this.assembleJson();

        if (clicktag === 0) {
          clicktag = 1;
          let orderCreate = "plugin.channel.frontend.freedom-create.index";
          $http.post(orderCreate, json, "提交中").then(
            (response)=> {
              if (response.result === 1) {
                Toast("下单成功！");
                that.$router.push(that.fun.getUrl("distributorIndex", {}));
              } else {
                Toast(response.msg);
              }
              that.submit_active = true;
              setTimeout(function() {
                clicktag = 0;
              }, 1000);
            },
            (response)=> {
              that.submit_active = true;
              console.log(response);
            }
          )
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    // 组装json数据
    assembleJson() {
      let json = {
        //公共数据
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        goods: JSON.stringify(this.assembleGoods()),
        member_coupon_ids: JSON.stringify([]),
        orders: JSON.stringify(this.assembleDeduction()),
        // 发票
        invoice_type: 0,
        rise_type: 1,
        call: "",
        company_number: ""
      };

      if (_root_tag == TAG_ACTION_CART) {
        json.dispatch_type_id = 1;
        json.channel_type = 3;
        json.cart_ids = JSON.stringify(_cart_ids);
      }

      return json;
    },

    // 组装商品信息
    assembleGoods() {
      let newGoods = [];

      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          let model = {};
          model.goods_id = this.goodsInfo.orders[j].order_goods[i].goods_id;
          model.total = this.goodsInfo.orders[j].order_goods[i].total;
          model.option_id = this.goodsInfo.orders[j].order_goods[
            i
          ].goods_option_id;
          newGoods.push(model);
        }
      }
      return newGoods;
    },

    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },

    // 留言触发抵扣事件
    noteHandle(event, item) {
      if (!item.order_deductions[0]) {
        // 没有抵扣数据时
        let isHasNote = false;
        if (this.checkDeductionList.length > 0) {
          this.checkDeductionList.map((deduction, index)=>{
            if(deduction.pre_id == item.pre_id) {
              isHasNote = true;
              deduction.note = this.note[item.pre_id];
            }
          });
        }
        if (!isHasNote) {
          this.checkDeductionList.push({
            deduction_ids: [],
            pre_id: item.pre_id,
            note: this.note[item.pre_id]
          });
        }
        this.checkDeductionList.reverse(); // 更新数组
      } else {
        this.screenDiscount(item, item.order_deductions[0]);
      }

      // console.log("this.checkDeductionList::::", this.checkDeductionList);
    },

    // 筛选抵扣
    screenDiscount(item, value) {
      // console.log("value::::", value);
      if (this.checkDeductionList.length > 0) {
        this.checkDeductionList.map((deduction, index)=>{
          if(deduction.pre_id == item.pre_id) {
            if (value.checked) {
              // 选中的时候检查是否有对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) == -1) {
                deduction.deduction_ids.push(value.code);
              }
            }else {
              // 取消选中的时候检查去掉对应的code
              if(deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) > -1) {
                deduction.deduction_ids.splice(deduction.deduction_ids.indexOf(value.code), 1);
              }
            }

            // 留言和安装选项重新赋值
            deduction.note = this.note[item.pre_id];
            deduction.service_fee = this.service_fee[item.pre_id];
          }
        });
        this.checkDeductionList.reverse(); // 更新数组
      } else {
        this.checkDeductionList.push({
          deduction_ids: [value.code],
          pre_id: item.pre_id,
          note: this.note[item.pre_id],
        });
      }

      // console.log('checkList:', this.checkDeductionList)
    },

  },
  components: {
    yzAddressList
  },
};
