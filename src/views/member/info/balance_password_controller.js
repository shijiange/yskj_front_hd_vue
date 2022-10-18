// import addre from 'assets/address/addressinfo';
import cTitle from 'components/title';
// import { mapState, mapMutations } from 'vuex';
// const address = addre;
export default {
  data() {
    return {
      mobile: "",

      codeStr: "获取验证码",
      code: "",
      oldPwd: "",//旧密码
      newPwd: "",//新密码

      timer: 30,
      stop: false,   //默认是停止的，但界面加载之后会变成false
      interval: null,  //setInterval的对象
      lock: false,      //数秒期间不能点击按钮
    };
  },

  methods: {


    initData() {
      this.mobile = "";

      this.codeStr = "获取验证码";
      this.code = "";
      this.oldPwd = "";
      this.newPwd = "";

      this.timer = 30;
      this.stop = false;
      this.interval = null;
      this.lock = false;
    },

    submitInfo() {
      if (this.fun.isTextEmpty(this.code)) {
        this.$dialog.alert({message:"验证码不能为空"});
        return;
      }

      if (this.fun.isTextEmpty(this.oldPwd)) {
        this.$dialog.alert({message:"原始密码不能为空"});
        return;
      }

      if (this.fun.isTextEmpty(this.newPwd)) {
        this.$dialog.alert({message:"新密码不能为空"});
        return;
      }

      let that = this;
      let json = { old_password: this.oldPwd, password: this.newPwd, code: this.code , mobile: this.mobile};
      $http.get('member.balance-password.update-password', json, "初始化").then(function (response) {

        if (response.result == 1) {
          that.$dialog.alert({message:"成功"});
          that.$router.go(-1);
        } else {
          that.$dialog.alert({message:response.msg});
          
        }

      }, function (response) {
        that.$dialog.alert({message:response.msg});
      });
    },

    verificationCode() {
      var that = this;
      //如果是false就开始倒计时，如果是true就停止倒计时
      if (this.lock == false) {
        if (this.fun.isMoblie(that.mobile)) {
          that.$dialog.alert({message:"手机号数据错误"});
          
          return;
        } else {
          this.interval = setInterval(this.update, 1000);
          this.lock = true;
          //发送获取验证码的请求
          $http.get('member.balance-password.send-code', { mobile: that.mobile }, "").then(function (response) {

            console.log(response.data);
            if (response.result == 0) {
              clearInterval(that.interval);
              that.timer = 30;
              that.codeStr = '获取验证码';
              that.lock = false;
              that.$dialog.alert({message:response.msg});

            }
          }, function (response) {
            // error callback
          });

        }

      }
      else {
        return;
      }
    },
    update() {
      this.timer--;
      if (this.timer == 0) {
        //停止数秒，重新获取
        clearInterval(this.interval);
        this.timer = 30;
        this.codeStr = '发送验证码';
        this.lock = false;
      } else {
        this.codeStr = String(this.timer) + ' 秒';
      }
    },




    //余额支付密码设置 手机号是否绑定
    getBalancePwdInfo() {
      let that = this;
      $http.get('member.balance-password.is-has-password', {}, "").then(function (response) {

        if (response.result == 1) {
          if (response.data.is_has) {
            that.mobile = response.data.mobile;
          } else {
            that.$router.go(-1);
          }
        } else {
          that.$dialog.alert({message:response.msg});
         
        }

      }, function (response) {
        that.$dialog.alert({message:response.msg});
       
      });
    },



  },
  //计算属性，更新数据
  computed: {

  },
  mounted() {

  },
  activated() {
    this.initData();
    this.getBalancePwdInfo();
  },
  components: { cTitle }
};
