import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      plugin_name: "",
      info: {},
      orderId: null
    };
  },
  activated() {
    this.getData();
  },

  components: {},
  computed: {},
  methods: {
    getData() {
      $http
        .get("plugin.live-install.frontend.order.orderDetail", { order_id: this.$route.params.id }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.plugin_name = res.data.another_name.plugin_name;
            this.fun.setWXTitle(this.plugin_name);
            this.info = res.data;
          } else {
            Toast(res.msg);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    imgPreview(data) {
      ImagePreview(data);
    },
    clickBotton(item, order_id) {
      if (this.fun.isTextEmpty(item.api)) {
        return;
      }
      this.orderId = order_id;
      this.btnApi = item.api;
      if (item.code == "installFinish") {
        //完成安装，显示上传安装图片弹窗
        this.finishImgPop = true;
        return;
      }
      if (item.code == "takeCode" || item.code == "payCode") {
        //显示二维码图片
        this.getCodeImg(item, order_id);
        return;
      }
      if (item.code == "goodsApplyRefund") {
        //申请售后
        this.$router.push(this.fun.getUrl("installationSeverAfterApply", { id: order_id }, { sn: this.info.order_sn }));
        return;
      }
      if (item.code == "getRefundList") {
        //查看售后
        this.$router.push(this.fun.getUrl("installationSeverAftersale", { oid: order_id }));
        return;
      }
      if (item.code == "comment") {
        //评价列表
        this.$router.push(this.fun.getUrl("myEvaluation", {}));
        return;
      }
      if (item.code == "orderApplyRefund") {
        //申请退款，order_type==1
        // order_type == 2 查看退款
        this.$router.push(this.fun.getUrl("refund", { order_id: order_id, order_type: 1 }, { refundType: "installationSever" }));
        return;
      }
      if (item.code == "orderPay") {
        //去支付
        this.$router.push(this.fun.getUrl("orderpay", { order_ids: order_id }));
        return;
      }

      this.bottonRequest(item, order_id);
    },
    bottonRequest(item, order_id) {
      let _json = {
        order_id: order_id
      };

      if (item.code == "finishRefund" || item.code == "cancelRefundApply") {
        //退款记录id
        _json.refund_id = order_id;
        delete _json.order_id;
      }
      this.$dialog
        .confirm({ message: `确定${item.name}?` })
        .then(() => {
          var that = this;
          $http.get(item.api, _json).then(
            function(response) {
              if (response.result == 1) {
                that.getData();
                that.$notify({
                  background: "#f0f9eb",
                  message: `${item.name}成功`,
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    }
  }
};
