import cTitle from 'components/title';
import cMyswipe from 'components/myswipe';
import { Toast } from 'vant';
import {scrollMixin} from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      banner: [],
      homeData: {},
      companyList: [],
      sortNum: 0,
      one_up: false,
      two_up: false,
      lang: {},

      sort: '',
      sort_field: '',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.initData();
    this.getLang();
    // this.getIndexData();
    this.getData();
  },
  computed: {},
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
    initData() {
      this.banner = [];
      this.homeData = {};
      this.companyList = [];
      this.sortNum = 0;
      this.one_up = false;
      this.two_up = false;

      this.sort = '';
      this.sort_field = '';

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getIndexData() {
      $http.fetchUrl('asset-details-home-page', {}, "加载中...").then((response) => {
        if (response.result === 1) {
          this.banner = response.data.banner_img;
          this.homeData = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
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
    toTransHome(event) {
      let subStr = new RegExp('trading_hall');
      let result = window.location.href.replace(subStr, "trans_home");
      event.preventDefault();
      location.replace(result);
    },
    toCompany(item) {
      this.$router.push(this.fun.getUrl('Assessment',{asset_id:item.asset_id}));
    },
    myAsset() {
      this.$router.push(this.fun.getUrl('MyAsset'));
    },
    toAll() {
      this.$router.push(this.fun.getUrl('AssetClassify'));
    },
    toBuying(item) {
      this.$router.push(this.fun.getUrl('Buying',{asset_id:item.id}, {name:'buy'}));
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      let json = {
        sort: this.sort,
        sort_field: this.sort_field,
      };
      $http.get('plugin.asset.Frontend.Modules.Trading.Controllers.page.index', json, "加载中...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.sell_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.companyList = response.data.sell_list.data;
          this.banner = response.data.slide_list;
          this.homeData = response.data.statistics;
        } else {
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
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('plugin.asset.Frontend.Modules.Trading.Controllers.page.index', {
          page: that.page
        }, '加载中...').then(function (response) {
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
  components: {cTitle, cMyswipe}
};
