import { scrollMixin } from "../../../utils/mixin";
import lineEcharts from "./components/lineEcharts";
import indexGroupItem from "./components/index_group_item";
import qrcode from "./components/qrcode";
import filterPopup from "./components/filter-popup";
import inviterMemberItem from "./components/inviter-member-item";
import sharePoster from "./components/share_poster";

import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  components: { lineEcharts, indexGroupItem, qrcode, filterPopup, inviterMemberItem, sharePoster },
  data() {
    return {
      tabIndex: 0,
      childTabIndex: 0,
      datetimePopup: false,
      qrcodePopup: false,
      currentDate: new Date(),

      employee: null,
      owner: null,

      currentTimeText: "",

      listData: [],
      searchText: "",
      searchMemberName: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      qrcodeList: {}, //二维码列表
      qrcodeImg: "",
      sharePosterList: {}, //分享海报列表

      lineCharts: {},
      filterPopup: false, //筛选条件弹窗
      filterConfig: null,
      sharePopup: false,
      posterID: "" //海报id
    };
  },
  activated() {
    window.scrollTo(0, 0);
    this.getEmployee();
    this.currentTimeText = this.dateFormat("YYYY-mm-dd", this.currentDate);
    this.getListData();
    console.log(this.dateFormat("YYYY-mm-dd", this.currentDate));
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    setTabIndex(index) {
      if (index == this.tabIndex) return;
      if (this.owner == null) this.getOwner();
      this.tabIndex = index;
      this.childTabIndex = this.tabIndex == 0 ? 0 : 3;
      this.getListData();
    },
    setChildTabIndex(index) {
      if (index == this.childTabIndex) return;
      this.childTabIndex = index;
      this.getListData();
    },
    showQrcode({ id, is_worker }) {
      this._getQrcode(id, is_worker);
    },
    confirmTime(e) {
      this.datetimePopup = false;
      this.currentTimeText = this.dateFormat("YYYY-mm-dd", e);
      this.getOwner();
      console.log(e);
    },
    getEmployee() {
      Toast.loading({
        message: "",
        forbidClick: true
      });
      $http.get("plugin.group-develop-user.frontend.index.employee-summary").then(res => {
        Toast.clear();
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        this.employee = res.data;
        console.log(res);
      });
    },
    getOwner() {
      Toast.loading({
        message: "",
        forbidClick: true
      });
      $http
        .get("plugin.group-develop-user.frontend.index.owner-member-summary", {
          end_day: this.currentTimeText
        })
        .then(res => {
          Toast.clear();
          if (res.result !== 1) {
            Toast(res.msg);
            return;
          }
          this.owner = res.data;
          this._setLineChartsData(res.data.charts);
          console.log(res);
        });
    },
    _setLineChartsData(data) {
      this.lineCharts = {
        x: data.x,
        y: [
          { name: "新会员人数", color: "rgb(24,144,255)", data: data.y },
          { name: "邀请人数", color: "rgb(65,198,76)", data: data.invite_y }
        ]
      };
    },
    _getQrcode(id, is_worker) {
      this.posterID = id;
      if (is_worker == 0 && this.qrcodeList[id]) {
        this.qrcodeImg = this.qrcodeList[id];
        this.qrcodePopup = true;
        return;
      } else if (is_worker == 1 && this.sharePosterList[id]) {
        this.qrcodeImg = this.sharePosterList[id];
        this.sharePopup = true;
        return;
      }
      $http
        .get(
          "plugin.group-develop-user.frontend.group-chat.get-new-post",
          {
            id,
            is_worker
          },
          ""
        )
        .then(res => {
          if (res.result !== 1) {
            Toast(res.msg);
            return;
          }

          this.qrcodeImg = res.data.image_url;
          if (is_worker == 0) {
            this.qrcodeList[id] = res.data.image_url;
            this.qrcodePopup = true;
          }
          if (is_worker == 1) {
            this.sharePosterList[id] = res.data.image_url;
            this.sharePopup = true;
          }

          console.log(res);
        });
    },
    getListData() {
      Toast.loading({
        message: "",
        forbidClick: true
      });
      this.initData();
      let json = {};
      let _url = "";

      if (this.childTabIndex != 4) {
        json.owner_type = this.tabIndex;
        if (this.tabIndex == 0) {
          json.is_bind_owner_uid = this.childTabIndex;
        }
        if (this.searchText != "") {
          json.kwd = this.searchText;
        }
        _url = "plugin.group-develop-user.frontend.group-chat.get-list";
      }

      if (this.tabIndex == 1 && this.childTabIndex == 4) {
        json.member_name = this.searchMemberName; //会员昵称
        json.group_name = this.searchText; //群名称
        if (this.filterConfig) {
          for (let key in this.filterConfig) {
            console.log(key + "---");
            json[key] = this.filterConfig[key].value;
          }
          console.log("wwwwwwwwwwwww", json);
        }
        _url = "plugin.group-develop-user.frontend.group-chat-member.inviterGetList";
      }

      $http.get(_url, json).then(res => {
        Toast.clear();
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }

        this.listData = res.data.data;
        this.isLoadMore = true;
        this.total_page = res.data.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }

        console.log(res);
      });
    },
    //加载更多数据
    async getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let json = { owner_type: this.tabIndex, page: this.page };

        if (tabIndex == 0) {
          json.is_bind_owner_uid = this.childTabIndex;
        }

        if (this.searchText != "") {
          json.kwd = this.searchText;
        }

        $http.get("plugin.group-develop-user.frontend.group-chat.get-list", json).then(res => {
          this.isLoadMore = true;
          if (res.result !== 1) {
            this.page = this.page - 1;
            this.isLoadMore = false;
            return;
          }

          var nextPageData = res.data.data;

          this.listData = this.listData.concat(nextPageData);
        });
      }
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
        }
      }
      return fmt;
    },
    confirmFilter(e) {
      // 已完成筛选
      console.log(e);
      this.filterConfig = e;
      this.filterPopup = false;
      this.getListData();
    },
    delFilter(_key) {
      //删除筛选条件
      console.log("===== 删除筛选条件===", _key);
      this.$refs.filterPopup[_key] = null;
      setTimeout(() => {
        this.$refs.filterPopup.confirm();
      }, 50);
    },
    closeFilterPop() {
      this.$refs.filterPopup.confirm();
    }
  }
};
