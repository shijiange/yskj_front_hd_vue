import cTitle from 'components/title';
import { Toast } from 'vant';

export default {

  data() {
    return {
      order_id: '',
      truck_list: [],
      value_list: [],
      order_list: [],

      //加载更多
      isLoading: false,
      isLoadMore: true,
      total_page: 0,
      page: 1,
    };
  },


  activated() {
    this.getTuck();
    this.getOrder_list();
  },
  methods: {
    toUrl(item) {
      window.location.href = item.value;
    },
    getTuck() {
      if (!this.isLoadMore || this.isLoading) {
        return;
      }
      this.isLoading = true;

      $http.get('plugin.virtual-card.frontend.order.virtualCardList', {
        order_id: this.$route.params.order_id,
        page: this.page
      }, '加载中...').then((res) => {
        if (res.result === 1) {
          this.isLoading = false;

          // 解构出总页数和所有数据
          const {
            data
          } = res.data;
          let resData = [];
          this.truck_list = [...this.truck_list, ...data];
          this.truck_list.forEach(value => {
            resData.push(value);
          });
          this.value_list = resData;
        }
        if (res.data.total == this.page) {
          this.isLoadMore = false;
        }
        this.page = this.page + 1;
      }).catch((error) => {
        console.log(error);
      });
    },
    getOrder_list() {
      $http.get('order.detail', {
        order_id: this.$route.params.order_id
      }, '加载中...').then((res) => {
        if (res.result === 1) {
          this.order_list = res.data;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    //复制卡密
    onCopy: function (e) {
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: '复制失败',
        position: 'bottom',
        duration: 1000
      });
    }
  },
  components: {
    cTitle
  }

};
