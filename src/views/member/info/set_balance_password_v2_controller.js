import { Toast } from 'vant';
// import addre from 'assets/address/addressinfo';
import cTitle from 'components/title';
import payKeyboard from "components/payKeyboard";
// import { mapState, mapMutations } from 'vuex';
// const address = addre;
export default {
  data() {
    return {
      isPwdShowKeyboard:false,
      isRePwdShowKeyboard:false,
      pwd: "",
      rePwd: "",
      visibleSet:true,
      visibleSure:true,
      setpassword:'password',
      surepassword:'password',
      payarr1: '',
      payarr2: '',
    };
  },

  methods: {
    onInput2(e){
      // if(this.payarr2.length <6){
      //   this.payarr2 = `${this.payarr2}${e}`;
      //   if(this.payarr2.length == 6){
      //     this.rePwdKeyboardDone(this.payarr2);
      //   }
      // }
      this.rePwdKeyboardDone(e);
    },
    onDelete2(){
      if(this.payarr2.length >0){
        this.payarr2 = this.payarr.substr(0, this.payarr.length - 1);
      }
    },
    onInput1(e){
      // if(this.payarr1.length <6){
      //   this.payarr1 = `${this.payarr1}${e}`;
      //   if(this.payarr1.length == 6){
      //     this.pwdKeyboardDone(this.payarr1);
      //   }
      // }
      this.pwdKeyboardDone(e);
    },
    onDelete1(){
      if(this.payarr1.length >0){
        this.payarr1 = this.payarr.substr(0, this.payarr.length - 1);
      }
    },
    initData() {
      this.isPwdShowKeyboard=false;
      this.isRePwdShowKeyboard=false;

      this.pwd = "";
      this.rePwd = "";
    },

    showPwdKeyboard() {
      this.isPwdShowKeyboard = true;
      this.payarr1 = '';
    },

    hidePwdKeyboard() {
      this.isPwdShowKeyboard = false;
    },

    showRePwdKeyboard() {
      this.isRePwdShowKeyboard = true;
      this.payarr2 = '';
    },

    hideRePwdKeyboard() {
      this.isRePwdShowKeyboard = false;
    },

    pwdKeyboardDone(val) {
      this.pwd = val;

      this.hidePwdKeyboard();
    },

    rePwdKeyboardDone(val) {
      this.rePwd = val;
      this.hideRePwdKeyboard();
    },



    //验证是否绑定手机号
    initVerify() {
      let that = this;
      $http.get('member.balance-password.is-has-password', { password: this.pwd }, "").then(function (response) {
        if (response.result == 1) {

          //手机号为空
          if (that.fun.isTextEmpty(response.data.mobile)) {
            that.$dialog.confirm({ message: "设置密码必须先绑定手机号"})
              .then(() => {
                that.$router.push(that.fun.getUrl('editmobile', {}));
              }).catch(() => {
                that.$router.go(-1);
              });
          }
        } else {
          that.$dialog.alert({message:response.msg});

        }

      }, function (response) {
        that.$dialog.alert({message:response.msg});

      });
    },


    setPwd() {
      let that = this;

      if (this.fun.isTextEmpty(this.pwd)) {
        Toast('支付密码不能为空');
        return;
      }

      if (this.fun.isTextEmpty(this.rePwd)) {
        Toast('确认密码不能为空');
        return;
      }

      if (this.pwd != this.rePwd) {
        Toast('支付密码和确认密码必须相同');
        return;
      }



      $http.get('member.balance-password.set-password', { password: this.pwd,confirmed:this.rePwd }, "提交中...").then(function (response) {
        if (response.result == 1) {
          switch (response.data.code) {
          case 1://成功

            that.$dialog.alert({message:response.msg});
            that.$router.go(-1);
            break;
          case 2://失败

            that.$dialog.alert({message:response.msg});
            break;
          case 3://手机号未绑定
            that.$dialog.confirm({ message: response.msg})
              .then(() => {
                that.$router.push(this.fun.getUrl('editmobile', {}));
              }).catch(() => {
                that.$router.go(-1);
              });
            break;
          default:
            break;
          }
        } else {
          that.$dialog.alert({message:response.msg});

        }

      }, function (response) {
        that.$dialog.alert({message:response.msg});

      });
    },

    surePwdClick(){
      this.visibleSure = !this.visibleSure;
      if(this.visibleSure == true) {
        this.surepassword = 'password';
      } else {
        this.surepassword = 'text';
      }

    },
    SetPwdClick(){
      this.visibleSet = !this.visibleSet;
      if(this.visibleSet == true) {
        this.setpassword = 'password';
      } else {
        this.setpassword = 'text';
      }
    },
  },
  //计算属性，更新数据
  computed: {

  },
  mounted() {

  },
  activated() {
    this.initData();
    this.initVerify();
    this.fun.setWXTitle('设置'+this.fun.getBalanceLang()+'支付密码');
  },
  components: { cTitle,payKeyboard }
};
