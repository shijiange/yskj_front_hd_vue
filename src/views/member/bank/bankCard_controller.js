import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      bank_num: '',
      return_bank: '',
      bank_status: 0,
    };
  },
  activated() {
    this.bank_num = '';
    this.return_bank = '';
    this.bank_status= 0;
    this.getBank();
  },
  methods: {
    getBank() {
      $http.get("plugin.separate.Frontend.Modules.Member.Controllers.store-card.index", {}, "...").then(response => {
        if (response.result === 1) {
          this.bank_status = response.data.status;
          if(this.bank_status === 1){
            this.return_bank = response.data.card_no;
          }

        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    submitBank() {
      if (this.fun.isTextEmpty(this.bank_num)) {
        Toast("银行卡号码不能为空");
        return;
      }

      $http.get('plugin.separate.Frontend.Modules.Member.Controllers.store-card.index', {
        card_no: this.bank_num
      }, '提交中...').then((response) => {
        if (response.result === 1) {
          Toast(response.msg);
          this.$router.go(-1);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    }
  },
  components: {cTitle}
};