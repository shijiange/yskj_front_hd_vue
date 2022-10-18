import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      allData: {},
      member:{},
      name:'',
      recordsList: [],
      amount_id: '',
      level_name: '',
      total_amount:"",
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
    toPage(){
      this.$router.push(this.fun.getUrl('TaskCenter'));
    },
    showDetail(obj) {
      if (obj.show && this.amount_id === obj.id) {
        obj.show = false;
        return;
      }
      this.amount_id = obj.id;
      if (obj.show) {
        obj.show = false;
        return;
      }
      this.$set(obj, "show", true);
    },
    getData() {
      $http.get("plugin.management-dividend.api.dividend.index", {page:1}, " ").then(
        (response) => {
          if (response.result === 1) {
            this.allData = response.data;
            console.log(this.allData);
            this.member = this.allData.member;
            this.name = this.allData.plugin_name;
            this.level_name = this.allData.level;
            this.total_amount = this.allData.total_amount;
            this.isLoadMore = true;
            this.total_page = this.allData.dividend.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = this.allData.dividend.data;
            this.fun.setWXTitle(this.name);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.management-dividend.api.dividend.index', {
          page: this.page
        }, '加载中').then(response=> {
          this.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.dividend.data;
            this.recordsList = this.recordsList.concat(myData);//数组拼接
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
    initData(){
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.amount_id = '';
    },
    // goRewardsRecordDetail(){
    // 	this.$router.push(this.fun.getUrl("RewardsRecordDetail"));
    // }
  },
  components: {cTitle}
};
