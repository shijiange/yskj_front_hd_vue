//window.localStorage.isWeiXin
import { Toast } from 'vant';
import cTitle from "components/title";
export default {
  //name: 'login',
  data() {
    return {
      login_checked: false,
      ys_short_url_redirect_url: '',
      ys_short_url_redirect_tel: '',
      eye_open: false,
      eye_close: true,
      type: "password",
      form: {
        mobile: "",
        mobileErr: "",
        password: "",
        passwordErr: "",
        uuid: 0,
        mid: 0,
        code: "",
        captcha: ""
      },
      mydata: "",
      isApp: false,
      apptoken: "",
      wetach_login: false,
      appShow: true,
      start1: false,
      mobile_login_code: 0,
      imgcode: "",
      wechat_qrcode_config:{
        callback: "",
        is_open: "",
        is_wechat_login: "",
        wechat_login_type: ""
      },
      login_type:1,
      appid:"",
      redirect_uri:"",
      scope:"",
      state:"",
      login_obj:{},
      loading: false,
      // loading: false,
      is_enable: 0,
      enable_btn:false,
      btnText:'获取短信验证码',
      btnTag:false,
      timer: null,
      count:'',
      toastLogin: null,
      visible:true,
      passwordOrText:'password',

      mailInfo_logo: "",
      from: "",
      login_back_url: "",
      account_url: "",
      pc_token: "",
      pc_bind_mobile: "",
      protocol_title: "",
      timer2: null,
      showChangeID: false,
      changidInfo: {},
      mobileForm: {
        code: "",
        captcha: "",
        mobile: ""
      },
    };
  },
  components: {
    cTitle
  },
  mounted() {
    this.start1 = false;

    this.ys_short_url_redirect_url = this.fun.getCookie('ys_short_url_redirect_url');
    this.ys_short_url_redirect_tel = this.fun.getCookie('ys_short_url_redirect_tel');
    if (this.ys_short_url_redirect_tel) {
      this.form.mobile = this.ys_short_url_redirect_tel;
      this.mobile_login_code = 1;
      this.getimgdata();
      this.loading = true;
    } else {
      this.getLoginMode();
    }
  },
  methods: {
    tapChange(){
      if(this.is_enable == 0){
        this.is_enable = 1;
      }else{
        this.is_enable = 0;
      }
    },
    getLoginMode() {
      var that = this;
      let _json = {
        basic_info: 1
      };
      //没登录是没有返回basic_info信息的，会导致报错；任务编号: 41368

      $http.get("member.login.login-mode", _json).then(response => {
        // console.log(response);
        if (response.result === 1) {

          this.loading = true;
          this.mobile_login_code = response.data.mobile_login_code;
          this.mailInfo_logo = response.data.logo;
          this.protocol_title = response.data.protocol_title;
          if (response.data.sms && response.data.sms.captcha.status == "1") {
            this.imgcode = response.data.sms.captcha.img;
          }
          // PC端扫码登录
          if(that.fun.isPc()) {
            that.wechat_qrcode_config = response.data.wechat_qrcode_config || {};
            if(that.wechat_qrcode_config.is_open && (that.wechat_qrcode_config.wechat_login_type == 1 || that.wechat_qrcode_config.wechat_login_type == 2)) {
              // 开启PC端微信扫码登录  1
              // 开启PC端微信扫码关注微信号登录 2
              let yz_redirect = sessionStorage.getItem("yz_redirect");
              that.login_type = 2;
              that.login({is_pc_qrcode:1,yz_redirect:yz_redirect});
            }
          }
          if (response.basic_info.plugin_setting) {
            if (response.basic_info.plugin_setting.account_login) {
              this.is_enable = response.basic_info.plugin_setting.account_login.enable;
              this.enable_btn = response.basic_info.plugin_setting.account_login.enable;
            }
          }
        } else {
          this.loading = true;
          Toast(response.msg);
        }
      });
    },
    toRegisterText() {
      this.$router.push(this.fun.getUrl("registerAgreement"));
    },
    verificationCode_V2() {
      if (this.fun.isTextEmpty(this.mobileForm.mobile)) {
        Toast("请填写手机号");
        return;
      }

      if (this.fun.isMoblie(this.mobileForm.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.mobileForm.captcha) && this.imgcode) {
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
            mobile: this.mobileForm.mobile,
            state: "86",
            captcha: this.mobileForm.captcha,
          })
          .then(
            response => {
              Toast.clear();
              if (response.result == 1) {
                this.sendCodeAnimation();
              } else {
                Toast(response.msg);
                //刷新图形验证码
                this.mobileForm.captcha = "";
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg);
            }
          );
      }
    },
    //先验证是否导致会员id变更
    getPrepBind() {
      console.log(this.mobileForm);
      if (!this.mobileForm.mobile) {
        Toast('请填写手机号');
        return;
      }
      if (this.imgcode && !this.mobileForm.captcha) {
        Toast('图形验证码不能为空');
        return;
      }

      if (!this.mobileForm.code) {
        Toast('请填验证码');
        return;
      }

      $http.post('member.member.prepBind', this.mobileForm, '绑定中...').then(
        response => {
          if (response.result == 1) {
            if (response.data.is_show) {
              // 显示 导致会员id变更 弹窗
              this.showChangeID = true;
              this.changidInfo.uid = response.data.uid;
              this.changidInfo.change_uid = response.data.change_uid;
            } else {
              //不显示提示弹窗
              this.register_V2();
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          Toast(response.msg);
        }
      );
    },
    register_V2() {
      let json = {
        country: '86',
        mobile: this.mobileForm.mobile,
        captcha: this.mobileForm.captcha,
        code: this.mobileForm.code,
        close: 1
      };

      $http.post('member.member.bindMobile', json, '绑定中...').then(
        response => {
          if (response.result == 1) {
            Toast('绑定成功');
            this.showChangeID = false;
            if (this.ys_short_url_redirect_url) {
              window.location.href = this.ys_short_url_redirect_url + '&from=mobile';
              return;
            }

            if (this.login_back_url) {
              window.location.href = this.login_back_url;
            } else {
              this.$router.push(this.fun.getUrl("home"));
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          Toast(response.msg);
        }
      );
    },
    login(data) {
      let that = this;
      let url;
      let datainfo;
      let type = "";
      let loading = "正在获取";
      // console.log(data);
      if (this.is_enable == 0) {
        url = "member.login.index";//pc端手机号加密码登录的请求接口
        datainfo = data;
        //console.log('datainfo111:'+datainfo.mid);
      } else {
        // is_enable == "1" 是账号登录
        url = "plugin.account-login.frotend.member.login";
        // console.log(data);
        datainfo = {
          account: data.mobile,
          mobileErr: data.mobileErr,
          password: data.password,
          passwordErr: data.passwordErr,
          uuid: data.uuid,
          mid:data.mid,
          code: data.code,
          captcha: data.captcha
        };
       // console.log('datainfo:'+datainfo.mid);
      }
      if(that.wechat_qrcode_config.is_open && that.wechat_qrcode_config.wechat_login_type == 2 && that.login_type==2) {
        type = "16";
        if(this.pc_token) {
          datainfo.pc_token = this.pc_token;
          loading = null;
        }
      }
      //var datainfonew = datainfo;

      $http.post(url, datainfo, loading, "", type).then(async (response) => {
        //console.log(response);
        if (response.result === 1) {//pc端手机号加密码登录的请求接口
          if (that.fun.isPc() && response.data.status == 11) {
            // 扫码公众号登陆首次
            this.pc_token = response.data.pc_token;
            this.account_url = response.data.account_url;
            if(this.timer2) {
              clearInterval(this.timer2);
              this.timer2 = null;
            }
            if(!this.timer2 && this.pc_bind_mobile != 1) {
              this.timer2 = setInterval(()=> {
                that.login({
                  is_pc_qrcode: 1,
                  yz_redirect: this.yz_redirect
                });
              }, 5000);
            }
            zhuge.identify(''+window.localStorage.uid);
          }else if (that.fun.isPc() && response.data.status == 1) {//pc端手机号加密码登录的请求接口
            // 扫码公众号登陆成功
            this.pc_bind_mobile = response.data.pc_bind_mobile;
            if(this.timer2) {
              clearInterval(this.timer2);
              this.timer2 = null;
            }
            localStorage.setItem("siteMobile", this.form.mobile);
            //console.info("--会员信息1--");
            //console.info(response.msg);
            that.$store.commit("setLoginStatus", response.data.status);
            window.localStorage.setItem("isWxLogin", 0);  // 判断是否微信授权登录
            this.login_back_url = response.data.url;

            if(this.pc_bind_mobile != 1) {
              if (this.ys_short_url_redirect_url) {
                //console.info("--会员信息11--");
                //诸葛统计
                //zhuge.identify(''+window.localStorage.uid);
                //zhuge.track('登录成功');
                window.location.href = that.ys_short_url_redirect_url + '&from=mobile';
                return;
              }

              if (response.data.url) {
                //console.info("--会员信息12--");
                //诸葛统计
                //console.log('uid:'+response.msg.uid);
                zhuge.identify(''+window.localStorage.uid);
                window.location.href = response.data.url;
                //console.log('mobile:'+response.msg.mobile);  
              } else {
                //console.info("pc端手机号加验证码登录和手机号加密码登录");
                //诸葛统计
                zhuge.identify(''+window.localStorage.uid);
                //zhuge.track('登录成功');
                this.$router.push(this.fun.getUrl("home"));
              }
            }
          }else {
            //console.info("--会员信息14--");
            if(this.timer2) {
              clearInterval(this.timer2);
              this.timer2 = null;
            }

            localStorage.setItem("siteMobile", this.form.mobile);
            //console.info("--会员信息2--");
            //console.info(response.msg);
            that.$store.commit("setLoginStatus", response.data.status);
            window.localStorage.setItem("isWxLogin", 0);
            if (that.fun.isApp()) {
              if (response.msg.uid) {
                YDB.SetUserRelationForPush(response.msg.uid);
              } else {
                YDB.SetUserRelationForPush(response.msg.member_id);
              }
            }
            if (this.ys_short_url_redirect_url) {
             // console.info("--会员信息21--");
              //诸葛统计
              //zhuge.identify(''+window.localStorage.uid);
              window.location.href = that.ys_short_url_redirect_url + '&from=mobile';
              return;
            }

            if (response.data.url) {
              //console.info("--会员信息22--");
              //诸葛统计
              zhuge.identify(''+window.localStorage.uid);
              window.location.href = response.data.url;
            } else {
             // console.info("--会员信息23--");
               //诸葛统计
              zhuge.identify(''+window.localStorage.uid);
              //zhuge.track('登录成功');
              that.$router.push(that.fun.getUrl("home"));
            }
          }

           

        } else {
          //console.info("--会员信息3--");
          if(that.fun.isPc()&&response.data.status==9) {
            let url = response.msg.url;
            if(url) {
              that.appid = that.getParam('appid',url);
              that.redirect_uri = that.getParam('redirect_uri',url);
              that.scope = that.getParam('scope',url);
              that.state = that.getParam('state',url);
            }

            //诸葛统计
            zhuge.identify(''+window.localStorage.uid);
            this.login_obj = new WxLogin({
              // self_redirect:true,
              id:"login_code",
              appid: that.appid,
              // scope: "snsapi_login",
              scope:that.scope,
              redirect_uri: encodeURIComponent(that.redirect_uri),
              // redirect_uri:encodeURI(that.redirect_uri),
              state: that.state,
              // style: "",
              // href: ""
            });
            //console.info("--会员信息31--");
            


          }else {
            if(response.data.status != 10) {
              that.$dialog.alert({message:response.msg});
            }
          }
        }


      });
    },
    //获取图片验证码
    getimgdata() {
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
    },
    mobile_login() {
      zhuge.track('点击登录');
      if (this.fun.isApp() && !this.login_checked) {
        Toast("请先勾选登录即代表您同意《用户协议》和《隐私政策》！");
        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
        return;
      }

      if (this.mobile_login_code != 1) {
        if (this.fun.isTextEmpty(this.form.password)) {
          Toast("请填写密码");
          return;
        }
        delete this.form.code;
      }

      this.form.uuid = 0;

      this.form.mid =
        this.fun.isTextEmpty(window.localStorage.getItem("mid")) == null
          ? 0
          : window.localStorage.getItem("mid");

      this.form.is_sms = this.mobile_login_code;
      if (this.mobile_login_code != 1) {
        delete this.form.code;
      }
      let yz_redirect = sessionStorage.getItem("yz_redirect");
      if (!this.fun.isTextEmpty(yz_redirect)) {
        this.form.yz_redirect = yz_redirect;
      }
      console.log(this.form);
      this.login(this.form);
    },
    //发送验证码
    verificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
        return;
      }

      if (this.fun.isMoblie(this.form.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请先填图形验证码");
        return;
      }

      this.toastLogin = Toast({
        duration: -1, // 持续展示 toast
        message: '发送中...'
      });
      //发送获取验证码的请求
      $http
        .get("member.register.alySendCode", {
          mobile: this.form.mobile,
          captcha: this.form.captcha,
          sms_type: 3
        })
        .then(
          response => {
            this.toastLogin.clear();
            if (response.result === 1) {
              that.sendCodeAnimation();
            } else {
              //刷新图形验证码
              Toast(response.msg);
              this.form.captcha = "";
              this.getimgdata();
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },
    //发送验证码 倒计时
    sendCodeAnimation() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        Toast.success('验证码已发送');
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


    register() {
      $http
        .get("member.register.chk-register")
        .then(res => {
          if (res.result === 1 && res.data.state == 0) {
            console.log(this.is_enable,'上级的点击');
            this.$router.push(this.fun.getUrl("register",{enable:this.is_enable}));
          }
          if (res.result === 0 && res.data.state == 1) {
            Toast(res.data.reason);
          }
        })
        .catch(error => {
          console.log(error);
        });
        zhuge.track('点击注册');
    },
    weixin() {
      if (this.fun.isApp() && !this.login_checked) {
        Toast("请先勾选登录即代表您同意《用户协议》和《隐私政策》！");
        return;
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: "正在登录"
      });
      window.localStorage.setItem("isWxLogin", 0);
      let accessUrl = this.fun.getSiteRoot() + this.fun.getRealUrl("member.login.index", {uuid:YDB_UUID});
      YDB.WXLogin(0, accessUrl);
    },
    init_login() {
      if (!this.fun.isApp()) {
        return;
      }
      if (!YDB_isWXApp) {
        return;
      }
      if (this.apptoken) {
        this.login({
          apptoken: this.apptoken
        });
      } else {
        $http
          .get("member.login.index", {
            show_wechat_login: true
          })
          .then(response => {
            if (response.result == 1) {
              this.wetach_login = parseInt(response.data.wetach_login);
            }
          });
      }
    },
    //跳转修改密码
    gotoPwd() {
      this.$router.push(this.fun.getUrl("findpwd"));
    },

    isAppLogin() {
      $http
        .post("member.login.phoneSetGet", {})
        .then(response => {
          // console.log(response);
          if (response.result == 1) {
            // if(response.data.phone_oauth == '1'){
            // 	this.appShow=true;
            // }else if(response.data.phone_oauth == '0' ){
            // 	this.appShow=false;
            // }else{
            // 	return;
            // }
            this.appShow = parseInt(response.data.phone_oauth);
          } else {
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //点击切换password显示
    isShowpsd() {
      this.eye_open = this.eye_open == false ? true : false;
      this.eye_close = this.eye_close == true ? false : true;
      this.type = this.type == "password" ? "text" : "password";
    },
    // 切换登录方式
    changeLoginType(type) {
      if(this.timer2) {
        clearInterval(this.timer2);
        this.timer2 = null;
      }
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.login_type = type;
      let dom = document.getElementsByTagName('iframe');
      if(dom && dom[0]) {
        dom[0].setAttribute('style',"display:none");
      }
    },
    getParam(name,url) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      // var r = window.location.search.substr(1).match(reg);
      if(url.indexOf('?')>-1) {
        var r = url.split('?')[1].match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
      return null;
    },

    passwordClick() {
      this.visible = !this.visible;
      if(this.visible == true) {
        this.passwordOrText = 'password';
      } else {
        this.passwordOrText = 'text';
      }

    }
  },
  deactivated() {
    Toast.clear();
    if(this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if(this.timer2) {
      clearInterval(this.timer2);
      this.timer2 = null;
    }
  },
  activated() {
    let app = this.fun.getTyep();

    if (app == "7") {
      this.isAppLogin();
    } else {
      this.appShow = true;
    }

    if(this.$route.query.from == 'phone') {
      this.pc_bind_mobile = '1';
    }
    this.apptoken = this.$route.query.apptoken;
    this.init_login();
  }
};
