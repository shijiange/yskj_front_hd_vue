import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: "",
      formData: {
        mercFlg: "2",
        isAcFlg: "1",
        idType: "01",
        busRating: "00",
        platRoleID: "001",
        realNm: "",
        idNo: "",
        contacts: "",
        email: "",
        telphone: "",
        address: ""
      }
      
    };
  },

  activated() {
    this.initData();
  },
  methods: {
    initData() {
      this.id = "";
      this.formData = {
        mercFlg: "2",
        isAcFlg: "1",
        idType: "01",
        busRating: "00",
        platRoleID: "001",
        realNm: "",
        idNo: "",
        contacts: "",
        email: "",
        telphone: "",
        address: ""
      };
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
    submit() {
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let that = this;
      if (that.fun.isTextEmpty(that.formData.realNm)) {
        Toast("请输入姓名");
        return;
      }
      if (that.fun.isTextEmpty(that.formData.idNo)) {
        Toast("请输入身份证号码");
        return;
      }
      if (!regIdNo.test(this.formData.idNo)) {
        Toast("请输入正确身份证号码");
        return;
      }
      if (this.fun.isTextEmpty(this.formData.contacts)) {
        Toast("请输入联系人姓名");
        return;
      }
      if (this.fun.isTextEmpty(this.formData.telphone)) {
        Toast("请输入固定电话");
        return;
      }
      if (isNaN(this.formData.telphone) && this.formData.telphone.length > 0) {
        Toast("固定电话只能为数字");
        return;
      }
      $http
        .post("plugin.dragon-deposit.frontend.index.consumerReg", {
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
    }
  },
  components: { cTitle }
};
