import cTitle from "components/title";
import { Toast } from "vant";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      menberList: [], //会员成员数组
      circle_id: "", //圈子id
      header_img: "", //头像
      name: "", //昵称
      created_at: "", //创建时间
      member_id: "", //会员id
      memberPagination: {
        page: 1,
        loading: false,
        finished: false
      },
      circleId: null
    };
  },
  activated() {
    this.circleId = Number(this.$route.query.id);
    this.loadMembers();
  },
  methods: {
    // 获取会员成员列表
    loadMembers() {
      if (this.memberPagination.finished || this.memberPagination.loading) {
        return;
      }
      this.memberPagination.loading = true;
      $http
        .get("plugin.circle.frontend.circle-member.get-circle-memberList", {
          circle_id: this.circleId,
          page: this.memberPagination.page,
          nickname: this.name
        })
        .then(
          ({ data: response, result, msg }) => {
            if (result == 0) {
              Toast(msg);
              return;
            }
            if (response.last_page == response.current_page || response.data.length < response.per_page) {
              this.memberPagination.finished = true;
            }
            this.memberPagination.page++;
            this.menberList.push(...response.data);
            this.memberPagination.loading = false;
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    // 搜索会员成员
    searchMenber() {
      // 防抖
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.menberList = [];
        this.memberPagination = {
          page: 1,
          loading: false,
          finished: false
        };
        this.loadMembers();
      }, 500);
    },
    // 删除会员
    expurgate(member_id, itemIndex) {
      let params = { circle_id: this.circleId, member_id: member_id };
      $http
        .get("plugin.circle.frontend.circle.delete-circle-member", params, "")
        .then(
          response => {
            if (response.result !== 1 || response.msg.indexOf("只有圈主") != -1 || response.msg.indexOf("不能删除") != -1) {
              Toast(response.msg);
            } else {
              this.$delete(this.menberList, itemIndex);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle,
    DList
  }
};
