import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      bonus: {
        avatar:'',
        nickname:'',
        settled_money:null,
        unsettled_money:null
      },
      dividend: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      active: 0
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  components: { cTitle },
  computed: {},
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.dividend = [];
    },
    getData() {
      let that = this;
      let url = 'plugin.room.frontend.anchor.dividend';
      let json = {
        page: 1
      };
      switch (this.active) {
      case 0:
        json.status = '';
        break;
      case 1:
        json.status = '0';
        break;
      case 2:
        json.status = '1';
        break;
      case 3:
        json.status = '-1';
        break;
      default:
        console.log("error;;;;;");
        break;
      }
      $http.get(url, json, "").then(
        response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            that.bonus.avatar = response.data.data.avatar;
            that.bonus.nickname = response.data.data.nickname;
            that.bonus.settled_money = response.data.data.settled_money;
            that.bonus.unsettled_money = response.data.data.unsettled_money;
            that.dividend = response.data.data.bonus;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        switch (this.active) {
        case 0:
          json.status = '';
          break;
        case 1:
          json.status = '0';
          break;
        case 2:
          json.status = '1';
          break;
        case 3:
          json.status = '-1';
          break;
        default:
          console.log("error;;;;;");
          break;
        }
        $http
          .get(
            "plugin.room.frontend.anchor.dividend",
            json,
            ""
          )
          .then((response)=> {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data.data.bonus;
              that.dividend = that.recordsList.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
          );
      }
    },
    changeTab() {
      this.initData();
      this.getData();
    }
  }
};
