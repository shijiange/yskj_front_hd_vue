import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from '../../../utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      inputs: '',
      recordsList: [],
      member: {},
      total: '',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.initData();
        this.getData();
      }
    },
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getData() {
      $http.get("plugin.commission-statistics.api.index.index", {page: 1, keyword: this.inputs}, "...").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.agent.last_page;
          if(!this.inputs) {
            this.total = response.data.agent.total;
          }
          this.member = response.data.member;
          this.recordsList = response.data.agent.data;
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
        $http.get("plugin.commission-statistics.api.index.index", {
          page: that.page,
          keyword: this.inputs
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.agent.data;
            that.recordsList = that.recordsList.concat(myData);//数组拼接

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
  components: { cTitle }
};
