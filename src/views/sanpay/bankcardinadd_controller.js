import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';

export default {
  mixins: [scrollMixin], // 加载更多
  data() {
    return {
      radio: '对公账户',
      is_default: true,
      receiverAccountNoEnc: '', // 银行卡号
      receiverNameEnc: '', // 名称
      receiverBankChannelNo: '', // 账户
      // 判断是否显示对公和对私
      toPrivate: false, // 对公
      toPublic: false, // 对私
    };
  },
  activated() {
    this.initData();
    this.getShow();
  },
  methods: {
    initData() {
      this.toPrivate = false;
      this.toPublic = false;
      this.radio = '对公账户';
    },
    // 判断是否显示
    getShow() {
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.create').then((res) => {
        if (res.result === 1) {
          if (res.data.all == '1') {
            this.toPrivate = true;
            this.toPublic = true;

          } else {
            if (res.data.private == '1') {
              this.toPrivate = true;
              this.radio = '对私账户';
            }
            if (res.data.public == '1') {
              this.toPublic = true;
              this.radio = '对公账户';
            }
          }
        } else {
          this.$dialog.alert({message:res.msg});
        }
      }, function (response) {
        // error callback
      });
    },
    // 提交
    addTiJiao() {
      if (this.receiverAccountNoEnc == '') {
        Toast('请输入银行卡卡号');
        return;
      }
      // let reg = /^\d{16,19}$/;
      let reg = /(^[0-9]*([0-9])?)$/;
      if (!reg.test(this.receiverAccountNoEnc)) {
        Toast('银行卡卡号只能为纯数字');
        return;
      }

      if (this.receiverNameEnc == '') {
        Toast('请输入持卡人名称');
        return;
      }
      if (this.radio === '对公账户') {
        if (this.receiverBankChannelNo == '') {
          Toast('请输入对公账户');
          return;
        }
      }

      let type = '';
      if (this.radio == '对公账户') {
        type = 204;
      } else if (this.radio == '对私账户') {
        type = 201;
      }
      let json = [{
        receiverAccountNoEnc: this.receiverAccountNoEnc,
        receiverAccountType: type,
        receiverNameEnc: this.receiverNameEnc,
        receiverBankChannelNo: this.receiverBankChannelNo,
        default: this.is_default ? '1' : '0'
      }];
      json = JSON.stringify(json);
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.create', { data: json }).then((res) => {
        if (res.result === 1) {
          Toast(res.msg);
          this.receiverAccountNoEnc = '';
          this.receiverNameEnc = '';
          this.receiverBankChannelNo = '';
          setTimeout(() => {
            this.$router.push(this.fun.getUrl('bankCardInformation'));
          }, 1000);
        } else {
          Toast(res.msg);
        }
      }, function (response) {
        // error callback
      });
    },
  },

  components: {cTitle}
};
