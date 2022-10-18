import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      cloudImei:''
    };
  },
  activated() {
    this.initWeixin();
    this.checkCloud();
  },
  mounted() {

  },
  methods: {
    checkCloud(){
      $http.get("plugin.store-cashier.frontend.store.yun-horn.index").then(response => {
        if (response.result === 1) {
          if(response.data.status==1){
            Toast('你已绑定云喇叭');
            this.cloudImei = response.data.yun_horn;
          }
        } else {
          Toast(response.msg);
          this.$router.go(-1);
        }
      });
    },
    initWeixin(){//微信设置
      $http.post("member.member.wxJsSdkConfig",{},).then(response =>{
        if(response.result == 1){
          this.weixinConfig(response.data);
        }
      }).catch(error =>{
        console.log(error);
      });
    },
    weixinConfig(data){
      wx.config(data.config);
    },
    getcode() {
      wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success:(res)=>{
          let arr=res.resultStr.split('|');
          this.cloudImei=arr[0];
        },
        fail:(res)=>{
          console.log(res);
          alert('扫码失败');
        }
      });
    },
    submitBtn(){
      let that = this;
      if (that.fun.isTextEmpty(that.cloudImei)) {
        Toast('请输入云喇叭IMEI');
        return;
      }
      $http.post("plugin.store-cashier.frontend.store.yun-horn.bind-horn ",{
        yun_horn:that.cloudImei
      },).then(response =>{
        if(response.result == 1){
          that.$dialog.alert({message:response.msg}).then(()=>{
            that.$router.go(-1);
          });

        }else{
          that.$dialog.alert({message:response.msg}).then(()=>{
            that.$router.go(-1);
          });

        }
      }).catch(error =>{
        console.log(error);
      });
    }
  },
  components: {
    cTitle,
  }
};
