import cTitle from 'components/title';
import { Toast } from 'vant';
// import {scrollMixin} from 'utils/mixin';

export default {
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      isShowcode: false,
      shop_list: [],
      goods_list: [],
      popupData: {}
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    isPopup(item, index) {
      this.popupData = {
        ...item,
        index
      };
      this.isShowcode = !this.isShowcode;
    },
    handleShowPopup(e) {
      if (e.srcElement.className == "dialog-wrapper") {
        this.isShowcode = !this.isShowcode;
      }
    },
    getData() {
      $http.get("plugin.enter-goods.frontend.enterGoods.list", {}, "加载中").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.shop_list = response.data.data;
          let resData = [];
          this.shop_list.forEach(value => {
            resData.push(value.goods);
          });

          this.goods_list = resData;
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
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get("plugin.enter-goods.frontend.enterGoods.list", {
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.shop_list = that.shop_list.concat(myData);//数组拼接

            let resData = [];
            this.shop_list.forEach(value => {
              resData.push(value.goods);
            });

            this.goods_list = resData;

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
  },
  components: {
    cTitle
  }

};