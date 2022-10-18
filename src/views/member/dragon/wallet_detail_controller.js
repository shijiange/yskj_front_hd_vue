import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: "0",
      id: "0",
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
    this.$refs.wallet_detail.style.height = document.body.clientHeight + "px";
  },
  methods: {
    loadTop() {
      this.initData();
      this.getNetData();
      // this.$refs.wallet_loadmore.onTopLoaded();
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
    onClick(index, title) {
      this.initData();
      let tab = document.getElementById("tab");
      let tabChild = tab.getElementsByClassName("tabChild");
      this.id = tabChild[index].getAttribute("id");
      this.getNetData();
    },
    getNetData() {
      let that = this;
      let json = { inoutFlag: this.id, page: 1 };
      $http
        .get(
          "plugin.dragon-deposit.frontend.lcg-merchant.Income-expenditure-details",
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
              this.isLoading = false;
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
        let json = { inoutFlag: this.id, page: this.page };
        $http
          .get(
            "plugin.dragon-deposit.frontend.lcg-merchant.Income-expenditure-details",
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
