import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: "",
      name: "",
      formData: {
        operType: "08", //操作类型 08:绑定、09:解绑、10:主卡变更、11:个人用户银行预留手机号变更。
        accountNm: "", //持卡人姓名/账户户名
        idType: "01", //证件类型,01:身份证
        idNo: "", //证件号码
        account: "", //卡号/账号
        bankMbl: "" //银行预留手机号
      },
      empower: [
        {
          id: "08",
          name: "绑定",
          checked: true
        },
        {
          id: "09",
          name: "解绑",
          checked: false
        },
        {
          id: "10",
          name: "主卡变更",
          checked: false
        },
        {
          id: "11",
          name: "预留手机号变更",
          checked: false
        }
      ]
    };
  },

  activated() {},

  methods: {
    push() {
      $http
        .post("plugin.dragon-deposit.frontend.index.consumerModify", {
          data: this.formData
        })
        .then(response => {
          if (response.result === 1) {
            this.dragonPay(response.data);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
    edit() {
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let that = this;
      if (that.formData.operType == "08") {
        if (this.fun.isTextEmpty(this.formData.accountNm)) {
          Toast("请输入持卡人姓名/账户户名");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.idNo)) {
          Toast("请输入身份证号码");
          return;
        }
        if (!regIdNo.test(this.formData.idNo)) {
          Toast("请输入正确的身份证号码");
          return;
        }
      }
      if (
        this.formData.operType == "09" ||
        this.formData.operType == "10" ||
        this.formData.operType == "11"
      ) {
        if (this.fun.isTextEmpty(this.formData.accountNm)) {
          Toast("请输入持卡人姓名/账户户名");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.idNo)) {
          Toast("请输入身份证号码");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.idNo)) {
          Toast("请输入身份证号码");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.account)) {
          Toast("请输入卡号/账号");
          return;
        }
        if (
          isNaN(this.formData.account) &&
          this.formData.account.length > 0 &&
          this.formData.operType != "08"
        ) {
          Toast("卡号/账号只能为数字");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.bankMbl)) {
          Toast("请输入银行预留手机号");
        }
        if (isNaN(this.formData.bankMbl) && this.formData.bankMbl.length > 0) {
          Toast("银行预留手机号只能为数字");
          return;
        }
      }
      this.push();
    }
  },
  components: { cTitle }
};
