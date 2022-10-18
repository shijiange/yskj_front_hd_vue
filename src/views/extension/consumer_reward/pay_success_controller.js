import cDyPopup from "../../goods/diyFormPopup";
import { Toast } from "vant";
import QRCode from "qrcode";
export default {
  components: { cDyPopup },
  data() {
    return {
      detail: {},
      order: [],
      popup: false,
      withdrawal: false,
      qrcodeShow: false,
      qrcodeImg: "",

      is_form: 0,
      dfData: {
        fields: {}
      },
      form_id: 0,
      form_data_id: 0,
      profitShow: false,

      networkLoading: false,

      cash: 0,
      dividend_id: 0
    };
  },
  created() {
    this.getData();
    this.generate();
    if (this.$route.query.is_scan == 1) {
      this.receive();
    }
  },
  methods: {
    getData() {
      $http.get("plugin.consumer-reward.frontend.controllers.payment-jump.index", { pay_id: this.$route.query.pay_id }, "").then(res => {
        if (res.msg != "") Toast(res.msg);
        if (res.result != 1) return;
        this.detail = res.data;
        this.order = res.data.order;
        if (this.detail.popup == 1) this.popup = true;
      });
    },
    receive() {
      $http.get("plugin.consumer-reward.frontend.controllers.reward.receive-reward", { pay_id: this.$route.query.pay_id }, "").then(res => {
        Toast(res.msg);
        if (res.result != 1) return;
        setTimeout(() => {
          this.popup = false;
          //先判断是否开启提现，在判断是否授权
          if (this.detail.is_withdraw == 1) {
            if (this.detail.is_bind == 1) {
              this.withdrawal = true;
              this.dfData.fields = res.data.fields;
              this.form_id = res.data.form_id;
              this.networkLoading = true;
              this.is_form = res.data.is_form;
              this.cash = res.data.cash;
              this.dividend_id = res.data.dividend_id;
            } else {
              this.qrcodeShow = true;
            }
          } else {
            this.$router.push(this.fun.getUrl("member", {}));
          }
        }, 1000);
      });
    },
    handWithBtn() {
      // if(this.is_form == 1){
      //   this.profitShow = true;
      // }else {
      this.dfsave();
      // }
    },
    dfsave(form_data_id = 0) {
      console.log(form_data_id);
      this.form_data_id = form_data_id;
      $http
        .get(
          "plugin.consumer-reward.frontend.controllers.withdraw.withdraw",
          {
            form_id: this.form_id,
            form_data_id,
            dividend_id: this.dividend_id,
            cash: this.cash
          },
          ""
        )
        .then(res => {
          Toast(res.msg);
          if (res.result != 1) return;
          this.withdrawal = false;
          if (form_data_id != 0) this.profitShow = false;
          console.log(res);
        });
    },

    generate() {
      let url = window.location.href + "&is_scan=1";
      console.log(url);
      QRCode.toDataURL(url).then(res => {
        this.qrcodeImg = res;
      });
    }
  }
};
