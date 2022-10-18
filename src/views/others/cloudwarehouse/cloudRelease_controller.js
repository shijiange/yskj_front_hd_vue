
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      info: [],
      member: [],
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.active = 0;
    this.getData();
    this.init();
  },
  methods: {
    tapDetail(id,item) {
      if(this.active == 1){
        if(item.total_buy_log == 0){
          Toast("没有待释放记录");
          return;
        }
      }
      this.$router.push(
        this.fun.getUrl("cloudReleaseLog", {id,active:this.active})
      );
    },
    init() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      $http
        .get(
          "plugin.cloud-warehouse.frontend.dividend.index",
          {},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.info = response.data;
            this.member = response.data.member;
            this.list = response.data.list.data;
          } else {
            this.$router.go(-1);//返回上一层
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    tabChange() {
      this.init();
      let urlStr = '';
      console.log(this.active);
      if (this.active == 1) {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.wait-dividend-goods";
      } else {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.dividend-list";
      }
      $http
        .get(
          urlStr,
          {
            page: this.page
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            console.log(this.list);
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let urlStr = '';
      if (this.active == 1) {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.wait-dividend-goods";
      } else {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.dividend-list";
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            urlStr,
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function (response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.list = that.list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              console.error(response.msg);
            }
          );
      }
    },
  },
  components: { cTitle }
};