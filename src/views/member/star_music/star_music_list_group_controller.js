import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      listData: [],
      currentTime: parseInt(new Date().getTime() / 1000),

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {

  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.page = 1;
      this.isLoadMore = true;
    },
    getData() {

      $http.get("plugin.star-spell.frontend.index.openList", {
        activity_id: this.$route.query.id
      }, "").then(res => {
        if (res.result != 1) {
          return Toast(res.msg);
        }

        this.total_page = res.data.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
        this.listData = res.data.data;
      });


    },
    gotoGroupDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGroupDetails", { id }));
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.star-spell.frontend.index.openList", {
            activity_id: this.$route.query.id,
            page: this.page
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

            }
          });
      }
    }
  }
};