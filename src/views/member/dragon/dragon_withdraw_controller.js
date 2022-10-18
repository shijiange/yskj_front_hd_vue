import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      money: "",
      info: ""
    };
  },

  activated() {
    this.getData();
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
    getData() {
      $http
        .get("plugin.dragon-deposit.frontend.withdraw.apply", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data.amount;
          } else {
            this.$dialog.alert({message:response.msg});
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //确认提现
    confirm() {
      var that = this;
      if (parseFloat(this.money) > parseFloat(this.info)) {
        that.$dialog.alert({message:"提现金额不可大于您的余额"});
        return;
      }
      if (this.money == undefined || this.money <= 1) {
        that.$dialog.alert({message:"提现金额不可低于1元"});
        return;
      }
      $http
        .post("plugin.dragon-deposit.frontend.withdraw.index", {
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
