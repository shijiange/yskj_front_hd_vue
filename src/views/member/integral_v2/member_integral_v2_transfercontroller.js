import cTitle from 'components/title';
import payKeyboard from "components/payKeyboard";
import {payKeyboardAsync} from "utils/payKeyboard";

export default {
  data() {
    return {
      credit1: '0.00',

      toi: this.fun.getKeyByI(),
      balance: 0,
      info_form: {
        transfer_id: '',
        transfer_point: ''
      },
      transfer_id: '',
      memberInfo: '',
      integral: window.localStorage.integral,
      rate: 0, // 积分比率
      nick_name:"",

      payKeyboardShow:false,  //键盘显示
      need_password:false,    //是否需要验证支付密码
      has_password:false,   //是否设置支付密码
    };
  },
  watch: {
    transfer_id: function (new_transfer_id) {
      var that = this;
      $http
        .get(
          'member.member.memberInfo',
          {
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep(),
            uid: this.transfer_id
          },
          '获取用户中'
        )
        .then(
          function (response) {
            if (response.result === 1) {
              that.memberInfo = response.data;
            }
          },
          function (response) {console.log(response);}
        );
    }
  },
  methods: {
    initData() {
      this.credit1 = '0.00';
      this.info_form.transfer_point = '';
    },

    getIntegral() {
      var that = this;
      $http
        .get(
          'finance.point-page.index',
          {
            i: this.fun.getKeyByI(),
            type: this.fun.getTyep()
          },
          '加载中'
        )
        .then(
          function (response) {
            if (response.result == 1) {
              that.credit1 = response.data.credit1;
              that.transfer = response.data.transfer;
              that.rate = response.data.rate;
              that.need_password=response.data.need_password;
              that.has_password = response.data.has_password;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function (response) {
            that.$dialog.alert({message:response.msg});

          }
        );
    },

    payComplete(text){
      console.log(text,"页面");
      payKeyboardAsync.complete(text);
    },
    getPayKeyboardPassword(){
      this.payKeyboardShow=true;
      return new Promise((resove,reject)=>{
        payKeyboardAsync.addCompleteFn((pass)=>{
          resove(pass);
        });
      });
      // let pass = await this.getPayKeyboardPassword();
      // console.log(pass);
    },

    // 确认转账
    async confirm() {
      var that = this;
      if (
        parseFloat(this.info_form.transfer_point) > parseFloat(this.credit1)
      ) {
        that.$dialog.alert({message:'转让积分不可大于您的积分'});

        return;
      }
      if (
        this.transfer_id == undefined ||
        this.transfer_id <= 0 ||
        this.transfer_id.length == 0
      ) {
        that.$dialog.alert({message:'转让id不可为空'});

        return;
      }
      if (
        this.info_form.transfer_point == undefined ||
        this.info_form.transfer_point <= 0 ||
        this.info_form.length == 0
      ) {
        that.$dialog.alert({message:'转让积分不可低于0元'});

        return;
      }

      if(this.need_password==true && this.has_password==false){
        that.$dialog
          .confirm({ message: "请先设置支付密码" })
          .then(() => {
            that.$router.push(that.fun.getUrl("set_balance_password", {}));
          });
        return;
      }

      let json={
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        recipient: this.transfer_id,
        transfer_point: this.info_form.transfer_point
      };
      if(this.need_password==true){  //开启支付密码验证
        let pass = await this.getPayKeyboardPassword();
        json.password = pass;
      }

      $http
        .get(
          'finance.point-transfer.index',
          json,
          ' '
        )
        .then(
          function (response) {
            if (response.result == 1) {
              that.$dialog.alert({message:response.msg}).then(()=>{
                that.$router.go(-1);
              });

            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function (response) {
            // error callback
          }
        );
    }
  },
  activated() {
    this.toi = this.fun.getKeyByI();
    this.initData(); // 初始化数据
    this.getIntegral(); // 获取当前积分
    this.fun.setWXTitle(this.integral + '转账');
  },

  components: { cTitle,payKeyboard}
};
