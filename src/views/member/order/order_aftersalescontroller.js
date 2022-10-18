import cTitle from "components/title";
import labels from "components/goods/labels";
// import { resolve } from 'dns';
export default {
  data() {
    return {
      showID: "",

      value: null,
      orderOn: false,
      status_name: "",
      //退款说明
      content: "",
      //退款原因
      remark: "",
      reason: "",
      refund_time: "",
      refund_type_name: "",
      alipay_batch_sn: "",
      operate_time: "",
      price: "",
      create_time: "",
      refund_sn: "",
      button_models: "",
      reject_reason: null,
      address: "",
      datas: "",
      is_plugin: "",
      supplier_id: "",
      store_id: "",

      images: [],
      imgIndex: 1, //相册图片预览起始位置
      show: false,

      refund_order_goods: [],

      return_express: null,

      myData: {},
      freight_price: "", //可退运费
      other_price: "" //其他费用
    };
  },
  methods: {
    showimg(ind) {
      this.imgIndex = ind;
      this.show = true;
    },
    showMore(item) {
      if (this.showID == item.value) {
        this.showID = "";
      } else {
        this.showID = item.value;
      }
    },
    gotoNegotiationRecord() {
      this.$router.push(this.fun.getUrl("negotiationRecord", { refund_id: this.refund_id }));
    },
    gotoLogistics() {
      this.$router.push(
        this.fun.getUrl(
          "logistics",
          {},
          {
            refund_id: this.refund_id,
            from: "userReturn"
          }
        )
      );
    },
    //发起http请求
    getNetData() {
      let _url = "refund.detail";
      if (this.$route.query.pluginid && this.$route.query.pluginid == 69) {
        _url = "plugin.snatch-regiment.api.refund.detail";
      }
      $http
        .get(
          _url,
          {
            refund_id: this.refund_id,
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep()
          },
          "正在获取..."
        )
        .then(
          response => {
            if (response.result == 1) {
              this.myData = response.data;
              this.button_models = response.data.button_models;
              this.images = response.data.images || [];
              this.price = response.data.price;
              this.content = response.data.content;
              this.status_name = response.data.status_name;
              this.reason = response.data.reason;
              this.refund_time = response.data.refund_time;
              this.refund_type_name = response.data.refund_type_name;
              this.alipay_batch_sn = response.data.alipay_batch_sn;
              this.create_time = response.data.create_time;
              this.remark = response.data.remark;
              this.refund_sn = response.data.refund_sn;
              this.reject_reason = response.data.reject_reason;
              this.is_plugin = response.data.is_plugin ? response.data.is_plugin : null;
              this.store_id = response.data.store_id ? response.data.store_id : null;
              this.supplier_id = response.data.supplier_id ? response.data.supplier_id : null;
              this.plugin_id = response.data.plugin_id ? response.data.plugin_id : null;
              this.refund_order_goods = response.data.refund_order_goods;
              this.return_express = response.data.return_express;
              this.freight_price = Number(response.data.freight_price) || 0; //可退运费
              this.other_price = Number(response.data.other_price) || 0; //其他费用
              if (response.data.refund_address != "") {
                this.getaddress();
              }
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    cancleRefund() {
      //refund.cancel
      var that = this;
      $http
        .get(
          "refund.operation.cancel",
          {
            refund_id: this.refund_id,
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep()
          },
          "提交申请..."
        )
        .then(
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
    operation(btn) {
      if (btn.value == 2) {
        this.$router.push(this.fun.getUrl("express", { refund_id: this.refund_id }));
      } else if (btn.value == 1) {
        this.$router.push(this.fun.getUrl("refund", { order_id: this.refund_id, order_type: 2 }));
      } else if (btn.value == 3) {
        //确认收货
        this.confirm();
      } else if (btn.value == 6) {
        if (this.myData.resend_express_id == 0) {
          this.$router.push(
            this.fun.getUrl(
              "multiplePackages",
              {
                order_id: this.refund_id //传送订单id到多包裹页面
              },
              {
                from: "resend"
              }
            )
          );
        } else {
          this.$router.push(
            this.fun.getUrl(
              "logistics",
              {},
              {
                refund_id: this.refund_id,
                express_id: this.myData.resend_express_id,
                from: "resend"
              }
            )
          );
        }
      } else {
        //取消申请
        this.cancleRefund();
      }
    },
    //换货确认收货
    confirm() {
      var that = this;
      $http
        .get(
          "refund.operation.complete",
          {
            refund_id: this.refund_id,
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep()
          },
          "提交申请..."
        )
        .then(
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
    getaddress() {
      $http
        .get("order.refund.return-address", {
          refund_id: this.refund_id,
          plugins_id: this.is_plugin == 1 ? this.is_plugin : this.plugin_id,
          store_id: this.store_id,
          supplier_id: this.supplier_id
        })
        .then(res => {
          this.address = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  activated() {
    this.refund_id = this.$route.params.refund_id;
    this.getNetData();
    //setTimeout(()=>{this.getaddress()},1500)
  },
  components: { cTitle , labels }
};
