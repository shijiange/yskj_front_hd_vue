import { Toast } from 'vant';
export default {

  data() {
    return {
      name:'',
      cer_code:'',
      mobile:'',
      bank_code:'',
    };
  },
  methods: {
    submit(){
      console.log(this.$router.path,'path');
      let that = this;
      $http.post("plugin.yee-pay.frontend.index.add-employee",{
        employee: {
          name:this.name,
          cer_code:this.cer_code,
          bank_code:this.bank_code ,
          mobile:this.mobile
        }
      }).then(
        function(response) {
          if (response.result == 1) {
            Toast('签约成功');
            setTimeout(()=>{
              that.$router.go(-1);
            },1000);
            that.name = '';
            that.cer_code = '';
            that.mobile = '';
            that.bank_code = '';
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response,'response');
          Toast('签约失败，请重新提交');
        }
      );
    }
  },
};
