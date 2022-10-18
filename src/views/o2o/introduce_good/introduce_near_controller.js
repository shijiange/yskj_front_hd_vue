import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      id:'',
      show_num:''
    };
  },
  activated() {
    this.initData();
    this.id=this.$route.params.store_id;
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
      this.id="";
      this.show_num='';
    },
    getNetData() {
      let that = this;
      let json = {store_id:this.id };
      $http
        .get(
          "plugin.store-cashier.frontend.store.near-by-goods.get-store-goods",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.show_num=response.data.show_num;
              that.datas = response.data.list;
            } else {
              that.$dialog.alert({message:response.msg});
          
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    del(item){
      let that = this;
      let json = {store_id:this.id,goods_id:item.id };
      $http
        .get(
          "plugin.nearby-store-goods.frontend.controllers.goods.delete-good",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              Toast(response.msg);
              this.getNetData();
            } else {
              // 判断权限
              if (response.data.url) {
                that.$notify(response.msg);
                window.location.href = response.data.url;
                return 0;
              }
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    toAdd(){
      this.$router.push(this.fun.getUrl('addNear',{id:this.id}));
    }
  },
  components: {
    cTitle
  }
};
