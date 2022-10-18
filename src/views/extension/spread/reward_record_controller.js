// import { Toast } from 'vant';
import cTitle from 'components/title';




export default {
  data() {
    return {
      activeName:0,
      list: [],

      amount: "",

      amount_finishi: "",

      amount_surplus: "",

      //more
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
    this.getData();
    this.getList();


  },

  mounted() {



  },
  methods: {
    getData() {
      $http.get("plugin.member-return.frontend.queue.index", {}, "...").then(response => {
        if (response.result == 1) {
          this.amount = response.data.queue.amount;
          this.amount_finishi = response.data.queue.amount_finish;
          this.amount_surplus = response.data.queue.amount_surplus;
        }
      }).catch(error => {
        console.log(error);
      });
    },


    getList(){
      $http.get("plugin.member-return.frontend.log.get-list", {page:this.page}, "加载中...").then(response => {
        if (response.result == 1) {
          this.list=response.data.data;
          this.total_page=response.data.last_page;
        }
      }).catch(error => {
        console.log(error);
      });
    },


    gotoDetail(val) {
      this.$router.push(this.fun.getUrl("RecordOfAwards", { id: val }));
    },


    loadTop() {
      this.initData();
      this.getList();
      this.$refs.coupon_loadmore.onTopLoaded();
    },

    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.getMoreData(this.page);
        this.$refs.coupon_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },

    getMoreData(page) {
      var that = this;
      if (this.page == this.total_page) {
        return;

      }
      if (this.page >= this.total_page) {
        that.loading = true; that.allLoaded = true; return;

      } else {
        this.page = this.page + 1;
        $http.get('plugin.member-return.frontend.log.get-list', { page: this.page }, '加载中...').then(function (response) {

          if (response.result == 1) {
            var myData = response.data.data;
            that.loading = false; that.allLoaded = false;
            that.list = that.list.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.loading = true; that.allLoaded = true; that.isLoadMore = false; return;
          }
        }, function (response) {
          // error callback
        });

      }


    },

    initData() {
      this.activeName=0;
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.list = [];
    },






  },
  components: {
    cTitle
  }
};