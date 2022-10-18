import { Toast } from "vant";
// 弹窗调用
import { Dialog } from "vant";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      circleInfo: {},
      list: [], //会员成员列表数组
      show: true, //面板是否显示
      reveal: false, //弹窗
      // circle_img: "", //头像
      bg_img: "", //背景
      category_name: "", //分类名称
      synopsis: "", //简介
      member_count: "", //成员数量
      circle_name: "", //圈子名称
      id: "", //圈子id
      //* ---dtj changed---
      currentShowTab: "introduce",
      members: [],
      membersPagination: {
        loading: false,
        finished: false,
        page: 1
      }
    };
  },
  computed: {
    circleJoinOfQuitText() {
      if (this.circleInfo.is_exist) {
        return "退出圈子";
      } else {
        if (this.circleInfo.is_toll) {
          return `加入圈子（申请费用￥${this.circleInfo.price}）`;
        }
        return "加入圈子";
      }
    }
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.circle.frontend.circle.get-circle", { circle_id: this.$route.query.id }, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              this.circleInfo = response.data;
              this.circle_img = response.data.circle_img;
              this.bg_img = response.data.bg_img;
              this.category_name = response.data.category_name;
              this.synopsis = response.data.synopsis;
              this.member_count = response.data.member;
              this.circle_name = response.data.name;
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
    attentionMember(memberIndex) {
      const member = this.members[memberIndex];
      let requestUrl = "plugin.circle.frontend.circle-member.attention-member";
      if (member.is_attention) {
        requestUrl = "plugin.circle.frontend.circle-member.cancel-attention";
      }
      $http
        .post(requestUrl, {
          attention_member_id: member.member_id
        })
        .then(({ msg, result }) => {
          if (result == 1) {
            member.is_attention = !member.is_attention;
          }
          Toast(msg);
        });
    },
    dispatchJoinQuit() {
      if (this.circleInfo.is_exist) {
        this.quitCircle();
      } else {
        this.joinCircle();
      }
    },
    joinCircle() {
      // TODO 加入圈子
    },
    quitCircle() {
      Dialog.confirm({
        title: "是否确认退出该圈子",
        message: "注：付费圈子退出后再次去圈子需交费"
      }).then(res => {
        $http
          .post("plugin.circle.frontend.circle.quit-circle", {
            circle_id: this.circleInfo.id
          })
          .then(({ result, msg }) => {
            if (result == 0) {
              Toast(msg);
              return;
            }
            if (msg.indexOf("自己创建的") != -1) {
              Toast(msg);
              return;
            }
            this.$router.push(this.fun.getUrl("circleIndex"));
          });
      });
    },
    getMembers() {
      if (this.currentShowTab !== "members") {
        return;
      }
      $http.get("plugin.circle.frontend.circle-member.get-circle-memberList", { circle_id: this.id, page: this.membersPagination.page, is_review: 1 }).then(({ result, data: response, msg }) => {
        if (result == 0) {
          Toast(msg);
          return;
        }
        if (response.last_page == response.current_page || response.per_page > response.data.length) {
          this.membersPagination.finished = true;
        }
        this.membersPagination.page++;
        this.members.push(...response.data);
        this.membersPagination.loading = true;
      });
    },
    swtichTab({ target: { dataset } }) {
      if (!dataset.name) {
        return;
      }
      this.currentShowTab = dataset.name;
      if ((dataset.name = "members" && this.members.length == 0)) {
        this.getMembers();
      }
    }
  },
  components: {
    DList
  }
};
