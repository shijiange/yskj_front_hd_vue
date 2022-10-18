import cTitle from "components/title";
export default {
  data() {
    return {
      goods_id:'',
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
    };
  },
  activated() {
    this.goods_id=this.$route.params.goods_id;
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      let json={
        goods_id:this.goods_id,
        page:this.page
      };
      $http
        .get(
          "plugin.auction.api.bid.bid-record",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData(page) {
      var that = this;
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        console.log("getMoreData", this.total_page);
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let json={
          goods_id:this.goods_id,
          page:this.page
        };
        $http
          .get("plugin.auction.api.bid.bid-record", json, "加载中")
          .then(
            function(response) {
              if (response.result === 1) {
                that.total_page = response.data.last_page;
                that.loading = false;
                that.allLoaded = false;

                that.datas = that.datas.concat(response.data.data);
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
    },
  },
  components: {
    cTitle
  }
};
