import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },

  activated() {
    this.initData();
    //获取数据
    this.getNetData();
    this.$refs.info_change.style.height = document.body.clientHeight + "px";
  },
  methods: {
    loadTop() {
      this.initData();
      this.getNetData();
      // this.$refs.info_loadmore.onTopLoaded();
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.datas = [];
    },
    getNetData() {
      let that = this;
      let json = { page: 1 };
      $http
        .get(
          "plugin.dragon-deposit.frontend.lcg-merchant.mer-update-log",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.total_page = response.data.last_page;
              that.datas = response.data.data;
              if (!that.total_page) {
                that.total_page = 0;
              }
              this.isLoading = false;
            } else {
              that.$dialog.alert({message:response.msg});
           
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getMoreData() {
      var that = this;
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let json = { page: this.page };
        $http
          .get(
            "plugin.dragon-deposit.frontend.lcg-merchant.mer-update-log",
            json,
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                that.loading = false;
                that.allLoaded = false;
                that.datas = that.datas.concat(response.data.data);
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
