// import cFoot from "../enterprise_wechat/myComponents/foot";
import userInfo from "../enterprise_wechat/myComponents/memberInfo";
import myCustomer from "../enterprise_wechat/myComponents/my_customer";
import orderList from "../enterprise_wechat/myComponents/orderList";
import revenueDetails from "../enterprise_wechat/myComponents/revenueDetails";
import myCart from "../enterprise_wechat/myComponents/myCart";
import goodsCoupon from '../enterprise_wechat/myComponents/goodsCoupon';
import myFavorite from '../enterprise_wechat/myComponents/myFavorite';
import browseRecord from '../enterprise_wechat/myComponents/browseRecord';
import { Toast } from 'vant';


export default {
  data () {
    return {
      agentData: { // 企业微信config接口配置
        agent_secret: "",
        agentid: "",
        corpid: ""
      },
      testUserId: 'wmDesSDgAAnVOxcNIw8XQ6x1qhN5ZidA', // dev15 测试userId
      userDataUrl: "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.index",
      getConfig: {client: 'work',type: 17}, //企业微信公共参数

      memberInfo: {}, // 会员信息
      income_statistic: [], // 收入信息
      tags: [], // 标签列表
      actions: [], // 企业标签
      navActive: 0,
      addTagText: '',
      showAddTagPop: false,
      showAddSheet: false,
      income_statistic_type: "0",

      tabList: ['会员详情', 'Ta的客户', '订单列表', '收入详情', 'Ta的购物车', '优惠券', '商品收藏', '浏览足迹'],
      showChild: false,
    };
  },
  computed: {
    componentName () {
      switch (this.navActive) {
      case 1:
        return "myCustomer";
      case 2:
        return "orderList";
      case 3:
        return "revenueDetails";
      case 4:
        return "myCart";
      case 5:
        return "goodsCoupon";
      case 6:
        return "myFavorite";
      case 7:
        return "browseRecord";
      }
    },
  },
  activated () {
    this.getAgentConfig();

    // if (this.fun.getTyep() === "17") {
    //   this.getAgentConfig();
    // } else {
    //   // // 本地测试 start
    //   this.getCustomerInfo(this.testUserId);
    //   // // 本地测试 end
    // }
  },

  methods: {
    // 企业微信配置信息
    getAgentConfig() {
      $http
        .get(
          "plugin.wechat-chat-sidebar.frontend.controller.index.get-config",
          { url: this.fun.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href },
          "loading"
        )
        .then(response => {
          if (response.result === 1) {
            this.agentData = response.data;
            let get_token = response.data.get_token;
            let config = {
              debug: false,
              beta: true,
              jsApiList: ["agentConfig"],
              openTagList: ["ww-open-data"],
              appId: this.agentData.corpid,
              nonceStr: get_token.noncestr,
              timestamp: get_token.timestamp,
              signature: get_token.token
            };
            console.log("wx.config ==== start");
            wx.config(config);
            wx.ready(() => {
              console.log("wx.ready ==== start");
              setTimeout(() => {
                this.getAgentSign(config, get_token.app_token);
              }, 500);
            });
            wx.error(res => {
              console.log("getAgentConfig：：config信息验证失败！" + JSON.stringify(res));
            });
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(error => {
          console.log("getAgentConfig::", error);
        });
    },
    // 企业微信登录
    getAgentSign(config, app_token) {
      wx.agentConfig({
        debug: false,
        corpid: config.appId,
        agentid: this.agentData.agentid,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: app_token,
        jsApiList: ["getCurExternalContact"],
        success: () => {
          wx.invoke("getCurExternalContact", {}, res => {
            console.log("getCurExternalContact:::", res);
            if (res.err_msg == "getCurExternalContact:ok") {
              // console.log("getCurExternalContact:ok ::::::::::::::", res.userId);
              this.getCustomerInfo(res.userId); //返回当前外部联系人userId
            } else {
              //错误处理
              this.errorLogHandler("getCurExternalContact", res);
              this.$toast("获取当前外部联系人失败！");
            }
          });
        },
        fail: res => {
          console.log('wx.agentConfig::res',res);
          this.errorLogHandler("wx.agentConfig", res);
          this.$toast("您没有查看权限，请联系管理员！");
        }
      });
    },
    // 发送外部联系人id
    getCustomerInfo(userId) {
      $http.get("plugin.wechat-chat-sidebar.frontend.controller.index.get-customer-info", { user_id: userId, ...this.getConfig }, "获取联系人...").then(response => {
        if (response.result === 1) {
          this.getUserData();
          this.getTagData();
        } else {
          this.$toast(response.msg);
        }
      })
        .catch(err => {
          console.log("getCustomerInfo::err", err);
        });
    },
    getUserData () {
      $http.get(this.userDataUrl, this.getConfig, "loading").then(res => {
        if (res.result === 1) {
          if (res.data.member && res.data.member.hasAuth == 0) {
            this.$dialog.alert({ message: "暂无权限" })
              .then(() => {
                this.$router.push(this.fun.getUrl("member"));
              });
          }
          this.showChild = true;
          this.tags = res.data.member.tag;
          this.memberInfo = res.data.member;
          this.income_statistic = res.data.statistics;
        } else {
          this.$toast(res.msg);
        }
      }).catch(err => {
        console.log('getUserData::err',err);
      });
    },
    // 获取标签选择列表
    getTagData () {
      $http.get('plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-tag', this.getConfig)
        .then(res => {
          if (res.result === 1) {
            this.actions = res.data;
          } else {
            this.$toast(res.msg);
          }
        });
    },
    // 选择标签
    selectTags (detail) {
      let json = { tag_ids: detail.id, status: 1 };
      if (this.tags.some(item => item.tag_id == json.tag_ids)) {
        this.$dialog.alert({message:"已添加该标签"});
        return false;
      }
      $http.get('plugin.wechat-chat-sidebar.frontend.controller.customer.customer.manage-customers-tag', {...json, ...this.getConfig}, "loading")
        .then(res => {
          this.$toast(res.msg);
          if (res.result === 1) {
            this.getUserData();
            this.closeSheet();
          }
        });
    },
    closeSheet () {
      this.showAddSheet = false;
    },
    //删除标签
    deleteTag (tagId) {
      let json = { tag_ids: tagId,status: 2 };
      $http.get('plugin.wechat-chat-sidebar.frontend.controller.customer.customer.manage-customers-tag', {...json, ...this.getConfig}, "loading")
        .then(res => {
          this.$toast(res.msg);
          if (res.result === 1) {
            this.getUserData();
          }
        });
    },
    // 添加标签
    confirmAdd () {
      $http.post('plugin.wechat-chat-sidebar.frontend.controller.customer.customer.add-tag', {name: this.addTagText}, "loading")
        .then(res => {
          this.$toast(res.msg);
          if (res.result === 1) {
            this.getUserData();
          }
          this.showAddTagPop = false;
        });
    },
    selectTime () {
      $http.get(this.userDataUrl, {...this.getConfig, income_statistic_type: this.income_statistic_type}, "loading").then(res => {
        if (res.result === 1) {
          this.income_statistic = res.data.statistics;
        } else {
          this.$toast(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 跳转至会员权益
    gotoMemberGrade() {
      if (this.isMemberGrade) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },
    // 跳转至名片
    toCard(id) {
      if (!id) {
        Toast("该会员没有对应的名片");
        return;
      }
      this.$router.push(this.fun.getUrl("BusinessCard",{},{ mark_id: id, mark: "card" }));
    },

    // 错误日志
    errorLogHandler (logType, err) {
      $http.get('plugin.wechat-chat-sidebar.frontend.controller.index.recordErrorLog', {logType, err}, "loading")
        .then()
        .catch(err => {
          console.log(err);
        });
    }
  },

  components: {
    // cFoot,
    userInfo,
    myCustomer,
    orderList,
    revenueDetails,
    myCart,
    goodsCoupon,
    myFavorite,
    browseRecord
  },
};
