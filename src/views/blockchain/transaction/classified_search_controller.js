import cTitle from 'components/title';
import { Toast } from 'vant';
import BScroll from 'better-scroll';
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showClassify: false,
      classify: [],
      companyList: [],
      chooseID: '',
      sortNum: 0,
      one_up: false,
      two_up: false,
      three_up: false,
      address_detail: '',
      sort_field: '',
      sort: '',
      lang: {
        subscription_name: ''
      },

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },
  activated() {
    this.initData();
    this.getLang();
    this.chooseID = this.$route.params.class_id;
    this.getData();
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    searchGoods(event) {
      if (event.keyCode == 13) { //如果按的是enter键 13是enter
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.getData();
      }
    },
    initData() {
      this.showClassify = false;
      this.classify = [];
      this.companyList = [];
      this.chooseID = '';
      this.sortNum = 0;
      this.one_up = false;
      this.two_up = false;
      this.three_up = false;
      this.address_detail = '';
      this.sort_field = '';
      this.sort = '';

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    toggle(num) {
      switch (String(num)) {
      //资产总量
      case '1':
        this.sortNum = 1;
        this.one_up = !this.one_up;
        this.one_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'total ';
        break;
        //发放数量
      case '2':
        this.sortNum = 2;
        this.two_up = !this.two_up;
        this.two_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'publish';
        break;
        //认购单价
      case '3':
        this.sortNum = 3;
        this.three_up = !this.three_up;
        this.three_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'price';
        break;
      default:
        this.sortNum = 1;
        this.one_up = !this.one_up;
        this.one_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'total';
        break;
      }
      this.getData();
    },
    toCompany(item) {
      this.$router.push(this.fun.getUrl('Assessment', {asset_id: item.id}));
    },
    goback() {
      this.$router.go(-1);
    },
    chooseClassify(item) {
      if (!item) {
        this.chooseID = '';
      } else {
        this.chooseID = item.id;
      }

      this.showClassify = false;
      this.getData();
    },
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
      });
    },
    showClass() {
      this.showClassify = !this.showClassify;
      this.$nextTick(() => {
        if (!this.cartScroll) {
          this._initScrollCart();
        } else {
          this.cartScroll.refresh();
        }
      });
    },
    //刷新
    loadTop() {
      console.log('下拉刷新');
      this.initData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      let json = {
        category_id: this.chooseID,
        sort_field: this.sort_field,
        sort: this.sort,
        asset_name: this.address_detail,
      };

      $http.get('plugin.asset.Frontend.Modules.Capital.Controllers.Records.index', json, "加载中...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.companyList = response.data.page_list.data;
          this.classify = response.data.category_list;
          this.isLoading = false;
        } else {
          Toast(response.msg);
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {
        category_id: this.chooseID,
        sort_field: this.sort_field,
        sort: this.sort,
        asset_name: this.address_detail,
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('plugin.asset.Frontend.Modules.Capital.Controllers.Records.index', json, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            that.companyList = that.companyList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
          console.log(response.msg);
        });

      }
    },
  },
  components: {cTitle}
};
