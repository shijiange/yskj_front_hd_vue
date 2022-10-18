import cTitle from "components/title";
import {scrollMixin} from '../../utils/mixin';
// import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      rotation:[],
      recommend:[],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],

    };
  },
  mounted() {
    window.scrollTo(0,0); //页面向上滚动
    this.getData();
    this.getNew();
    this.now=new Date(this.timestampToTime(new Date().valueOf()/1000)).valueOf()/1000;
  },
  methods: {
    initData() {
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.datas = [];
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
    toMore(){
      this.$router.push(this.fun.getUrl("auctionMore"));
    },
    toSearch(){
      this.$router.push(this.fun.getUrl("auctionSearch"));
    },
    toDetail(item){
      let kid = item.member_id?item.member_id:item.auctioneer_id;
      this.$router.push(this.fun.getUrl("auctionGood",{goods_id:item.goods_id,id:kid}));
    },
    toMy(){
      this.$router.push(this.fun.getUrl("myIndex"));
    },
    //获取数据
    getData() {
      let json={
        art:'index'
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.rotation=response.data.index.rotation;
            this.recommend=response.data.index.recommend;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNew() {
      var that = this;
      let json={
        keyword:'',
        status:1,
        auc_status:'',
        is_new:1,
        is_recommend:'',
        auctioneer_id:'',
        art:'getSearch',
        page:this.page,
        is_pass:'0'
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
          keyword:'',
          status:'1',
          auc_status:'',
          is_new:1,
          is_recommend:'',
          auctioneer_id:'',
          art:'getSearch',
          page:this.page,
          is_pass:'0'
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
