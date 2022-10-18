import cTitle from 'components/title';
import { Toast } from 'vant';

const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      nickname: '',
      avatar: '',
      summarizing: {},
      getDataApi: '',

      rewardList: [],
      activeName: 'shop',
      chooseName: 'queue',
      status: '',
      chooseId: '',
      chooseRatio: '',
      msg: '',
      typeData: {},
      WXtitle: '',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      // 兑换类型 1=>积分 2=>爱心值
      type: '',
      convertType: '',
      convertTypeId: 0,
      convertTypeUnit: 0,
      convertTypeExchange_count: 0,
      exchangeLogs: {},

      exchange_name: '',

    };
  },
  activated() {
    this.getTitle();
    this.initData();
    this.getData(this.activeName, 'plugin.share-chain.frontend.queue.getList');
    this.getUser();
    this.getHomeInfo();
    window.addEventListener('scroll', this.handleScroll);
  },
  created() {
    this.getName();
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    toDetail() {
      this.$router.push(this.fun.getUrl('RewardDetail'));
    },
    toProcess(item) {
      this.$router.push(this.fun.getUrl('RewardProcess', {source_code: this.activeName, queue_id: item.id}));
    },
    showComplete(obj) {
      this.$set(obj, "show", true);
    },
    getName() {
      // 自定义name
      const that = this;
      $http.get('plugin.share-chain.frontend.exchange-name.index', {}, " ").then(function (response) {
        if (response.result === 1) {
          that.exchange_name = response.data.exchange_name;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    getTitle() {
      //兑换操作
      const that = this;
      $http.get('plugin.share-chain.frontend.plugin-name.index', {}, "兑换中...").then(function (response) {
        if (response.result === 1) {
          that.WXtitle = response.data.plugin_name;
          that.fun.setWXTitle(that.WXtitle);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    chooseType(convertType) {
      // 根据选择类型显示弹框
      if (convertType.code === 1) {
        this.convertType = this.typeData.modules.point.name;
        this.convertTypeId = this.typeData.modules.point.code;
        this.convertTypeUnit = this.typeData.modules.point.unit;
        this.convertTypeExchange_count = this.typeData.modules.point.exchange_count;
      } else if (convertType.code === 2) {
        this.convertType = this.typeData.modules.love.name;
        this.convertTypeId = this.typeData.modules.love.code;
        this.convertTypeUnit = this.typeData.modules.love.unit;
        this.convertTypeExchange_count = this.typeData.modules.love.exchange_count;
      }
    },
    exchange(item) {
      const that = this;
      this.chooseId = item.id;
      this.convertType = '';
      this.convertTypeId = 0;
      this.convertTypeUnit = 0;
      this.convertTypeExchange_count = 0;
      $http.get('plugin.share-chain.frontend.exchange.index', {
        source_code: that.activeName,
        queue_id: item.id,
      }, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.show3 = true;
          that.typeData = response.data;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    SureExchange() {
      //兑换操作
      const that = this;
      $http.get('plugin.share-chain.frontend.exchange.handle', {
        source_code: that.activeName,
        queue_id: that.chooseId,
        exchange_code: that.convertTypeId
      }, "兑换中...").then(function (response) {
        if (response.result === 1) {
          that.show3 = false;
          that.getData(that.activeName, 'plugin.share-chain.frontend.queue.getList');
          Toast(response.msg);
        } else {
          that.show3 = false;
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    exchangeLog(item) {
      const that = this;
      // console.log(item);
      $http.get('plugin.share-chain.frontend.exchange.log', {
        source_code: that.activeName,
        queue_id: item.id
      }, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.show4 = true;
          that.exchangeLogs = response.data;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    luckyDraw(item) {
      // 抽奖
      this.show1 = true;
      this.chooseId = item.id;
      this.chooseRatio = item.ratio;
    },
    sureTake(item) {
      // 确认抽奖
      const that = this;
      // console.log(item);
      $http.get('plugin.share-chain.frontend.lucky.handle', {
        source_code: that.activeName,
        queue_id: that.chooseId
      }, "抽奖中...").then(function (response) {
        if (response.result === 1) {
          that.show1 = false;
          that.show2 = true;
          that.msg = response.data.msg;
          that.getData(that.activeName, 'plugin.share-chain.frontend.queue.getList');
        } else {
          that.show1 = false;
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    getUser() {
      let that = this;
      $http.get('plugin.share-chain.frontend.member.getInfo', {}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.nickname = response.data.nickname;
          that.avatar = response.data.avatar;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });

    },
    getHomeInfo() {
      let that = this;
      $http.get('plugin.share-chain.frontend.center.statistics', {}, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.summarizing = response.data;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        console.log(response);
      });
    },
    handleClick1(tab) {
      this.rewardList = [];
      this.isLoadMore = true;
      // if (tab.name === 'queue') {
      //   this.getData(this.activeName, 'plugin.share-chain.frontend.queue.getList');
      // } else if (tab.name === 'record') {
      //   this.getData('', 'plugin.share-chain.frontend.log.getList');
      // }
      /*组建修改需要改变方法*/
      if (this.chooseName === 'queue') {
        this.getData(this.activeName, 'plugin.share-chain.frontend.queue.getList');
      } else if (this.chooseName  === 'record') {
        this.getData('', 'plugin.share-chain.frontend.log.getList');
      }

    },
    handleClick(tab) {
      this.rewardList = [];
      this.isLoadMore = true;
      // this.getData(tab.name, 'plugin.share-chain.frontend.queue.getList');
      /*组建修改需要改变方法*/
      this.getData(this.activeName, 'plugin.share-chain.frontend.queue.getList');
    },
    //获取数据
    getData(status, api) {
      this.getDataApi = api;
      this.status = status;
      let that = this;
      let data = {};
      if (status) {
        data = {source_code: status};
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      that.page = 1;
      $http.get(api, data, "加载中...").then(function (response) {
        if (response.result === 1) {
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.rewardList = response.data.data;
        } else {
          Toast(response.msg);
          that.$router.push(that.fun.getUrl('extension', {}));
        }
      }, function (response) {
        console.log(response);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      let data = {};
      if (this.status) {
        data = {source_code: this.status, page: that.page};
      } else {
        data = {page: that.page};
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get(this.getDataApi, data, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.rewardList = that.rewardList.concat(myData);//数组拼接
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
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      this.nickname = '';
      this.avatar = '';
      this.summarizing = {};
      this.status = '';
      this.chooseId = '';
      this.chooseRatio = '';
      this.msg = '';
      this.activeName = 'shop';
      this.chooseName = 'queue';
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.rewardList = [];
    },
  },
  components: {cTitle}
};
