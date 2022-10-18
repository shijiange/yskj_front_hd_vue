import yz_uploader from "components/ui_components/yz_uploader";
import yzSubscribe from "components/ui_components/yz_subscribe";

import returnTypePop from "./components/returnTypePop";
import returnGoodsPop from "./components/returnGoodsPop";
import receivingStatusPop from "./components/receivingStatusPop";
import returnMethodsPop from "./components/returnMethodsPop";
import editAddressPop from "./components/editAddressPop";
import returnReasonPop from "./components/returnReasonPop";
import pickUpTimePop from "./components/pickUpTimePop";
export default {
  data() {
    return {
      title: "售后申请",
      //  reasontype: ["不想要了", "卖家缺货", "拍错了,订单信息错误", "其他"],
      // refundtype: ['退款（仅退款不退货）', '退款退货', '换货'],  换成取接口的refundTypes
      order_id: "",
      refund_id: "",

      //处理方式
      refundTypes: [],
      //退款原因
      //  reasons: [],
      money: 0.0,

      fileList1: [], //凭证图片

      order_status: 0, //订单状态

      //退款商品
      returnAllGoodsList: [],
      returnGoolsList: [],

      //售后类型
      returnTypeItem: {},

      //收货状态
      receivingStatus: "not_received",

      //退货方式
      returnMethods: 0,
      send_back_way: [],

      //退款原因
      returnReasons: "",

      //退款说明
      returnExplain: "",

      //京东上门取件相关信息
      jdTakeParts: null,
      jd_weight: "",
      jd_length: "",
      jd_width: "",
      jd_height: "",

      start_time: "",
      end_time: "",

      jd_address: {
        pick_up_name: "",
        pick_up_tel: "",
        pick_up_province: 0,
        pick_up_city: 0,
        pick_up_district: 0,
        pick_up_street: 0,
        pick_up_address: "",
        addressName: ""
      },
      refundable_freight: 0, //可退运费
      refundable_other: 0, //其他费用
      freight_price: "", //可退运费
      other_price: "", //其他费用
      freight_price_field_readonly: false,
      showInstructions: false
    };
  },
  computed: {
    returnMethodsName() {
      let name = "";
      this.send_back_way.forEach(item => {
        if (item.value == this.returnMethods) {
          name = item.name;
        }
      });
      return name;
    }
  },
  methods: {
    openComponentsPop(name) {
      // console.log(this.$refs[name],name);
      // return;
      if (name == "pickUpTime" && this.fun.isTextEmpty(this.jd_address.addressName)) {
        this.$toast("请先补充取货地址信息");
        this.$refs.editAddress.setPopShow(true);
        return;
      }
      this.$refs[name].setPopShow(true);
    },
    confirmSub() {
      this.confirmRefund();
    },
    errorSub() {
      this.confirmRefund();
    },
    //提交退款申请
    confirmRefund() {
      console.log(this.$route.params.order_type, this.form);
      const that = this;
      if (this.refundable_freight > 0 && Number(this.freight_price) > this.refundable_freight) {
        return this.$toast(`退款运费金额最大为${this.refundable_freight}`);
      }
      if (this.refundable_other > 0 && Number(this.other_price) > this.refundable_other) {
        return this.$toast(`退款其他金额最大为${this.refundable_other}`);
      }
      let action;
      let json = {
        order_id: this.order_id,
        refund_id: this.refund_id,
        refund_type: this.returnTypeItem.value,
        reason: this.returnReasons,
        content: this.returnExplain,
        receive_status: this.receivingStatus == "not_received" ? 0 : 1,
        refund_way_type: this.returnMethods,
        freight_price: this.freight_price || 0,
        other_price: this.other_price || 0
      };
      if (this.order_status > 0) {
        let arr = [];
        this.returnGoolsList.forEach(element => {
          let o = {};
          o.id = element.id;
          o.total = element.refund_total;
          arr.push(o);
        });

        if (arr.length > 0) json.order_goods = arr;
        json.part_refund = 1;
      }
      // if (this.form.refund_type === "") {
      //   Toast("请选择退款方式！");
      //   return;
      // }
      if (this.returnTypeItem.value != 2 && this.fun.isTextEmpty(this.returnReasons)) {
        this.$toast("请选择申请原因！");
        return;
      }

      if (this.fileList1.length > 0) {
        json.images = this.fileList1;
      }

      //上门取货
      if (this.returnMethods == 1) {
        if (!this.start_time || !this.end_time) return this.$toast("请选择取件时间");
        Object.assign(json, this.jd_address);
        json.jd_weight = this.jd_weight;
        json.jd_length = this.jd_length;
        json.jd_width = this.jd_width;
        json.jd_height = this.jd_height;
        json.start_time = this.start_time;
        json.end_time = this.end_time;
      }
      if (this.$route.params.order_type == 1) {
        action = "refund.apply.store";
      } else if (this.$route.params.order_type == 3) {
        action = "plugin.snatch-regiment.api.order.refund";
      } else {
        action = "refund.edit.store";
      }

      //盲盒
      if (this.$route.query && this.$route.query.value && this.$route.query.value == 54) {
        action = "plugin.blind-box.api.apply.store";
      } else if (this.$route.query && this.$route.query.refundType && this.$route.query.refundType == "installationSever") {
        action = "plugin.live-install.frontend.apply.store";
      }
      $http.post(action, json, "正在提交申请").then(
        function(response) {
          if (response.result == 1) {
            that.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    //获取退款信息
    getRefundInfo() {
      let url = "plugin.overseas.frontend.refund.apply";
      if (this.$route.query && this.$route.query.value && this.$route.query.value == 54) {
        url = "plugin.blind-box.api.apply.index";
      } else if (this.$route.query && this.$route.query.refundType && this.$route.query.refundType == "installationSever") {
        url = "plugin.live-install.frontend.apply.index";
      }
      $http.get(url, { order_id: this.$route.params.order_id }, "").then(
        response => {
          if (response.result == 1) {
            var mydata = response.data;
            this.refundable_freight = Number(mydata.refundable_freight) || 0; //可退运费
            this.refundable_other = Number(mydata.refundable_other) || 0; //其他费用
            this.money = mydata.order.true_refund_amount || mydata.order.price;
            this.refundTypes = mydata.refundTypes;
            this.send_back_way = mydata.send_back_way;
            this.returnMethods = this.send_back_way && this.send_back_way[0] ? this.send_back_way[0].value : 0;
            this.order_status = mydata.order.status;
            if (mydata.order.order_goods) {
              this.returnAllGoodsList = mydata.order.order_goods.filter(item => {
                return item.is_refund == 0;
              });
            }
            console.log(this.returnAllGoodsList);
            if (this.order_status >= 2 && mydata.support_batch) {
              //support_batch 参数 true 支持单商品退款 false不支持， 先判断下订单是否支持选择商品退款
              // 不支持的就显示商品就行了，提交时也不用传 order_goods 参数
              this.openComponentsPop("returnGoods");
            } else {
              this.openComponentsPop("returnType");
            }
            //that.reasons = mydata.reasons;
            //如果订单是待发货状态，退款金额=可退退款金额，且不可修改
            this.freight_price = this.order_status === 1 ? this.refundable_freight : '';
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },
    getAlterInfo() {
      $http.get("refund.edit", { refund_id: this.$route.params.order_id }, "").then(
        response => {
          if (response.result == 1) {
            var mydata = response.data;
            this.refundable_freight = Number(mydata.refundable_freight) || 0; //可退运费
            this.refundable_other = Number(mydata.refundable_other) || 0; //其他费用
            this.freight_price = Number(mydata.refundApply.freight_price) || ""; //可退运费
            this.other_price = Number(mydata.refundApply.other_price) || ""; //其他费用
            this.money = mydata.refundApply.apply_price;
            this.refundTypes = mydata.refundTypes;
            if (mydata.refundApply.receive_status == 1) {
              this.receivingStatus = "received";
            } else {
              this.receivingStatus = "not_received";
            }
            this.$refs.receivingStatus.setRadio(mydata.refundApply.receive_status);

            this.returnTypeItem = this.refundTypes[mydata.refundApply.refund_type];
            this.returnReasons = mydata.refundApply.reason;
            this.returnExplain = mydata.refundApply.content;
            this.fileList1 = mydata.refundApply.images;
            this.$refs.yz_uploader.setFileList1(this.fileList1);
            this.send_back_way = mydata.send_back_way;
            this.returnMethods = mydata.refundApply.refund_way_type;

            this.$refs.returnMethods.setRadio(this.returnMethods);
            this.returnGoolsList = mydata.refundApply.refund_order_goods;
            this.order_status = mydata.refundApply.order.status;
            console.log(mydata.send_back_way_data);

            if (this.returnMethods == 1 && mydata.send_back_way_data) {
              this.getJdTakeParts(mydata.send_back_way_data);
            } else if (this.returnMethods == 1) {
              this.getJdTakeParts();
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },
    confrimReturnGoods(evt) {
      console.log(evt, evt.modelsArr);
      this.returnGoolsList = evt.modelsArr;
      this.money = evt.total_price;
      this.openComponentsPop("returnType");
    },
    confrimReturnType(evt) {
      let item = evt.item;
      if (this.returnTypeItem.value == item.value) return;
      if (item.value != 0) {
        this.receivingStatus = "received";
      }
      this.returnReasons = "";
      this.returnTypeItem = item;
    },
    confirmReturnReason(evt) {
      let text = evt.text;
      this.returnReasons = text;
    },
    confirmReceivingStatus(evt) {
      this.receivingStatus = evt.status;
    },
    confirmPickUpTime(evt) {
      this.start_time = evt.start_time;
      this.end_time = evt.end_time;
    },
    confirmReturnMethods(evt) {
      this.returnMethods = evt.status;
      if (this.returnMethods == 1 && this.jdTakeParts == null) {
        this.getJdTakeParts();
      }
    },
    confirmEditAddress(evt) {
      this.jd_address = evt;
      let _json = {
        province_id: evt.pick_up_province,
        city_id: evt.pick_up_city,
        district_id: evt.pick_up_district,
        street_id: evt.pick_up_street,
        address: evt.pick_up_address
      };
      this.getPickUpTime(_json);
    },
    //获取京东上门安装默认数据
    getJdTakeParts(defaultData = null) {
      $http.get("plugin.jd-take-parts.frontend.refund.get-default-data", { order_id: this.$route.params.order_id }, "").then(res => {
        if (res.result == 1) {
          this.jdTakeParts = res.data;
          // this.$refs['pickUpTime'].setListData(res.data.time_list);

          if (defaultData == null) {
            this.jd_height = res.data.default.default_height;
            this.jd_length = res.data.default.default_length;
            this.jd_weight = res.data.default.default_weight;
            this.jd_width = res.data.default.default_width;
            this.$refs["editAddress"].setFormData(res.data.order_address);
            this.getPickUpTime(res.data.order_address);
          } else {
            this.jd_height = defaultData.jd_height;
            this.jd_length = defaultData.jd_length;
            this.jd_weight = defaultData.jd_weight;
            this.jd_width = defaultData.jd_width;
            this.start_time = defaultData.start_time;
            this.end_time = defaultData.end_time;
            let address = {
              realname: defaultData.pick_up_name,
              mobile: defaultData.pick_up_tel,
              province: defaultData.pick_up_province_name,
              city: defaultData.pick_up_city_name,
              district: defaultData.pick_up_district_name,
              street: defaultData.pick_up_street_name,
              province_id: defaultData.pick_up_province,
              city_id: defaultData.pick_up_city,
              district_id: defaultData.pick_up_district,
              street_id: defaultData.pick_up_street,
              address: defaultData.pick_up_address
            };
            this.$refs["editAddress"].setFormData(address);
            this.getPickUpTime(address);
          }
        }
      });
    },
    getPickUpTime(_data) {
      let _json = {
        pick_up_province: _data.province_id,
        pick_up_city: _data.city_id,
        pick_up_district: _data.district_id,
        pick_up_street: _data.street_id,
        pick_up_address: _data.address
      };
      $http.post("plugin.jd-take-parts.frontend.refund.get-pickup-in-time", { _json }, "").then(res => {
        if (res.result == 0) return this.$toast(res.msg);
        this.$refs["pickUpTime"].setListData(res.data.time_list);
      });
    },
    showInstructionsFn() {
      this.showInstructions = true;
    }
  },
  activated() {
    //this.money = this.$route.params.order_id;
  },
  created() {
    this.money = 0.0;
    //console.log(this.$route.params.order_id);
    this.order_id = this.$route.params.order_id;
    this.refund_id = this.$route.params.order_id;
    if (this.$route.params.order_type == 2) {
      //修改申请
      this.title = "修改申请";
      this.getAlterInfo();
    } else {
      this.title = "售后申请";
      this.getRefundInfo();
    }
    // setTimeout(()=>{
    //   this.openComponentsPop('pickUpTime');
    // },1000)
  },
  components: { yz_uploader, yzSubscribe, returnReasonPop, returnTypePop, returnGoodsPop, receivingStatusPop, returnMethodsPop, editAddressPop, pickUpTimePop }
};
