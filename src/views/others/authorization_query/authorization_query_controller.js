import { Toast } from "vant";
export default {
  data() {
    return {
      domain_name: "",
      app_key: "",
      result: false, //是否显示查询结果
      app_name:'',
      plugin_class:[],
    };
  },
  methods: {
    async queryBtn() {
      if (this.fun.isTextEmpty(this.domain_name)) {
        Toast("请输入域名");
        this.result = false;
        return;
      }
      if (this.fun.isTextEmpty(this.app_key)) {
        Toast("请输入站点key");
        this.result = false;
        return;
      }
      let res = await $http.get(
        'plugin.auth-query.frontend.auth-query.get-query-info',
        {
          domain_name:this.domain_name,
          app_key:this.app_key
        }
      );
      if(res.result === 0){
        Toast(res.msg);
        this.result = false;
        return;
      }
      if(res.result === 1){
        this.app_name = res.data.app_name;
        this.plugin_class = res.data.plugin_class;
        this.result = true;
      }
    }
  }
};
