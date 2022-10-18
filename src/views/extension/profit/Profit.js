// import { Toast } from 'vant';
import cTitle from 'components/title';

const CHAIN_SHOP_INFO = "plugin.manual-bonus.frontend.index.statistics";
const CHAIN_SHOP_LIST = "plugin.manual-bonus.frontend.index.getList";

export default {
  data() {
    return {
      shop_amount: '',
      WXtitle: '',

      shopListArr: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  activated() {
    this.initData();
    this.getChainShopInfo();

  },

  mounted() {

  },
  methods: {
    initData() {
      this.shop_amount = '';
      this.WXtitle = '';
      this.initListData();
    },

    initListData() {
      this.shopListArr = [];
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getChainShopInfo() {
      $http.get(CHAIN_SHOP_INFO, {}, "加载中...").then(res => {
        if (res.result == 1) {
          this.shop_amount = res.data.amount_total;
          this.WXtitle = res.data.plugin_name;
          this.fun.setWXTitle(this.WXtitle);
          this.getShopList();
        } else {
          this.$dialog.alert({message:res.msg});
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getShopList() {
      $http.get(CHAIN_SHOP_LIST, {page: this.page}).then(res => {
        if (res.result == 1) {
          this.total_page = res.data.last_page;
          this.shopListArr = res.data.data;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreShopList() {

      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        this.loading = true;
        this.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http.get(CHAIN_SHOP_LIST, {page: this.page}, '加载中...').then(res => {
          if (res.result == 1) {
            this.loading = false;
            this.allLoaded = false;
            this.shopListArr = this.shopListArr.concat(res.data.data);//数组拼接

          } else {
            this.page = this.page - 1;
            this.loading = true;
            this.allLoaded = true;
            this.isLoadMore = false;
            return;
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },

    loadTop() {
      this.initListData();
      this.getShopList();
      this.$refs.shop_loadmore.onTopLoaded();
    },

    loadBottom() {
      if (this.isLoadMore) {
        this.getMoreShopList();
        this.$refs.shop_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },

  },
  components: {cTitle}
};