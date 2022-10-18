import DList from "@/components/dlist";
let _search_kwd = "";
export default {
  data() {
    return {
      search_kwd: "",

      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      neworkloading: false
    };
  },
  created() {},
  activated() {
    if (this.$route.params.fromHome && this.$route.params.fromHome == 1) {
      this.search_kwd = "";
      _search_kwd = "";
      this.listData = [];
      this.initPage();
    }
  },
  methods: {
    initPage() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.neworkloading = false;
    },

    getListData() {
      if (this.search_kwd == "") {
        return this.$toast("请输入关键字搜索");
      }
      if (_search_kwd == this.search_kwd) return;
      _search_kwd = this.search_kwd;
      this.initPage();
      $http.post("plugin.present-project.frontend.project.index", { search_kwd: _search_kwd }, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.neworkloading = true;
        this.listData = res.data.person_list.data;
        this.total_page = res.data.person_list.last_page;
        if (this.total_page <= 0) {
          this.total_page = 1;
        }
        if (this.total_page <= this.page) {
          this.loading = true;
          this.isLoadMore = false;
        }
      });
    },
    getMoreData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      // console.log('加载更多启动');
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        //console.log('没了');
      } else {
        this.page += 1;
        let json = {
          page: this.page,
          search_kwd: _search_kwd
        };

        $http
          .post("plugin.present-project.frontend.project.index", json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.person_list.data;
              this.listData = this.listData.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    gotoPage(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    }
  },
  components: { DList }
};
