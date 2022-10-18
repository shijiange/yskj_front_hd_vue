import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import cTitle from "components/title";
import yzCommentInput from "components/ui_components/yz_commentInput";
import { yzPay } from "../../utils/yz_pay"; //引入支付方法
import payKeyboard from "components/payKeyboard";
import audioSlider from "./component/audio-slider";
var share_tag = "-1";
//import BMap from 'BMap';
export default {
  mixins: [scrollMixin, yzPay], //加载更多
  data() {
    return {
      bannerindex: 1,
      showCommentInput: false,
      commentInputOptions: {},
      adminOperationshow: false,
      releaseOperationshow: false,
      amountRewardshow: false,
      rewardPayshow: false,
      stickid: "",
      detailsData: {},
      StickCommentData: [],
      replyName: "",
      host_comment_id: "",
      second_comment_id: "",
      readertype: 1, // 1普通看帖人 2发帖人 3管理人
      is_praise: true,
      //打赏金额选项
      rewardArr: [
        {
          value: 1,
          name: "5元"
        },
        {
          value: 2,
          name: "10元"
        },
        {
          value: 3,
          name: "20元"
        },
        {
          value: 4,
          name: "50元"
        },
        {
          value: 5,
          name: "100元"
        }
      ],
      rewardArrselect: 99999,
      rewardArrmoney: "",
      rewardArrmoneytype: 2,
      btnData: [],
      rewardMoney: 0,
      commentManagement: false,
      is_own: false,
      commend_id: "",
      mulcommentsshow: true,
      reward_commend_id: 0, //打赏评论id
      rewardTypes: 0, //打赏类型。0：帖子打赏||1：评论打赏
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      stick_flag: 0,
      recommend_flag: 0,

      reward_button: 1,

      passwordInfo: {},
      popupSpecs: false,
      pwds: [],
      pwd: "",
      pw1: "",
      pw2: "",
      pw3: "",
      pw4: "",
      pw5: "",
      pw6: "",

      imagesPreview: [], //图片预览数组
      startPosition: 0, //图片预览组件起始位置
      showImagePreview: false,
      RewardMember: {}, //打赏人信息
      replayIdZhuge:""
    };
  },
  activated() {
    if (this.$route.params.stickId) {
      this.stickid = this.$route.params.stickId;
    } else {
      this.$router.go(-1);
    }
    this.popupSpecs = false;
    this.initPop();
    this.getMicroDetails();
    this.getStickComment();
    
    setTimeout(() =>{
     //console.log(this.detailsData);
    //console.log(9999);
      zhuge.track('进入社区帖子详情页',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at
      });
      zhuge.startTrack('社区帖子详情页停留时长',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at
      });
    },2000);
  },
  deactivated(){
    setTimeout(() =>{
      zhuge.endTrack('社区帖子详情页停留时长',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at
      });
    },2000);
  },
  mounted() {
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }
  },
  methods: {
    openImgPreview(arr, index) {
      this.imagesPreview = arr;
      this.startPosition = index;
      this.showImagePreview = true;
    },
    mulchMeatsShowBtn() {
      this.mulcommentsshow = false;
      this.getMoreData();
    },
    moneyShow(tag, cid, name, img) {
      this.rewardTypes = tag;
      this.rewardArrmoney = "";
      this.rewardArrselect = 9999;
      this.rewardMoney = 0;
      this.amountRewardshow = true;
      this.reward_commend_id = cid;

      this.RewardMember.img = img || this.detailsData.has_one_stick_user.avatar;
      this.RewardMember.name = name || this.detailsData.has_one_stick_user.nickname;
    },
    shorewardArrBtn(index) {
      this.rewardArrmoneytype = 1;
      this.rewardArrselect = index;
      this.rewardArrmoney = "";
    },
    rewardArrMoneyBtn() {
      this.rewardArrmoneytype = 2;
      this.rewardArrselect = 9999;
    },
    confirmRewardBtn() {
      this.amountRewardshow = false;
      if (this.rewardArrmoneytype == 1) {
        this.rewardMoney = parseInt(this.rewardArr[this.rewardArrselect].name);
      } else if (this.rewardArrmoneytype == 2) {
        this.rewardMoney = this.rewardArrmoney;
      }
      if (this.fun.isTextEmpty(this.rewardMoney)) {
        Toast("请输入或选择打赏金额");
        return;
      }
      if (this.rewardMoney <= 0) {
        Toast("打赏金额必须大于0");
        return;
      }
      this.getPayData();
    },
    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    showPwdPop() {
      this.initPop();
      this.rewardPayshow = false;
      this.popupSpecs = true;
    },
    hidePwdPop() {
      this.popupSpecs = false;
    },
    //初始化pop
    initPop() {
      this.pwds = [];
      this.pwd = "";
      this.pw1 = "";
      this.pw2 = "";
      this.pw3 = "";
      this.pw4 = "";
      this.pw5 = "";
      this.pw6 = "";
    },
    //密码组装
    onPassword(value) {
      if (this.pwd.length < 6) {
        this.pwd = this.pwd + value;
        this.setPwdView(); //设置密码显示
      }
      if (this.pwd.length == 6) {
        this.hidePwdPop();
        this.getVerifyPassword(this.pwd); //请求密码验证接口
        this.pwd = ""; //复位
      }
      this.getVerifyPassword(value);
    },
    //设置密码 view显示
    setPwdView() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      switch (pwdLength) {
      case 1:
        this.pw1 = this.pwd.substring(0, 1);
        break;
      case 2:
        this.pw2 = this.pwd.substring(1, 2);
        break;
      case 3:
        this.pw3 = this.pwd.substring(2, 3);
        break;
      case 4:
        this.pw4 = this.pwd.substring(3, 4);
        break;
      case 5:
        this.pw5 = this.pwd.substring(4, 5);
        break;
      case 6:
        this.pw6 = this.pwd.substring(5, 6);
        break;
      default:
        break;
      }
    },

    //删除密码
    pwdDelete() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      switch (pwdLength) {
      case 1:
        this.pwd = this.pwd.substring(0, 0);
        this.pw1 = "";
        break;
      case 2:
        this.pwd = this.pwd.substring(0, 1);
        this.pw2 = "";
        break;
      case 3:
        this.pwd = this.pwd.substring(0, 2);
        this.pw3 = "";
        break;
      case 4:
        this.pwd = this.pwd.substring(0, 3);
        this.pw4 = "";
        break;
      case 5:
        this.pwd = this.pwd.substring(0, 4);
        this.pw5 = "";
        break;
      case 6:
        this.pwd = this.pwd.substring(0, 5);
        this.pw6 = "";
        break;
      default:
        break;
      }
    },

    //验证密码
    getVerifyPassword(pwd) {
      //order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function(response) {
          if (response.result == 1) {
            that.passwordInfo.need_password = false;
            that.payBtn(that.passwordInfo);
          } else {
            that.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  //商城支付密码设置未开启
                  //that.$router.go(-1);
                } else if (response.data.code == 2002) {
                  //用户未设置支付密码
                  //去设置密码
                  that.$router.push(that.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  //支付密码错误
                }
              })
              .catch(() => {
                if (response.data.code == 2001) {
                  //商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                  //用户未设置支付密码
                } else if (response.data.code == 2003) {
                  //支付密码错误
                }
              });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      $http
        .get("plugin.micro-communities.api.reward-log.get-payment-buttons", {}, "")
        .then(response => {
          if (response.result == 1) {
            let btnData = response.data.buttons;
            this.btnData = btnData;
            this.rewardPayshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    payBtn(data) {
      if (data.need_password) {
        this.passwordInfo = data;
        this.showPwdPop();
        return;
      }
      let that = this;
      let url = "plugin.micro-communities.api.reward-log.index";
      let json = {
        pay_method: data.value,
        amount: this.rewardMoney,
        pay_name: data.name
      };
      if (this.rewardTypes == 0) {
        // 帖子打赏
        json.trick_id = this.stickid;
      } else {
        // 评论打赏
        url = "plugin.micro-communities.api.reward-log.commentPay";
        json.comment_id = this.reward_commend_id;
      }
      $http
        .post(url, json, "支付中...")
        .then(response => {
          that.rewardPayshow = false;
          if (response.result == 1) {
            this.handleOtherPay(data, response);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          that.$dialog.alert({ message: response.msg });
        });
    },
    attentionBtn() {
      if (this.detailsData.is_follow) {
        this.cancelAttention();
      } else {
        zhuge.track('社区帖子详情-点击关注发布人',{
          '帖子标题':this.detailsData.title,
          '帖子id':this.detailsData.id,
          '发布人':this.detailsData.has_one_stick_user.nickname,
          '发布人id':this.detailsData.has_one_stick_user.uid,
        });
        this.addAttention();
      }
    },
    cancelAttention() {
      let dataJson = {
        uid: this.detailsData.user_id
      };
      $http.post("plugin.micro-communities.api.user.delFollow", dataJson).then(response => {
        if (response.result == 1) {
          this.$set(this.detailsData, "is_follow", false); //动态添加
          Toast(response.msg);
        } else {
          Toast(response.msg);
        }
      });
    },
    addAttention() {
      let dataJson = {
        user_id: this.detailsData.user_id
      };
      $http.post("plugin.micro-communities.api.user.addFollow", dataJson).then(response => {
        if (response.result == 1) {
          this.$set(this.detailsData, "is_follow", true); //动态添加
          Toast(response.msg);
        } else {
          Toast(response.msg);
        }
      });
    },
    sidingsImg(index) {
      this.bannerindex = index + 1;
    },
    getMicroDetails() {
      let that = this;
      let dataJson = {
        tid: this.stickid
      };
      $http.post("plugin.micro-communities.api.trick.getStrickDetail", dataJson, {}).then(response => {
        if (response.result == 1) {
          that.detailsData = response.data;
          if (that.detailsData) {
            if (that.detailsData.is_manager == 1) {
              that.readertype = 3;
            } else if (that.detailsData.is_own == 1) {
              that.readertype = 2;
            }
            if (that.detailsData.is_manager == 1) {
              that.is_praise = true;
            } else {
              that.is_praise = false;
            }
          }
          this.reward_button = response.data.reward_button;
          this.recommend_flag = response.data.is_recommend;
          this.stick_flag = response.data.is_top;
          that.is_own = response.data.is_own == 0 ? false : true;
          that.fun.wxShare(
            "",
            {},
            {
              title: that.detailsData.title,
              imgUrl: that.detailsData.has_one_stick_user.avatar,
              description: that.detailsData.contents
            }
          );
        } else {
          if (share_tag == "-1") {
            that.$router.go(-1);
          } else {
            that.$router.push(that.fun.getUrl("home", {}));
          }
          Toast(response.msg);
        }
      });
    },
    getStickComment() {
      let that = this;
      that.pageInit();
      let dataJson = {
        tid: this.stickid
      };
      $http.post("plugin.micro-communities.api.trick.getStickComment", dataJson, {}).then(response => {
        if (response.result == 1) {
          that.total_page = response.data.last_page;
          that.StickCommentData = response.data.data;
        } else {
          Toast(response.msg);
        }
      });
    },
    helpPay(oid) {
      this.$router.push(this.fun.getUrl("PayAnotherDetail", {}, { order_ids: oid, pid: this.detailsData.has_one_stick_user.uid }));
    },
    replyCommentsBtn(item,host_comment_id, second_comment_id, uname, content, is_own) {
      this.replayIdZhuge = item.user_id;
      this.host_comment_id = host_comment_id;
      this.second_comment_id = second_comment_id;
      this.replyName = uname;
      this.replyshowcontent = content;
      if (is_own == 1) {
        this.is_own = true;
      } else {
        this.is_own = false;
      }
      this.commentManagement = true;
    },
    replyBtn() {
      this.showCommentInput = true;
      this.commentInputOptions = {
        type: "reply",
        placeholder: "请输入你的回复吧"
      };
      this.commentManagement = false;
    },
    delBtn() {
      if (this.host_comment_id && this.second_comment_id) {
        this.commend_id = this.second_comment_id;
      } else {
        this.commend_id = this.host_comment_id;
      }
      this.commentManagement = false;
      this.delReply();
    },
    delReply() {
      let that = this;
      let dataJson = {};
      dataJson.commend_id = this.commend_id;
      $http.post("plugin.micro-communities.api.trick.delComment", dataJson).then(response => {
        if (response.result == 1) {
          that.getStickComment();
          Toast(response.msg);
        } else {
          Toast(response.msg);
        }
      });
    },
    replyCancelBtn() {
      this.commentManagement = false;
    },
    subMainCommentBtn() {
      this.showCommentInput = true;
      this.commentInputOptions = {
        type: "main"
      };
      zhuge.track('社区帖子详情-点击评论框',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at
      });
    },
    subMainBtn(e) {
      if (e) {
       // console.log("1111111111111111111", e);
        this.showCommentInput = false;
        this.getReplyComments(e);
      }
    },
    getReplyComments(e) {
      let that = this;
      let dataJson = {
        image: e.imgs,
        content: e.text
      };
      dataJson.tid = that.stickid;
      if (e.options.type == "reply") {
        if (this.host_comment_id) {
          dataJson.host_comment_id = this.host_comment_id;
        }
        if (this.second_comment_id) {
          dataJson.second_comment_id = this.second_comment_id;
        }
      }
      $http.post("plugin.micro-communities.api.trick.comments", dataJson).then(response => {
        if (response.result == 1) {
          that.getStickComment();
          let num = that.detailsData.comments_num + 1;
          that.$set(that.detailsData, "comments_num", num);

          Toast(response.msg);
        } else {
          Toast(response.msg);
        }
      });
    },
    managementBtn() {
      // if (this.readertype == 1) {
      //
      // } else
      if (this.readertype == 2) {
        this.releaseOperationshow = true;
      } else if (this.readertype == 3) {
        this.adminOperationshow = true;
      }
    },
    reEditBtn() {
      this.adminOperationshow = false;
      if (this.detailsData.is_pc == 1) {
        Toast("PC端发布的帖子只能在PC端修改！");
        return;
      }
      this.$router.push(
        this.fun.getUrl("microEdit", {
          stickid: this.stickid
        })
      );
    },
    deleteBtn() {
      let that = this;
      let dataJson = {};
      dataJson.tid = that.stickid;
      $http.post("plugin.micro-communities.api.trick.delTrick", dataJson).then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          this.releaseOperationshow = false;
          this.adminOperationshow = false;
          this.$router.push(this.fun.getUrl("MicroIndex"));
        } else {
          Toast(response.msg);
          this.releaseOperationshow = false;
          this.adminOperationshow = false;
        }
      });
    },
    reCancelBtn() {
      this.releaseOperationshow = false;
    },
    adminBtn(typenum) {
      let that = this;
      let dataJson = {};
      dataJson.tid = that.stickid;
      if (typenum == 1) {
        dataJson.state = this.recommend_flag == 1 ? 0 : 1;
        dataJson.operation = 1;
      } else if (typenum == 2) {
        dataJson.state = this.stick_flag == 1 ? 0 : 1;
        dataJson.operation = 2;
      }
      $http.post("plugin.micro-communities.api.trick.changeOperation", dataJson).then(response => {
        if (response.result == 1) {
          if (typenum == 1) {
            this.recommend_flag = this.recommend_flag == 1 ? 0 : 1;
          } else if (typenum == 2) {
            this.stick_flag = this.stick_flag == 1 ? 0 : 1;
          }
          Toast(response.msg);
          this.adminOperationshow = false;
        } else {
          Toast(response.msg);
          this.adminOperationshow = false;
        }
      });
    },
    adCancel() {
      this.adminOperationshow = false;
    },
    praiseBtn(item,host_comment_id, second_comment_id, index, chilindex, is_praise) {
      //console.log("5555", host_comment_id);
      //console.log(item);
      if (is_praise == 1) {
        Toast("你已赞过该贴");
        return false;
      }
      zhuge.track('社区帖子详情-点击点赞',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at,
        '点赞评论人名称':item.uname,
        '点赞评论人id':item.user_id,
        '评论时间':item.created_at,
        '点赞类型':'评论点赞'
      });
      this.getPraiseData(host_comment_id, second_comment_id, index, chilindex, "");
    },
    isPraiseBtn() {
     // console.log(999999);
      if (this.detailsData.is_praise == 1) {
        Toast("你已赞过该贴");
        return false;
      }
      zhuge.track('社区帖子详情-点击点赞',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at,
        '点赞评论人名称':'',
        '点赞评论人id':'',
        '评论时间':'',
        '点赞类型':'帖子点赞'
      });
      this.getPraiseData("", "", "", "", "main");
    },
    getPraiseData(host_comment_id, second_comment_id, index, chilindex, type) {
      let that = this;
      let dataJson = {};
      if (!host_comment_id) {
        dataJson.tid = that.stickid;
      }
      if (host_comment_id && second_comment_id) {
        dataJson.comment_id = second_comment_id;
      } else {
        dataJson.comment_id = host_comment_id;
      }
      $http.post("plugin.micro-communities.api.trick.givePraise", dataJson).then(response => {
        if (response.result == 1) {
          if ("main" == type) {
            that.$set(that.detailsData, "praise_num", that.detailsData.praise_num ? that.detailsData.praise_num + 1 : 1); //动态添加
          } else {
            if (host_comment_id && second_comment_id) {
              let childData = that.StickCommentData[index].child[chilindex];
              that.$set(childData, "is_praise", 1); //动态添加
              that.$set(childData, "praise_num", childData.praise_num ? childData.praise_num + 1 : 1); //动态添加
            } else {
              let StickCommentData = that.StickCommentData[index];
              that.$set(StickCommentData, "is_praise", 1); //动态添加
              that.$set(StickCommentData, "praise_num", StickCommentData.praise_num ? StickCommentData.praise_num + 1 : 1); //动态添加
            }
          }
          Toast(response.msg);
        } else {
          Toast(response.msg);
        }
      });
    },
    gotoHome(_ids) {
      this.$router.push(this.fun.getUrl("microhomepage", {}, { micuid: _ids }));
    },
    goto() {
      if (share_tag == "-1") {
        this.$router.go(-1);
      } else {
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },
    //跳转购物车
    gotoCart() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      }
      zhuge.track('社区帖子详情-点击分享',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at
      });
      this.$dialog.alert({ message: "请点击右上角微信分享" });
    },
    pageInit() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    //获取更多数据
    getMoreData() {
      if (this.mulcommentsshow) {
        return false;
      }
      const that = this;
      let json = {
        tid: this.stickid
      };
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.post("plugin.micro-communities.api.trick.getStickComment", json, "加载中...").then(
          function(response) {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.StickCommentData = that.StickCommentData.concat(myData);
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
    },
    gotoStore(_id) {
      this.$router.push(this.fun.getUrl("HomeSeller", { store_id: _id, fromHome: 1 }));
    },
    gotoGoods(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id }));
    }
  },

  components: {
    cTitle,
    yzCommentInput,
    payKeyboard,
    audioSlider
  }
};
