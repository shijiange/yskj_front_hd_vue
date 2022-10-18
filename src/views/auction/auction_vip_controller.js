import cTitle from "components/title";
import {scrollMixin} from '../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show:false,
      status:1,
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
      keyword:'',
      show1:false,
      password:'',
      dataInfo:{},
      total:0
    };
  },
  activated() {
    this.initData();
    this.getSearch();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getSearch();
      }
    },
    toDetail(item){
      this.$router.push(this.fun.getUrl("auctionGood",{id:item.member_id,goods_id:item.goods_id}));
    },
    initData(){
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
      this.datas=[];
      this.keyword='';
      this.show1=false;
      this.password='';
      this.total=0;
      this.dataInfo={};
    },
    select(id){
      this.status=id;
      this.show=false;
      this.initData();
      this.getSearch();
    },
    yanzhen(item){
      this.dataInfo=item;
      if(item.is_verify==1){
        this.$router.push(this.fun.getUrl("auctioneerShop",{id:this.dataInfo.member_id}));
      }else{
        this.show1=true;
      }
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
    confirm(item){
      let json={art:'verifyPassword',auction_id:this.dataInfo.member_id,passwd:this.password};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.show1=false;
            this.$router.push(this.fun.getUrl("auctioneerShop",{id:this.dataInfo.member_id}));
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
        status:this.status,
        auc_status:'',
        is_new:'',
        is_recommend:'',
        auctioneer_id:'',
        art:'getSearch',
        page:this.page,
        is_pass:'1'
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
            that.total = response.data.getSearch.total;
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
          keyword:this.keyword,
          status:this.status,
          auc_status:'',
          is_new:'',
          is_recommend:'',
          auctioneer_id:'',
          art:'getSearch',
          page:this.page,
          is_pass:'1'
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
