// import { Toast } from 'vant';
import cTitle from 'components/title';
import { scrollMixin } from "../../../utils/mixin";

const CHAIN_SHOP_INFO = "plugin.store-cashier.frontend.boss.center.index";
const CHAIN_SHOP_LIST = "plugin.store-cashier.frontend.boss.center.getChildStoreList";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      shop_info: {},
      shop_amount: {},
      bossId: 0,

      shopListArr: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      income_name_text: "",
      isLoading:false
    };
  },

  activated() {
    this.initData();
    this.getChainShopInfo();
    this.customizeIncome();
  },

  mounted() {

  },
  methods: {
    initData() {
      this.shop_info = {};
      this.shop_amount = {};
      this.bossId = 0;
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
    //验证手机身份
    gotoIncome() {
      let that = this;
      $http.get('member.member.withdrawByMobile', {}, '').then(function (response) {

        if (response.result == 1) {
          if (response.data.is_bind_mobile == 1) {
            that.$router.push(that.fun.getUrl('withdrawEditmobile', {}));
          } else {
            that.$router.push(that.fun.getUrl('withdrawal', {}));
          }
        } else {
          that.$dialog.alert({message:response.msg});
         
        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});
       
      });
    },
    getChainShopInfo() {
      $http.get(CHAIN_SHOP_INFO, {}, "加载中...").then(res => {
        if (res.result == 1) {
          this.shop_info = res.data.store_boss.has_one_member;
          this.shop_amount = res.data.statistics;
          this.bossId = res.data.store_boss.id;
          this.getShopList(this.bossId);
        } else {
          this.$dialog.alert({message:res.msg});
       
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getShopList(value) {
      $http.get(CHAIN_SHOP_LIST, {page: this.page, boss_id: value}).then(res => {
        if (res.result == 1) {
          this.total_page = res.data.last_page;
          this.shopListArr = res.data.data;
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreData() {

      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        this.loading = true;
        this.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http.get(CHAIN_SHOP_LIST, {boss_id: this.bossId, page: this.page}, '加载中...').then(res => {
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
      this.getShopList(this.bossId);
      // this.$refs.shop_loadmore.onTopLoaded();
    },

    loadBottom() {
      if (this.isLoadMore) {
        this.getMoreShopList(this.bossId);
        this.$refs.shop_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },

    goToShop(value) {
      this.$router.push(this.fun.getUrl('ChainShopInfo', {id: value}));
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: {cTitle}
};