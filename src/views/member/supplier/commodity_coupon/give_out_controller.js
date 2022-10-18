import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      Num:'',//发放数量
      id:'',//优惠券ID
      Text:'', //文本框内容
      result:1 //选择的发放对象
    };
  },
  activated() {
    this.initPageData();
    this.id=this.$route.params.id;
  },
  methods: {
    initPageData(){
      this.Num='',
      this.id='',
      this.Text='',
      this.result=1;
    },
    publish(){
      if(this.fun.isTextEmpty(this.Num)||isNaN(this.Num)){
        Toast('请输入发放数量，必须是整数');
        return;
      }
      if(!(isNaN(this.result))){
        if(this.fun.isTextEmpty(this.Text)){
          Toast('请输入会员ID');
          return; 
        }
      }
      let json={
        id:this.id,
        send_total:this.Num,
        sendtype:this.result,
        send_memberids:this.Text
      };
      $http.post('plugin.store-cashier.frontend.store.center.coupon.send',json,'发放中').then(response=>{
        if(response.result===1){
          Toast('发放成功');
          this.$router.push(this.fun.getUrl('CommodityCoupon'));
        }
        else if(response.result===0){
          if(response.data.url){
            window.location.href=response.data.url;
          }else{
            Toast(response.msg);
          }
        }
      });
    },
  },
  components: {cTitle}
};
