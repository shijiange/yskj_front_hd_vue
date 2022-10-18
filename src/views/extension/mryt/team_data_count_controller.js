import cTitle from 'components/title';
// import { Toast } from 'vant';

const URL_MEMBER = "plugin.mryt.api.home.get-member-list";
const URL_SALES = "plugin.mryt.api.home.get-sales-member-list";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "",
      url: "",
      member_arr: [],
      total_num: 0,


      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl('home', {}));
      } else {
        this.$router.go(-1);
      }

    },

    initData() {
      this.title = "";
      this.url = "";
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.total_num = 0;
      this.isLoadMore = true;
      this.total_page = 0;
      this.member_arr = [];
    },

    getData() {
      let url = '';
      let json = {};
      if (this.$route.params.team_type == 'team_cost_count') {
        url = URL_SALES;
      } else {
        url = URL_MEMBER;
        json = { page: this.page, member_type: this.$route.params.team_type, level: this.$route.params.level };
      }
      $http.get(url, json, "加载中...").then(res => {
        if (res.result == 1) {
          this.member_arr = res.data.member.data;
          this.total_page = res.data.member.last_page;
          this.title = res.data.level_name;
          this.total_num = res.data.member.total ? res.data.member.total : 0;
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreData() {
      if (this.isLoadMore) {
        if (this.page == this.total_page) {
          return;
        }
        if (this.page >= this.total_page) {
          this.loading = true;
          this.allLoaded = true;
          return;

        } else {
          this.page = this.page + 1;
          let url = '';
          let json = {};
          if (this.$route.params.team_type == 'team_cost_count') {
            url = URL_SALES;
          } else {
            url = URL_MEMBER;
            json = { page: this.page, member_type: this.$route.params.team_type, level: this.$route.params.level };
          }
          $http.get(url, json, '加载中...').then(res => {

            if (res.result == 1) {
              //var myData = response.data.data;
              this.loading = false;
              this.allLoaded = false;
              //this.histroyInfo = that.histroyInfo.concat(myData);//数组拼接
              this.member_arr = this.member_arr.concat(res.data.member.data);

            } else {
              this.page = this.page - 1;
              this.loading = true;
              this.allLoaded = true;
              this.isLoadMore = false;
              return;
            }
          }).catch(error => {
            console.log(error);
          });

        }
      } else {
        console.log('没有更多数据');
      }



    },

    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },

    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page);
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log('没有更多数据');
    //   }
    // },
  },
  components: { cTitle }
};
