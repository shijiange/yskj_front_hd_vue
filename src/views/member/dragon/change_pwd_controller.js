import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      isActive: 1
    };
  },

  activated() {
    this.$refs.password.style.height = document.body.clientHeight + "px";
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
    rememberPwd() {
      let that = this;
      this.isActive = 1;
      $http
        .post("plugin.dragon-deposit.frontend.index.passwdUpdate", {
          data: { operType: "17" }
        })
        .then(
          function(response) {
            if (response.result == 1) {
              that.dragonPay(response.data);
            }
          },
          function(response) {}
        );
    },
    forgetPwd() {
      let that = this;
      this.isActive = 2;
      $http
        .post("plugin.dragon-deposit.frontend.index.passwdUpdate", {
          data: { operType: "18" }
        })
        .then(
          function(response) {
            if (response.result == 1) {
              that.dragonPay(response.data);
            } else {
              that.$dialog.alert({message:response.msg});
             
            }
          },
          function(response) {}
        );
    }
  },
  components: { cTitle }
};
