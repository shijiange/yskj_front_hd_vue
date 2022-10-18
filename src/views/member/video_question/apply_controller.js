import { Toast } from 'vant';
export default {
  data() {
    return {
      is_agreement: false,
      submit_status: false,
      username: '',
      mobile: '',
      agreement: '',
      application_audit_status:'',
      status:false,
      info:[]
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    toRecord(){
      this.$router.push(this.fun.getUrl("videoRecord"));
    },
    tapAgr(){
      this.status = !this.status;
    },
    submit() {
      if(!this.status){
        Toast('请阅读服务协议并同意');
        return;
      }
      var that = this;
      $http.get("plugin.agent-qa.api.application.apply-agent", { username: that.username, mobile: that.mobile }).then(
        response => {
          if (response.result == 1) {
            that.submit_status = true;
            that.getData();
          } else {
            if(response.msg){
              if(response.msg.mobile){
                Toast(response.msg.mobile[0]);
              }else if(response.msg.username){
                Toast(response.msg.username[0]);
              }else{
                Toast(response.msg);
              }
            }
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.index.index").then(
        response => {
          if (response.result === 1) {
            that.info = response.data;
            that.agreement = response.data.agreement;
            that.application_audit_status = response.data.application_audit_status;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    answerClose() {
      this.$router.go(-1);
      console.log('111');
    },
    goApply() {
      this.$router.push(this.fun.getUrl("videoAnswer"));
    },
    goHome() {
      this.$router.push(this.fun.getUrl("videoQuestion"));
    },
  },
  components: {
  }
};