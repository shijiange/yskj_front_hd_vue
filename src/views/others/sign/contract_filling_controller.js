export default {
  data() {
    return {
      contract_id: '',
      Data: {},
      commonStructsList: [],
    };
  },
  activated() {
    this.contract_id = this.$route.query.contract_id;
    this.getData();
  },
  methods: {
    // 获取模版
    getData() {
      $http.post("plugin.yun-sign.frontend.contract.detail-step3", {contract_id: this.contract_id}).then(response => {
        if (response.result === 1) {
          this.Data = response.data.contract_info;
          this.commonStructsList = [];
          for(let i=0;i<response.data.form_list.length;i++) {
            if(response.data.form_list[i].form_type == 1) {
              this.commonStructsList.push(response.data.form_list[i]);
            }
          }
        } else {
          this.$dialog.alert({ message: response.msg});
        }
      }).catch(err => {
        console.log(err);
      });
    },
    postSignData(step) {
      let contract_form_params = [];
      let flag = true;
      for (let i = 0; i < this.commonStructsList.length; i++) {
        if(this.commonStructsList[i].is_require && !this.commonStructsList[i].form_value){
          this.$toast(`${this.commonStructsList[i].form_name}未填写`);
          flag = false;
          break;
        }else {
          contract_form_params.push({
            id: this.commonStructsList[i].id,
            value: this.commonStructsList[i].form_value
          });
        }
      }
      if(!flag){
        return;
      }
      $http.post("plugin.yun-sign.frontend.contract.create-sign-doc", {id: this.contract_id, pdfWidth: 0, pdfHeight: 0, contract_form_params: contract_form_params}, "loading").then(response => {
        if (response.result === 1) {
          if(step == 1) {
            this.$router.push(this.fun.getUrl("signPage",{id: this.contract_id}));
          }else {
            this.$router.replace(this.fun.getUrl('contractList',{},{status:0}));
          }

        } else {
          this.$toast(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
  }
};
