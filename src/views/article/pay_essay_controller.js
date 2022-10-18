import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
      isLoading:false
    };
  },
  activated() {
    this.getData();
  },
  deactivated() {
   
  },
  mounted() {},

  methods: {
    toNoticeInfo(item) {
      this.$router.push(this.fun.getUrl("articleContent", { id: item.id }));
    },
    loadTop() {
      this.initData();
      this.getData();
      this.$refs.loadmore.onTopLoaded();
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.datas=[];
    },
    //获取数据
    getData() {
      this.isLoadMore = false;
      this.page = 1;
      $http
        .get(
          "plugin.article-pay.api.index.articlePayData",
          { page: this.page,art:'payed' },
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.getPayed.articles.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.datas = response.data.getPayed.articles.data;
              this.isLoading = false;
            } else {
              Toast(response.msg);
              this.isLoading = false;
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
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
            "plugin.article-pay.api.index.articlePayData",
            {
              page: this.page,
              art:'payed'
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.getPayed.articles.data;
                this.datas = this.datas.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
