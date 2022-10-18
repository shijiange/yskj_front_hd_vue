import cTitle from "components/title";
import {scrollMixin} from '../../../utils/mixin';
// import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      keyword:'',
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
      id:'',
      status:'',
      is_verify:'',
      now:'',
    };
  },
  activated() {
    this.id=this.$route.params.id;
    this.now=new Date(this.timestampToTime(new Date().valueOf()/1000)).valueOf()/1000;
    this.getStatus();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getSearch();
      }
    },
    getStatus(){
      let json={
        member_id:this.id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.status=response.data.getVerify.status;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSearch() {
      var that = this;
      let json={
        keyword:this.keyword,
        status:1,
        auc_status:'',
        is_new:'',
        is_recommend:'',
        auctioneer_id:this.id,
        art:'getSearch',
        page:this.page,
        is_pass:this.status?'1':'0'
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            that.total_page = response.data.getSearch.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.getSearch.data;
          } else {
            that.$dialog.alert({message:response.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toDetail(item){
      this.$router.push(this.fun.getUrl("auctionGood",{id:item.member_id,goods_id:item.goods_id}));
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "/";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
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
          keyword:this.keyword,
          status:1,
          auc_status:'',
          is_new:'',
          is_recommend:'',
          auctioneer_id:this.id,
          art:'getSearch',
          page:this.page,
          is_pass:this.status?'1':'0'
        };
        $http
          .get("plugin.auction.api.index.getAuctionData", json, "加载中")
          .then(
            function(response) {
              if (response.result === 1) {
                that.total_page = response.data.getSearch.last_page;
                that.loading = false;
                that.allLoaded = false;

                that.datas = that.datas.concat(response.data.getSearch.data);
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
