import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

let submitLoad;
let cart_ides = [];//购物车id合集
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      kwd: "",
      list:[],
      selectCheck: [],
      checked: false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.init();
    this.getData();
    this.getCartData();//获取购物车的信息
  },
  methods: {
    init(){
      cart_ides = [];
      this.kwd = "";
      this.list=[];
      this.selectCheck= [];
      this.checked= false;
      //more
      this.isLoadMore= true;
      this.page= 1;
      this.total_page= 0;
    },
    getCartData() {
      $http
        .post('plugin.channel.frontend.freedom-cart.index',{},"加载中").then(response => {
          if (response.result === 1) {
            let cartList = response.data;
            for (var i = 0; i < cartList.length; i++) {
              cart_ides.push(cartList[i].id);
            }
            if(cart_ides.length>0){
              this.clearCart();
            }
          } else {
            this.$dialog.alert({message:response.msg});
           
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearCart(){
      $http.get("plugin.channel.frontend.freedom-cart.destroy", {ids:cart_ides}, "").then(
        function(response) {
          if (response.result === 1) {
            console.log(response);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    addOrder(){
      if(this.fun.isTextEmpty(this.selectCheck)){
        Toast("请选择发货商品！");
        return;
      }
      submitLoad = Toast({
        duration: -1, // 持续展示 toast
        message: '下单中...'
      });

      for (let i = 0; i < this.selectCheck.length; i++) {
        let goodId = this.selectCheck[i].goods_id;
        let option_id = this.selectCheck[i].goods_option?this.selectCheck[i].goods_option.id:0;
        this.addCart(goodId,option_id,i);
      }

    },
    addCart(_gid,_opId,activeIndex){
      //添加购物车
      let that = this;
      $http.get("plugin.channel.frontend.freedom-cart.store",{ goods_id: _gid, total: 1, option_id: _opId },"加载中").then(function(response) {
        if (response.result === 1) {
          if(activeIndex+1 == that.selectCheck.length){
            submitLoad.clear();
            that.$router.push(that.fun.getUrl("deliverGoodsNext", {}));
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
    checkAll(tag){
      if(tag){
        this.$refs.checkboxGroup.toggleAll(true);
      }else{
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    toggleAll(){
      this.checked = false;
    },
    getData() {
      let json = {};
      if(this.kwd){
        json.kwd = this.kwd;
      }
      $http
        .post('plugin.channel.frontend.freedom.getGoodsList',json,"").then(response => {
          if (response.result === 1) {
            this.list = response.data.list.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            this.$dialog.alert({message:response.msg});
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get("plugin.channel.frontend.freedom.getGoodsList",json,"").then((response)=> {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.list = that.list.concat(myData); //数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        },
        function(response) {
          // error callback
        }
        );
      }
    },

    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
  },
  components: { cTitle }
};
