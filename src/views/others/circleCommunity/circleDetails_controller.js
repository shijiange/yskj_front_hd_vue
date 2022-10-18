import { Toast, Image, ActionSheet } from "vant";
import DList from "@/components/dlist";
import Request from "./libs/_request";
import _Functions from "./libs/_funtions";
import PostItem from "@/components/circleCommunity/postItem";
import CircleButton from "@/components/circleCommunity/circleButton";
export default {
  data() {
    return {
      attentions: [], //关注
      posts: [], //普通帖子
      videoPosts: [], // 视频帖子
      tabsIndex: 0,
      name: "", // 圈子名称
      bg_img: "", //背景图片
      circle_img: "", //	圈子图片
      synopsis: "", //简介
      is_exist: "", //0没有加入圈子  1加入圈子了
      member_count: "", //圈子会员数量
      invitation_count: "", //圈子帖子+视频数量
      category_name: "", //分类名称
      is_master: "", //	是否圈主：0不是圈主，1圈主
      member_review: "", //审核状态：0待审核，1审核通过，2审核驳回
      is_toll: "", //是否收费：0免费，1付费
      price: "", //加入圈子费用
      is_review_member: "", //	成员加入是否审核：0否，1是
      is_posting: "", //	是否除圈主外其他能否发帖：0不能，1能
      id: "", //圈子id
      topList: "", //  置顶数组

      circleInfo: null,
      currentShowTab: "posts",
      circleId: 0,
      circlePosts: [],
      postPagination: {
        loading: false,
        finished: false,
        page: 1
      },
      showPostActionSheet: false,
      currentOperationPostIndex: null,
      postActionSheet: [],
      goods_id: "", // 圈子付费商品id
      backUrl: null
    };
  },
  activated() {
    if (!this.$route.query.id) {
      Toast("圈子不存在");
      this.$router.go(-1);
      return;
    }
    this.circleId = this.$route.query.id;
    if (this.$route.query.refresh) {
      this.circlePosts = [];
      this.postPagination.finished = false;
      this.postPagination.loading = false;
      this.postPagination.page = 1;
    }
    if (this.$route.query.to_home) {
      this.backUrl = "circleIndex";
    }
    if (this.$route.query.tab) {
      this.currentShowTab = this.$route.query.tab;
    }
    this.loadPost();
  },
  mounted() {
    this.getData();
    // this.getAttData(1, 1);
    this.getstick(); //获取置顶
  },
  computed: {
    joinQuitCircleText() {
      if (!this.circleInfo) {
        return "加入圈子";
      }
      if (this.circleInfo.is_master) {
        return "";
      }
      if (this.circleInfo.is_exist) {
        if (this.circleInfo.member_review == 0) {
          return "等待圈主审核";
        }
        return "退出圈子";
      } else {
        if (this.circleInfo.is_toll) {
          return `加入圈子（申请费用￥${this.circleInfo.price}）`;
        }
        return "加入圈子";
      }
    }
  },
  methods: {
    // 获取置顶
    getstick() {
      let params = {
        circle_id: this.$route.query.id,
        is_top: 1
      };
      $http
        .get("plugin.circle.frontend.circle-invitation.get-circle-invitation-list", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.topList = response.data.data;
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    // 点击加入圈子
    joinCircle() {
      if (this.circleInfo.is_exist) {
        return;
      }

      if (this.circleInfo.is_toll) {
        // 先获取商品id
        this.payAddCircle();
        // this.$router.push(
        //   this.fun.getUrl(
        //     "circlePay",
        //     {},
        //     {
        //       circle_id: this.circleInfo.id
        //     }
        //   )
        // );
        // _Functions.joinPayCircle().then(res => console.log(res));
      } else {
        _Functions
          .joinFreeCircle(this.circleInfo.id)
          .then(response => {
            Toast(response.msg);
            this.is_exist = 1;
            this.circleInfo.is_exist = 1;
            this.getData();
          })
          .catch(response => {
            Toast(response.msg);
          });
      }
    },
    payAddCircle() {
      $http.get("plugin.circle.frontend.circle-pay.add-circle-order", { circle_id: this.circleInfo.id }, "").then(({ data: response, result, msg }) => {
        if (result === 0) {
          Toast(msg);
        }
        this.goods_id = response.goods_id;
        this.createOrder();
      });
    },
    createOrder() {
      $http.post("plugin.circle.api.create.index", { circle_id: this.circleInfo.id, goods: [{ goods_id: this.goods_id, total: 1, option_id: 0 }] }, "").then(({ data: response, result, msg }) => {
        if (result === 0) {
          Toast(msg);
          return;
        }
        this.$router.replace(
          this.fun.getUrl("orderpay", {
            status: "2",
            order_ids: response.order_ids
          })
        );
      });
    },
    // 跳转至发布页
    compile(id) {
      let is_exist = this.is_exist;
      if (is_exist == 1 || this.circleInfo.is_master) {
        this.$router.push(this.fun.getUrl("circleSelect", {}, { id: id }));
      }
    },
    // 跳转到帖子详情页面
    toPostDetails(itemIndex, postType) {
      let route = null;
      let post = null;
      let page = null;
      if (postType == "top") {
        post = this.topList[itemIndex];
        page = this.topList.findIndex((value, index, arr) => {
          return value.id === post.id;
        });
      } else {
        post = this.circlePosts[itemIndex];
        page = this.circlePosts.findIndex((value, index, arr) => {
          return value.id === post.id;
        });
      }

      switch (post.status) {
      case 1:
        route = this.fun.getUrl(
          "topicDetails",
          {},
          {
            pid: post.id
          }
        );
        break;
      case 2:
        page = Math.ceil((page + 1) / 15);
        route = this.fun.getUrl(
          "circleVideodetail",
          {},
          {
            circle_invitation_id: post.id,
            from: "circle",
            page,
            circle_id: post.circle_id,
            vid: post.id
          }
        );
        break;
      }
      this.$router.push(route);
    },
    // 跳转到圈子设置页面
    setting(id) {
      this.$router.push(this.fun.getUrl("circleSetting", {}, { id: id }));
    },
    // 跳转至查看页面
    check(id) {
      this.$router.push(this.fun.getUrl("circleIntroduce", {}, { id: id }));
    },
    getData() {
      $http
        .get("plugin.circle.frontend.circle.get-circle", { circle_id: this.$route.query.id }, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.fun.setWXTitle(response.data.name);
              this.circleInfo = response.data;
              this.name = response.data.name;
              this.bg_img = response.data.bg_img;
              this.circle_img = response.data.circle_img;
              this.synopsis = response.data.synopsis;
              this.is_exist = response.data.is_exist;
              this.member_count = response.data.member;
              this.invitation_count = response.data.invitation;
              this.category_name = response.data.category_name;
              this.price = response.data.price;
              this.is_posting = response.data.is_posting;
              this.is_master = response.data.is_master;
              this.member_review = response.data.member_review;
              this.is_toll = response.data.is_toll;
              this.price = response.data.price;
              this.is_review_member = response.data.is_review_member;
              this.member_review = response.data.member_review;
              this.id = response.data.id;
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    // 点击切换选项 获取类容
    getAttData(index, type) {
      this.tabsIndex = index;
      let url = "";
      let params = {};
      if (type == 0) {
        url = "plugin.circle.frontend.circle-invitation.get-circle-invitation-list";
        params = {
          circle_id: this.$route.query.id,
          is_attention: 1
        };
      } else {
        url = "plugin.circle.frontend.circle-invitation.get-circle-invitation-list";
        params = {
          circle_id: this.$route.query.id,
          invitation_status: type
        };
      }

      $http
        .get(url, params)
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.posts = response.data.data;
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },

    switchTabs({ target: { dataset } }) {
      if (!dataset.name) {
        return;
      }
      this.currentShowTab = dataset.name;
      this.circlePosts = [];
      this.postPagination = {
        loading: false,
        finished: false,
        page: 1
      };
      this.loadPost();
    },
    loadPost() {
      if (this.postPagination.finished || this.postPagination.loading) {
        return;
      }
      this.postPagination.loading = true;
      const loadPostRequestParams = {
        circle_id: this.circleId
      };
      switch (this.currentShowTab) {
      case "attention":
        loadPostRequestParams["is_attention"] = 1;
        break;
      case "posts":
        loadPostRequestParams["invitation_status"] = 1;
        break;
      case "video":
        loadPostRequestParams["invitation_status"] = 2;
        break;
      }
      loadPostRequestParams["page"] = this.postPagination.page;
      $http.get("plugin.circle.frontend.circle-invitation.get-circle-invitation-list", loadPostRequestParams).then(({ data: response, result, msg }) => {
        if (result == 0) {
          Toast(msg);
          return;
        }
        if (response.total === 0 || response.data.length < response.per_page || response.last_page == response.current_page) {
          this.postPagination.finished = true;
        }
        this.circlePosts.push(...response.data);
        this.postPagination.page++;
        this.postPagination.loading = false;
      });
    },
    attentionAuthor(postIndex) {
      const post = this.circlePosts[postIndex];
      if (post["is_current_member"]) {
        Toast("无法关注自己");
        return;
      }
      let requestUrl = "plugin.circle.frontend.circle-member.cancel-attention"; //* 取消关注
      if (post["is_attention"] == 0) {
        requestUrl = "plugin.circle.frontend.circle-member.attention-member"; //* 关注
      }
      $http
        .post(requestUrl, {
          attention_member_id: post["member_id"]
        })
        .then(res => {
          if (res.result) {
            post["is_attention"] = Number(!post["is_attention"]);
          }
          Toast(res.msg);
        });
    },
    async selectPostActionSheet({ key }) {
      let actionKey = null;
      switch (key) {
      case "top":
        actionKey = "is_top";
        break;
      case "recommend":
        actionKey = "is_recommend";
        break;
      case "displayorder":
        actionKey = "is_show";
        break;
      case "delete":
        this.deletePost();
        break;
      }
      if (actionKey !== null) {
        let post = this.circlePosts[this.currentOperationPostIndex];
        let { result, msg } = await Request.postOperation(post.id, post.circle_id, actionKey);
        if (result == 1) {
          msg = "操作成功";
          post[actionKey] = !post[actionKey];
          // if (key === "top") {
          //   if(post[actionKey]){
          //     this.topList.push(post);
          //   }
          // }
        }
        Toast(msg);
      }
    },
    deletePost() {
      let post = this.circlePosts[this.currentOperationPostIndex];
      $http
        .post("plugin.circle.frontend.circle-invitation.del", {
          invitation_id: post.id
        })
        .then(({ result, msg }) => {
          if (result == 1) {
            this.circlePosts.splice(this.currentOperationPostIndex, 1);
          }
          Toast(msg);
        });
    },
    accessMember(memberId) {
      this.$router.push(
        this.fun.getUrl(
          "circleMyRelease",
          {},
          {
            member_id: memberId
          }
        )
      );
    },
    displayPostActionSheet(itemIndex) {
      this.showPostActionSheet = true;
      this.currentOperationPostIndex = itemIndex;
      this.computedPostActionSheet(itemIndex);
    },
    computedPostActionSheet(itemIndex) {
      if (!this.circleInfo || !this.circleInfo.is_master) {
        return;
      }
      let postItem = this.circlePosts[itemIndex];
      const actionSheet = [
        {
          name: "推荐",
          key: "recommend"
        },
        {
          name: "置顶",
          key: "top"
        },
        {
          name: "未加入可见",
          key: "displayorder"
        },
        {
          name: "删除",
          key: "delete"
        }
      ];
      if (postItem.is_recommend) {
        actionSheet[0]["name"] = "取消推荐";
      }
      if (postItem.is_top) {
        actionSheet[1]["name"] = "取消置顶";
      }
      if (postItem.is_show) {
        actionSheet[2]["name"] = "取消未加入可见";
      }
      this.postActionSheet = actionSheet;
    }
  },
  components: {
    DList,
    PostItem,
    CircleButton,
    VanImage: Image,
    VanActionSheet: ActionSheet
  }
};
