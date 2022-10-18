// import { Toast } from 'vant';
import caseMobile from './mycomponents/case_mobile';
import headTemplate from './mycomponents/head';
import serviceTemplate from './mycomponents/service';
import { scrollMixin } from '../../../../utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      view_show:false,
      label_title: '',
      id: '',
      list: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {},
  activated() {
    this.initData();
    this.getList();
  },
  methods: {
    initData() {
      this.id = this.$route.params.id;
      this.label_title = '';
      this.list = [];
      this.view_show = false;
      this.page = 1;
      this.isLoadMore = true; //判断是否要加载更多的标志
      this.total_page = 0; //总页数
    },
    getList() {
      let that = this;
      $http.post('plugin.case-library.api.mobile.home.label-case', { label_id: that.id }, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.label_title = response.data.label.label_name;
            that.list = [];
            that.list = response.data.case.data;
            that.total_page = response.data.case.last_page;
            that.page = response.data.case.current_page;
            that.isLoadMore = true;
            if (that.list.length == 0) {
              that.isLoadMore = false;
            }
          } else {
            // 我的发布报错
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
          label_id: that.id,
          page: that.page
        };
        $http
          .post('plugin.case-library.api.mobile.home.label-case', json, '')
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
  computed: {},
  components: {
    caseMobile,
    headTemplate,
    serviceTemplate
  }
};
