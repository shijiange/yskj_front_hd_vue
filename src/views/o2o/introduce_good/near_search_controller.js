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
      total_page: 0,
      result:[],
      kwd:'',
      store_id:'',
      show_num:''
    };
  },
  activated() {
    this.initData();
    if(this.$route.params.keyword!=undefined){
      this.kwd=this.$route.params.keyword;
    }
    this.store_id=this.$route.params.store_id;
    this.getNum();
    this.search();  
  },
  methods: {
    getNum(){
      let that = this;
      let json = {store_id:this.store_id };
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
            } else {
              that.$dialog.alert({message:response.msg});
            
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    initData(){
      this.datas=[];
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
      this.result=[];
    },
    add(){
      let json={store_id:this.store_id,choose_goods:this.result};
      $http
        .post(
          "plugin.nearby-store-goods.frontend.controllers.goods.index",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              Toast(response.msg);
             
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    search(){
      this.initData();
      let that=this;
      let json={kwd:this.kwd,store_id:this.store_id,page:this.page};
      $http
        .post(
          "plugin.store-cashier.frontend.store.goods.get-goods-by-kwd",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.datas=response.data.data;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
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
        let json ={kwd:this.kwd,store_id:this.store_id,page:this.page};
        $http
          .post(
            "plugin.store-cashier.frontend.store.goods.get-goods-by-kwd",
            json,
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
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
    }
  },
  components: {
    cTitle
  }
};
