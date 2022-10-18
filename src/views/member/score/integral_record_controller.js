import cTitle from 'components/title';
import yzBlank from 'components/ui_components/yz_blank';
const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      activeName: 'first',
      receive_point: "0.00",
      used_point: "0.00",
      validity_point: 0,
      dataList: [],
      statuNum: 0,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      integral: window.localStorage.integral,
    };
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      //   if (this.statuNum === (Number(tab.index) - 1)) {
      //     return;
      //   }
      this.dataList = [];
      this.isLoadMore = true;

      // if (Number(tab.index) === 0) {
      //   this.getData()
      // } else {
      //   this.getData(Number(tab.index) - 1);
      // }
      /*因修改组建改方法*/
      if (Number(tab) === 0) {
        this.getData();
      } else {
        this.getData(Number(tab) - 1);
      }

    },
    getData(statuNum) {
      const that = this;
      that.statuNum = statuNum;
      that.page = 1;

      $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.activity-receive-records.index', {
        activity_id: that.id,
        page_id: 1,
        status: statuNum
      }, '加载中').then(function (response) {
        if (response.result === 1) {
          const activityDate = response.data;
          that.receive_point = activityDate.receive_point;
          that.used_point = activityDate.used_point;
          that.validity_point = activityDate.validity_point;
          that.total_page = activityDate.records.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.dataList = activityDate.records.data;

        } else {
          that.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        // error callback
      });
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
    getMoreData() {
      const that = this;
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.activity-receive-records.index', {
          activity_id: that.id,
          page_id: that.page,
          status: that.statuNum
        }, '加载中...').then(function (response) {

          if (response.result === 1) {
            var myData = response.data.records.data;
            that.dataList = that.dataList.concat(myData);//数组拼接

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
    initData() {
      this.activeName = 'first';
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.dataList = [];
    },
  },
  activated() {
    this.id = this.$route.params.activity_id;
    if (!this.id) {
      this.$router.push(this.fun.getUrl('IntegralActivity'));
      return;
    }
    this.initData();
    this.getData();
    window.addEventListener('scroll', this.handleScroll);
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  components: { cTitle, yzBlank }
};