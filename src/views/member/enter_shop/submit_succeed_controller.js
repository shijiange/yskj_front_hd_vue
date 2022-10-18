import cTitle from 'components/title';
// import { Toast } from 'vant';

export default {
  data() {
    return {
      enter_goods: {}
    };
  },


  activated() {
    this.order_success();
  },

  methods: {
    order_success(){
      $http.get('plugin.enter-goods.frontend.order.success',{
        order_id: this.$route.query.order_id,
        goods_id: this.$route.query.goods_id
      },'加载中...').then((res)=>{
        this.enter_goods = res.data.enter_goods;
      });
    }
  },
  components: { cTitle }

};