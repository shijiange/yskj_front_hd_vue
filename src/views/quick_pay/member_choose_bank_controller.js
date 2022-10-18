import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      bank:[],
      show1:false,
      arr:[],
      amount:'',
      pay_sn:'',
      bank_name:'',
      code:'',
      order_pay_sn:'',
      payer_phone:'',
      pay_type:'',
      card_no:'',
      check_open: false,
    };
  },

  activated() {
    this.initData();
    this.getType();

  },

  mounted() {

  },
  methods: {
    initData(){
      this.bank=[];
      this.show1=false;
      this.arr=[];
      this.amount='';
      this.pay_sn='';
      this.bank_name='';
      this.code='';
      this.order_pay_sn='';
      this.payer_phone='';
      this.pay_type='';
      this.card_no='';
      this.check_open = false;
    },
    toPay(item){
      if(item.status==0&&this.pay_type==2){
        this.$router.push(this.fun.getUrl("memberbindBank", { card_id: item.id }));
      }
    },
    getType(){
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-pay-type", {}, "").then(response => {
        if (response.result == 1) {
          this.pay_type=response.data.pay_type;
          this.getBank();
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getIconUrl(item) {
      let icon_url = "";
      if(item.status==0&&this.pay_type==2){
        icon_url = "default";
        return icon_url;
      }else{
        switch (item.bank_name) {
        case "中国工商银行":
          icon_url = "gongshang";
          break;
        case "中国银行":
          icon_url = "zhongguo";
          break;
        case "中信银行":
          icon_url = "zhongxin";
          break;
        case "上海银行":
          icon_url = "shanghai";
          break;
        case "中国建设银行":
          icon_url = "jianshe";
          break;
        case "光大银行":
          icon_url = "guangda";
          break;
        case "民生银行":
          icon_url = "mingsheng";
          break;
        case "北京银行":
          icon_url = "beijing";
          break;
        case "平安银行":
          icon_url = "pingan";
          break;
        case "交通银行":
          icon_url = "jiaotong";
          break;
        case "招商银行":
          icon_url = "zhaoshang";
          break;
        case "广发银行":
          icon_url = "guangfa";
          break;
        case "浦发银行":
          icon_url = "pufa";
          break;
        case "邮政银行":
          icon_url = "youzheng";
          break;
        }
        return icon_url;
      }
    },

    toAdd(){
      this.$router.push(this.fun.getUrl("memberaddBankFirst"));
    },

    tapUnbound (item) {
      if (this.check_open) {
        this.toRemove(item);
      } else {
        this.$dialog.confirm({
          message: "此操作将解绑该银行卡，确认执行该操作吗？"
        }).then(() => {
          this.deleteBank(item);
        }).catch((err) => {});
      }
    },

    toRemove (item) {
      this.$router.push(this.fun.getUrl("memberRemoveBank", {card_id:item.id}));
    },
    deleteBank(item){
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.del", {card_id:item.id}, "").then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          this.show1=false;
          this.getBank();
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },

    changeBank(str){
      var m=str.split("");
      var num='*'.repeat(str.length-4);
      m.splice(0,str.length-4,num);
      var s=m.join("");
      return s;
    },
    getBank(){
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.index", {}, "").then(response => {
        if (response.result == 1) {
          this.bank=response.data;
          this.getMemberPhone();
        } else {
          this.bank=response.data;
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // 获取会员绑定的手机号
    getMemberPhone () {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-mobile", {}, "loading")
        .then((res) => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          this.check_open = res.data.sms_check_open;
        });
    },
  },
  components: { cTitle }
};