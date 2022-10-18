import { Toast } from 'vant';
import cTitle from 'components/title';
export default {
  data() {
    return {
      cationCode:false,
      start1:false,
      count: '',
      form: {
        mobile: '',
        //验证码
        code: '',
        captcha: ""
      },
      //验证码
      code: '',
      action_name: '绑定',
      CodeStr: "获取验证码",
      // timer: 30,
      // stop: false,   //默认是停止的，但界面加载之后会变成false
      // Interval: null,  //setInterval的对象
      // lock: false,      //数秒期间不能点击按钮

      imgcode: ""

    };
  },
  methods: {


    // update() {

    //     this.timer--;
    //     if (this.timer == 0) {
    //         //停止数秒，重新获取
    //         clearInterval(this.Interval);
    //         this.timer = 30;
    //         this.CodeStr = '发送验证码';
    //         this.lock = false;


    //     } else {
    //         this.CodeStr = String(this.timer) + ' 秒';

    //     }


    // },
    // 60秒倒计时
    getCode(){
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.cationCode=true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.cationCode=false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    } ,
    // 获取验证码
    VerificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast('请填图形验证码');
      }if(this.fun.isTextEmpty(this.form.mobile)){
        Toast('请填写手机号');
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '发送中',
        });

        //发送获取验证码的请求//旧的请求：member.register.sendCodeV2
        $http.get('member.register.sendWithdrawCode', {
          mobile: this.form.mobile,
          captcha: this.form.captcha,
          code:this.form.code
        }).then((response) => {
          console.log(response);
          Toast.clear();
          if (response.result == 1) {
            that.cationCode=true;
            that.getCode();
            that.sendCodeAnimation();
          } else {
            this.cationCode=false;
            //刷新图形验证码
            Toast(response.msg);
            this.form.captcha = '';
            this.getimgdata();
          }
        }, (response) => {
          console.log(response.msg + 'nihao');
        });
      }


    },
    // var that = this;
    //如果是false就开始倒计时，如果是true就停止倒计时
    // if (this.lock == false) {
    // if (this.fun.isMoblie(this.form.mobile)) {
    //
    //     return;
    // }
    // else {
    //     this.Interval = setInterval(this.update, 1000);
    //     this.lock = true;
    // 发送获取验证码的请求
    // $http.get('member.register.sendWithdrawCode', { mobile: this.form.mobile }).then(function (response) {

    //     console.log(response.data)
    //     if (response.result == 0) {
    //         clearInterval(that.Interval);
    //         that.timer = 30;
    //         that.CodeStr = '获取验证码';
    //         that.lock = false;
    //

    //     }
    // }, function (response) {
    //     // error callback
    // });
    // }

    // }
    // else {
    //     return;
    // }

    //发送验证码 倒计时
    sendCodeAnimation() {
      setTimeout(() => {
        this.start1 = true;
        Toast.clear();
        Toast('已发送');
      }, 1000);
      console.log('1111111');
    },
    //提交修改手机的请求
    alterAction() {

      var that = this;
      //发送获取验证码的请求

      if (that.fun.isTextEmpty(this.form.mobile)) {
        that.$dialog.alert({message:'手机号码不能为空'});

        return;
      }


      if (that.fun.isMoblie(this.form.mobile)) {
        that.$dialog.alert({message:'请输入正确的手机号'});

        return;
      }

      if (that.fun.isTextEmpty(this.form.code)) {
        that.$dialog.alert({message:'请填写验证码'});

        return;

      }
      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast('图形验证码不能为空');
          return;
        }
      }

      $http.post('member.member.bindWithdrawMobile', this.form, '正在绑定手机..').then((response) => {
        if (response.result == 1) {
          this.$dialog.alert({ message: response.msg})
            .then(() => {

              this.$router.go(-1);
            }).catch(() => {});
        } else {
          this.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        // error callback
      });

    },

    getimgdata() {
      $http.get('home-page.getCaptcha').then((res) => {
        this.imgcode = res.data.captcha.img;
      }).catch(error => {
        console.log(error);
      });
    }


  },
  activated() {
    this.start1=false;
    //clearInterval(this.Interval);
    // this.timer = 30;
    // this.CodeStr = '获取验证码';
    // this.lock = false;
    this.form.mobile = this.$route.params.num;
    this.form.code = '';
    // this.form.password = '';
    // this.form.confirm_password = '';
    this.form.captcha = "";
    this.imgcode = "";
    // if (this.$route.params.num) {
    //     this.action_name = '绑定手机';
    // } else {
    //     this.action_name = '修改手机';
    // }

    this.getimgdata();



  },
  components: {
    cTitle
  }
};
