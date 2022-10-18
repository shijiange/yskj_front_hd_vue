import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      transferID: '',
      transferIntegral: '',
      integral: {},
      checkRadio:'1',
      shiftPoint:false,
      nick_name:'',
      timerId:null
    };
  },
  activated() {
    if(this.$route.params.type){
      this.shiftPoint = true;
    }
    this.initData();
    this.getData();
  },
  methods: {
    serach_nick_name(){
      if(this.transferID == ''){
        return;
      }
      if(this.timerId){clearTimeout(this.timerId)}
      this.timerId = setTimeout(() => {
          this.getNickName()
      }, 800);
    },
    getNickName(){
      $http
      .get('member.member.memberInfo', {uid:this.transferID}, 'loading')
      .then(response => {
        console.log(response)
        if (response.result === 1) {
          this.nick_name = response.data.nickname;
        } else {
          // Toast(response.msg);
          this.nick_name = '';
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.transferIntegral = '';
      this.transferID = '';
      this.nick_name = '';
      this.integral = {};
    },
    getData() {
      $http
        .get('plugin.integral.Frontend.Controllers.Page.transfer-love', {transferID:this.nick_name}, ' ')
        .then(response => {
          console.log(response)
          if (response.result === 1) {
            this.integral = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sureTransfer() {
      if(this.nick_name == ''){
        Toast('该会员不存在');
        return;
      }
      if (!this.transferIntegral && this.checkRadio == '1') {
        Toast('请输入转让数额');
        return;
      }
      if (Number(this.transferIntegral) > Number(this.integral.member_integral)) {
        Toast(`输入的${this.integral.member_integral}数额超过已有的` + this.integral.member_integral);
        return;
      }
      let json = {
        change_value: this.transferIntegral,
        recipient_id: this.transferID,
        give_type:this.checkRadio
      }
      let url;
      if(this.shiftPoint){
        url = 'plugin.integral.Frontend.Modules.Integral.Controllers.Transfer.point-transformation'
      }else{
        url = 'plugin.integral.Frontend.Modules.Integral.Controllers.Transfer.love-transformation'
      }
      $http
        .get(
          url,
          json,
          '转让中'
        )
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl('Integral_love_detail'));
            Toast('转化成功');
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
