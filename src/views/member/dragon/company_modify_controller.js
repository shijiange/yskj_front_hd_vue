import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      info: {},
      status: false,
      formData: {
        operType: "12",
        accountNm: "", //账户户名
        legalPerNm: "", //法人真实姓名
        legalPerIdTyp: "01", //法人证件类型，01:身份证
        legalPerIdNo: "", //法人证件号
        bussLicenseID: "", //营业执照图片ID
        bussLicenseURL: "", //营业执照图片地址
        legalFrontPic: "", //法人身份证正面图片ID
        legalFrontURL: "", //法人身份证正面图片地址
        legalBackPic: "", //法人身份证反面图片ID
        legalBackURL: "", //法人身份证反面图片地址
        agent: "", //被授权人1姓名
        agentIdType: "01", //被授权人1证件类型，01:身份证
        agentIdNo: "", //被授权人1证件号码
        agentMbl: "", //被授权人1联系手机号
        authorizer1Nm: "", //被授权人2姓名
        authorizer1IdTyp: "01", //被授权人2证件类型，01:身份证
        authorizer1IdNum: "", //被授权人2证件号码
        authorizer1Mbl: "", //被授权人2联系手机号
        authorizer2Nm: "", //被授权人3姓名
        authorizer2IdTyp: "01", //被授权人3证件类型，01:身份证
        authorizer2IdNum: "", //被授权人3证件号码
        authorizer2Mbl: "", //被授权人3联系手机号
        certPic: "", //授权书图片ID
        certURL: "" //授权书图片地址
      },
      empower: [
        {
          id: "12",
          name: "银行账户开户行行号变更",
          checked: true
        },
        {
          id: "13",
          name: "银行账户开户行名称变更",
          checked: false
        },
        {
          id: "14",
          name: "法人/授权人变更",
          checked: false
        },
        {
          id: "15",
          name: "银行账号变更",
          checked: false
        },
        {
          id: "23",
          name: "被授权人变更",
          checked: false
        }
      ]
    };
  },

  activated() {
    this.initData();
    this.getData();
    this.getStatus();
  },

  methods: {
    initData() {
      this.info = {};
      this.status = false;
      this.formData = {
        operType: "12",
        accountNm: "", //账户户名
        legalPerNm: "", //法人真实姓名
        legalPerIdTyp: "01", //法人证件类型，01:身份证
        legalPerIdNo: "", //法人证件号
        bussLicenseID: "", //营业执照图片ID
        bussLicenseURL: "", //营业执照图片地址
        legalFrontPic: "", //法人身份证正面图片ID
        legalFrontURL: "", //法人身份证正面图片地址
        legalBackPic: "", //法人身份证反面图片ID
        legalBackURL: "", //法人身份证反面图片地址
        agent: "", //被授权人1姓名
        agentIdType: "01", //被授权人1证件类型，01:身份证
        agentIdNo: "", //被授权人1证件号码
        agentMbl: "", //被授权人1联系手机号
        authorizer1Nm: "", //被授权人2姓名
        authorizer1IdTyp: "01", //被授权人2证件类型，01:身份证
        authorizer1IdNum: "", //被授权人2证件号码
        authorizer1Mbl: "", //被授权人2联系手机号
        authorizer2Nm: "", //被授权人3姓名
        authorizer2IdTyp: "01", //被授权人3证件类型，01:身份证
        authorizer2IdNum: "", //被授权人3证件号码
        authorizer2Mbl: "", //被授权人3联系手机号
        certPic: "", //授权书图片ID
        certURL: "" //授权书图片地址
      };
      this.empower = [
        {
          id: "12",
          name: "银行账户开户行行号变更",
          checked: true
        },
        {
          id: "13",
          name: "银行账户开户行名称变更",
          checked: false
        },
        {
          id: "14",
          name: "法人变更",
          checked: false
        },
        {
          id: "15",
          name: "银行账号变更",
          checked: false
        },
        {
          id: "23",
          name: "被授权人变更",
          checked: false
        }
      ];
    },
    getData() {
      $http
        .get("plugin.dragon-deposit.frontend.lcg-merchant.balance", {}, " ")
        .then(response => {
          if (response.result === 1) {
            response.data.balance.forEach((item, index, key) => {
              if (item.amount > 0) {
                this.status = true;
              }
            });
          } else {
            this.$dialog.alert({message:response.msg});
           
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStatus() {
      $http
        .get("plugin.dragon-deposit.frontend.index.getConsumer", {}, " ")
        .then(response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(response.data)) {
              this.info = response.data;
            }
          } else {
            this.$dialog.alert({message:response.msg});
           
          }
        })
        .catch(error => {
          console.log(error);
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
    businessRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadImg",
        {}
      );
      axios
        .post(That.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            That.formData.bussLicenseID = response.data.data.id;
            That.formData.bussLicenseURL = response.data.data.url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    idUpRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadImg",
        {}
      );
      axios
        .post(That.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            That.formData.legalFrontPic = response.data.data.id;
            That.formData.legalFrontURL = response.data.data.url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    idDownRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadImg",
        {}
      );
      axios
        .post(That.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            That.formData.legalBackPic = response.data.data.id;
            That.formData.legalBackURL = response.data.data.url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    auorRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadImg",
        {}
      );
      axios
        .post(That.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            That.formData.certPic = response.data.data.id;
            That.formData.certURL = response.data.data.url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let that = this;
      if (that.formData.operType == "14") {
        if (that.fun.isTextEmpty(this.formData.accountNm)) {
          Toast("请输入持卡人姓名/账户户名");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalPerNm)) {
          Toast("请输入法人/授权人真实姓名");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalPerIdNo)) {
          Toast("请输入身份证号码");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalPerIdNo)) {
          Toast("请输入身份证号码");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.bussLicenseID)) {
          Toast("请上传营业执照图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.bussLicenseURL)) {
          Toast("请上传营业执照图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalFrontPic)) {
          Toast("请上传身份证正面图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalFrontURL)) {
          Toast("请上传身份证正面图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalBackPic)) {
          Toast("请上传身份证背面图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.legalBackURL)) {
          Toast("请上传身份证背面图片");
          return;
        }
      }
      if (this.formData.operType == "15") {
        if (this.fun.isTextEmpty(this.formData.accountNm)) {
          Toast("请输入持卡人姓名/账户户名");
          return;
        }
        if (this.status) {
          Toast("电子登记簿余额不为 0、存在在途资金，不允许变更");
          return;
        }
      }
      if (this.formData.operType == "23") {
        if (this.fun.isTextEmpty(this.formData.certPic)) {
          Toast("请上传授权书图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.certURL)) {
          Toast("请上传授权书图片");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.agent)) {
          Toast("请输入被授权人1姓名");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.agentIdNo)) {
          Toast("请输入被授权人1身份证号码");
          return;
        }
        if (!regIdNo.test(this.formData.agentIdNo)) {
          Toast("请输入正确的被授权人1身份证号码");
          return;
        }
        if (this.fun.isTextEmpty(this.formData.agentMbl)) {
          Toast("请输入被授权人1联系手机号");
          return;
        }
        if (
          isNaN(this.formData.agentMbl) &&
          this.formData.agentMbl.length > 0
        ) {
          Toast("被授权人1联系手机号只能为数字");
          return;
        }
      }
      this.push();
    },
    push() {
      if (this.fun.isTextEmpty(this.formData.authorizer1IdNum)) {
        this.formData.authorizer1IdTyp = "";
      }
      if (this.fun.isTextEmpty(this.formData.authorizer2IdNum)) {
        this.formData.authorizer2IdTyp = "";
      }
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
    }
  },
  components: { cTitle }
};
