import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      child_agent_count:0,
      child_order_price:0,
      child_order_count:0,
      child_agent_count_percentage:0,
      child_order_price_percentage:0,
      child_order_count_percentage:0,
      info:{},
      active:0,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init(){
      //more
      this.isLoadMore= true;
      this.page= 1;
      this.total_page= 0;
    },
    getData(){
      $http
        .post('plugin.channel.frontend.my-child.index',{level:this.active ==0?1:2},"").then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.my_childs.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.info = response.data.my_childs.data;
            this.child_agent_count = Number(response.data.child_agent_count);
            this.child_order_price = Number(response.data.child_order_price);
            this.child_order_count = Number(response.data.child_order_count);
            this.child_agent_count_percentage = this.setPercentage(this.child_agent_count);
            this.child_order_price_percentage = this.setPercentage(this.child_order_price);
            this.child_order_count_percentage = this.setPercentage(this.child_order_count);
          } else {
            this.$dialog.alert({message:response.msg});
            this.$router.push(this.fun.getUrl('distributor_index'));
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
          page: this.page,
          level:this.active ==0?1:2
        };
        $http.get("plugin.channel.frontend.my-child.index",json,"").then((response)=> {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.my_childs.data;
            that.info = that.info.concat(myData); //数组拼接
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
    setPercentage(value){
      // 计算百分比
      if(value == 0){
        return 0;
      }
      if(value>0&&value<100){
        return (Math.round(value / 100 * 10000) / 100.00);// 小数点后两位百分比
      }else if(value>100&&value<1000){
        return (Math.round(value / 1000 * 10000) / 100.00);
      }else if(value>1000&&value<10000){
        return (Math.round(value / 10000 * 10000) / 100.00);
      }else if(value>10000&&value<100000){
        return (Math.round(value / 100000 * 10000) / 100.00);
      }else if(value>100000&&value<1000000){
        return (Math.round(value / 1000000 * 10000) / 100.00);
      }else{
        return (Math.round(value / 100000000 * 10000) / 100.00);
      }
    }
  },
  components: { cTitle }
};
