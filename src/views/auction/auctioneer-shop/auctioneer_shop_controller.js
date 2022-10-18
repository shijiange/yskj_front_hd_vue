import cTitle from "components/title";
import {scrollMixin} from '../../../utils/mixin';
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show1:false,
      posterShow: false,
      posterImg: {},
      status:'',
      activeName:'0',
      id:'',
      passwd:'',
      info:{},
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
      is_verify:'',
      password:'',
      now:'',
    };
  },
  activated() {
    this.id=this.$route.params.id;

    this.now=new Date(this.timestampToTime(new Date().valueOf()/1000)).valueOf()/1000;
    this.getStatus();
  },
  methods: {
    toDetail(item){
      this.$router.push(this.fun.getUrl("auctionGood",{id:item.auctioneer_id,goods_id:item.goods_id}));
    },
    confirm(){
      let json={art:'verifyPassword',auction_id:this.id,passwd:this.password};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.show1=false;
            this.getStatus();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
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
            this.is_verify=response.data.getVerify.is_verify;
            if(this.is_verify==0&&this.status==1){
              this.show1=true;
            }else{
              this.is_verify=1;
              this.getData();
              this.getSearch();

            }

          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData(){
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
      this.datas=[];
      this.now='';
    },
    toMy(){
      this.$router.push(this.fun.getUrl("myIndex"));
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
    toSearch(){
      this.$router.push(this.fun.getUrl("auctioneerShopSearch",{id:this.id}));
    },
    //海报生成
    // postShow() {
    //   if(!this.fun.isTextEmpty(this.posterImg.base64Image)){
    //     this.posterShow = true;
    //   }else{
    //     let toastPoster = Toast({
    //       duration: -1, // 持续展示 toast
    //       message: '正在为您生成海报中'
    //     });
    //     $http
    //       .get(
    //         "goods.goods-poster.generate-goods-poster",
    //         { id: '752'},
    //         ""
    //       )
    //       .then(response => {
    //         toastPoster.clear();
    //         if (response.result == 1) {
    //           this.posterImg = response.data;
    //           this.posterShow = true;
    //         } else {
    //           this.posterShow = false;
    //
    //         }
    //       })
    //       .catch(error => {
    //         toastPoster.clear();
    //         console.log(error);
    //       });
    //   }
    // },
    //获取数据
    getData() {
      let that=this;
      let json={member_id:this.id,art:'shop'};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            that.info=response.data.shop;
          } else {
            that.$dialog.alert({message:response.msg}).then(()=>{
              that.$router.go(-1);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSearch() {

      var url;
      if(this.activeName=='0'){
        url='plugin.auction.api.auction.all';
      }else if(this.activeName=='1'){
        url="plugin.auction.api.auction.biding";
      }
      else if(this.activeName=='2'){
        url="plugin.auction.api.auction.bid";
      }
      else if(this.activeName=='3'){
        url="plugin.auction.api.auction.finish";
      }
      var that = this;
      let json={
        auctioneer_id:this.id
      };
      console.log(url);
      $http
        .post(
          url,json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
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
        var url;
        if(this.activeName=='0'){
          url='plugin.auction.api.auction.check';
        }else if(this.activeName=='1'){
          url="plugin.auction.api.auction.biding";
        }
        else if(this.activeName=='2'){
          url="plugin.auction.api.auction.bid";
        }
        else if(this.activeName=='3'){
          url="plugin.auction.api.auction.finish";
        }
        else if(this.activeName=='4'){
          url="plugin.auction.api.auction.failure";
        }
        let json={
          auctioneer_id:this.id
        };
        $http
          .post(url, json, "加载中")
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
    toCollect(){
      let json={
        art:'collectionShop',
        auctioneer_id:this.id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.data.collectionShop);
            this.getData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClick(){
      this.initData();
      this.getSearch();
    },
  },
  components: {
    cTitle
  }
};
