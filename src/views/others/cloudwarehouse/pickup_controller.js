
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      goods_id: '',
      info: {
        dispatch_type:[]
      },
      active: '',
      sum: 1
    };
  },
  methods: {
    shiftTo() {
      var that = this;
      $http
        .get(
          "plugin.cloud-warehouse.frontend.warehouse-goods-manage.moving-to-seal",
          {
            goods_id: that.goods_id,
            sum: this.sum
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.$router.go(-1);
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      var that = this;
      $http
        .get(
          "plugin.cloud-warehouse.frontend.warehouse-goods-manage.warehouse-goods-info",
          {
            goods_id: that.goods_id
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.info = response.data;
          } else {
            this.$router.go(-1);//返回上一层
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goOrder(id,tag,ind){
      if(this.active == 1){
        if(this.sum > this.info.deposit_stock){
          Toast('库存不足');
          return;
        }
      }
      //普通商品
      this.$router.push(
        this.fun.getUrl('cloudOrder', {
          tag: tag,
          goodsId: id,
          optionsId: '',
          total: this.sum,
          is_selected:ind
        })
      );
    }
  },
  activated() {
    this.goods_id = this.$route.params.id;
    this.active = this.$route.params.active;
    console.log(this.active);
    this.getData();
  },
  components: { cTitle }
};