import cTitle from "components/title";
import { Toast } from 'vant';
import {scrollMixin} from '../../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tag: 1,
      aid: null,
      extractWord: {},
      log: [],
      info: {},
      settitle: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    let that = this;
    this.init();
    this.tag = this.$route.params.tag;
    this.aid = this.$route.params.aid;

    this.getData();

    if (this.tag == 1) {
      that.fun.setWXTitle("邀请记录");
      that.settitle = "邀请记录";
    } else {
      that.fun.setWXTitle("挑战记录");
      that.settitle = "挑战记录";
    }
  },
  mounted() {},
  methods: {
    init(){
      this.extractWord = {};
      this.log=[];
      this.info = {};
      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      const that = this;
      let _url =
        this.tag == 1
          ? "plugin.redpack.frontend.activity.getShareLog"
          : "plugin.redpack.frontend.activity.getChallengeLog";
      $http.get(_url, { aid: that.aid }, "").then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.log.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.extractWord = response.data;
            that.log = response.data.log.data;
            that.info = response.data.member;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      this.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let _url = this.tag == 1? "plugin.redpack.frontend.activity.getShareLog": "plugin.redpack.frontend.activity.getChallengeLog";
        $http.get(_url, { aid: that.aid }, '').then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.log.data;
            that.log = that.log.concat(myData);//数组拼接
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
  components: { cTitle }
};
