import cTitle from "components/title";
import { Toast } from "vant";
import { Dialog } from "vant";
export default {
  data() {
    return {
      id: "", //圈子id
      name: "", //圈子名称
      member_count: "", //圈子会员数量
      is_review_member: "", //成员加入是否审核：0否，1是
      is_search: "", //圈子是否可以被搜索到：0否，1是
      is_posting: "", //是否除圈主外其他能否发帖：0不能，1能
      is_review_invitation: "", //帖子是否审核：0否，1是
      is_open_member: "" //是否开放成员列表：0否，1是
    };
  },
  activated() {},
  mounted() {
    this.getData();
  },
  methods: {
    // 跳转到圈子资料编辑页面
    editData(id) {
      this.$router.push(this.fun.getUrl("circleEdit", {}, { id: id }));
    },
    // 跳转到会员成员管理页面
    memberMember(id) {
      this.$router.push(this.fun.getUrl("circleMember", {}, { id: id }));
    },
    // 跳转到到审核列表
    audit(id) {
      this.$router.push(this.fun.getUrl("circleChecklist", {}, { id: id }));
    },
    // 修改当前状态
    setPermission(key) {
      let params = {
        circle_id: this.$route.query.id,
        authority_type: key
      };
      $http
        .get("plugin.circle.frontend.circle.set-circle-authority", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
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
    // 删除弹窗确认
    createCircle() {
      Dialog.confirm({
        title: "提示",
        message: "你正在进行删除圈子操作，请确认是否删除",
        confirmButtonText: "删除",
        confirmButtonColor: "#3175fe",
        className: "affirmBox"
      }).then(() => {
        this.deleteCircle();
      });
    },
    getData() {
      $http
        .get("plugin.circle.frontend.circle.get-circle", { circle_id: this.$route.query.id }, "")
        .then(
          response => {
            if (response.result == 0) {
              Toast(response.msg);
              this.$router.push(this.fun.getUrl("circleIndex"));
            } else {
              this.id = response.data.id;
              this.name = response.data.name;
              this.member_count = response.data.member;
              this.is_review_member = response.data.is_review_member;
              this.is_search = response.data.is_search;
              this.is_posting = response.data.is_posting;
              this.is_review_invitation = response.data.is_review_invitation;
              this.is_open_member = response.data.is_open_member;
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
    deleteCircle() {
      let deleteLoading = Toast.loading();
      $http
        .post("plugin.circle.frontend.circle.del-circle", {
          circle_id: this.id
        })
        .then(res => {
          deleteLoading.clear();
          Toast(res.msg);
          this.$router.push(this.fun.getUrl("circleIndex"));
        });
    }
  },
  components: {
    cTitle
  }
};
