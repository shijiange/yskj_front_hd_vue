import { Toast } from 'vant';
import payKeyboard from "components/payKeyboard";
// import addre from "assets/address/addressinfo";
import cTitle from "components/title";
// import { mapState, mapMutations } from "vuex";

// const address = addre;
export default {
  data() {
    return {
      isOldShowKeyboard: false,
      isNewShowKeyboard: false,
      mobile: "",

      code: "",
      // oldPwd: "",//旧密码
      newPwd: "", //新密码
      newPwdConfirm: "", //确认密码
      captcha: "",

      startCode: false,
      imgcode: "",
      btnBg:'#ef4f4f',
      btnText:'获取短信验证码',
      btnTag:false,
      timer: null,
      count:'',
      toastSet: null,
      visible:true,
      visibleConfirm:true,
      passwordOrText:'password',
      passwordOrTextConfirm:'password',
      payarr:'',
      passIndex:''
    };
  },

  methods: {
    initData() {
      this.isOldShowKeyboard = false;
      this.isNewShowKeyboard = false;
      this.startCode = false;
      this.mobile = "";
      this.captcha = "";
      this.getimgdata();

      this.code = "";
      // this.oldPwd = "";
      this.newPwd = "";
    },
    onInput(e){
      console.log(e,this.payarr.length);
      this.payarr = e;
      this.newKeyboardDone(this.payarr);
      // if(this.payarr.length <6){
      //   this.payarr = `${this.payarr}${e}`;
      //   if(this.payarr.length == 6){
      //     this.newKeyboardDone(this.payarr);
      //   }
      // }
    },
    onDelete(e){
      if(this.payarr.length >0){
        this.payarr = this.payarr.substr(0, this.payarr.length - 1);  
      }
    },
    // showOldKeyboard() {
    //   this.isOldShowKeyboard = true;
    // },
    //
    // hideOldKeyboard() {
    //   this.isOldShowKeyboard = false;
    // },

    showNewKeyboard(type) {
      this.passIndex = type;
      this.isNewShowKeyboard = true;
      this.payarr = '';
    },

    hideNewKeyboard() {
      this.isNewShowKeyboard = false;
    },

    // oldKeyboardDone(val) {
    //   this.oldPwd = val;
    //
    //   this.hideOldKeyboard();
    // },

    newKeyboardDone(val) {
      console.log(this.passIndex);
      if(this.passIndex == 'newPwd'){
        this.newPwd = val;
      }else{
        this.newPwdConfirm = val;
      }
      this[this.passIndex] = val;
      this.hideNewKeyboard();
    },

    //发送验证码
    verificationCode() {
      if (this.fun.isTextEmpty(this.mobile) || this.fun.isMoblie(this.mobile)) {
        Toast("手机号数据错误");
        return;
      }
      if (this.fun.isTextEmpty(this.captcha) && this.imgcode) {
        Toast("请填图形验证码");
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '发送中',
        });
        //发送获取验证码的请求
        $http
          .get("member.balance-password.send-code", {
            mobile: this.mobile,
            captcha: this.captcha
          })
          .then(
            response => {
              Toast.clear();
              if (response.result === 1) {
                this.sendCodeAnimation();
              } else {
                Toast(response.msg);
                this.getimgdata();
              }
            },
            response => {
              Toast.clear();
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
        Toast.success('验证码已发送');
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            this.btnText = this.count + "s后重新获取";
            this.btnTag = true;
            this.btnBg = '#999';
          } else {
            this.btnTag = false;
            this.btnBg = '#ef4f4f',
            this.btnText = "获取短信验证码";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
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

    submitInfo() {
      if (this.fun.isTextEmpty(this.code)) {
        Toast("验证码不能为空");
        return;
      }

      if (this.fun.isTextEmpty(this.newPwd)) {
        Toast("新密码不能为空");
        return;
      }

      if (this.fun.isTextEmpty(this.newPwdConfirm)) {
        Toast("确认密码不能为空");
        return;
      }

      if (this.newPwdConfirm != this.newPwd ) {
        Toast("密码不一致");
        return;
      }

      let that = this;
      let json = { password: this.newPwd, code: this.code , mobile: this.mobile,confirmed:this.newPwdConfirm};
      $http
        .get("member.balance-password.update-password", json, "提交中")
        .then(
          function(response) {
            if (response.result === 1) {
              that.$dialog.alert({message:'成功'});
              that.$router.go(-1);
            } else {
              that.$dialog.alert({message:response.msg});
          
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
           
          }
        );
    },

    //余额支付密码设置 手机号是否绑定
    getBalancePwdInfo() {
      let that = this;
      $http.get("member.balance-password.is-has-password", {}, "").then(
        function(response) {
          if (response.result == 1) {
            if (response.data.is_has) {
              that.mobile = response.data.mobile;
            } else {
              that.$router.go(-1);
            }
          } else {
            that.$dialog.alert({message:response.msg});
           
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
          
        }
      );
    },
    passwordClick(name,passname) {
      this[name] = !this[name];
      if(this[name] == true) {
        this[passname] = 'password';
      } else {
        this[passname] = 'text';
      }
       
    }
  },
  //计算属性，更新数据
  computed: {},
  mounted() {},
  activated() {
    this.initData();
    this.getBalancePwdInfo();
    this.fun.setWXTitle('修改支付密码');
  },
  components: { cTitle,payKeyboard }
};
