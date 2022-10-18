// import { Toast } from 'vant';
import caseMobile from './mycomponents/case_mobile';
import headTemplate from './mycomponents/head';
import serviceTemplate from './mycomponents/service';
import { scrollMixin } from '../../../../utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多

  data() {
    return {
      firstCategory: [],
      secondCategory: [],
      first_id: -1,
      second_id: -1,
      list: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.getFirstCategory();
  },
  methods: {
    getFirstCategory() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-all-category', {}, '').then(
        response => {
          if (response.result === 1) {
            that.firstCategory = response.data.firstCategory;
            if(that.firstCategory.length>=1) {
              that.changeFirstCategory(that.firstCategory[0].id);
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },
    changeFirstCategory(id) {
      let that = this;
      that.first_id = id;
      $http.post('plugin.case-library.api.mobile.home.cut-first-category', { pid: that.first_id }, '').then(
        response => {
          if (response.result === 1) {
            that.secondCategory = response.data.secondCategory;
            that.list = response.data.case.data;
            that.total_page = response.data.case.last_page;
            that.page = response.data.case.current_page;
            that.isLoadMore = true;
            that.second_id = -1;
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    changeSecondCategory(id) {
      let that = this;
      that.second_id = id;
      $http.post('plugin.case-library.api.mobile.home.cut-second-category', { cid: that.second_id }, '').then(
        response => {
          if (response.result === 1) {
            that.list = response.data.case.data;
            that.total_page = response.data.case.last_page;
            that.page = response.data.case.current_page;
            that.isLoadMore = true;
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },
    getMoreData() {
      console.log('加载更多启动');
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        let _url = '';
        let json = {};
        that.page += 1;
        if (this.second_id == -1) {
          _url = 'plugin.case-library.api.mobile.home.cut-first-category';
          json = {
            pid: that.first_id,
            page: that.page
          };
        }
        else {
          _url = 'plugin.case-library.api.mobile.home.cut-second-category';
          json = {
            cid: that.second_id,
            page: that.page
          };
        }
        $http
          .post(_url, json, '')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.case.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: {
    caseMobile,
    headTemplate,
    serviceTemplate
  }
};
