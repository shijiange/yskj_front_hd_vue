import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      form: {
        mobile: '',
        captcha: '',
        code: '',
        password: '',
        confirm_password: ''
      },
      passData: {},
      has_password: false,
      //验证码
      start1: false,
      imgcode: '',
      btnBg: '#ffb400',
      btnText: '获取短信验证码',
      btnTag: false,
      timer: null,
      count: ''
    };
  },
  activated() {
    this.init();
    this.isSetPassword();
  },
  methods: {
    init() {
      this.start1 = false;
      this.has_password = false;

      this.passData = {};
      this.imgcode = '';
      this.form = {
        mobile: '',
        captcha: '',
        code: '',
        password: '',
        confirm_password: ''
      };
    },
    isSetPassword() {
      $http
        .get('plugin.asset.Frontend.Modules.Password.Controllers.has.index', {}, '加载中...')
        .then(response => {
          if (response.result === 1) {
            this.has_mobile = response.data.has_mobile;
            this.has_password = response.data.has_password;
            if (!this.has_mobile) {
              this.$router.push(this.fun.getUrl('editmobile'));
            } else {
              this.passwordData();
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    passwordData() {
      $http
        .get('plugin.asset.Frontend.Modules.Password.Controllers.update.page', {}, '加载中...')
        .then(response => {
          if (response.result === 1) {
            this.passData = response.data;
            this.imgcode = this.passData.captcha_image.img;
            this.form.mobile = this.passData.mobile;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setPassword() {
      if (this.form.confirm_password !== this.form.password) {
        Toast('确认密码与支付密码不一致');
        return;
      }
      $http
        .get('plugin.asset.Frontend.Modules.Password.Controllers.Update.store', this.form, '加载中...')
        .then(response => {
          if (response.result === 1) {
            this.$router.go(-1);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    forgetPassword() {
      this.has_password = false;
    },
    //发送验证码
    verificationCode() {
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast('请填写手机号');
        return;
      }
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast('请填图形验证码');
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '发送中',
        });
        $http
          .get('plugin.asset.Frontend.Modules.Password.Controllers.code.index', {
            mobile: this.form.mobile,
            captcha: this.form.captcha
          })
          .then(
            response => {
              Toast.clear();
              if (response.result === 1) {
                this.sendCodeAnimation();
              } else {
                //刷新图形验证码
                Toast(response.msg);
                this.form.captcha = '';
                if (this.passData.captcha_status) {
                  this.getimgdata();
                }
              }
            },
            response => {
              console.log(response.msg);
            }
          );
      }
    },
    //更新图片验证码
    getimgdata() {
      $http
        .get('plugin.asset.Frontend.Modules.Password.Controllers.update.captcha')
        .then(res => {
          this.imgcode = res.data.captcha_image.img;
        })
        .catch(error => {
          console.log(error);
        });
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
            this.btnText = this.count + 's后重新获取';
            this.btnTag = true;
            this.btnBg = '#999';
          } else {
            this.btnTag = false
            ;(this.btnBg = '#ef4f4f'), (this.btnText = '获取短信验证码');
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  },
  components: {
    cTitle
  }
};
