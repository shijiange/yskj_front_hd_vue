import cTitle from 'components/title';
import { Toast } from 'vant';

const documentElement = document.documentElement;
const body = document.body;
export default {
  data() {
    return {
      show1: false,
      earningList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      plugin_type: '',
      plugin_text:"",

      //广告
      adv_thumb: '',
      adv_url: '',
      income: 0,
      income_name_text: "",
      reward_type:''
    };
  },
  activated() {
    this.initData();
    this.plugin_type = this.$route.query.plugin_type;
    this.plugin_text = this.$route.query.plugin_text;
    if (!this.plugin_type) {
      this.$router.push(this.fun.getUrl('extension', {}));
    }
    this.getData();
    window.addEventListener('scroll', this.handleScroll);
    this.customizeIncome();
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    toAdvertising() {
      if (this.adv_url) {
        window.location.href = this.adv_url;
      }
      this.show1 = false;
    },
    getAdvertising(id) {
      let that = this;
      this.adv_thumb = '';
      this.adv_url = '';
      this.income = 0;
      $http.get('finance.plugin-settle.income-receive', {
        plugin_type: that.plugin_type,
        id: id
      }, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.adv_thumb = response.data.adv_thumb;
          that.adv_url = response.data.adv_url;
          that.income = response.data.income_data.amount;
          that.show1 = true;
          if(response.data.income_data&&response.data.income_data.reward_type){
            that.reward_type=response.data.income_data.reward_type;
          }
          that.getData();
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    //获取数据
    getData() {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      that.page = 1;
      $http.get('finance.plugin-settle.get-not-settle-list', {plugin_type: that.plugin_type}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.earningList = response.data.data;
        } else {
          that.earningList = response.data;
          // Toast(response.msg);
          // that.$router.push(that.fun.getUrl('extension', {}));
        }
      }, function (response) {
        console.log(response);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('finance.plugin-settle.get-not-settle-list', {
          plugin_type: that.plugin_type,
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.earningList = that.earningList.concat(myData);//数组拼接

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
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if ((this.getScrollTop() + this.getClientHeight() + 105) > this.getScrollHeight()) {
        // console.log('下拉刷新了')
        //此处发起请求
        if (this.isLoadMore) {
          this.getMoreData();
        } else {
          console.log('没有更多数据');
        }
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.show1 = false;
      this.earningList = [];
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
