import cTitle from 'components/title';
export default {
  components: { cTitle},
  data() {
    return {
      val: '',
      recharge_val: '',
      alipay_show: false,
      wechat_show: false,

      // 支付方式
      pay_type: '',
      buttons: []
    };
  },

  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      $http
        .get('plugin.froze.Frontend.Controllers.page.index', {}, '加载中')
        .then(res => {
          if (res.result === 1) {
            this.val = res.data.froze;
            this.buttons = res.data.buttons;
            this.isPayType(res.data.buttons);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 初始化数据
    initData() {
      this.val = '';
      this.recharge_val = '';
      this.alipay_show = false;
      this.wechat_show = false;
      this.pay_type = '';
    },

    // 校验数据
    validateData(val) {
      // let reg = new RegExp('^d+(.d{1,2})?$');

      if (this.fun.isTextEmpty(val) || val <= 0) {
        this.$dialog.alert({message:'充值金额不能为0和负数'});

        return;
      }
      // 输入小数最多两位
      if (!val.match(/^\d+(\.\d{1,2})?$/)) {
        this.$dialog.alert({message:'请输入正确的金额,最多两位小数'});
      }
    },

    // 提交订单 方式 -- 支付类型
    submitOrder(type) {
      let that = this;
      this.pay_type = type;
      this.validateData(this.recharge_val);

      let json = {
        change_value: this.recharge_val,
        pay_way: this.pay_type
      };
      $http
        .get(
          'plugin.froze.Frontend.Modules.Froze.Controllers.recharge.index',
          json,
          '充值中'
        )
        .then(res => {
          if (res.result === 1) {
            if (this.pay_type == '2') {
              this.$router.push(
                this.fun.getUrl('fre_alipay', {
                  status: 1,
                  recharge_money: this.recharge_val,
                  order_pay_id: res.data.order_sn,
                  uid: res.data.uid,
                  pid: this.$route.query.pid
                    ? this.$route.query.pid
                    : res.data.uid,
                  tag: 'frozen'
                })
              );
            } else if (this.pay_type == '1') {
              wx.config(res.data.js);
              this.WXPay(res.data.config);
            } else if (this.pay_type == '28') {
              let data = res.data.data.rc_Result;
              data = JSON.parse(data);
              let json = {
                appId: data.appId,
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
              };
              this.WXPay(json);
            } else if (this.pay_type == '29') {
              if (res.data.msg != '') {
                this.$dialog.alert({message:res.data.msg});

              } else {
                window.href = res.data.data.rc_Result;
              }
            } else if (this.pay_type == '9') {
              YDB.SetWxpayInfo(
                that.$store.state.temp.mailInfo.name,
                '订单号：' + res.data.order_sn,
                that.recharge_val,
                res.data.order_sn,
                that.fun.getKeyByI()
              );
            }
          } else {
            that.$dialog.alert({message:res.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 微信支付
    WXPay(payParams) {
      // alert('"'+payParams.timestamp+'"')
      var that = this;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function (res) {
          // 支付成功后的回调函数

          if (res.errMsg == 'chooseWXPay:ok') {
            that.$dialog.alert({message:'充值成功'}).then(()=>{
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({message:'充值失败，请返回重试'});

          }
        },
        cancel: function (res) {
          // 支付取消
        },
        fail: function (res) {
          console.log(payParams, '参数失败');
          that.$dialog.alert({message:'充值失败，请返回重试。'});

        }
      });
    },

    // 判断是否有微信或者支付宝支付方式
    isPayType(arr) {
      arr.forEach(e => {
        if (e.value == 2) {
          this.alipay_show = true;
        }
        if (e.value == 1) {
          this.wechat_show = true;
        }
      });
    }
  }
};
