// import { mapState, mapMutations } from 'vuex';
import cTitle from '../../components/title';
import { scrollMixin } from 'utils/mixin';
// var haveShop = false;

// var intervalid;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 'first',
      url: '',
      list: [],
      total: 0,
      total_price: '0',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  mounted() {},
  methods: {
    initData() {
      this.activeName = 'first';
      this.url = '';
      this.list = [];
      this.total = 0;
      this.total_price = '0';

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    handleClick(x,i) {
		
      switch (x) {
      case 'first':
        this.url = 'plugin.store-cashier.frontend.cashier.income.today';
        break;
      case 'second':
        this.url = 'plugin.store-cashier.frontend.cashier.income.yesterday';
        break;
      case 'third':
        this.url = 'plugin.store-cashier.frontend.cashier.income.last-month';
        break;
      case 'fourth':
        this.url = 'plugin.store-cashier.frontend.cashier.income.this-month';
        break;
      default:
        break;
      }
      this.isLoadMore = false;
      $http.get(this.url).then(
        response => {
          if (response.result == 1) {
            this.list = response.data.data;
            this.total = response.data.total;
            this.total_price = response.data.total_price;

            this.page = response.data.current_page;
            this.total_page = response.data.last_page;
            console.log(this.page, this.total_page);
          } else {
            this.$dialog.alert({message:response.msg});
        
          }
          this.isLoadMore = true;
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            this.url,
            {
              page: that.page
            },
            ''
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.list = that.list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
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
  activated() {
    this.initData();
    this.handleClick('first');
  },
  created() {},

  beforeDestroy() {},

  watch: {},

  components: { cTitle }
};
