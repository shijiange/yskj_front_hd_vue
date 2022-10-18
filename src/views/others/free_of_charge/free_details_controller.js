import { Toast} from "vant";
export default {
  data() {
    return {
      upgradeCodeLoading: false,
      upgradeCodeFinished: false,
      upgradeCodePage: 1,
      dataList: [],
      order_id:'',
      order_sn:'',
      status_name:''
    };
  },
  activated() {
    this.order_id = this.$route.params.order_id;
    this.order_sn = this.$route.params.order_sn;
    this.status_name = this.$route.params.status_name;
    this.getRecord();
  },
  methods: {
    getRecord() {
      $http.post("plugin.free-lottery.frontend.index.order-info", {
        order_id:this.order_id * 1,
      }).then(res => {
        if (res.result == 1) {
          const { data: data } = res;
          this.dataList = [];
          this.dataList.push(...data);
        } else {
          Toast(res.msg);
        }
      });
    }
  },
};
