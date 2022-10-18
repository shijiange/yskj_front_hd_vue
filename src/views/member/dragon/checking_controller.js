import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      title: "",
      formData: {}
    };
  },

  activated() {
    this.getStatus();
  },
  methods: {
    getStatus() {
      $http
        .get("plugin.dragon-deposit.frontend.index.getConsumer", {}, " ")
        .then(response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(response.data)) {
              this.formData = response.data;
              if (this.formData.platRoleID == "001") {
                this.fun.setWXTitle("个人信息");
                this.title = "个人信息";
              } else {
                if (this.formData.registrant == 1) {
                  this.formData.registrant = "法人";
                } else {
                  this.formData.registrant = "授权人";
                }
                if (this.formData.accType == "2") {
                  this.formData.accType = "对公";
                } else {
                  this.formData.accType = "对私";
                }
                this.title = "企业信息";
                this.fun.setWXTitle("企业信息");
              }
            }
          } else {
            this.$dialog.alert({message:response.msg});
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
