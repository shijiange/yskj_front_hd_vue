import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      show1: false,
      member_integral: 0,
      addressData: {},
      radio: "1",
      address: "",
      cash: "",
      address_id: "",
      integral_name: ""
    };
  },
  activated() {
    this.inniData();
    this.getData();
    this.fun.setWXTitle("手动" + this.fun.initWithdrawal());
  },
  methods: {
    inniData() {
      this.show1 = false;
      this.member_integral = 0;
      this.addressData = {};
      this.radio = "1";
      this.address = "";
      this.cash = "";
      this.address_id = "";
      this.integral_name = "";
    },
    getData() {
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.integral-manual-cash-withdrawal.pageIndex"
        )
        .then(response => {
          if (response.result == 1) {
            this.integral_name = response.data.integral_name;
            this.member_integral = response.data.member_integral;
            this.addressData = response.data.addressData;
            this.addressData.map((item, index, key) => {
              if (item.is_default == 1) {
                this.radio = item.id;
                this.address = item.address;
                this.address_id = item.id;
              }
            });
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sureCash() {
      if (this.fun.isTextEmpty(this.address)) {
        Toast(`请选择${this.fun.initWithdrawal()}地址`);
        return;
      }
      if (this.fun.isTextEmpty(this.cash)) {
        Toast(`请输入${this.fun.initWithdrawal()}数额`);
        return;
      }
      if (Number(this.cash) < 0) {
        Toast(`输入的${this.fun.initWithdrawal()}数额需大于0`);
        return;
      }
      if (Number(this.cash) > Number(this.member_integral)) {
        Toast(`输入的${this.fun.initWithdrawal()}数额超过已有的消费积分`);
        return;
      }
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.integral-manual-cash-withdrawal.index",
          { change_value: this.cash, address_id: this.address_id },
          `${this.fun.initWithdrawal()}中`
        )
        .then(response => {
          if (response.result === 1) {
            Toast(`${this.fun.initWithdrawal()}成功`);
            this.$router.push(this.fun.getUrl("Integral_love"));
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toAdd() {
      this.$router.push(this.fun.getUrl("addressAdd"));
    },
    selectAddress(item) {
      this.address = item.address;
      this.address_id = item.id;
      this.show1 = false;
    }
  },
  components: { cTitle }
};
