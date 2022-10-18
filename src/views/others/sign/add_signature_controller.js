import DList from "@/components/dlist";
import { Toast } from 'vant';
export default {
  props: {
    signTableData: {
      type: Object,
      default: () => ({})
    },
    sign_form_count: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      sign_index: 0, // 是否编辑
      quick_add_sign: "",
      role_options: [{value: '甲方', id: 1}, {value: '乙方', id: 2}],
      keyWord: '',
      search_list: [],
      page: 1,
      isLoadMore: true,
      loading: false,
      signData: {
        role_id: 1,
        tel: "",
        name: "",
        sign_type: 0,
        company_name: ""
      },
      msg: "甲方\n15200000000\n张三\n企业\nxxxx科技有限公司"
    };
  },
  components: {
    DList
  },
  mounted() {
    if(this.search_list.length <= 0) {
      this.searchData('refresh');
    }
  },
  methods: {
    sureAddSign() {
      if(!this.signData.role_id) {
        Toast("请选择角色名称");
        return;
      }

      if(this.sign_form_count === 2 && this.signData.role_id > 2) {
        Toast("当前只能设置甲方或者乙方两种角色!");
        return;
      }
      if(!this.signData.tel) {
        Toast("请填写手机号");
        return;
      }
      if(!this.signData.name) {
        Toast("请填写姓名");
        return;
      }
      if(this.signData.sign_type === 1 && !this.signData.company_name) {
        Toast("请填写企业信息");
        return;
      }

      this.$emit('sureAddSign', this.signData, this.sign_index);
    },
    chooseRole(index) {
      this.signData.role_id = index;
    },
    changeSignType(sign_type) {
      this.signData.sign_type = sign_type;
    },
    handleText() {
      let data = this.quick_add_sign.split('\n');
      this.signData = {
        role_id: data[0] === '甲方' ? 1 : (data[0] === '乙方' ? 2 : (data[0] === '丙方'? 3 : '')),
        tel: data[1],
        name: data[2],
        sign_type: data[3] === '企业' ? 1 : 0,
        company_name: data[4],
      };
    },
    chooseSign(item) {
      this.signData.name = item.name;
      this.signData.tel = item.tel;
      this.signData.company_name = item.company_name;
      window.scrollTo(0, 0);
    },
    initSignData() {
      this.sign_index = 0;
      if(this.sign_form_count === 2) {
        this.role_options = [{value: '甲方', id: 1}, {value: '乙方', id: 2}];
      }else if(this.sign_form_count === 3) {
        this.role_options = [{value: '甲方', id: 1}, {value: '乙方', id: 2}, {value: '丙方', id: 3}];
      }

      let old_role_options = [];
      for(let i=0;i<this.signTableData.length;i++) {
        // 排除已选角色
        old_role_options.push(this.signTableData[i].role_id);
      }
      for(let i=0;i<this.role_options.length;i++) {
        if(old_role_options.indexOf(this.role_options[i].id) > -1) {
          this.role_options[i] = {};
        }
      }

      this.signData = {
        role_id: this.role_options[0].id,
        tel: "",
        name: "",
        sign_type: 0,
        company_name: ""
      };
      window.scrollTo(0, 0);
    },
    setSignData(item, sign_index) {
      this.initSignData();
      this.sign_index = sign_index;
      this.signData = item;
      if(this.signData.role_id === 1) {
        this.role_options.unshift({value: '甲方', id: 1});
      }else if(this.signData.role_id === 2) {
        this.role_options.unshift({value: '乙方', id: 2});
      }if(this.signData.role_id === 3) {
        this.role_options.unshift({value: '丙方', id: 3});
      }
    },
    searchData(flag) {
      if(flag === 'refresh') {
        this.page = 1;
        this.isLoadMore = true;
        this.search_list = [];
      }

      if (this.loading === true || this.isLoadMore === false) {
        return;
      }
      this.loading = true;
      $http.get("plugin.yun-sign.frontend.h5.contract.signContractRoleLog", {kwd: this.keyWord, page: this.page}, "loading").then(response => {
        if (response.result === 1) {
          if(!this.keyWord && this.page == 1) {
            this.search_list.push(response.data.self);
          }
          this.search_list = this.search_list.concat(response.data.list.data);
          this.page++;
          if (response.data.list.current_page === response.data.list.last_page || response.data.list.data.length === 0 || response.data.list.data.length < response.data.list.per_page) {
            this.isLoadMore = false;
          }
          this.loading = false;
        }
      });
    },
  },
};






