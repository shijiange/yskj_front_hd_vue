import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: "",
      name: "",
      formData: {
        mercFlg: "1", //商户标识，1:是，2:否
        platRoleID: "100", //	用户角色，002-体工商户户 100-企业店铺 101-企业买家
        busFullNm: "", //单位名称
        busShortNm: "", //单位简称
        creditCd: "", //统一社会信用代码
        busScope: "", //营业范围
        registrant: "1", //注册人身份，1:法定代表人、2:授权人
        legalPerNm: "", //法人真实姓名
        legalPerIdTyp: "01", //法人证件类型，01:身份证
        legalPerIdNo: "", //法人证件号
        busRegCapital: "", //公司注册资金
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
        accType: "2", //1:对私,2:对公
        accountNm: "", //账户户名
        isAcFlg: "1", //主卡默认标志，1:主卡
        busRating: "00", //商户评级，默认为[00]
        email: "", //邮箱
        telphone: "", //固定电话
        bussLicenseID: "", //营业执照图片ID
        bussLicenseURL: "", //营业执照图片地址
        legalFrontPic: "", //法人身份证正面图片ID
        legalFrontURL: "", //法人身份证正面图片地址
        legalBackPic: "", //法人身份证反面图片ID
        legalBackURL: "", //法人身份证反面图片地址
        certPic: "", //授权书图片ID
        certURL: "", //授权书图片地址
        shopPic: "", //店铺图片ID
        shopURL: "", //店铺图片地址
        contPic1: "", //合作协议文件ID
        contURL: "" //合作协议文件地址
      },
      empower: [
        {
          id: 1,
          name: "法定",
          checked: true
        },
        {
          id: 2,
          name: "授权",
          checked: false
        }
      ],
      face: [
        {
          id: 2,
          name: "对公",
          checked: true
        },
        {
          id: 1,
          name: "对私",
          checked: false
        }
      ]
    };
  },

  activated() {
    this.initData();
    if (!this.fun.isTextEmpty(this.$route.params.id)) {
      this.id = this.$route.params.id;
      if (this.id == 1) {
        this.formData.platRoleID = "100";
      }
      // if (this.id == 2) {
      //   this.formData.platRoleID = "101";
      // }
      if (this.id == 3) {
        this.formData.platRoleID = "002";
      }
    }
  },

  methods: {
    initData() {
      this.id = "";
      this.name = "";
      this.formData = {
        mercFlg: "1", //商户标识，1:是，2:否
        platRoleID: "100", //	用户角色，002-体工商户户 100-企业店铺 101-企业买家
        busFullNm: "", //单位名称
        busShortNm: "", //单位简称
        creditCd: "", //统一社会信用代码
        busScope: "", //营业范围
        registrant: "1", //注册人身份，1:法定代表人、2:授权人
        legalPerNm: "", //法人真实姓名
        legalPerIdTyp: "01", //法人证件类型，01:身份证
        legalPerIdNo: "", //法人证件号
        busRegCapital: "", //公司注册资金
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
        accType: "2", //1:对私,2:对公
        accountNm: "", //账户户名
        isAcFlg: "1", //主卡默认标志，1:主卡
        busRating: "00", //商户评级，默认为[00]
        email: "", //邮箱
        telphone: "", //固定电话
        bussLicenseID: "", //营业执照图片ID
        bussLicenseURL: "", //营业执照图片地址
        legalFrontPic: "", //法人身份证正面图片ID
        legalFrontURL: "", //法人身份证正面图片地址
        legalBackPic: "", //法人身份证反面图片ID
        legalBackURL: "", //法人身份证反面图片地址
        certPic: "", //授权书图片ID
        certURL: "", //授权书图片地址
        shopPic: "", //店铺图片ID
        shopURL: "", //店铺图片地址
        contPic1: "", //合作协议文件ID
        contURL: "" //合作协议文件地址
      };
      this.empower = [
        {
          id: 1,
          name: "法定",
          checked: true
        },
        {
          id: 2,
          name: "授权",
          checked: false
        }
      ];
      this.face = [
        {
          id: 2,
          name: "对公",
          checked: true
        },
        {
          id: 1,
          name: "对私",
          checked: false
        }
      ];
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
      if (that.fun.isTextEmpty(this.formData.busFullNm)) {
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
        .post("plugin.dragon-deposit.frontend.index.consumerReg", {
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
            this.formData.legalFrontPic = response.data.data.id;
            this.formData.legalFrontURL = response.data.data.url;
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
      // var That = this;
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
            this.formData.legalBackPic = response.data.data.id;
            this.formData.legalBackURL = response.data.data.url;
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
      // var That = this;
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
            this.formData.certPic = response.data.data.id;
            this.formData.certURL = response.data.data.url;
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
      // var That = this;
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
            this.formData.shopPic = response.data.data.id;
            this.formData.shopURL = response.data.data.url;
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
      // var That = this;
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
            this.formData.contPic1 = response.data.data.id;
            this.formData.contURL = response.data.data.url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
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
