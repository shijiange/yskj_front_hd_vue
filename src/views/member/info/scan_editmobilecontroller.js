import { Toast } from "vant";
import cTitle from "components/title";
import diyorm from "components/diyform";
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
  for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
};
//diy--------diy

export default {
  data() {
    return {
      is_password: false, //是否开启填写密码
      isset: "",
      protocol_content: "",
      show2: false,
      success_show: false, //注册成功弹出框
      agreement_show: false, //注册协议

      imgcode: "",
      showChangeID: false,
      changidInfo: {
        uid: null,
        change_uid: null
      },

      agreementStatus: false,
      agreementCB: true,

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
        invite_code: ""
      },
      // poster
      show_banner: false,
      is_force_binding: 1,
      banner_url: "",
      register_explain: "",
      is_record: 1,
      app_url: "",
      app_type: "", //app分享类型，不同类型跳不同APP下载链接
      // poster

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
        "2": "diyselect",
        "7": "diydate",
        "9": "diycity"
      },
      invite: "",
      isrequired: "",
      country_code: 0,
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

      pickerShow: false
    };
  },

  mounted() {
    this.isset = sessionStorage.getItem("isset");
    var dataSource = {};
    if (this.isset) {
      sessionStorage.removeItem("isset");
      dataSource = {
        close: 1
      };
    }
    // 判断是否显示邀请码字段
    $http.get("member.register.getInviteCode", dataSource).then(res => {
      // 登录是否是微信登录
      // if (this.fun.isWeiXin() == true) {
      //   this.invite = false
      //   return
      // }
      if (res.data.status == 1) {
        this.invite = res.data.status;
        this.isrequired = res.data.required;
        this.country_code = res.data.country_code;
        this.form.invite_code = res.data.invitation_code.invite_code;
      }
    });
  },
  watch: {
    success_show() {
      let that = this;
      if (this.success_show == false) {
        // 注册成功后，关闭弹窗，直接跳到注册成功页面
        that.$router.push(
          that.fun.getUrl(
            "RegisterGuide",
            {
              type: "1"
            },
            {
              app_type: this.app_type
            }
          )
        );
      }
    }
  },

  methods: {
    init() {
      this.agreementCB = true;

      this.start1 = false;
      this.form = {
        country: "86",
        mobile: "",
        mobileErr: "",
        password: "",
        passwordErr: "",
        confirm_password: "",
        confirm_passwordErr: "",
        close: 1
      };

      this.diyStatus = 0;
      this.form_id = "";
      this.pickerValue = "2017-09-27";
      this.showCity = false;

      this.currentDateKey = "";
      this.currentCityKey = "";
      this.checks = [];
      this.isValidation = true;
      this.diyform = {};
      this.diydata = [];

      this.show2 = false;
      this.success_show = false;
      this.agreement_show = false;

      this.is_force_binding = 1;
      this.show_banner = false;
      this.banner_url = "";
      this.register_explain = "";
      this.is_record = 1;
      this.app_url = "";

      this.pickerShow = false;
    },

    //获取是否开启协议
    getProtocolStatus() {
      var that = this;
      $http.get("setting.get-member-protocol", {}).then(
        response => {
          if (response.result == 1) {
            that.is_password = response.data.register && Number(response.data.register.is_password) == 0 ? false : true; //是否开启了填写密码
          }
        },
        response => {
          console.log(response.msg);
          that.agreementStatus = false;
        }
      );
    },
    // 获得海报分享数据
    getPosterData() {
      var that = this;
      let url = "";
      if (this.app_type == 7) {
        // 默认
        url = "plugin.app-set.frontend.app-poster.getAppShareOther";
      } else if (this.app_type == 15) {
        // 淘京拼插件
        url = "plugin.aggregation-cps.api.poster.getAppShare";
      }
      $http.get(url, {},'loading').then(
        response => {
          if (response.result == 1) {
            let set = response.data.set;
            that.is_force_binding = set.is_force_binding;
            that.show_banner = true;
            that.banner_url = set.banner_url;
            that.register_explain = set.register_explain;
            that.is_record = set.is_record;
            that.app_url = set.app_url;
            if (set.is_record == 1 || set.is_force_binding == 0) {
              that.$router.push(
                that.fun.getUrl(
                  "RegisterGuide",
                  {
                    type: "1"
                  },
                  {
                    app_type: that.app_type
                  }
                )
              );
            }
          }else {
            that.show_banner = true;
          }
        },
        response => {
          console.log(response.msg);
          that.agreementStatus = false;
        }
      );
    },

    //获取diy 状态信息
    getDiyFormStatus() {
      var that = this;
      $http.get("setting.get-register-diy-form", {}).then(
        response => {
          if (response.result == 1) {
            if (response.data.status == 1) {
              that.diyStatus = 1;
              that.form_id = response.data.form_id;
              that.getDiyFormInfo(response.data.form_id);
            } else {
              that.diyStatus = 0;
            }
          } else {
            that.diyStatus = 0;
          }
        },
        response => {
          console.log(response.msg);
          that.diyStatus = 0;
        }
      );
    },

    //获取diy 信息
    getDiyFormInfo(id) {
      var that = this;
      $http
        .get("plugin.diyform.api.diy-form.get-diy-form-by-id", {
          form_id: id
        })
        .then(
          response => {
            if (response.result == 1) {
              that.diyform = response.data;
              var fields = that.diyform.fields;

              console.log(fields, 456);
              var f;
              for (var field in fields) {
                if (that.types[fields[field].data_type] == "diycheckbox") {
                  f = {
                    name: field,
                    data: fields[field],
                    value: [],
                    type: that.types[fields[field].data_type]
                  };
                } else if (that.types[fields[field].data_type] == "diydate") {
                  f = {
                    name: field,
                    data: fields[field],
                    value: "",
                    type: that.types[fields[field].data_type]
                  };
                } else {
                  f = {
                    name: field,
                    data: fields[field],
                    value: "",
                    type: that.types[fields[field].data_type]
                  };
                }

                that.diydata.push(f);
              }
              console.log(that.diydata);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },

    //发送验证码
    verificationCode() {
      console.log(this.form.mobile);
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
          } else {
            this.btnTag = false;
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
      //this.$router.push(this.fun.getUrl('registerAgreement', {}));
      this.show2 = true;
    },

    //注册
    register() {
      console.log("hahahahaha");
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

      if (this.is_password && this.fun.isTextEmpty(this.form.password)) {
        Toast("请填写密码");
        return;
      }

      if (this.isrequired == 1) {
        if (this.fun.isTextEmpty(this.form.invite_code)) {
          Toast("请填写邀请码");
          return;
        }
      }

      if (this.is_password && this.fun.isTextEmpty(this.form.confirm_password)) {
        Toast("请填写确认密码");
        return;
      }

      if (this.is_password && this.form.password != this.form.confirm_password) {
        Toast("两次密码不一致");
        return;
      }

      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }

      // if (this.fun.isTextEmpty(this.form.captcha)) {
      //     Toast({
      //         mes: '图形验证码不能为空',
      //         timeout: 1500
      //     });
      //     return;

      // }

      // 位置调整
      // if (this.diyStatus == 1) {
      //   this.validation();

      //   if (!this.isValidation) {
      //     return;
      //   }
      // }

      // if (this.agreementStatus) {
      if (!this.agreementCB) {
        Toast("请同意注册协议");
        return;
      }
      // }

      if (this.repeatStatus) {
        return; //防止快速点击，重复触发
      }
      this.repeatStatus = true;

      //判断是否从设置页面跳转
      if (!this.isset) {
        const { ...formData } = this.form;
        this.form = formData;
      }
      $http.post("member.member.bindMobile", this.form, "绑定中...").then(
        response => {
          that.repeatStatus = false;
          if (response.result == 1) {
            if (this.diyStatus == 0) {
              // this.$dialog.alert({
              //   mes: "绑定成功",
              // });
              that.successShow();
              // that.$router.push(
              //   that.fun.getUrl("RegisterGuide", {
              //     type:"1"
              //   })
              // );
              //   if (this.isset==1) {
              //   sessionStorage.removeItem("isset")
              //   this.$router.push(this.fun.getUrl('home'));
              // }else{
              //   that.$router.go(-1);
              // }
            } else if (this.diyStatus == 1) {
              //去提交diy
              // this.postDiy();
              this.$refs.gofunarr.submit();
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

      if (this.is_password && this.fun.isTextEmpty(this.form.password)) {
        Toast("请填写密码");
        return;
      }

      if (this.isrequired == 1) {
        if (this.fun.isTextEmpty(this.form.invite_code)) {
          Toast("请填写邀请码");
          return;
        }
      }

      if (this.is_password && this.fun.isTextEmpty(this.form.password)) {
        Toast("请填写确认密码");
        return;
      }

      if (this.is_password && this.form.password != this.form.confirm_password) {
        Toast("两次密码不一致");
        return;
      }

      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }
      // 位置调整
      // if (this.diyStatus == 1) {
      //   this.validation();

      //   if (!this.isValidation) {
      //     return;
      //   }
      // }

      // if (this.agreementStatus) {
      if (!this.agreementCB) {
        Toast("请同意注册协议");
        return;
      }
      // }

      if (this.repeatStatus) {
        return; //防止快速点击，重复触发
      }
      this.repeatStatus = true;

      //判断是否从设置页面跳转
      if (!this.isset) {
        const { ...formData } = this.form;
        this.form = formData;
      }
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
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          this.imgcode = res.data.captcha.img;
        })
        .catch(error => {
          console.log(error);
        });
    },

    //diy--------diy

    postDiy(e) {
      var that = this;
      var formData = e;
      // var formObject = {};
      // this.diydata.forEach(item => {
      //   formObject[item.name] = item.value;
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
            that.success_show = true;
            // this.$dialog.alert({
            //   mes: "绑定成功",
            // });
            // that.$router.go(-1);
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
      this.pickerShow = true;
      //this.$refs.picker.open();
    },
    setDate(ret) {
      console.log(ret.Format("yyyy-MM-dd"));
      this.diydata.forEach(item => {
        if (item.name == this.currentDateKey) {
          this.$set(item, "value", ret.Format("yyyy-MM-dd"));
        }
      });
      this.pickerShow = false;
    },
    openCity(name) {
      this.currentCityKey = name;
    },

    //验证参数
    validation() {
      this.isValidation = true;
      console.log(this.diydata, 33);
      this.diydata.forEach(item => {
        if (item.data.tp_must == 1 && !item.value && item.type) {
          console.log(item.data.tp_name, item.value);
          Toast.fail(item.data.tp_name + "必须填写哦");

          this.isValidation = false;
        }

        if (item.type == "diycheckbox" && item.value.length == 0) {
          console.log(item.data.tp_name, item.value);
          Toast.fail(item.data.tp_name + "必须选择哦");
          this.isValidation = false;
        }
      });
    },
    //diy--------diy

    popClose() {
      this.show2 = false;
    },
    goto() {
      this.$router.push(this.fun.getUrl("editmobile"));
    },
    successShow() {
      this.success_show = true;
    },
    jumpDown() {
      window.location.href = this.app_url;
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
    },
    getParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.hash.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  },
  activated() {
    this.app_type = this.getParam("app_type");
    if (!this.app_type) {
      this.app_type = 7;
    }
    window.localStorage.setItem("cps_app_type", this.app_type);

    // 判断是否已绑定手机，如已绑定，跳到提示下载APP页面
    this.getPosterData();

    // console.log(this.$route.params.num);
    this.init();
    this.form.mobile = this.$route.params.num;
    this.getDiyFormStatus();
    this.getProtocolStatus();
    this.getimgdata();
  },

  components: {
    cTitle,
    diyorm
  }
};
