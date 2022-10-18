import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  activated() {
    this.list = [];
    this.isLoadMore = true;
    this.page = 1;
    this.total_page = 0;
    this.getData();//获取数据
  },

  methods: {

    //获取数据
    getData() {
      let that = this;
      let json = {};
      let url = '';
      if (that.$route.params.type == 1) {
        url = 'plugin.merchant.frontend.store.list.storeListByStaff';
      }
      else if (that.$route.params.type == 2) {
        url = 'plugin.merchant.frontend.store.list.storeList';
      }
      $http.get(url, json, "获取中").then(function (response) {
        console.log(response.data);
        if (response.result == 1) {
          that.list = response.data.store_list.data;
          that.total_page = response.data.store_list.last_page;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },

    toShop(id, str) {
      if (str === 'hotel') {
        this.$router.push(this.fun.getUrl("HotelHome", { id: id, fromHome: 1 }));
      } else if (str === 'store') {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: id, fromHome: 1 }));
      } else if (str === 'supplier') {
        this.$router.push(this.fun.getUrl("SupplierShop", { id: id, fromHome: 1 }));
      }
    },
    //获取更多数据
    getMoreData() {
      let url = '';
      this.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        if (this.$route.params.type == 1) {
          url = 'plugin.merchant.frontend.store.list.storeListByStaff';
        }
        else if (this.$route.params.type == 2) {
          url = 'plugin.merchant.frontend.store.list.storeList';
        }
        $http.get(url, {
          page: this.page
        }, '加载中').then(response => {
          this.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.store_list.data;
            this.list = this.list.concat(myData);//数组拼接
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
  },
  components: { cTitle }

};
