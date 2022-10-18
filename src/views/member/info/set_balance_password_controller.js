// import addre from 'assets/address/addressinfo';
import cTitle from 'components/title';
// import { mapState, mapMutations } from 'vuex';
// const address = addre;
export default {
  data() {
    return {
      pwd: "",
      rePwd: "",
    };
  },

  methods: {

    initData() {
      this.pwd = "";
      this.rePwd = "";
    },

    //验证是否绑定手机号
    initVerify() {
      let that = this;
      $http.get('member.balance-password.is-has-password', { password: this.pwd }, "").then(function (response) {
        if (response.result == 1) {

          //手机号为空
          if (that.fun.isTextEmpty(response.data.mobile)) {
            that.$dialog.confirm({ message: "设置密码必须先绑定手机号?"})
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

        this.$dialog.alert({message:"密码不能为空"});
        return;
      }

      if (this.pwd.length < 6) {

        this.$dialog.alert({message:"密码不能小于6位"});
        return;
      }

      if (this.fun.isTextEmpty(this.rePwd)) {
        this.$dialog.alert({message:"确认密码不能为空"});

        return;
      }

      if (this.rePwd.length < 6) {
        this.$dialog.alert({message:"确认密码不能小于6位"});

        return;
      }

      if (this.pwd != this.rePwd) {
        this.$dialog.alert({message:"密码和确认密码必须相同"});

        return;
      }



      $http.get('member.balance-password.set-password', { password: this.pwd }, "提交中...").then(function (response) {
        if (response.result == 1) {
          switch (response.data.code) {
          case 1://成功

            that.$dialog.alert({message:response.msg}).then(()=>{
              that.$router.go(-1);
            });
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
  },
  //计算属性，更新数据
  computed: {

  },
  mounted() {

  },
  activated() {
    this.initData();
    this.initVerify();
  },
  components: { cTitle }
};