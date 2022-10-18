import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      sid:0,  //选择的ID
      goods_id:0, //选择对于的商品id
      member_agent_level:0,   //选择商品的等级
      price:0,    //选择商品的价格

      listData:[],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

    };
  },
  created() {
    this.getDate();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    choice(item){
      this.sid = item.id;
      this.goods_id = item.goods_id;
      this.member_agent_level = item.agent_level;
      this.price = item.deposit;
    },
    //获取数据
    getDate() {
      $http
        .get("plugin.store-business-alliance.frontend.index.task-list", {})
        .then(response => {
          if (response.result != 1) return Toast(response.msg);
          console.log(response.data);
          this.listData = response.data.data;
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //加载更多数据
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.store-business-alliance.frontend.index.task-list",{
            page:this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              this.listData = this.listData.concat(nextPageData);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    send(){
      if(this.sid==0) return Toast("请选择任务");
      let json = {
        dispatch_type_id:0,
        goods:[{goods_id:this.goods_id,total:1}],
        member_agent_level:this.member_agent_level,
        price:this.price 
      };
      $http
        .post("plugin.store-business-alliance.frontend.create",json,"")
        .then(res => {
          console.log(res);
          if(res.result !=1 ) return Toast(res.msg);
          //未支付 跳转到支付
          this.$router.push(
            this.fun.getUrl("orderpay", {
              status: "2",
              order_ids: res.data.order_ids //-----------------等待后端接口弄好返回----------------------------
            })
          );
        });
    }
  }
};
