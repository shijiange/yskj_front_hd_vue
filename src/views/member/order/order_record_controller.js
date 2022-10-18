import cTitle from "components/title";
//setting sun
// 上传图片弹信息
import { Toast } from 'vant';

export default {
  components: { cTitle },
  data() {
    return {
      show1: false,
      img_url: "",
      //setting sun
      imageUrl: "",
      uploadUrl: "",
      upImgSrc: "",
      user_information: { card_number: "20180621154230", payee: "中国银行（3260）", money: "{{$i18n.t('money')}}5000.00" },
      btn_name: "",
      reason_data: "",
      order_state: ""
    };
  },
  activated() {
    //setting sun
    this.init();
    this.urlUp();
    this.getJson();
  },
  methods: {
    init() {

    },
    getJson() {
      // console.log(this.$route.params.order_id);
      this.img_url = "";
      var that = this;
      var json = {
        order_id: that.$route.params.order_id
      };
      $http.get("remittance.remittance-record", json).then(function(response) {
        console.log("显示", response);

        if (response.result == 1) {
          that.img_url = response.data.report_url;
          that.btn_name = response.data.button_models[0].name;
          that.reason_data = response.data.audit_note;
          that.order_state = response.data.status_name;
        } else {
          Toast(response.msg);
        }

      }, function(response) {
        Toast(response.msg);
      });
    },
    //setting sun
    //上传url
    urlUp() {
      this.uploadUrl = this.fun.getRealUrl("plugin.store-cashier.frontend.store.store.upload", {});
    },
    handleStoreSuccess(res, file) {
      // console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.upImgSrc = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isPNG = (file.type === "image/png" || file.type === "image/jpeg");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
        // this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$notify("上传头像图片大小不能超过 2MB!");
        // this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNG && isLt2M;
    },
    //完成
    completeEvent() {
      this.$router.push(this.fun.getUrl("orderdetail", { order_id: this.$route.params.order_id }));
    },
    //返回
    returnEvent() {
      this.$router.push(this.fun.getUrl("orderdetail", { order_id: this.$route.params.order_id }));
    },
    //取消转账
    // cancelTransfer(){
    //     var that = this;
    //     var json = {order_id: that.$route.params.order_id}
    //     if(this.img_url != ''){
    //         $http.get('remittance.remittance-record-operation.cancel', json).then(function (response) {
    //             //   console.log(response);
    //                 if(response.result == 1){
    //                     //that.img_url = response.data.report_url;
    //                     Toast("取消申请成功");
    //                 }else{
    //                     Toast(response.msg);
    //                 }

    //         }, function (response) {
    //                 Toast(response.msg);
    //         });
    //     }
    // },
    cancelTransfer() {
      this.$dialog.confirm({
        title: "提示",
        message: "此操作将取消汇款申请, 是否继续?",
      }).then(() => {
        // on confirm
        var that = this;
        var json = { order_id: that.$route.params.order_id };
        $http.get("remittance.remittance-record-operation.cancel", json).then(function(response) {
          if (response.result === 1) {
            // that.$message({
            //     type: 'success',
            //     message: '取消申请成功!'
            //   });
            that.$notify({
              background: "#f0f9eb",
              message: "取消申请成功",
              color: "#67c23a"
            });

          }

        }, function(response) {
          Toast(response.msg);
        });
      }).catch(() => {
        // on cancel
        this.$notify({
          background: "#edf2fc",
          message: "已取消操作",
          color: "#909399"
        });
      });

    }
  }
};
