import { Toast } from "vant";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
import yzAddressList from "components/ui_components/yz_addressList/index";
export default {
  data() {
    return {
      showcomment: false,
      showInfo: false,
      addNum: 1,
      showAddress: false,
      info: {},
      tel: "",
      addBtn_status: false, //是否可参加
      commentlist: [],
      comment_input: "",
      showWechatshar: false,
      showShare: false,
      options: [
        { name: "微信分享", icon: "wechat" },
        { name: "分享海报", icon: "poster" }
      ],
      showposter: false,
      poster_url: "",
      activityInfo: {},
      addressData: [],
      //more(评论分页)
      isLoadMore: false,
      page: 1,
      total_page: 0,

      showgp: false,
      goodinfo: undefined
    };
  },
  activated() {
    this.showInfo = false;
    this.getData();
  },
  mouted() {
    document.body.addEventListener("focusout", () => {
      // 回到原点  若觉得一瞬间回到底部不够炫酷，那自己可以自定义缓慢回弹效果， 可用css 、贝塞尔曲线、js的 requestAnimationFrame  等等 方法 实现体验性更好的回弹效果
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  },
  methods: {
    showGoodPup(_id) {
      if (!this.fun.isTextEmpty(this.goodinfo)) {
        this.showgp = true;
        return;
      }
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: Number(_id) }, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodinfo = res.data.get_goods;
            this.goodinfo.end_time = this.info.end_time;
            if (res.data.get_goods.content) {
              let str = this.goodinfo.content.replace(/src=\"http:/gi, 'src="https:');
              this.goodinfo.content = str;
            } else {
              this.goodinfo.content = "暂无该商品详情";
            }
            setTimeout(() => {
              this.showgp = true;
            }, 800);
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoUrl(_name, _params) {
      this.$router.push(this.fun.getUrl(_name, _params));
    },
    getData() {
      $http
        .get("plugin.luck-draw.frontend.index.detail", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getComment() {
      // 获取抽奖评论
      $http
        .get("plugin.luck-draw.frontend.index.getComment", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.commentlist = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.showcomment = true;
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
      if (!that.isLoadMore) {
        return;
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {
          activity_id: that.$route.params.id
        };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.get("plugin.luck-draw.frontend.index.getComment", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.commentlist = that.commentlist.concat(myData); //数组拼接
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
    sendComment() {
      if (this.comment_input == "") {
        Toast("不能发送空白信息");
        return;
      }
      // 获取抽奖评论
      $http
        .get("plugin.luck-draw.frontend.index.comment", { activity_id: this.$route.params.id, content: this.comment_input }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.comment_input = "";
            this.getComment();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCollection() {
      //收藏 or 取消收藏（1-收藏 0-取消收藏）
      $http
        .get("plugin.luck-draw.frontend.index.collection", { activity_id: this.$route.params.id, state: this.info.is_collection ? 0 : 1 }, "加载中")
        .then(response => {
          Toast(response.msg);
          if (response.result === 1) {
            this.info.collection_num = this.info.is_collection == 1 ? this.info.collection_num - 1 : this.info.collection_num + 1;
            this.info.is_collection = !this.info.is_collection;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSelect(option) {
      this.showShare = false;
      if (option.name == "微信分享") {
        this.showWechatshar = true;
      } else if (option.name == "分享海报") {
        this.getPoster();
      }
    },
    getPoster() {
      if (!this.fun.isTextEmpty(this.poster_url)) {
        this.showposter = true;
        return;
      }
      $http
        .get("plugin.luck-draw.frontend.index.getPoster", { id: this.$route.params.id }, "")
        .then(res => {
          if (res.result == 1) {
            this.poster_url = res.data.h5.poster;
            this.showposter = true;
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addActivity() {
      if (!this.addBtn_status) {
        return;
      }
      $http
        .get("plugin.luck-draw.frontend.team.getActivity", { activity_id: this.$route.params.id }, "")
        .then(res => {
          if (res.result == 1) {
            this.activityInfo = res.data;
            this.showInfo = true;
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取收货地址
    getAddress() {
      this.addressData = [];
      this.showAddress = true;
      // let that = this;
      // $http.get("member.member-address.index", {}, "获取中").then(
      //   function(response) {
      //     if (response.result === 1) {
      //       that.showAddress = true;
      //       that.addressData = response.data;
      //       // that.defaultAddress = response.data.filter(function(item) {
      //       //   return item.isdefault === 1;
      //       // });
      //     } else {
      //       Toast(response.msg);
      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },
    confirmSelectAddress(item) {
      this.activityInfo.address = item;
      this.showAddress = false;
    },
    joinActivity() {
      let that = this;
      //参加活动
      //如果是分享进入的，把分享人的id加上
      let json = {
        activity_id: this.$route.params.id,
        total: this.addNum,
        address: JSON.stringify(this.activityInfo.address),
        pid: this.fun.getKeyByMid()
      };

      if (this.activityInfo.type == 2 && this.activityInfo.need_address == 1) {
        //虚拟商品并且开启不填写地址
        if (this.fun.isTextEmpty(this.tel)) {
          Toast("请填写手机号码");
          return;
        }
        json.address = JSON.stringify({ mobile: this.tel });
      } else {
        if (this.fun.isTextEmpty(this.activityInfo.address)) {
          Toast("请选择收货地址");
          return;
        }
      }
      let _url = "";
      // 活动类型type_id 1-免费 2-付费
      if (this.activityInfo.type_id == 1) {
        _url = "plugin.luck-draw.frontend.team.freeJoinActivity";
      } else {
        //付费。跳转支付页，带参
        json.money = this.info.money;
        this.showInfo = false;
        this.$router.push(this.fun.getUrl("newDrawPayment", { datas: JSON.stringify(json) }));
        return;
      }
      $http.post(_url, json, "获取中").then(
        function(response) {
          Toast(response.msg);
          if (response.result === 1) {
            that.getData();
            that.showInfo = false;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  components: { yzWechatShareImg, yzGoodsPopup, yzAddressList },
  filters: {
    timeSlice: function(setdateTimeStamp) {
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      // let halfamonth = day * 15;
      let month = day * 30;

      let dateTimeStamp = new Date(setdateTimeStamp);
      let now = new Date().getTime();
      let diffValue = now - dateTimeStamp;
      if (diffValue < 0) {
        //日期不符
        return "刚刚";
      }
      let monthC = diffValue / month;
      let weekC = diffValue / (7 * day);
      let dayC = diffValue / day;
      let hourC = diffValue / hour;
      let minC = diffValue / minute;
      let result = null;
      if (monthC >= 1 && monthC <= 3) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (weekC >= 1 && weekC <= 3) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (dayC >= 1 && dayC <= 6) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (hourC >= 1 && hourC <= 23) {
        result = parseInt(hourC) + "小时前";
      } else if (minC >= 1 && minC <= 59) {
        result = parseInt(minC) + "分钟前";
      } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
      } else result = setdateTimeStamp.substr(5, 11);
      return result;
    }
  },
  computed: {
    btn_text() {
      let text = "";
      let timestamp = new Date().getTime();
      if (this.info.start_time * 1000 > timestamp) {
        text = "活动未开始";
      } else if (this.info.activity_state == 3) {
        text = "活动已结束";
      } else if (this.info.member_num <= 0) {
        text = "您已参与";
      } else if (this.info.type_id == 2) {
        text = `${$i18n.t("money")}${this.info.money}抽奖`;
        this.addBtn_status = true;
      } else if (this.info.type_id == 1) {
        text = `免费`;
        this.addBtn_status = true;
      }
      return text;
    }
  }
};
