import cTitle from 'components/title';
import BScroll from 'better-scroll';
import {scrollMixin} from 'utils/mixin';
import { Toast } from 'vant';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      address_detail: '',
      showPopup: false,

      classify: [],
      companyList: [],
      chooseID: -1,
      sortNum: 0,
      one_up: false,
      two_up: false,

      sort: '',
      sort_field: '',
      category_id: '',
      asset_name: '',
      lang: {},

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
      this.address_detail = '';
      this.showPopup = false;

      this.companyList = [];
      this.chooseID = -1;
      this.sortNum = 0;
      this.one_up = false;
      this.two_up = false;

      this.sort = '';
      this.sort_field = '';
      this.category_id = '';
      this.asset_name = '';

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    //初始化
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
      });
    },
    showClass() {
      this.showPopup = !this.showPopup;
      this.$nextTick(() => {
        if (!this.cartScroll) {
          this._initScrollCart();
        } else {
          this.cartScroll.refresh();
        }
      });
    },
    // 点击控制排序
    toggle(num) {
      switch (String(num)) {
      //数量
      case '1':
        this.sortNum = 1;
        this.one_up = !this.one_up;
        this.one_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'total';
        break;
        //单价
      case '2':
        this.sortNum = 2;
        this.two_up = !this.two_up;
        this.two_up ? this.sort = 'asc' : this.sort = 'desc';
        this.sort_field = 'price ';
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
    searchAsset() {
      this.getData();
    },
    toCompany(item) {
      this.$router.push(this.fun.getUrl('Assessment',{asset_id:item.asset_id}));
    },
    goback() {
      this.$router.go(-1);
    },
    toBuying(item) {
      this.$router.push(this.fun.getUrl('Buying',{asset_id:item.id}, {name:'buy'}));
    },
    chooseClassify(index, item) {
      this.category_id = item.id;
      this.chooseID = index;
      this.showPopup = false;
      this.getData();
    },
    //刷新
    loadTop() {
      console.log('下拉刷新');
      this.initData();
      this.getData();
      this.$refs.loadmore.onTopLoaded();
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      let json = {
        sort: this.sort,
        sort_field: this.sort_field,
        category_id: this.category_id,
        asset_name: this.address_detail,
      };
      $http.get('plugin.asset.Frontend.Modules.Trading.Controllers.records.index', json, "加载中...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.sell_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.companyList = response.data.sell_list.data;
          this.classify = response.data.category_list;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {
        sort: this.sort,
        sort_field: this.sort_field,
        category_id: this.category_id,
        asset_name: this.address_detail,
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('plugin.asset.Frontend.Modules.Trading.Controllers.records.index', json, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.sell_list.data;
            that.companyList = that.companyList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });

      }
    },
  },
  components: {cTitle}
};
