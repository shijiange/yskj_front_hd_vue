// import { Toast } from 'vant';
import subjectTemplate from './mycomponents/subject_mobile';
import headTemplate from './mycomponents/head';
import serviceTemplate from './mycomponents/service';
import { scrollMixin } from '../../../../utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多

  data() {
    return {
      list: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.initData();
    this.getList();
  },
  methods: {
    initData() {
      this.list = [];
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getList() {
      let that = this;
      $http.post('plugin.case-library.api.mobile.home.special-list', {}, '').then(
        response => {
          if (response.result === 1) {
            that.list = [];
            that.list = response.data.special.data;
            that.total_page = response.data.special.last_page;
            that.page = response.data.special.current_page;
            this.isLoadMore = true;
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
        that.page += 1;
        let json = {
          page:that.page
        };
        $http
          .post('plugin.case-library.api.mobile.home.special-list', json, '')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.special.data;
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
    },
  },
  components: { subjectTemplate, headTemplate, serviceTemplate }
};
