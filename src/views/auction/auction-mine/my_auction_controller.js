import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: "0",
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      name:'',
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
      if(from.name=='auctionOrderlist'){
        vm.activeName='0',
        vm.initData();
        vm.getSearch();
      }else{
        vm.initData();
        vm.activeName=String(vm.$route.params.id);
        vm.getSearch();
      }
    });
  },
  activated() {
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
    handleClick() {
      this.initData();
      this.getSearch();
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      // let s = this.change(date.getSeconds());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    toDetail(item){
      this.$router.push(this.fun.getUrl("auctionGood",{id:item.member_id,goods_id:item.goods_id}));
    },
    toBuy(item){

      this.$router.push(
        this.fun.getUrl("goodsorder", {}, {
          tag: 'auction',
          goodsId: item.goods_id,
          total: 1,
          fixed_price:0,
          auction_sn:item.auction_sn
        })
      );
    },
    commodityDelete(index) {
      let that = this;
      this.$dialog.confirm({
        title: "提示",
        message: '此操作将永久删除该拍品, 是否继续?',
      }).then(() => {
        // on confirm

        let json = {goods_id: that.datas[index].goods_id,art:'delGoods'};
        let urls = 'plugin.auction.api.index.getAuctionData';
        $http.post(urls, json).then(function (response) {
          if (response.result == 1) {
            // that.$message({
            // 	message: '商品删除成功',
            // 	type: 'success'
            // })
            that.$notify({
              background: '#f0f9eb',
              message: '拍品删除成功',
              color: '#67c23a'
            });

            that.datas.splice(index, 1);

          }else {
            // that.$message.error(response.msg)
            that.$notify(response.msg);
          }
        }, function (response) {});
      }).catch(() => {
        // on cancel
        this.$notify({
          background: '#edf2fc',
          message: '已取消删除',
          color: '#909399'
        });
      });

    },
    getSearch() {
      var url;
      if(this.activeName=='0'){
        url="plugin.auction.api.bid-order.prepayment";
      }
      else if(this.activeName=='1'){
        url="plugin.auction.api.bid-order.biding";
      }
      else if(this.activeName=='2'){
        url="plugin.auction.api.bid-order.bide";
      }
      else if(this.activeName=='3'){
        url="plugin.auction.api.bid-order.finish";
      }
      else if(this.activeName=='4'){
        this.$router.push(this.fun.getUrl('auctionOrderlist',{ status: '0', orderType: 'auction' }));
        return;
      }
      var that = this;
      $http
        .post(
          url,{},"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
            that.total=response.data.total;
          } else {
            that.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData(page) {
      let that = this;
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
        var url;
        if(this.activeName=='0'){
          url="plugin.auction.api.bid-order.prepayment";
        }
        else if(this.activeName=='1'){
          url="plugin.auction.api.bid-order.biding";
        }
        else if(this.activeName=='2'){
          url="plugin.auction.api.bid-order.bid";
        }
        else if(this.activeName=='3'){
          url="plugin.auction.api.bid-order.finish";
        }
        else if(this.activeName=='4'){
          this.$router.push(this.fun.getUrl('auctionOrderlist',{ status: '0', orderType: 'auction' }));
          return;
        }
        $http
          .post(url, {}, "加载中")
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
                return;
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
