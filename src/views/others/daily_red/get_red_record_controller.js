import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      titleText: '',
      baseUrl: '',
      recordsList: [],
      memberData: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      tag:'old',
    };
  },
  activated() {
    this.tag = this.$route.params.tag;
    this.titleText = ((this.tag == 'new') || (this.tag == 'old'))?'红包领取记录':'额外奖励记录';
    if(this.tag == 'new'){
      this.baseUrl = "plugin.redpack-tool.frontend.receiveLog.getList";
    }else if (this.tag == 'old'){
      this.baseUrl = "plugin.red-packet.api.logs.receiveLogs";
    } else {
      this.baseUrl = "plugin.red-packet.api.red-packet-logs.getBonusReceiveLogs";
    }
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get(
          this.baseUrl,
          { page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            if(this.tag == 'new'){
              this.total_page = response.data.logs.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.recordsList = response.data.logs.data;
              this.receive_total = response.data.receive_total;
              console.log(this.recordsList);
            }else if (this.tag == 'old'){
              this.amount_sum = response.data.receive_log.amount_sum;
              this.total_page = response.data.receive_log.list.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.recordsList = response.data.receive_log.list.data;
            } else {
              // 其他奖励领取记录
              this.amount_sum = response.data.bonus_sum;
              this.total_page = response.data.receive_log.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.recordsList = response.data.receive_log.data;
            }
            this.isLoadMore = true;
            this.memberData  = response.data.member;
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
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            this.baseUrl,
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                let myData = [];
                if(that.tag == 'new'){
                  myData = response.data.logs.data;
                }else if (this.tag == 'old'){
                  myData = response.data.receive_log.list.data;
                } else {
                  myData = response.data.receive_log.data;
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
