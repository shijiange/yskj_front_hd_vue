




import DList from "@/components/dlist";
export default {
  data() {
    return {
      tabsIndex:3,

      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      settlement:0,
      un_settlement:0,
      member:{}

    };
  },
  components: { DList },
  activated() {
    this.getListData();
  },

  methods: {
    changeTab(index){
      this.getListData();
    },
    initPage() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getListData() {
      this.initPage();
      let json = {};
      if (this.tabsIndex != 3) {
        json.status = this.tabsIndex;
      }

      $http.get("plugin.gratitude-reward.frontend.index.index", json, "").then(
        res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.listData = res.data.list.data;
          this.member = res.data.member;
          this.settlement = res.data.settlement;
          this.un_settlement = res.data.un_settlement;
          this.total_page = res.data.list.last_page;

          if (this.total_page <= 0) {
            this.total_page = 1;
          }
          if (this.total_page <= this.page) {
            this.loading = true;
            this.isLoadMore = false;
          }
        },
        response => {
          this.$toast(response.msg);
        }
      );
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
          page: this.page
        };
        if (this.tabsIndex != 3) {
          json.status = this.tabsIndex;
        }
        $http
          .get("plugin.gratitude-reward.frontend.index.index", json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.list.data;
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

  }
};
