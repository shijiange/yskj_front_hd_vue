import cTitle from "components/title";
import {scrollMixin} from '../../../utils/mixin';
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      uncertified_status:'',
      num:'',
      // info:'',
      status:'',
      id:'',
      activeName:'0',
      loading: false,
      allLoaded: false,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas:[],
      total:'',
      is_release_switch:'2',
      isLoading:false
    };
  },
  activated() {
    this.id=window.localStorage.uid;
    this.activeName="0";
    this.getStatus();
    // this.getData();  没用到
  },
  methods: {
    initData(){
      this.datas=[];
      this.page=1;
      this.total_page=0;
      this.total='';
      this.isLoadMore=true;
      this.allLoaded=false;
      this.loading=false;
    },
    getverifyGoods(){
      let json={art:'verifyGoods'};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.$router.push(this.fun.getUrl('auctionApply'));
          } else {
            if(response.msg.url.length>0){
              window.location.href=response.msg.url[0];
              this.$dialog.alert({message:response.msg.msg});
            }else{
              this.$dialog.alert({message:response.msg.msg});
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取数据
    // getData() {
    //   let json={
    //     art:'auctioneer'
    //   };
    //   $http
    //     .get(
    //       "plugin.auction.api.index.getAuctionData",json,"获取中"
    //     )
    //     .then(response => {
    //       if (response.result == 1) {
    //         this.info=response.data.auctioneer;
    //         this.renzhen_status=response.data.auctioneer.status;
    //       } else {
    //         this.$dialog.alert({message:response.msg});
    //
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    getNum(){
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",{art:'judgeNum'},"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.$router.push(this.fun.getUrl('publishFirst'));

          } else {
            this.getverifyGoods();
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
            this.uncertified_status=response.data.getAgreement.uncertified_status;
            this.is_release_switch=response.data.getAgreement.is_release_switch;
            this.getSearch();
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
    getSearch() {
      let url;
      if(this.activeName=='0'){
        url='plugin.auction.api.auction.check';
      }else if(this.activeName=='1'){
        url="plugin.auction.api.auction.biding";
      }else if(this.activeName=='2'){
        url="plugin.auction.api.auction.bid";
      }else if(this.activeName=='3'){
        url="plugin.auction.api.auction.finish";
      }
      let that = this;
      let json={
        auctioneer_id:this.id
      };
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
            for (var i = 0;i < response.data.data.length;i++) {
              response.data.data[i].edit_active = false;
            }
            that.datas = response.data.data;
            that.total=response.data.total;
            this.isLoading = false;
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
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let url;
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
                for (let i = 0;i < response.data.data.length;i++) {
                  response.data.data[i].edit_active = false;
                }
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
    loadTop() {
      this.initData();
      this.getSearch();
      // this.$refs.good_manage.onTopLoaded()
    },
    moreEvent(index) {
      if (this.datas[index].edit_active == false) {
        this.emptyEditActive();
        this.datas[index].edit_active = true;

      }else {
        this.emptyEditActive();
      }
    },

    Toedit(Id) {
      this.$router.push(this.fun.getUrl('publishFirst', {id: Id}));
    },
    toUp(Id,local) {
      let json={art:'upperLower',goods_id:Id,status:local==0?1:0};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.data.upperLower);
            this.getSearch();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    emptyEditActive() {
      for (var i = 0;i < this.datas.length;i++) {
        this.datas[i].edit_active = false;

      }
    },
    toPublish(){
      if(this.uncertified_status=='0'){
        Toast('未认证会员不允许发布拍品');
      }else{
        this.getNum();
      }

    },
    toDetail(item){
      this.$router.push(this.fun.getUrl("auctionGood",{id:item.auctioneer_id,goods_id:item.goods_id}));
    },
    commodityDelete(index) {
      let that = this;
      this.emptyEditActive();
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
            that.total = Number(that.total) - 1;
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
  },
  components: {
    cTitle
  }
};
