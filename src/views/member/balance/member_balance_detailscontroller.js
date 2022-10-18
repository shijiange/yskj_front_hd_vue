import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      item: "",
      //余额字样
      balanceLang: this.fun.getBalanceLang()
    };
  },
  methods: {
    getData() {
      // 门店独立余额
      $http
        .post("plugin.store-cashier.frontend.store.balance.log.detail", { log_id: this.$route.params.item }, "")
        .then(response => {
          this.isShow = true;
          if (response.result === 1) {
            console.log(response.data);
            let log_model = response.data.log_model;
            let info = {
              serial_number:log_model.sn,
              change_money:`${log_model.op}${log_model.change_balance}`,
              service_type_name:log_model.mold_name,
              new_money:log_model.after_balance,
            };
            this.item = info;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  activated() {
    if (this.$route.params.name == 'store') {
      // 门店独立余额
      this.getData();
    } else {
      this.toi = this.fun.getKeyByI();
      this.item = this.$route.params.item;
      this.fun.setWXTitle(this.balanceLang + '详情');
    }

  },
  components: { cTitle }
};
