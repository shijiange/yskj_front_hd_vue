import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      id: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false,
      //
      info: [],
      datas: [],
      dinfo: [],
      contenTapMore:false,
      overview:''
    };
  },
  activated() {
    this.init();
    this.total_page = 0;
    window.scrollTo(0, 0);
    this.getData();
  },
  deactivated() {},
  mounted() {},

  methods: {
    init() {
      this.id = this.$route.params.id;
      this.page = 1;
      this.info = [];
      this.datas = [];
      this.dinfo = [];
      this.isLoadMore = true;
      this.isLoading = false;
    },
    toGoBtn(key) {
      if (key == "home") {
        this.$router.push(this.fun.getUrl("periodicalIndex", {}));
      } else if (key == "list") {
        this.$router.push(this.fun.getUrl("periodicalDetail", {}));
      }
    },
    goWatch(index) {
      this.$router.push(this.fun.getUrl("periodicalWatch", { id: this.id, ind: index }));
    },
    getData() {
      let that = this;
      this.isLoadMore = false;
      $http
        .get("plugin.journal.frontend.journal.directory", { journal_id: that.id, page: that.page }, "加载中")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.directory.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.directory.data;
            that.info = response.data;
            that.dinfo = response.data.info;
            that.overview = that.dinfo.overview; 
            if(that.dinfo.overview.length >= 100){
              that.contenTapMore = false;
            }else{
              that.contenTapMore = true;
            }
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
            "plugin.journal.frontend.journal.directory",
            {
              page: that.page,
              journal_id: that.id
            },
            "加载中"
          )
          .then(response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.directory.data;
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
