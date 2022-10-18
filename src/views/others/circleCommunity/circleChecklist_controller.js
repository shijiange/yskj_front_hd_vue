import cTitle from "components/title";
import { Toast, Image as VanImage } from "vant";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      tabsIndex: 0,
      memberList: [],
      postList: [],
      circleId: null,
      currentShowTab: "members",
      membersPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      postsPagination: {
        page: 1,
        finished: false,
        loading: false
      }
      // review: "", //审核状态：0待审核，1审核通过，2审核驳回
      // circle_member_id: "" //被审核的圈子成员id
      // created_at: "", //创建时间
      // header_img: "", //头像
      // name: "" //会员名称
    };
  },
  activated() {
    this.circleId = Number(this.$route.query.id);
    this.getMembers();
  },
  methods: {
    setTabsIndex(index, type) {
      this.tabsIndex = index;
      let url = "";
      let params = {};
      if (type == 0) {
        url = "plugin.circle.frontend.circle-member.get-circle-memberList";
        params = { circle_id: this.$route.query.id, is_review: 0 };
      } else {
        url = "plugin.circle.frontend.circle-invitation.review-invitation-list";
        params = { circle_id: this.$route.query.id };
      }
      $http
        .get(url, params)
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              if (type == 0) {
                this.memberList = response.data.data;
              } else {
                this.postList = response.data.data;
              }
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

    // 通过审核
    pass(review, memberId, itemIndex) {
      let params = {
        circle_id: this.circleId,
        review: review,
        circle_member_id: memberId
      };
      $http
        .get("plugin.circle.frontend.circle-member.review", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.$delete(this.memberList, itemIndex);
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
    // 驳回审核
    rejectAppeal(review, id, index) {
      let params = {
        circle_id: this.$route.query.id,
        review: review,
        circle_member_id: id
      };
      $http
        .get("plugin.circle.frontend.circle-member.review", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.$delete(this.memberList, index);
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
    swtichTab({ target: { dataset } }) {
      if (!dataset.key) {
        return;
      }
      this.currentShowTab = dataset.key;
      switch (dataset.key) {
      case "members":
        if (this.memberList.length == 0) {
          this.getMembers();
        }
        break;
      case "posts":
        if (this.postList.length == 0) {
          this.getPosts();
        }
        break;
      }
    },
    getMembers() {
      if (this.membersPagination.loading || this.membersPagination.finished) {
        return;
      }
      this.membersPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-member.get-circle-memberList", {
          is_review: 0,
          circle_id: this.circleId,
          page: this.membersPagination.page
        })
        .then(({ data: response, result, msg }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.membersPagination.finished = true;
          }
          this.membersPagination.page++;
          this.memberList.push(...response.data);
          this.membersPagination.loading = false;
        });
    },
    getPosts() {
      if (this.postsPagination.loading || this.postsPagination.finished) {
        return;
      }
      this.postsPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-invitation.review-invitation-list", {
          circle_id: this.circleId,
          is_review: 0,
          page: this.postsPagination.page
        })
        .then(({ data: response, result, msg }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.postsPagination.finished = true;
          }
          this.postsPagination.page++;
          this.postList.push(...response.data);
          this.postsPagination.loading = false;
        });
    },
    reviewPost(itemIndex, reviewType) {
      let passLoading = Toast.loading();
      let post = this.postList[itemIndex];
      $http
        .post("plugin.circle.frontend.circle-invitation.review", {
          invitation_id: post.id,
          review: reviewType == "pass" ? 1 : 2,
          circle_id:this.circleId
        })
        .then(({ result, msg }) => {
          passLoading.clear();
          if (result == 0) {
            Toast(msg);
            return;
          }
          this.postList.splice(itemIndex, 1);
          Toast("审核成功");
        });
    }
  },
  components: {
    cTitle,
    DList,
    VanImage
  }
};
