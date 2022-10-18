import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: [],
    };
  },
  created() {
    this.getDate();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    //获取数据
    getDate() {
      $http
        .get("plugin.store-business-alliance.frontend.index.get-team-store", {
          child_uid:this.$route.query.child_uid
        })
        .then(res => {
          if(res.result !=1) return Toast(res.msg);

          this.listData = res.data.data;
          this.isLoadMore = true;
          this.total_page = res.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }

        })
        .catch(error => {
          console.log(error);
        });
    },
    //加载更多数据
    async getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.store-business-alliance.frontend.index.get-team-store", {
            page: this.page,child_uid:this.$route.query.child_uid
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
  }
};
