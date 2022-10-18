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
      status: false
    };
  },
  activated() {
    this.getShow();
    this.editInfo();
  },
  methods: {
    change() {
      this.status = true;
      this.receiverAccountNoEnc = "";
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
    // 修改
    addTiJiao() {
      console.log('修改银行卡');
      if (this.receiverAccountNoEnc == '') {
        Toast('请输入银行卡卡号');
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

      var type = '';
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
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.edit', { data: json, id: this.$route.params.id }).then((res) => {
        if (res.result === 1) {
          this.$dialog.alert({message:res.msg});
          setTimeout(() => {
            this.$router.push(this.fun.getUrl('bankCardInformation'));
          }, 1000);
        } else {
          this.$dialog.alert({message:res.msg});
        }
      }, function (response) {
        // error callback
      });
    },
    // 编辑数据
    editInfo() {
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.edit', { id: this.$route.params.id }).then((res) => {
        if (res.result == '1') {
          this.receiverAccountNoEnc = res.data.receiverAccountNoEnc;
          this.receiverAccountType = res.data.receiverAccountType;
          this.receiverNameEnc = res.data.receiverNameEnc;
          this.receiverBankChannelNo = res.data.receiverBankChannelNo;

          if (this.fun.isTextEmpty(res.data.has_one_default)) {
            this.is_default = false;
          } else {
            if (res.data.has_one_default.default == '0') {
              this.is_default = false;
            } else {
              this.is_default = true;
            }
          }
          if (this.receiverAccountType == '204') {
            this.radio = '对公账户';
            this.toPublic = true;
          } else if (this.receiverAccountType == '201') {
            this.radio = '对私账户';
            this.toPrivate = true;
          }
          this.status = false;
        } else {
          this.$dialog.alert({message:res.msg});
        }
      });
    },
    deleteChange() {
      $http.get('plugin.converge_pay.frontend.controllers.converge-pay-bank-card.destroy', { id: this.$route.params.id }).then((res) => {
        if (res.result == '1') {
          this.$dialog.alert({message:res.msg}).then(()=>{
            this.$router.push(this.fun.getUrl('bankCardInformation'));
          });
        } else {
          this.$dialog.alert({message:res.msg}).then(()=>{
            this.$router.push(this.fun.getUrl('bankCardInformation'));
          });
        }
      });
    }

  },

  components: {cTitle}
};
