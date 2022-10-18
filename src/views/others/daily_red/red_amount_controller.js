import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      recordsList: [],
      receive_logs: {},
      memberData: {},
      tag:'old',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    console.log(this.$route.params);
    this.tag = this.$route.params.tag;
    this.getData();
  },
  methods: {
    getData() {
      let url = '';
      if(this.tag == 'new'){
        url = "plugin.redpack-tool.frontend.quotaLog.getList";
      }else{
        url = "plugin.red-packet.api.logs.quotaLogs";
      }
      $http
        .get(
          url,
          { page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            if(this.tag == 'new'){
              this.receive_logs = response.data.quota_info;
              this.recordsList = response.data.quota_logs.data;
              this.total_page = response.data.quota_logs.last_page;
            }else{
              this.total_page = response.data.quotaLogs.last_page;
              this.recordsList = response.data.quotaLogs.data;
              this.receive_logs = response.data.receive_logs;
            }
            this.memberData = response.data.member;
            this.isLoadMore = true;
            
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      let url = '';
      if(this.tag == 'new'){
        url = "plugin.redpack-tool.frontend.quotaLog.getList";
      }else{
        url = "plugin.red-packet.api.logs.quotaLogs";
      }
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            url,
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData;
                if(that.tag == 'new'){
                  myData = response.data.quota_logs.data;
                }else{
                  myData = response.data.quotaLogs.data;
                }
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              console.error(response.msg);
            }
          );
      }
    },
  },
  components: { cTitle }
};
