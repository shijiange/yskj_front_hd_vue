import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      formData: {},
      face: [
        {
          id: 2,
          name: "对公",
          checked: false
        },
        {
          id: 1,
          name: "对私",
          checked: false
        }
      ],
      empower: [
        {
          id: 1,
          name: "法定",
          checked: false
        },
        {
          id: 2,
          name: "授权",
          checked: false
        }
      ]
    };
  },

  activated() {
    Toast(this.$route.params.info);
    this.getStatus();
  },
  methods: {
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
      if (that.fun.isTextEmpty(that.formData.busFullNm)) {
        Toast("请输入企业全称");
        return;
      }
      if (this.fun.isTextEmpty(this.formData.legalPerNm)) {
        Toast("请输入法人/授权人真实姓名");
        return;
      }
      if (this.fun.isTextEmpty(this.formData.legalPerIdNo)) {
        Toast("请输入法人/授权身份证号码");
        return;
      }
      if (!regIdNo.test(this.formData.legalPerIdNo)) {
        Toast("请输入正确的法人/授权人身份证号码");
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
      if (isNaN(this.formData.agentMbl) && this.formData.agentMbl.length > 0) {
        Toast("被授权人1联系手机号只能为数字");
        return;
      }
      var json;
      if (this.formData.registrant == "1") {
        json = Object.assign({}, this.formData);
      }
      if (this.formData.registrant == "2") {
        json = Object.assign({}, this.formData);
        delete json.busRegCapital;
      }

      if (this.fun.isTextEmpty(json.authorizer1IdNum)) {
        json.authorizer1IdTyp = "";
      }
      if (this.fun.isTextEmpty(json.authorizer2IdNum)) {
        json.authorizer2IdTyp = "";
      }
      $http
        .post("plugin.dragon-deposit.frontend.index.edit", {
          data: json
        })
        .then(response => {
          if (response.result === 1) {
            that.dragonPay(response.data);
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    chooseEnp(item) {
      this.empower.forEach((list, index, key) => {
        if (item.id == list.id) {
          list.checked = true;
          this.formData.registrant = list.id;
        } else {
          list.checked = false;
        }
      });
      this.formData.legalPerNm = ""; //法人真实姓名
      this.formData.legalPerIdTyp = "01"; //法人证件类型，01:身份证
      this.formData.legalPerIdNo = ""; //法人证件号
      this.formData.busRegCapital = ""; //公司注册资金
      this.formData.agent = ""; //被授权人1姓名
      this.formData.agentIdType = "01"; //被授权人1证件类型，01:身份证
      this.formData.agentIdNo = ""; //被授权人1证件号码
      this.formData.agentMbl = ""; //被授权人1联系手机号
      this.formData.authorizer1Nm = ""; //被授权人2姓名
      this.formData.authorizer1IdTyp = "01"; //被授权人2证件类型，01:身份证
      this.formData.authorizer1IdNum = ""; //被授权人2证件号码
      this.formData.authorizer1Mbl = ""; //被授权人2联系手机号
      this.formData.authorizer2Nm = ""; //被授权人3姓名
      this.formData.authorizer2IdTyp = "01"; //被授权人3证件类型，01:身份证
      this.formData.authorizer2IdNum = ""; //被授权人3证件号码
      this.formData.authorizer2Mbl = ""; //被授权人3联系手机号
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
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.bussLicense) {
              That.formData.bussLicense = {};
              That.formData.bussLicense.bussLicenseID = response.data.data.id;
              That.formData.bussLicense.bussLicenseURL = response.data.data.url;
            } else {
              That.formData.bussLicense.bussLicenseID = response.data.data.id;
              That.formData.bussLicense.bussLicenseURL = response.data.data.url;
            }
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
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.legalFront) {
              That.formData.legalFront = {};
              That.formData.legalFront.legalFrontPic = response.data.data.id;
              That.formData.legalFront.legalFrontURL = response.data.data.url;
            } else {
              That.formData.legalFront.legalFrontPic = response.data.data.id;
              That.formData.legalFront.legalFrontURL = response.data.data.url;
            }
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
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.legalBack) {
              That.formData.legalBack = {};
              That.formData.legalBack.legalBackPic = response.data.data.id;
              That.formData.legalBack.legalBackURL = response.data.data.url;
            } else {
              That.formData.legalBack.legalBackPic = response.data.data.id;
              That.formData.legalBack.legalBackURL = response.data.data.url;
            }
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
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.cert) {
              That.formData.cert = {};
              That.formData.cert.certPic = response.data.data.id;
              That.formData.cert.certURL = response.data.data.url;
            } else {
              That.formData.cert.certPic = response.data.data.id;
              That.formData.cert.certURL = response.data.data.url;
            }
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    shopRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadImg",
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.shop) {
              That.formData.shop = {};
              That.formData.shop.shopPic = response.data.data.id;
              That.formData.shop.shopURL = response.data.data.url;
            } else {
              That.formData.shop.shopPic = response.data.data.id;
              That.formData.shop.shopURL = response.data.data.url;
            }
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cooperationRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl(
        "plugin.dragon-deposit.frontend.index.uploadPdf",
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            if (!That.formData.cont) {
              That.formData.cont = {};
              That.formData.cont.contPic1 = response.data.data.id;
              That.formData.cont.contURL = response.data.data.url;
            } else {
              That.formData.cont.contPic1 = response.data.data.id;
              That.formData.cont.contURL = response.data.data.url;
            }
          } else {
            Toast(response.data.msg);
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
              this.formData = response.data;
              this.face.forEach((item, index, key) => {
                item.checked = false;
                if (item.id == this.formData.accType) {
                  item.checked = true;
                }
              });
              this.empower.forEach((item, index, key) => {
                item.checked = false;
                if (item.id == this.formData.registrant) {
                  item.checked = true;
                }
              });
            }
          } else {
            this.$dialog.alert({message:response.msg});
          
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chooseFace(item) {
      this.face.forEach((list, index, key) => {
        if (item.id == list.id) {
          list.checked = true;
          this.formData.accType = list.id;
        } else {
          list.checked = false;
        }
      });
    }
  },
  components: { cTitle }
};
