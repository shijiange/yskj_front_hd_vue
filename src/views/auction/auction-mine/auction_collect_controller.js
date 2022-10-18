import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
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
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getNetData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.datas = [];
    },
    toShop(item){
      this.$router.push(this.fun.getUrl("auctioneerShop",{id:item.auctioneer_id}));
    },
    getNetData() {
      let that = this;
      let json = { page: this.page,art:'collectionList' };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.total_page = response.data.collectionList.last_page;
              that.datas = response.data.collectionList.data;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    toCollect(item){
      let json={
        art:'collectionShop',
        auctioneer_id:item.auctioneer_id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast('取消收藏成功');
            this.getNetData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
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
        let json = { page: this.page,art:'collectionList' };
        $http
          .get(
            "plugin.auction.api.index.getAuctionData",
            json,
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                that.loading = false;
                that.allLoaded = false;
                that.datas = that.datas.concat(response.data.collectionList.data);
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: {
    cTitle
  }
};
