import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

const documentElement = document.documentElement;

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tabs: [],
      selected: 0,
      tabID: 0,
      bossList: [],
      detail: {},
      uid: 0,
      inNickName: "",
      showNoText: false,
      diyName: "我的朋友",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.bossList = [];
    this.initData();
    this.getTab();
  },
  methods: {
    initData() {
      this.tabs = [];
      this.selected = 0;
      this.tabID = 0;
      this.detail = {};
      this.uid = 0;

      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.bossList = [];
    },
    getTab() {
      let that = this;
      $http.get("plugin.my-friend.api.my-friend.get-columns", {}).then(
        function(response) {
          if (response.result === 1) {
            that.tabs = response.data.columns;
            that.tabID = that.tabs[0].id;
            that.diyName = response.data.my_friend_name || "我的朋友";
            that.fun.setWXTitle(that.diyName);
            that.getData();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          Toast(response.msg);
        }
      );
    },
    changeTab(tab, i) {
      this.selected = i;
      this.tabID = tab.id;
      documentElement.scrollTop = 0;
      //console.log(this.tabID);
      this.getData();
    },
    //获取数据
    getData() {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http
        .post(
          "plugin.my-friend.api.my-friend.get-list",
          { id: that.tabID },
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.bossList = response.data.list.data;
              that.showNoText = that.fun.isTextEmpty(that.bossList);
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
        $http
          .get(
            "plugin.my-friend.api.my-friend.get-list",
            {
              id: that.tabID,
              page: that.page
            },
            "加载中..."
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                that.bossList = that.bossList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
