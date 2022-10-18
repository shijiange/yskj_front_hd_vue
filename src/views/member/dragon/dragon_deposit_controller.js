import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      money: "",
    };
  },

  activated() {
  },

  methods: {
    //龙存管公共支付方法
    dragonPay(item) {
      let obj = item.form_data;
      var form = document.createElement("form");
      form.method = "post";
      form.setAttribute("action", item.action_url);
      let arr = ["INFO", "BODY", "SIGN", "CONTENTTYPE"];
      for (let i of arr) {
        let a = document.createElement("input");
        a.setAttribute("name", i);
        a.setAttribute("value", obj[i]);
        form.appendChild(a);
      }
      document.body.appendChild(form);
      form.style.display = "none";
      form.submit();
      return form;
    },
    //确认提现
    confirm() {
      var that = this;
      if (this.money == undefined || this.money <= 0) {
        that.$dialog.alert({message:"提现金额不可低于0元"});
        return;
      }
      $http
        .post("plugin.dragon-deposit.frontend.lcg-merchant.recharge", {
          amount: this.money
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.dragonPay(response.data);
            } else {
              that.$dialog.alert({message:response.msg});
            
            }
          },
          function(response) {
            // error callback
          }
        );
    }
  },
  components: { cTitle }
};
