import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      payer_phone:'',
      card_id:'',
      start1: false,
      btnBg:'#ef4f4f',
      btnText:'获取短信验证码',
      btnTag:false,
      timer: null,
      count:'',
    };
  },

  activated() {
    this.card_id=this.$route.params.card_id;
    this.getInfo();
  },

  mounted() {

  },
  methods: {
    verificationCode() {
      let that = this;
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '发送中',
      });

      //发送获取验证码的请求
      $http
        .get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.bind-card", {
          card_id:this.card_id
        })
        .then(
          response => {
            Toast.clear();
            if (response.result == 1) {
              that.sendCodeAnimation();
            } else {
              Toast(response.msg);
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
    confirm(){
      let json={
        card_id:this.card_id,
        sms_code:this.sms_code,
      };
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.confirm-bind-card", json, "").then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          this.$router.push(this.fun.getUrl("memberchooseBank"));
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getInfo(){
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-card", {card_id:this.card_id}, "").then(response => {
        if (response.result == 1) {
          this.payer_phone=response.data.payer_phone;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
  components: { cTitle }
};