import cTitle from "components/title";
import { Toast } from "vant";
// import { scrollMixin } from "utils/mixin";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      info: [],
      isLoadMore: true, //判断是否要加载更多的标识
      page: 1, //当前的页数
      total_page: 0 //总共有多少页
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    // plugin.flight-collect.frontend.index.get-flight
    getData() {
      $http
        .get("plugin.flight-collect.frontend.index.get-flight", {}, " ")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.info = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
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
        $http.get("plugin.flight-collect.frontend.index.get-flight", { page: this.page }, "加载中").then(
          response => {
            that.isLoadMore = true;

            if (response.result === 1) {
              var myData = response.data.data;
              that.info = that.info.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            console.log(response);
            // error callback
          }
        );
      }
    },
    goDetail(item) {
      this.$router.push(this.fun.getUrl("flightInformationDetail", { id: item.id, form_id: item.form_id }));
    }
  },
  components: { cTitle }
};
