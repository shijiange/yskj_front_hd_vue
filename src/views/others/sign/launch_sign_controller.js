import { Toast } from 'vant';
import addSign from './add_signature';
export default {
  data() {
    return {
      showAddSign: false,
      showType: 'template',
      template_id: "",
      contract_id: "",
      sign_form_count: 0, //签署区数量
      add_roles_notice: '', //添加角色提示
      contract: {}, //模板信息
      ncc_list: [],
      contract_attach: [], //附件信息
      signTableData: [],
      tableData: [],
      ruleForm: {
        name: "",
        sign_end_date: "",
        contract_end_date: ""
      },

      //截至日期
      deadline_show: false,
      deadline_model: new Date(),

      //合同到期日
      duedate_show:false,
      duedate_model:new Date(),
    };
  },
  activated() {
    this.initData();
    this.template_id = this.$route.params.template_id;
    if(this.$route.params.id) {
      this.contract_id = this.$route.params.id;
      this.getStep2();
    }else {
      this.getStep1();
    }
    this.getNearCc();
  },
  components: {
    addSign
  },
  methods: {
    toLink(file) {
      window.location.href = file.file_url;
    },
    sureAddSign(item, index) {
      if(index) {
        this.signTableData[index-1] = item;
      }else {
        this.signTableData.push(item);
      }
      this.onCloseSign();
    },
    deleteIt(index, flag) {
      if(flag === 'sign') {
        this.signTableData.splice(index, 1);
      }else {
        this.tableData.splice(index, 1);
      }
    },
    onCloseSign() {
      this.showAddSign = false;
    },
    toAddSign(index) {
      this.showAddSign = true;
      setTimeout(()=> {
        if(index) {
          // index-1 防止0的时候不好判断
          this.$refs.addSignRef.setSignData(this.signTableData[index-1], index);
        }else {
          this.$refs.addSignRef.initSignData();
        }
      },50);
    },
    toCCAdd(index) {
      if(index>=0) {
        let is_true = false;
        this.tableData.some((item,index1) => {
          if(item.name==this.ncc_list[index].name&&item.tel==this.ncc_list[index].tel) {
            is_true = true;
          }
        });
        if(is_true) {
          Toast('该抄送人信息已存在');
          return;
        }
        this.tableData.push({
          name: this.ncc_list[index].name,
          tel: this.ncc_list[index].tel
        });
      }else {
        this.tableData.push({
          name: "",
          tel: ""
        });
      }
    },
    submitFormSecond(step) {
      if(!this.ruleForm.name) {
        Toast("请输入合同名称！");
        return;
      }
      if(!this.ruleForm.sign_end_date) {
        Toast("请选择签署截止日期！");
        return;
      }
      if(this.signTableData.length <= 0){
        Toast("请添加签署角色");
        return;
      }

      let url = "";
      let json = {};
      if(this.showType === 'contract') {
        // PC端单独发起签署
        url = "plugin.yun-sign.frontend.contract.create-by-doc";
        json = {
          contract_id: this.contract_id,
          name: this.ruleForm.name,
          sign_end_date: this.ruleForm.sign_end_date,
          contract_end_date: this.ruleForm.contract_end_date,
          contract_doc_url: this.contract_doc_url,
          contract_attach: this.contract_attach,
          roles: this.signTableData,
          ccs: this.tableData,
        };
      }else {
        url = "plugin.yun-sign.frontend.contract.create-step2";
        json = {
          name: this.ruleForm.name,
          sign_end_date: this.ruleForm.sign_end_date,
          contract_end_date: this.ruleForm.contract_end_date,
          roles: this.signTableData,
          ccs: this.tableData,
        };
        if(this.contract_id) {
          json.contract_id = this.contract_id;
          json.template_id = this.template_id;
        }else {
          json.template_id = this.template_id;
        }
      }

      $http.post(url, json, "loading").then(response => {
        if (response.result === 1) {
          if(this.showType === 'contract') {
            // PC端单独发起签署
            if(step == 1) {
              this.$router.push(this.fun.getUrl("set_template", {id: response.data.contract_id}, {fromCreate: 1}));
            }else {
              this.$router.replace(this.fun.getUrl("launch"));
            }
          }else {
            if(step == 1) {
              this.$router.replace(this.fun.getUrl("contractFilling",{},{contract_id: response.data.contract_id}));
            }
          }
        } else {
          Toast(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });

    },
    getStep2() {
      $http.post("plugin.yun-sign.frontend.contract.detail-step2", { contract_id: this.contract_id }, "loading").then(response => {
        if (response.result === 1) {
          this.add_roles_notice = response.data.add_roles_notice;
          this.contract_info = response.data.contract_info;
          this.ruleForm.name = this.contract_info.name;
          this.ruleForm.sign_end_date = this.contract_info.sign_end_date;
          this.sign_form_count = response.data.sign_form_count;
          this.ruleForm.contract_end_date = this.contract_info.contract_end_date === '1970-01-01' ? '': this.contract_info.contract_end_date;
          this.contract = response.data.template_info;
          this.contract_attach = response.data.template_info.contract_attach;
          if(response.data.roles_list.length>0) {
            response.data.roles_list.forEach((item)=>{
              this.signTableData.push({
                id: item.id,
                role_id: item.role_id,
                name: item.name,
                tel: item.tel,
                sign_type: item.sign_type,
                company_name: item.company_name
              });
            });
          }
          if(response.data.cc_list.length>0) {
            response.data.cc_list.forEach((item)=>{
              this.tableData.push({
                id: item.id,
                name: item.name,
                tel: item.tel
              });
            });
          }
        } else {
          this.$toast(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getStep1() {
      let json = {};
      if(this.showType === 'template') {
        json = { template_id: this.template_id};
      }
      $http.post("plugin.yun-sign.frontend.contract.detail-step1", json, "loading").then(response => {
        if (response.result === 1) {
          if(this.showType === 'template') {
            this.add_roles_notice = response.data.add_roles_notice;
          }else {
            this.add_roles_notice = response.data.add_roles_doc_notice;
          }
          this.sign_form_count = response.data.sign_form_count;
          this.contract = response.data.template_info;
          this.contract_attach = response.data.template_info.contract_attach;
        } else {
          this.$dialog.alert({ message: response.msg});
        }
      });
    },
    getNearCc() {
      $http.get("plugin.yun-sign.frontend.contract.nearCc", {}, "loading").then(response => {
        if (response.result === 1) {
          this.ncc_list = response.data.list;
        } else {
          Toast(response.msg);
        }
      });
    },
    datetimeConfirm(timeModel, type) {
      if (type == "deadline") {
        this.deadline_show = false;
        this.deadline_model = timeModel;
        this.ruleForm.sign_end_date = this.fun.dateFormat("YYYY-mm-dd", timeModel);
      }else if(type == "duedate"){
        this.duedate_show = false;
        this.duedate_model = timeModel;
        this.ruleForm.contract_end_date = this.fun.dateFormat("YYYY-mm-dd", timeModel);
      }
    },
    initData() {
      this.signTableData = [];
      this.tableData = [];
      this.ruleForm = {
        name: "",
        sign_end_date: "",
        contract_end_date: ""
      };
    }
  }
};
