import { Toast } from "vant";
import cTitle from "components/title";
import diyorm from "components/diyform";
// import { delete } from "vue/types/umd";
//diy--------diy
// import District from 'ydui-district/dist/gov_province_city_area_id';

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
};
//diy--------diy

export default {
  data() {
    return {
      fromBase_sex: "",
      fromBase_birthday: "",
      fromBase_address: "",
      formBase_name:'',
      isForm: false,
      app_type: "",
      default_invite: "",
      repeatStatus: false,

      isset: "",
      protocol_content: "",
      protocol_title: "",
      show2: false,

      imgcode: "",
      showChangeID: false,
      changidInfo: {
        uid: null,
        change_uid: null
      },

      agreementStatus: false,
      agreementCB: false,

      // 平台协议
      PlatformAgreement:'',
      openPlatformAgreement:false,
      agreement_name:'平台协议',

      start1: false,
      form: {
        country: "86",
        mobile: "",
        mobileErr: "",
        password: "",
        passwordErr: "",
        confirm_password: "",
        confirm_passwordErr: "",
        captcha: "",
        invite_code: "",
        birthday: "", // 生日
        gender: "", // 性别 1男 0女
        province_name: "", // 省
        city_name: "", // 市
        area_name: "", // 区
        province: "", // 省ID
        city: "", // 市ID
        area: "", // 区ID
        address: "", // 详细地址
        custom_value: "",
        realname:"",//姓名
      },
      is_password: "1",
      custom_title: "",
      is_custom: false,
      is_edit: true, // 是否编辑进来的
      //diy--------diy
      diyStatus: 0,
      form_id: "",
      pickerValue: new Date(),
      startDate: new Date("1900"),
      showCity: false,
      district: district,
      currentDateKey: "",
      currentCityKey: "",
      checks: [],
      isValidation: true,
      diyform: {},
      diydata: [],
      types: {
        "0": "diyinput",
        "1": "diytextarea",
        "3": "diycheckbox",
        "4": "diyradio",
        "5": "diyimg",
        "2": "diyselect",
        "7": "diydate",
        "9": "diycity",
        "99": "diypwd",
        "88": "diyusername"
      },
      pickerValueShow: false,
      invite: "",
      isrequired: "",
      country_code: 0,
      //diy--------diy
      // 优化新增
      images_n: require("../../../assets/images/logindefault_bg@2x.png"),
      title1: "",
      title2: "",
      customDatas: [],
      // getImg:false,
      requimg: "",
      currentDate: new Date(),
      minDate: new Date(1900, 1, 1),
      dateshow_2: false,
      showAdd: false,
      actions: [{ name: "男", gender: 1 }, { name: "女", gender: 0 }],
      sexName: "",
      showSex: false,
      // 优化新增
      orderLocationObj: { positioning_success: 0, register_province: "", register_city: "" },
      // 替换ydui组件新增
      btnBg: "#ef4f4f",
      btnText: "获取短信验证码",
      btnTag: false,
      timer: null,
      count: "",
      visibleSet: true,
      visibleSure: true,
      setpassword: "password",
      surepassword: "password",
      form_open:false,
      // 开启姓名必填
      name_must:false
    };
  },

  async mounted() {
    if (JSON.parse(window.localStorage.getItem("globalParameter")).bind_mobile_locate == true) {
      this.orderLocationObj = await this.getCurrentOrderLocation();
    }
  },

  methods: {
    onSelect(item) {
      if (item.gender == 1) {
        this.form.gender = "1";
        this.sexName = "男";
      } else {
        this.form.gender = "0";
        this.sexName = "女";
      }
      this.showSex = false;
    },
    fillInCode() {
      this.$delete(this.form, "invite_code");
      this.$set(this.form, "invite_code", this.default_invite);
    },
    init() {
      this.repeatStatus = false;
      this.agreementCB = false;
      this.showSex = false;
      this.showAdd = false;
      this.start1 = false;
      this.form = {
        country: "86",
        mobile: "",
        mobileErr: "",
        password: "",
        passwordErr: "",
        confirm_password: "",
        confirm_passwordErr: "",
        address: "", // 详细地址
        close: 1
      };

      this.diyStatus = 0;
      this.form_id = "";
      this.pickerValue = new Date();
      this.showCity = false;

      this.currentDateKey = "";
      this.currentCityKey = "";
      this.checks = [];
      this.isValidation = true;
      this.diyform = {};
      this.diydata = [];
      this.pickerValueShow = false;
      this.show2 = false;
    },
    // 显示性别设置
    showSexInfo() {
      this.showSex = true;
    },
    // 城市结果
    resultAdd(district) {
      this.initDistrict("", district);
    },
    initDistrict(data, district) {
      if (!this.fun.isTextEmpty(data)) {
        if ((this.isShowAddress = data.myform.base)) {
          this.isShowAddress = data.myform.base.address == 1 ? true : false; // 设置是否显示
        }

        this.form.province = data.province;
        this.form.province_name = data.province_name;

        this.form.city = data.city;
        this.form.city_name = data.city_name;

        this.form.area = data.area;
        this.form.area_name = data.area_name;

        if (data.area_name) {
          this.districtName = data.province_name + " " + data.city_name + " " + data.area_name;
        }

        this.form.address = data.address;
        return;
      }

      if (!this.fun.isTextEmpty(district)) {
        this.form.province = district.itemValue1;
        this.form.province_name = district.itemName1;

        this.form.city = district.itemValue2;
        this.form.city_name = district.itemName2;

        this.form.area = district.itemValue3;
        this.form.area_name = district.itemName3;

        this.districtName = district.itemName1 + " " + district.itemName2 + " " + district.itemName3;
      }
    },
    handleConfirm(ret) {
      // console.log("handleConfirm=" + ret)
      // console.log(ret.Format("yyyy-MM-dd"));
      this.form.birthday = ret.Format("yyyy-MM-dd");
      this.dateshow_2 = false;
    },
    setDate(ret) {
      this.diydata.forEach(item => {
        if (item.name == this.currentDateKey) {
          this.$set(item, "value", ret.Format("yyyy-MM-dd"));
        }
      });
      this.pickerValueShow = false;
    },
    cancelbtn() {
      this.dateshow_2 = false;
      this.pickerValueShow = false;
    },
    // 新的合并接口
    getAllData() {
      var that = this;
      this.isset = sessionStorage.getItem("isset");
      console.log(this.isset,"isset");
      var dataSource = {};
      if (this.isset || !this.is_edit) {
        sessionStorage.removeItem("isset");
        dataSource = {
          close: 1
        };
      }
      $http
        .get("member.register.newApiData", dataSource)
        .then(response => {
          if (response.result == 1) {
            this.form_open = response.data.form_open == "1"?true:false;
            if (response.data.get_register_diy_form && response.data.get_register_diy_form.status == 1) {
              this.diyStatus = 1;
              this.form_id = response.data.get_register_diy_form.form_id;

              if (response.data.get_diy_form_by_id) {
                this.getDiyFormInfo(response.data.get_diy_form_by_id);
              }
            } else {
              this.diyStatus = 0;
            }

            if (response.data.get_member_protocol) {
              this.getProtocolStatus(response.data.get_member_protocol);
            }

            if (response.data.get_captcha) {
              this.getimgdata(response.data.get_captcha);
            }

            if (response.data.getInviteCode) {
              this.default_invite = response.data.getInviteCode.default_invite;
              this.getInviteCode(response.data.getInviteCode);
            }
            if (response.data.get_member_protocol) {
              if(response.data.get_member_protocol.new_agreement){
                this.PlatformAgreement = response.data.get_member_protocol.new_agreement;
                this.agreement_name = this.fun.isTextEmpty(response.data.get_member_protocol.agreement_name)?this.agreement_name:response.data.get_member_protocol.agreement_name;
              }

              if (response.data.get_member_protocol.form) {
                if (response.data.get_member_protocol.form.base) {
                  this.fromBase_address = response.data.get_member_protocol.form.base.address;
                  this.fromBase_birthday = response.data.get_member_protocol.form.base.birthday;
                  this.fromBase_sex = response.data.get_member_protocol.form.base.sex;
                  this.formBase_name = response.data.get_member_protocol.form.base.name;
                }
              }
              if (response.data.get_member_protocol.register) {
                this.requimg = response.data.get_member_protocol.register.top_img;
                this.title1 = response.data.get_member_protocol.register.title1;
                this.title2 = response.data.get_member_protocol.register.title2;
                that.is_password = response.data.get_member_protocol.register.is_password;
              }
              if (response.data.get_member_protocol.custom_field) {
                this.is_custom = response.data.get_member_protocol.custom_field.is_custom == "1" ? true : false;
                this.custom_title = response.data.get_member_protocol.custom_field.custom_title;
              }
              this.initCustomForm(response.data.get_member_protocol);
              if (response.data.get_member_protocol.member) {
                let member = response.data.get_member_protocol.member;
                this.districtName = `${member.province_name}${member.city_name}${member.area_name}`;
                this.form.address = member.address;
                this.form.birthday = `${member.birthyear}${member.birthmonth}${member.birthday}`;
                this.sexName = member.gender == 0 ? "女" : "男";
                this.form.custom_value = member.custom_value;
              }
              this.name_must = response.data.name_must == '1' ? true : false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 初始化自定义表单
    initCustomForm(data) {
      if (this.fun.isTextEmpty(data.form) || this.fun.isTextEmpty(data.form.form)) {
        this.isForm = false;
        return;
      }
      if (data.form.form.length == 0) {
        this.isForm = false;
        return;
      }
      this.isForm = true;
      this.customDatas = data.form.form;
    },
    openPickers() {
      this.dateshow_2 = true;
      // this.$refs.picker.open()
    },
    getInviteCode(data) {
      // 判断是否显示邀请码字段
      // $http.get("member.register.getInviteCode", {}).then(res => {
      this.country_code = data.country_code;
      if (data.status == 1) {
        this.invite = data.status;
        this.isrequired = data.required;
        if (data.invitation_code) {
          this.form.invite_code = data.invitation_code.invite_code;
        }
      } else {
        this.isrequired = data.required;
      }
      // });
    },
    registerTost() {
      Toast("请同意注册协议");
    },

    //获取是否开启协议
    getProtocolStatus(data) {
      // let that = this;
      // $http.get("setting.get-member-protocol", {}).then(
      //   response => {
      //     if (response.result == 1) {
      this.agreementStatus = data.protocol === "1" || data.protocol === 1;
      this.protocol_content = data.content;
      this.protocol_title = data.title;
      // } else {
      //   that.agreementStatus = false;
      // }
      //   },
      //   response => {
      //     console.log(response.msg);
      //     that.agreementStatus = false;
      //   }
      // );
    },

    //获取diy 状态信息
    // getDiyFormStatus() {
    //   var that = this;
    //   $http.get("setting.get-register-diy-form", {}).then((response) => {
    //     if (response.result == 1) {
    //       if (response.data.status == 1) {
    //         that.diyStatus = 1;
    //         that.form_id = response.data.form_id;
    //         that.getDiyFormInfo(response.data.form_id);
    //       } else {
    //         that.diyStatus = 0;
    //       }
    //     } else {
    //       that.diyStatus = 0;
    //     }
    //   }, (response) => {
    //     console.log(response.msg);
    //     that.diyStatus = 0;
    //   });
    // },

    //获取diy 信息
    getDiyFormInfo(data) {
      let that = this;
      // $http
      //   .get("plugin.diyform.api.diy-form.get-diy-form-by-id", { form_id: id })
      //   .then(
      //     response => {
      // if (response.result == 1) {
      that.diyform = data;
    },

    chooseUpload(name) {
      this.upload_name = name;
      console.log(this.upload_name);
      return true;
    },
    //发送验证码
    verificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.country)) {
        Toast("请输入国际区号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
        return;
      }

      if (this.fun.isMoblie(this.form.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填图形验证码");
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "发送中"
        });
        // 发送获取验证码的请求
        $http
          .get("member.register.sendCodeV2", {
            mobile: this.form.mobile,
            state: this.form.country,
            captcha: this.form.captcha,
            code: this.form.code
          })
          .then(
            response => {
              Toast.clear();
              if (response.result == 1) {
                that.sendCodeAnimation();
              } else {
                Toast(response.msg);
                //刷新图形验证码
                this.form.captcha = "";
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg);
            }
          );
      }
    },

    //发送验证码 倒计时
    sendCodeAnimation() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        Toast.success("验证码已发送");
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            //this.btnText = this.count + "s后重新获取";
            this.btnText = "验证码已发送";
            this.btnTag = true;
            this.btnBg = "#999";
          } else {
            this.btnTag = false;
            this.btnBg = "#ef4f4f",
            this.btnText = "获取短信验证码";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },

    //跳转
    login() {
      this.$router.push(this.fun.getUrl("login"));
    },

    goAgreement() {
      if(this.fun.isPc()) {
        this.$router.push(this.fun.getUrl('registerAgreement', {}));
      }else {
        this.show2 = true;
      }
    },

    //注册
    register() {
      // this.form.customDatas = this.customDatas;
      let is_customDatas = {},
        adress = {};
      is_customDatas.customDatas = this.customDatas;
      adress.province_name = this.form.province_name;
      adress.city_name = this.form.city_name;
      adress.area_name = this.form.area_name;
      adress.province = this.form.province;
      adress.city = this.form.city;
      adress.area = this.form.area;
      adress.address = this.form.address;
      let isclose = '';
      if (this.isset) {
        sessionStorage.removeItem("isset");
        isclose = 1;
      }//判断有没有开启邀请码绑定上级
      console.log(isclose);
      let is_form = {
        invite_code: this.form.invite_code,
        country: this.form.country,
        mobile: this.form.mobile,
        mobileErr: this.form.mobileErr,
        password: this.form.password,
        passwordErr: this.form.passwordErr,
        confirm_password: this.form.confirm_password,
        confirm_passwordErr: this.form.confirm_passwordErr,
        captcha: this.form.captcha,
        gender: this.form.gender,
        code: this.form.code,
        birthday: this.form.birthday,
        custom_value: this.form.custom_value,
        close: isclose
      };
      is_form.realname = this.form.realname;
      is_form.address = adress;
      is_form.customDatas = is_customDatas.customDatas;
      console.log(this.form);
      let that = this;

      if (this.formOpen && (this.customDatas instanceof Array)) {
        let result = this.customDatas.every((item) => {return (item.value != "");});
        if (!result) {
          Toast(`请先填写自定义信息`);
          return;
        }
      }

      if (this.repeatStatus) {
        return; //防止快速点击，重复触发
      }
      this.repeatStatus = true;

      //判断是否从设置页面跳转
      if (!this.isset) {
        const { ...formData } = is_form;
        console.log(formData);
        is_form = formData;
      }
      console.log(is_form);
      $http.post("member.member.bindMobile", is_form, "绑定中...").then(
        response => {
          that.repeatStatus = false;
          if (response.result == 1) {
            //诸葛统计
            zhuge.identify(''+response.data.uid);
            window.yzFirstlogin = 1;
            if (this.diyStatus == 0) {
              this.$dialog.alert({
                message: "绑定成功"
            });              
             
              if (this.ys_short_url_redirect_url) {
                window.location.href = that.ys_short_url_redirect_url + "&from=mobile";
                return;
              }
              if (this.isset == 1) {
                sessionStorage.removeItem("isset");
                this.$router.push(this.fun.getUrl("home"));
              } else if (window.localStorage.is_force_mobile && window.localStorage.is_force_mobile == 999) {
                that.$router.push(
                  that.fun.getUrl("RegisterGuide", {
                    type: "2"
                  }, {
                    app_type: this.app_type
                  })
                );
              } else {
                try {
                  if (this.$route.params.from == "fromInviter") {
                    //从邀请页进入的，后退2
                    that.$router.go(-2);
                    return;
                  }
                } catch (error) {
                  console.log(error);
                }
                that.$router.go(-1);
              }
            } else if (this.diyStatus == 1) {
              //去提交diy
              this.$refs.gofunarr.submit();
              // this.postDiy();
            }
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
        },
        response => {
          this.$dialog.alert({
            message: response.msg
          });
        }
      );
    },
    //先验证是否导致会员id变更
    getPrepBind() {
      console.log(this.form);
      let that = this;
      if (this.fun.isTextEmpty(this.form.country)) {
        Toast("请输入国际区号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
        return;
      }
      if (this.form.country == "86" && this.fun.isMoblie(this.form.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.code)) {
        Toast("请填验证码");
        return;
      }
      if(this.name_must && this.is_edit){
        if(this.fun.isTextEmpty(this.form.realname)){
          Toast("请输入您的姓名");
          return;
        }
      }
      if (this.is_password == "1") {
        if (this.fun.isTextEmpty(this.form.password)) {
          Toast("请填写密码");
          return;
        }
        if (this.fun.isTextEmpty(this.form.confirm_password)) {
          Toast("请填写确认密码");
          return;
        }
        if (this.form.password != this.form.confirm_password) {
          Toast("两次密码不一致");
          return;
        }
      }

      console.log(this.isrequired);
      console.log(this.form.invite_code);
      if (this.isrequired == 1) {
        if (this.fun.isTextEmpty(this.form.invite_code)) {
          Toast("请填写邀请码");
          return;
        }
      }

      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }
      if(this.form_open && this.isForm && this.is_edit){
        for(let i = 0;i<this.customDatas.length;i++){
          if(this.fun.isTextEmpty(this.customDatas[i].value)){
            Toast(`请输入${this.customDatas[i].name}`);
            return;
          }
        }
      }
      // 位置调整
      if (this.diyStatus == 1) {
        this.validation();
        if (!this.isValidation) {
          return;
        }
      }

      if(!this.fun.isTextEmpty(this.PlatformAgreement)){
        if(!this.agreementCB){
          Toast("请先勾选同意"+this.agreement_name);
          return;
        }
      }

      if (this.agreementStatus) {
        if (!this.agreementCB) {
          Toast("请先勾选同意"+ this.protocol_title || '会员注册协议');
          return;
        }
      }

      if (this.repeatStatus) {
        return; //防止快速点击，重复触发
      }
      this.repeatStatus = true;


      //判断是否从设置页面跳转
      if (!this.isset) {
        const { ...formData } = this.form;
        this.form = formData;
      }
      Object.assign(this.form, this.orderLocationObj);
      $http.post("member.member.prepBind", this.form, "绑定中...").then(
        response => {
          that.repeatStatus = false;
          if (response.result == 1) {
            if (response.data.is_show) {
              // 显示 导致会员id变更 弹窗
              this.showChangeID = true;
              this.changidInfo.uid = response.data.uid;
              this.changidInfo.change_uid = response.data.change_uid;
              return;
            } else {
              //不显示提示弹窗
              this.register();
            }
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
        },
        response => {
          this.$dialog.alert({
            message: response.msg
          });
        }
      );
    },

    //获取图片验证码
    getimgdata(data) {
      if (data) {
        if (data.captcha) {
          this.imgcode = data.captcha.img;
        }
      } else {
        $http
          .get("home-page.getCaptcha")
          .then(res => {
            if (res.data.captcha) {
              this.imgcode = res.data.captcha.img;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //diy--------diy
    // vant 多其他图片上传
    onRead_2(e, flag) {
      if (flag !== true) {
        if (e.file.size > this.photosize) {
          this.imgPreview(e.file, 3);
          return false;
        }
      }
      var That = this;
      // var real_length = 0;
      // let max_length = 0;
      // let real_list1 = [];
      // let real_list2 = [];
      let index = 0;
      let real_name = "";
      for (let i = 0; i < That.diydata.length; i++) {
        if (That.upload_name == That.diydata[i].name) {
          real_name = That.diydata[i].name;
          console.log(real_name);
          index = i;
          // max_length = That.diydata[i].data.tp_max;
          // real_list1 = That.diydata[i][real_name + "Value1"];
          // real_list2 = That.diydata[i][real_name + "Value2"];
          // console.log(That.diydata[i][real_name + "Value1"]);
          break;
        }
      }
      let fd = new FormData();
      if (
        this.diydata[index][real_name + "Length"] == this.diydata[index].data.tp_max ||
        this.diydata[index][real_name + "Length"] >= this.diydata[index].data.tp_max
      ) {
        this.$notify({
          background: "#fef0f0",
          message: "图片数量已达到上限",
          color: "#f56c6c"
        });
        return false;
      }
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      fd.append("attach", "upload");

      // 添加加载提示
      Toast.loading({
        message: "",
        forbidClick: true
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            this.diydata[index][real_name + "Length"]++;
            this.diydata[index][real_name + "Value1"].push({
              url: responseData.data.img
            });
            console.log(this.diydata[index][real_name + "Value1"]);

            if (flag === true) {
              this.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e)
              });
            } else {
              this.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e.file)
              });
            }
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1: function(item, delIndex) {
      console.log(item);
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (item.name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          console.log(real_name);
          index = i;
          break;
        }
      }
      this.diydata[index][real_name + "Value1"].splice(delIndex, 1);
      this.diydata[index][real_name + "Value2"].splice(delIndex, 1);
      this.diydata[index][real_name + "Length"] = this.diydata[index][real_name + "Value1"].length;
    },
    postDiy(e) {
      var that = this;
      var formData = e;
      // var formObject = {};
      // this.diydata.forEach(item => {
      //   if (item.type == "diyimg") {
      //     var arr = [];
      //     for (let i = 0; i < item[item.name + 'Value1'].length; i++) {
      //       arr.push(item[item.name + "Value1"][i].url);
      //     }
      //     formObject[item.name] = arr;
      //   } else {
      //     formObject[item.name] = item.value;
      //   }
      // });
      // formData.push(formObject);

      let json = {
        form_data: formData,
        form_id: this.form_id,
        form_type: "register"
      };
      $http.post("plugin.diyform.api.diy-form.save-diy-form-data", json, "提交中...").then(
        response => {
          if (response.result == 1) {
            this.$dialog.alert({
              message: "绑定成功"
            });
            try {
              if (that.$route.params.fromTag == "fromInviter") {
                //从邀请页进入的，后退2
                that.$router.go(-2);
                return;
              }
            } catch (error) {
              console.log("error", error);
            }
            that.$router.go(-1);
          } else {
            console.log(this.isrequired != 0);
            if (this.isrequired != 0) {
              this.$dialog.alert({
                message: response.msg
              });
            }
            this.$dialog.alert({
              message: response.msg
            });
          }
        },
        response => {
          this.$dialog.alert({
            message: response.msg
          });
        }
      );
    },

    setCity(ret) {
      var retCity = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      console.log("retCity", retCity);
      console.log("currentCityKey", this.currentCityKey);
      this.diydata.forEach(item => {
        if (item.name == this.currentCityKey) {
          this.$set(item, "value", retCity);
        }
      });
    },
    openPicker(name) {
      this.currentDateKey = name;
      console.log("name", name);
      this.pickerValueShow = true;
      // this.$refs.picker.open();
    },

    openCity(name) {
      this.currentCityKey = name;
    },

    //验证参数
    validation() {
      this.isValidation = true;
      console.log(this.diydata, 33);
      this.diydata.forEach(item => {
        if (item.data.tp_must == 1 && !item.value && item.type != "diyimg") {
          console.log(item.data.tp_name, item.value);
          Toast(item.data.tp_name + "必须填写哦");

          this.isValidation = false;
        }
        if (item.data.tp_must == 1 && item.type == "diyimg") {
          if (item[item.name + "Length"] <= 0) {
            this.isValidation = false;
            Toast(item.data.tp_name + "必须填写哦");
          }
        }
        if (item.type == "diycheckbox" && item.value.length == 0) {
          console.log(item.data.tp_name, item.value);
          Toast(item.data.tp_name + "必须选择哦");
          this.isValidation = false;
        }
      });
    },
    //diy--------diy

    popClose() {
      this.show2 = false;
    },

    //获取当前位置信息，用于提交订单
    getCurrentOrderLocation() {
      return new Promise((resolev, reject) => {
        // Toast.loading({
        //   message: "获取位置信息",
        //   forbidClick: true
        // });
        var mapObj = new AMap.Map("iCenter");
        mapObj.plugin("AMap.Geolocation", () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", (obj) => {
            // Toast.clear();
            //console.log("执行1");
            resolev({
              positioning_success: 1,
              register_province: obj.addressComponent.province,
              register_city: obj.addressComponent.city
            });
          }); // 返回定位信息
          AMap.event.addListener(geolocation, "error", () => {
            // Toast.clear();
            //console.log("执行2");
            resolev({
              positioning_success: 0,
              register_province: "",
              register_city: ""
            });
          }); // 返回定位出错信息
        });
      });
    },
    surePwdClick() {
      this.visibleSure = !this.visibleSure;
      if (this.visibleSure == true) {
        this.surepassword = "password";
      } else {
        this.surepassword = "text";
      }

    },
    SetPwdClick() {
      this.visibleSet = !this.visibleSet;
      if (this.visibleSet == true) {
        this.setpassword = "password";
      } else {
        this.setpassword = "text";
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    }
  },
  activated() {
    if (this.fun.getKey("app_type")) {
      this.app_type = this.fun.getKey("app_type");
    }else if(window.localStorage.getItem('cps_app_type')){
      this.app_type = window.localStorage.getItem('cps_app_type');
    }else {
      this.app_type = 7;
    }
    this.init();
    this.form.mobile = this.$route.params.num;
    if (this.$route.query.is_edit == "1") {
      // 编辑进来的不显示邀请码 is_edit=false是编辑进来的
      this.is_edit = false;
    }
    this.getAllData();
    // this.getDiyFormStatus();
    // this.getProtocolStatus();
    // this.getimgdata();
    if (!this.fun.isTextEmpty(this.$route.params.code)) {
      this.form.invite_code = String(this.$route.params.code);
      console.log(this.form.invite_code, "传过来的邀请码");
    }
    if (this.$route.query.from == "signPage") {
      this.ys_short_url_redirect_url = this.fun.getCookie("ys_short_url_redirect_url");
      this.ys_short_url_redirect_tel = this.fun.getCookie("ys_short_url_redirect_tel");
    }
    if (this.ys_short_url_redirect_tel) {
      this.form.mobile = this.ys_short_url_redirect_tel;
    }
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
  },

  components: {
    cTitle,
    diyorm
  }
};
