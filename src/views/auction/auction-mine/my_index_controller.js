import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      info:{},
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    toIntergal(){
      this.$router.push(this.fun.getUrl("auctionLove"));
    },
    toCollect(){
      this.$router.push(this.fun.getUrl("auctionCollect"));
    },
    toAuction(id){
      this.$router.push(this.fun.getUrl("myAuction",{id:id}));
    },
    //获取数据
    getData() {
      let json={
        art:'auctioneer'
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.info=response.data.auctioneer;
          } else {
            this.$dialog.alert({message:res.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  components: {
    cTitle
  }
};
