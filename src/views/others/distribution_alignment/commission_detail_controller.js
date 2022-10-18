import cMyswipe from "components/myswipe";
import cTitle from "components/title";
import { Toast } from 'vant';
import Vue from "vue";
import { Overlay } from "vant";
import {scrollMixin} from 'utils/mixin';
Vue.use(Overlay);

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      link_url:'',
      list:[],

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
    getData() {
      this.isLoadMore = false;
      $http
        .post(this.link_url, {
        })
        .then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let datas = response.data;
              this.list = datas.data;
              this.page = datas.current_page;
              this.total_page = datas.last_page;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
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

        $http.get(this.link_url,{page:this.page}).then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.list = that.list.concat(myData);//数组拼接
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
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.list = [];
      if(this.$route.params.tag == 1) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.estimate';
      }
      else if(this.$route.params.tag == 2) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.unsettlement';
      }
      else if(this.$route.params.tag == 3) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.settlement';
      }
      else if(this.$route.params.tag == 4) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.nowithdraw';
      }
      else if(this.$route.params.tag == 5) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.withdraw';
      }
      else if(this.$route.params.tag == 6) {
        this.link_url = 'plugin.commission-activity.api.dividend-list.failure';
      }
    }

  },
  components: { cTitle,cMyswipe }
};
