import { scrollMixin } from "../../../utils/mixin";

import lineEcharts from "./components/lineEcharts";
import enterpriseDetailsGroupItem from "./components/enterprise_details_group_item";
import barEcharts from "./components/barEcharts";
import pieEcharts from "./components/pieEcharts";
import { Toast } from "vant";
import qrcode from "./components/qrcode";
import filterPopup from "./components/filter-popup";

export default {
  mixins: [scrollMixin], //加载更多
  components: { enterpriseDetailsGroupItem, lineEcharts, barEcharts, pieEcharts, qrcode, filterPopup },
  data() {
    return {
      upImgPopup: false,
      lockPopup: false,
      memberInfoPopup: false,
      memberInfoData: null,
      qrcodePopup: false,
      qrcodeImg: "",
      photosize: 1024 * 1024 * 6,
      up_qrcode_img: "",
      level: 0,

      details: null,

      datetimePopup: false,
      currentDate: new Date(),
      currentTimeText: "",

      listData: [],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      lineCharts: {},

      listDataTotal: 0,

      lock_search_mobile: "",
      lock_search_loading: 0, //0未请求或正在请求，1找到会员，2找不到会员
      lock_search_member: null,

      filterPopup: false, //筛选弹窗
      filterConfig: {},
      member_name: "" //成员昵称
    };
  },
  created() {
    this.currentTimeText = this.dateFormat("YYYY-mm-dd", this.currentDate);
    if (this.$route.query.level) {
      this.level = this.$route.query.level;
    }
    this.getDetails();
    this.getListData();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    seeMemberInfo(item) {
      this.memberInfoPopup = true;
      this.memberInfoData = item;
    },
    confirmTime(e) {
      this.datetimePopup = false;
      this.currentTimeText = this.dateFormat("YYYY-mm-dd", e);
      this.getDetails();
      console.log(e);
    },
    getDetails() {
      let url = "plugin.group-develop-user.frontend.group-chat.get-detail-by-employee";
      if (this.level == 1) {
        url = "plugin.group-develop-user.frontend.group-chat.get-detail-by-owner-member";
      }
      $http
        .get(url, {
          end_day: this.currentTimeText,
          id: this.$route.query.group_id
        })
        .then(res => {
          Toast.clear();
          if (res.result !== 1) {
            Toast(res.msg);
            return;
          }
          this.details = res.data;
          if (this.level == 0) this._setLineChartsData(res.data.chats_line);
          if (this.level == 1) this._setLockLineChartsData(res.data.chats_line);
          console.log(res);
        });
    },
    _setLineChartsData(data) {
      this.lineCharts = {
        x: data.x,
        y: [
          { name: "入群人数", color: "rgb(24,144,255)", data: data.y_in },
          { name: "退群人数", color: "rgb(65,198,76)", data: data.y_withdraw },
          { name: "新会员人数", color: "rgb(255,168,24)", data: data.y_new_member }
        ]
      };
    },
    _setLockLineChartsData(data) {
      this.lineCharts = {
        x: data.x,
        y: [
          { name: "新会员人数", color: "rgb(24,144,255)", data: data.y_new_member },
          { name: "邀请人数", color: "rgb(65,198,76)", data: data.y_invite_member }
        ]
      };
    },
    queryMember() {
      console.log(this.lock_search_mobile);
      if (this.lock_search_mobile == "") return;
      this.lock_search_loading = 0;
      $http
        .get(
          "plugin.group-develop-user.frontend.member.query",
          {
            keyword: this.lock_search_mobile
          },
          ""
        )
        .then(res => {
          if (res.result !== 1) {
            this.lock_search_loading = 2;
            return;
          }
          if (res.data.length == 0) {
            this.lock_search_loading = 2;
          } else {
            this.lock_search_loading = 1;
            this.lock_search_member = res.data[0];
          }

          console.log(res);
        });
    },
    bindUser() {
      if (this.lock_search_loading != 1 || this.lock_search_member == null) return Toast("请搜索会员");
      $http
        .get(
          "plugin.group-develop-user.frontend.group-chat.bind-user",
          {
            id: this.$route.query.group_id,
            owner_uid: this.lock_search_member.uid
          },
          ""
        )
        .then(res => {
          Toast(res.msg);
          if (res.result !== 1) {
            return;
          }
          this.details.owner_member_uid = this.lock_search_member.uid;
          this.details.owner_member_avatar = this.lock_search_member.avatar_image;
          this.details.owner_member_nickname = this.lock_search_member.nickname;
          this.lockPopup = false;
          console.log(res);
        });
    },
    saveQrcode() {
      if (this.up_qrcode_img == "") return Toast("请选择图片");
      $http
        .get(
          "plugin.group-develop-user.frontend.group-chat.save-qrcode-img",
          {
            id: this.$route.query.group_id,
            qrcode_url: this.up_qrcode_img
          },
          ""
        )
        .then(res => {
          Toast(res.msg);
          if (res.result !== 1) {
            return;
          }
          this.up_qrcode_img = "";
          this.upImgPopup = false;
          console.log(res);
        });
    },
    getQrcode(_status) {
      // if (this.qrcodeImg != "") {
      //   this.qrcodePopup = true;
      //   return;
      // }
      let _url = _status == 0 ? "plugin.group-develop-user.frontend.group-chat.get-new-post" : "plugin.group-develop-user.frontend.group-chat.getCode";
      $http
        .get(
          _url,
          {
            id: this.$route.query.group_id
          },
          ""
        )
        .then(res => {
          if (res.result !== 1) {
            Toast(res.msg);
            return;
          }
          this.qrcodeImg = res.data.image_url;
          this.qrcodePopup = true;
          console.log(res);
        });
    },
    getListData() {
      let json = { id: this.$route.query.group_id, member_name: this.member_name };
      let url = "plugin.group-develop-user.frontend.group-chat-member.owner-get-list";
      if (this.level == 1) {
        url = "plugin.group-develop-user.frontend.group-chat-member.get-new-member-list";
      }

      if (this.filterConfig) {
        for (let key in this.filterConfig) {
          json[key] = this.filterConfig[key].value;
        }
      }

      $http.get(url, json).then(res => {
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }

        this.listData = res.data.data;
        this.isLoadMore = true;
        this.listDataTotal = res.data.total;
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
        let url = "plugin.group-develop-user.frontend.group-chat-member.owner-get-list";
        if (this.level == 1) {
          url = "plugin.group-develop-user.frontend.group-chat-member.get-new-member-list";
        }
        let json = { page: this.page, id: this.$route.query.group_id, member_name: this.member_name };
        if (this.filterConfig) {
          for (let key in this.filterConfig) {
            json[key] = this.filterConfig[key].value;
          }
        }
        $http.get(url, json).then(res => {
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
    /*vant图片上传*/
    onRead(e) {
      console.log(e.file);
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      //this.stopButton = true;
      let fd = new FormData();

      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file

      axios
        .post(this.fun.getRealUrl("upload.uploadPic", {}), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          Toast.clear();
          var responseData = response.data;
          if (responseData.result === 1) {
            this.up_qrcode_img = responseData.data.img_url;
            console.log(responseData);
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
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
