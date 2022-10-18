import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      allData: {},
      member: {},
      rewards: {},
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      progressNum: 0 //进度条
    };
  },
  activated() {
    this.initData();
    this.getMember();
    this.getData();
  },
  methods: {
    getMember() {
      $http.get("plugin.performance.frontend.bonus.getMemberInfo").then(response => {
        this.member = response.data;
        this.progressNum = Number(response.data.rest) > 0 ? parseInt((1 - Number(response.data.rest) / Number(response.data.rest_all)) * 100) : 100;
        this.fun.setWXTitle(this.member.plugin_name);
      });
    },
    getData() {
      $http.post("plugin.performance.frontend.bonus.getList", { page: 1 }, " ").then(
        response => {
          if (response.result === 1) {
            this.allData = response.data;
            this.rewards = this.allData.statistics;
            this.isLoadMore = true;
            this.total_page = this.allData.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = this.allData.list.data;
            // this.fun.setWXTitle(this.name.plugin_name);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.performance.frontend.bonus.getList",
            {
              page: this.page
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                this.recordsList = this.recordsList.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    goRewardsRecordDetail() {
      this.$router.push(this.fun.getUrl("RewardsRecordDetail"));
    }
  },
  components: { cTitle }
};
