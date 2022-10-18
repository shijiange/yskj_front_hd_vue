import cTitle from 'components/title';
import { Toast } from 'vant';
import { yzPay } from "../../utils/yz_pay"; //引入支付方法
import payKeyboard from "components/payKeyboard";

export default {
  mixins: [yzPay],
  data() {
    return {
      isclick: false,
      // 总共余额
      totalAmonut: '',
      // 总共参与人数
      totalNumber: '',
      // 总共参与会员
      totalMember: [],
      // 已打卡数量
      clockInNum: 0,
      // 未打卡数量
      notClockInNum: 0,
      // 第一名打卡会员
      clockFirstMember: {},
      clockFirstShow: false,
      // 手气最佳会员
      luckyMember: {},
      luckyMemberShow: false,
      // 连续打卡会员
      continueMember: {},
      continueMemberShow: false,
      // 信息说明
      message: '',

      // 倒计时
      cutDownTime: '',
      // 支付按钮控制
      forbidden: false,

      // 弹窗按钮控制
      actionSheetShow: false,

      actionSheetItems: [],

      btnStatus: '',

      amount: '1',

      clockin_title: '早起打卡',

      share_title: '',

      share_icon: '',

      share_desc: '',

      clock_begintime: '',

      clock_endtime: '',

      popupSpecs: false,//密码验证
      need_password:false,
      payarr:''
    };
  },
  methods: {
    onInput(e){
      // if(this.payarr.length <6){
      //   this.payarr = `${this.payarr}${e}`;
      //   if(this.payarr.length == 6){
      //     this.keyboardDone(this.payarr);
      //   }
      // }
      this.keyboardDone(e);
    },
    onDelete(e){
      if(this.payarr.length >0){
        this.payarr = this.payarr.substr(0, this.payarr.length - 1);
      }
    },
    // 获取今日支付数据
    getTodayPay() {
      $http
        .get('plugin.clock-in.api.clock-in.get-today-pay-data', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.totalAmonut = response.data.today_pay_amount;
            this.totalNumber = response.data.today_pay_num;
            this.totalMember = response.data.today_pay_member;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取今日打卡数据
    getTodayClockOn() {
      // let that=this
      $http
        .get('plugin.clock-in.api.clock-in.get-today-clock-data', {})
        .then(response => {
          if (response.result == 1) {
            if (this.fun.isTextEmpty(response.data.clock_firat_member)) {
              this.clockFirstShow = false;
            } else {
              this.clockFirstShow = true;
              this.clockFirstMember = response.data.clock_firat_member;
            }

            if (this.fun.isTextEmpty(response.data.reward_lucky_member)) {
              this.luckyMemberShow = false;
            } else {
              this.luckyMemberShow = true;
              this.luckyMember = response.data.reward_lucky_member;
            }

            if (this.fun.isTextEmpty(response.data.clock_continuity_member)) {
              this.continueMemberShow = false;
            } else {
              this.continueMemberShow = true;
              this.continueMember = response.data.clock_continuity_member;
            }

            this.clockInNum = response.data.clock_in_num;
            this.notClockInNum = response.data.not_clock_in_num;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取当前支付打卡状态
    getCurrentPayStatus() {
      $http
        .get('plugin.clock-in.api.clock-in.get-member-pay-status', {}, '')
        .then(response => {
          if (response.result == 1) {
            this.amount = response.data.amount;
            this.money = this.rewardMoney = response.data.amount;
            this.btnStatus = response.data.status;
            this.initBtnView(response.data);
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取倒计时
    getCutDownTime(data) {
      var currentTime = parseInt(data.current_time);
      var startTime = parseInt(data.start_time);
      var restTime = 0;
      if (currentTime < startTime) {
        restTime = (startTime - currentTime)*1000;
      }
      return restTime;
    },

    // 初始化btn状态
    initBtnView(data) {
      let that = this;
      switch (data.status) {
      case -1:
        that.message = '支付' + that.amount + $i18n.t('元') + '参与挑战';
        break;
      case 0:
        that.message = '支付' + that.amount + $i18n.t('元') + '参与挑战';
        break;
      case 1:
        that.message = '倒计时';
        that.forbidden = true;
        that.cutDownTime = this.getCutDownTime(data).toString();
        break;
      case 2:
        that.message = '打卡';
        break;
      case 3:
        that.message = '倒计时';
        that.forbidden = true;
        that.cutDownTime = this.getCutDownTime(data).toString();
        break;
      case 4:
        that.message = '倒计时';
        that.forbidden = true;
        that.cutDownTime = this.getCutDownTime(data).toString();
        break;
      default:
        break;
      }
    },

    // * -1 前一天未支付->支付; 显示 支付
    // * 0 今日未支付->支付; 显示 支付
    // * 1 前一天已支付->倒计时; 显示 倒计时
    // * 2 前一天已支付->打卡进行中->等待打卡; 显示 打卡
    // * 3 前一天已支付->打卡完成 --- 继续支付
    // * 4 今日已支付->倒计时; 显示 倒计时
    // 回调处理
    clokinBtnCallBack(status) {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: '十分抱歉，由于相关规定，你暂时无法在这里充值！'
        });
        return false;
      }
      switch (status) {
      case -1:
        this.getPayData();
        break;
      case 0:
        this.getPayData();
        break;
      case 1:
        break;
      case 2:
        this.postClockIn();
        break;
      case 3:
        this.getPayData();
        break;
      case 4:
        break;

      default:
        break;
      }
    },

    // 打卡
    postClockIn() {
      var that = this;
      $http
        .get('plugin.clock-in.api.clock-in.run-clock-in', {}, '')
        .then(response => {
          if (response.result == 1) {
            that.getCurrentPayStatus();
            that.getTodayPay();
            that.$dialog.alert({message:response.msg});

          } else {
            that.$dialog.alert({message:response.msg});

          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取支付数据
    getPayData() {
      if(this.isclick) {
        return;
      }
      this.isclick = true;
      let that = this;
      $http
        .get('plugin.clock-in.api.clock-in-pay.get-pay-button', {}, "load")
        .then(response => {
          if (response.result == 1) {
            this.actionSheetItems = [];
            let btnData = response.data.buttons;
            if (!this.fun.isTextEmpty(btnData) && btnData.length > 0) {
              for (let i = 0; i < btnData.length; i++) {
                let newItem = {};
                newItem.name = btnData[i].name;
                newItem.callback = this.initPayCallBack(btnData[i]);
                if(btnData[i].value==3) {
                  that.need_password = btnData[i].need_password;
                }
                this.actionSheetItems.push(newItem);
              }
            }
            that.actionSheetShow = true;
          }
          this.isclick = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 初始化支付回调
    initPayCallBack(item) {
      let callback = null;
      let that = this;
      switch (item.value) {
      case 1:
        callback = that.weChatPay;
        break;
      case 2:
        callback = that.aliPay;
        break;
      case 3:
        callback = that.balancePay;
        break;
      case 6:
        callback = that.newWeChatPay;
        break;
      case 12:
        callback = that.yunPay;
        break;
      case 7:
        callback = that.cloudAlipay;
        break;
      case 28:
        callback = that.hJWechatPay;
        break;
      case 29:
        callback = that.hJaliPay;
        break;
      case 9:
        callback = that.appWeChatPay;
        break;
      case 10:
        callback = that.appAliPay;
        break;
      case 50:
        callback = ()=> {
          that.payPost(50);
        };
        break;
      default:
        break;
      }
      return callback;
    },

    // 支付
    payPost(type) {
      let json = { pay_method: type, amount: this.amount };

      let url = 'plugin.clock-in.api.clock-in-pay.run-clock-pay'; // "&client_type=2&app_type=wechat"
      if (window.isMiniprogram) {
        url += '&client_type=2&app_type=wechat';
      }
      $http
        .get(url, json, '支付中...')
        .then(response => {
          if (response.result == 1) {
            this.handleOtherPay({value: type}, response, "clockin");
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          this.$dialog.alert({message:error});
        });
    },
    // 微信支付
    weChatPay() {
      this.payPost(1);
    },
    // 支付宝支付
    aliPay() {
      this.payPost(2);
    },
    // 余额支付
    balancePay() {
      let that = this;
      if(that.need_password) {
        that.showPwdPop();
      }
      else {
        that.payPost(3);
      }

    },
    // 新版微信支付
    newWeChatPay() {
      this.payPost(6);
    },
    // 芸支付
    yunPay() {
      this.payPost(12);
    },
    //app微信支付
    appWeChatPay() {
      this.payPost(9);
    },
    //app支付宝支付
    appAliPay() {
      this.payPost(10);
    },

    cloudAlipay() {
      this.payPost(7);
    },

    hJWechatPay() {
      this.payPost(28);
    },
    hJaliPay() {
      this.payPost(29);
    },

    // 倒计时回调
    cutDownCallBack() {
      console.log('cutdown callback');
      this.forbidden = false;
      this.getTodayClockOn();
      this.getCurrentPayStatus();
    },

    // 获取早起打卡设置
    getClockin() {
      var that = this;
      $http.get('plugin.clock-in.api.clock-in.get-set', {}).then(
        (response) => {
          if (response.result == 1) {
            that.clockin_title = response.data.plugin_name;
            that.fun.setWXTitle(response.data.plugin_name);
            // 分享数据
            that.share_title = response.data.share.share_title;
            that.share_icon = response.data.share.share_icon;
            that.share_desc = response.data.share.share_desc;

            that.clock_begintime = response.data.clock_time.starttime;

            that.clock_endtime = response.data.clock_time.endtime;

            // that.initShare();
            that.fun.wxShare(
              "",
              {},
              {
                title: that.share_title?that.share_title:'',
                imgUrl: that.share_icon?that.share_icon:'',
                description: that.share_desc?that.share_desc:""
              }
            );
          }else if(response.result == 0) {
            
            if(response.data.is_clock_in==0){
              let plugin_name = response.data.plugin_name;
              this.$dialog.alert({
                title: "提示",
                message: `${plugin_name}已禁用`
              })
                .then(() => {
                  this.$router.replace(
                    this.fun.getUrl("member", {})
                  );
                });
            }
          }
        },
        function (response) { }
      );
    },

    // 微信分享
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url };
      $http.post('member.member.wxJsSdkConfig', json).then(
        function (response) {
          if (response.result == 1) {
            // that.cservice = response.data.shop.cservice
            // that.initCservice(response.data.shop.cservice);//重新赋值
            if (response.data.config) {
              that.share(response.data);
            }
          } //else {
          //}
        },
        function (response) {
          console.log(response);
        }
      );
    },

    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        //   let _title = (that.fun.isTextEmpty()) ? that.goodsInfo.title : that.goodsInfo.has_one_share.share_title

        let _title = that.share_title;

        // let _link = document.location.href + "&mid=" + data.info.uid
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);

        // let _imgUrl = (that.fun.isTextEmpty()) ? that.goodsInfo.thumb : that.goodsInfo.has_one_share.share_thumb
        // let _desc = (that.fun.isTextEmpty()) ? data.shop.name : that.goodsInfo.has_one_share.share_desc

        let _imgUrl = that.share_icon;
        let _desc = that.share_desc;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
            Toast('取消分享');
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
            Toast('取消分享');
          }
        });

        //   if(that.fun.getWechatVersion()){
        //     wx.updateTimelineShareData({
        //         title: _title, // 分享标题
        //         link: _link, // 分享链接
        //         imgUrl: _imgUrl, // 分享图标
        //         success: function () {
        //           //Toast("分享成功")
        //         },
        //         // cancel: function () {
        //         //   Toast("取消分享")
        //         // }
        //       })

        //       wx.updateAppMessageShareData({
        //         title: _title, // 分享标题
        //         desc: _desc, // 分享描述
        //         link: _link, // 分享链接
        //         imgUrl: _imgUrl, // 分享图标
        //         type: 'link', // 分享类型,music、video或link，不填默认为link
        //         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //         success: function () {
        //           //Toast("分享成功")
        //         },
        //         // cancel: function () {
        //         //   Toast("取消分享")
        //         // }
        //       })
        //   }else{
        //     wx.onMenuShareTimeline({
        //         title: _title, // 分享标题
        //         link: _link, // 分享链接
        //         imgUrl: _imgUrl, // 分享图标
        //         success: function () {
        //             Toast("分享成功")
        //         },
        //         cancel: function () {
        //             Toast("取消分享")
        //         }
        //     })

        //       wx.onMenuShareAppMessage({
        //         title: _title, // 分享标题
        //         desc: _desc, // 分享描述
        //         link: _link, // 分享链接
        //         imgUrl: _imgUrl, // 分享图标
        //         type: 'link', // 分享类型,music、video或link，不填默认为link
        //         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //         success: function () {
        //             Toast("分享成功")
        //         },
        //         cancel: function () {
        //             Toast("取消分享")
        //         }
        //     })
        //   }
      });
    },
    showPwdPop() {
      this.popupSpecs = true;
      this.payarr = '';
    },

    hidePwdPop() {
      this.popupSpecs = false;
    },

    keyboardDone(val) {
      this.hidePwdPop();
      this.getVerifyPassword(val);
    },

    // 验证密码
    getVerifyPassword(pwd) {
      // order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function (response) {
          if (response.result == 1) {
            that.payPost(3);
          } else {
            that.$dialog.confirm({ message: response.msg})
              .then(() => {
                if (response.data.code == 2001) {
                // 商城支付密码设置未开启
                // that.$router.go(-1)
                } else if (response.data.code == 2002) {
                // 用户未设置支付密码
                // 去设置密码
                  that.$router.push(
                    that.fun.getUrl("set_balance_password", {})
                  );
                } else if (response.data.code == 2003) {
                // 支付密码错误
                }
              }).catch(() => {
                if (response.data.code == 2001) {
                // 商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                // 用户未设置支付密码
                } else if (response.data.code == 2003) {
                // 支付密码错误
                }
              });
          }
        },
        function (response) {

          that.$dialog.alert({
            message: response.msg
          });
        }
      );
    },
  },
  activated() { },

  mounted() {
    this.share_title = '';
    this.share_icon = '';
    this.share_desc = '';
    this.clock_begintime = '';
    this.clock_endtime = '';
    this.getTodayPay();
    this.getTodayClockOn();
    this.getCurrentPayStatus();
    this.getClockin();
  },
  components: { cTitle,payKeyboard }
};
