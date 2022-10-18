import DList from "@/components/dlist";
import { Toast} from "vant";
export default {
  data() {
    return {
      upgradeCodeLoading: false,
      upgradeCodeFinished: false,
      upgradeCodePage: 1,
      dataList: [],
    };
  },

  activated() {
    this.getRecord();
  },
  methods: {
    btnDetail(data) {
      this.$router.push(this.fun.getUrl("FreeDetails",{order_id:data.order_id,order_sn:data.order_sn,status_name:data.status_name}));
    },
    getRecord() {
      $http
        .post("plugin.free-lottery.frontend.index.dividend", {
          order_ids:this.$route.query.order_ids ? this.$route.query.order_ids : '',
          page: this.upgradeCodePage,
          is_aggregation: 1,
        }).then(res => {
          if (res.result == 1) {
            const { data: data, current_page, last_page } = res.data;
            if (data.length === 0 || current_page === last_page) {
              this.upgradeCodeFinished = true;
            }
            this.dataList.push(...data);
            this.upgradeCodeLoading = false;
            this.upgradeCodePage++;
            this.dataList.forEach(item => {
              item.isShow = false;
              if(item.status === 1 && item.order_id === item.has_one_task.order_id){
                item.isShow = true;
              }
              if(item.status === 0 || item.status === -1){
                item.isShow = true;
              }
            });
          } else {
            Toast(res.msg);
          }
        });
    }
  },
  filters:{
    conversionTime(data){
      function timeStamp(StatusMinute){
        // var day=parseInt(StatusMinute/60/24);
        var hour=parseInt(StatusMinute/60);
        var min= parseInt(StatusMinute % 60);
        StatusMinute="";
        // if (day > 0){
        //StatusMinute= day + "天";
        // }
        if (hour>0){
          StatusMinute += hour + "小时";
        }
        if (min>0){
          StatusMinute += parseFloat(min) + "分钟";
        }
        return StatusMinute;
      }
      return timeStamp(data);
    },
  },
  components: { DList }
};
