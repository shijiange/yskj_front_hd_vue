// import { Toast } from 'vant';
import cTitle from 'components/title';
import { scrollMixin } from "../../../utils/mixin";

const STORE_INFO_URL = "plugin.store-cashier.frontend.boss.child-store.index";
const STORE_ORDER_URL = "plugin.store-cashier.frontend.boss.child-store.getStoreOrderList";
const CASHIER_ORDER_URL = "plugin.store-cashier.frontend.boss.child-store.getCashierOrderList";
const AUDIO_IS_OPEN = "plugin.store-cashier.frontend.boss.voice-broadcast.verifyOpenAudio";
const GET_AUDIO_URL = "plugin.store-cashier.frontend.boss.voice-broadcast.index";
var intervalid;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      store_info: {},
      store_count: {},
      tabArr: [
        "门店订单",
        "收银台订单"
      ],
      currentIndex: 0,
      store_order_show: true,
      cashier_order_show: false,

      //门店订单
      storeList: [],
      store_loading: false,
      store_allLoaded: false,
      store_goload: true,
      store_isLoadMore: true,
      store_page: 1,
      store_total_page: 0,

      //收银台订单
      cashierList: [],
      cashier_loading: false,
      cashier_allLoaded: false,
      cashier_goload: true,
      cashier_isLoadMore: true,
      cashier_page: 1,
      cashier_total_page: 0,

      //语音播报
      vedioSrc: "",
      income_name_text: "",
      isLoading:false,
      // 门店独立余额
      open_store_balance:false,
      open_store_show:false,
      balanceInfo:[],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.initData();
    this.getStoreInfo();
    this.getStoreList();
    this.isOpenAudio();
    this.customizeIncome();
    this.$nextTick(() => {
      //this.audioPlay();

      this.autoClick();
    });

  },

  mounted() {

  },
  deactivated() {
    this.closeTimeInterval();
  },
  methods: {

    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.currentIndex = 0;
      this.store_order_show = false;
      this.open_store_show = false;
      this.open_store_balance = false;
      this.cashier_order_show = false;
      this.store_info = {};
      this.store_count = {};
      this.tabArr = ["门店订单", "收银台订单"];
      this.vedioSrc = "";
      this.initStoreData();
      this.initCashierData();
    },
    getStoreInfo() {
      $http.get(STORE_INFO_URL, { store_id: this.$route.params.id }, "加载中...").then(res => {
        if (res.result == 1) {
          this.store_info = res.data.store;
          this.store_count = res.data.statistics;
          this.getCashierList(this.store_info.cashier_id);
          if(res.data.open_store_balance){
            this.open_store_balance = res.data.open_store_balance;
            //有开启独立门店余额插件  默认第一个是充值订单
            this.open_store_show = true;
            this.getBalance();
          }else{
            this.store_order_show = true;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },

    toggle(index) {
      console.log(index);
      this.currentIndex = index;
      if (index == 1) {
        this.store_order_show = true;
        this.cashier_order_show = false;
        this.open_store_show = false;
      } else if(index == 3){
        this.balanceInfo = [];
        this.page = 1;
        this.last_page = 0;
        this.open_store_show = true;
        this.store_order_show = false;
        this.cashier_order_show = false;
        this.getBalance();
      } else {
        this.store_order_show = false;
        this.cashier_order_show = true;
        this.open_store_show = false;
      }

    },
    // 门店独立余额
    getBalance(){
      this.isLoadMore = false;
      $http.get("plugin.store-cashier.frontend.store.balance.award.boss", {}).then(res => {
        if (res.result == 1) {
          console.log(res.data.list.data);
          this.balanceInfo = res.data.list.data;
          this.total_page = res.data.list.last_page;
          this.isLoadMore = true;
          if (!this.total_page) {
            this.total_page = 0;
          }
        }else{
          that.page = that.page - 1;
          that.isLoadMore = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //门店
    initStoreData() {
      this.storeList = [];
      this.store_loading = false;
      this.store_allLoaded = false;
      this.store_goload = true;
      this.store_isLoadMore = true;
      this.store_page = 1;
      this.store_total_page = 0;
    },

    getStoreList() {
      $http.get(STORE_ORDER_URL, { store_id: this.$route.params.id, page: this.store_page }).then(res => {
        if (res.result == 1) {
          console.log(res);
          this.storeList = res.data.data;
          this.store_total_page = res.data.last_page;
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreStoreList() {
      if (this.store_page == this.store_total_page) {
        return;
      }
      if (this.store_page >= this.store_total_page) {
        this.store_loading = true;
        this.store_allLoaded = true;
        return;
      } else {
        this.store_page = this.store_page + 1;
        $http.get(STORE_ORDER_URL, { store_id: this.$route.params.id, page: this.store_page }, '加载中...').then(res => {
          if (res.result == 1) {
            this.store_loading = false;
            this.store_allLoaded = false;
            this.storeList = this.storeList.concat(res.data.data);//数组拼接
            this.isLoadMore = true;
          } else {
            this.store_page = this.store_page - 1;
            this.store_loading = true;
            this.store_allLoaded = true;
            this.store_isLoadMore = false;
            return;
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },

    storeLoadTop() {
      this.initStoreData();
      this.getStoreList();
      // this.$refs.store_loadmore.onTopLoaded();
    },
    getMoreData(){
      // 防止多次请求分页数据
    //如果是store就走原来store的加载更多方法  
      if(this.store_order_show){
        this.isLoadMore = false;
        this.storeLoadBottom();
      } else if(this.open_store_show){
        this.moreBalance();
      } else{
        this.isLoadMore = false;
        // 反之走收银台
        this.cashierLoadBottom();
      }
    },
    storeLoadBottom() {
      if (this.store_isLoadMore) {
        this.getMoreStoreList();
        this.$refs.store_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },
    moreBalance(){
      let json = {};
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get("plugin.store-cashier.frontend.store.balance.award.boss", json, "")
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                var mydata = response.data.list.data;
                console.log(this.balanceInfo,mydata);
                this.balanceInfo = this.balanceInfo.concat(mydata);
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    //收银台
    initCashierData() {
      this.cashierList = [];
      this.cashier_loading = false;
      this.cashier_allLoaded = false;
      this.cashier_goload = true;
      this.cashier_isLoadMore = true;
      this.cashier_page = 1;
      this.cashier_total_page = 0;
    },
    getCashierList(id) {
      $http.get(CASHIER_ORDER_URL, { cashier_id: id, page: this.cashier_page }).then(res => {
        if (res.result == 1) {
          console.log(res);
          // res.data.data.forEach(element => {
          //   this.cashierList.push(element.order);
          // });
          this.cashierList = res.data.data;
          console.log(this.cashierList);
          this.cashier_total_page = res.data.last_page;
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreCashierList() {
      if (this.cashier_page == this.cashier_total_page) {
        return;
      }
      if (this.cashier_page >= this.cashier_total_page) {
        this.cashier_loading = true;
        this.cashier_allLoaded = true;
        return;
      } else {
        this.cashier_page = this.cashier_page + 1;
        $http.get(CASHIER_ORDER_URL, { cashier_id: this.store_info.cashier_id, page: this.cashier_page }, '加载中...').then(res => {
          if (res.result == 1) {
            this.cashier_loading = false;
            this.cashier_allLoaded = false;
            this.cashierList = this.cashierList.concat(res.data.data);//数组拼接
            this.isLoadMore = true;
          } else {
            this.cashier_page = this.cashier_page - 1;
            this.cashier_loading = true;
            this.cashier_allLoaded = true;
            this.cashier_isLoadMore = false;
            return;
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },

    cashierLoadTop() {
      this.initCashierData();
      this.getCashierList(this.store_info.cashier_id);
      // this.$refs.cashier_loadmore.onTopLoaded();
    },

    cashierLoadBottom() {
      if (this.cashier_isLoadMore) {
        this.getMoreCashierList();
        this.$refs.cashier_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },

    //语音播报
    isOpenAudio() {
      $http.get(AUDIO_IS_OPEN, { store_id: this.$route.params.id }).then(res => {
        if (res.result == 1) {
          if (res.data.audio_open == 1) {
            this.getAudio();
          }
        } else {
          this.$dialog.alert({message:res.msg});
         
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getAudio() {
      intervalid = setInterval(() => {
        $http.get(GET_AUDIO_URL, { store_id: this.$route.params.id }).then(res => {
          if (res.result == 1) {
            this.vedioSrc = res.data.url;
            this.$nextTick(() => {
              this.audioPlay();
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }, 5000);

    },

    audioPlay() {
      // var that = this;
      let json = {
        url: document.location.href
      };
      $http.post('member.member.wxJsSdkConfig', json).then(res => {
        if (res.result == 1) {

          // var bgAudio = document.getElementById('yp');
          // console.log(bgAudio);
          // bgAudio.load();
          // bgAudio.play();
          wx.config(res.data.config);
          wx.ready(function () {
            var bgAudio = document.getElementById('yp');
            bgAudio.load();
            bgAudio.play();

            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
              bgAudio.load();
              bgAudio.play();
            });

          });
        }
      }).catch(error => {
        console.log(error);
      });
    },

    closeTimeInterval() {
      console.log("dsdsdsdsds");
      clearInterval(intervalid);
    },

    autoClick() {
      if (document.all) {
        document.getElementById("chain_shop").click();
      } else {// 其它浏览器
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", false, true);
        document.getElementById("chain_shop").dispatchEvent(e);
      }
    },

    show() {
      var bgAudio = document.getElementById('yp');
      bgAudio.load();
      bgAudio.play();
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};