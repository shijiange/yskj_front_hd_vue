import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      allData: {},
      member: {},
      rewards: {},
      name: {},
      rewards_type: 1,
      recordsList: [],
      amount_id: "",
      isLoading:false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getStatistic();
    this.getData();
  },
  methods: {
    // tabHandel(index) {
    //   this.rewards_type = index + 1;
    //   this.initData();
    //   this.getData();
    // },
    getStatistic() {
      let that = this;
      $http.get("plugin.video-share.frontend.bonus.statistic").then(
        response => {
          if (response.result === 1) {
            that.rewards = response.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let that = this;
      $http
        .post("plugin.video-share.frontend.bonus.getList", { page: 1 }, " ")
        .then(
          response => {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.recordsList = response.data.list.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //下拉刷新
    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    },
    //获取更多数据
    getMoreData() {
      let that = this;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.video-share.frontend.bonus.getList",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
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
      this.amount_id = "";
    }
  },
  components: { cTitle }
};
