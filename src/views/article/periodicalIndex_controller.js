import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false,
      //
      info: [],
      first_data:[],
      datas: []
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  deactivated() {},
  mounted() {},

  methods: {
    init(){
      this.info = [];
      this.first_data = [];
      this.datas = [];
      this.page =1;
      this.total_page = 0;
    },
    goDetail(kid) {
      this.$router.push(this.fun.getUrl("periodicalDetail", {id:kid}));
    },
    getData() {
      let that = this;
      this.isLoadMore = false;
      $http
        .get("plugin.journal.frontend.journal.index", { page: that.page }, "加载中")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.before_journal.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.before_journal.data;
            that.info = response.data;
            that.first_data = response.data.first_data;
            that.isLoading = false;
          } else {
            Toast(response.msg);
            that.isLoading = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
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
            "plugin.journal.frontend.journal.index",
            {
              page: that.page
            },
            "加载中"
          )
          .then(response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.before_journal.data;
              that.datas = that.datas.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
