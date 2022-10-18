import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      recordsList: [],
      receive_logs: {},
      memberData: {},
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.active = 0;
    this.getData();
  },
  methods: {
    bindChange(e){
      this.list = [];
      this.page = 1;
      this.getData();
    },
    getData() {
      $http
        .get("plugin.redpack-tool.frontend.rank.index", { page: this.page, rank_type: this.active + 1 }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.list = response.data.data;
            this.total_page = response.data.last_page;
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
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.redpack-tool.frontend.rank.index",
            {
              page: that.page,
              rank_type: this.active + 1
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.list = that.list.concat(myData); //数组拼接
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
    }
  },
  components: { cTitle }
};
