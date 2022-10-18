import DList from "@/components/dlist";
import { Image, Toast } from "vant";
export default {
  data() {
    return {
      attentions: [],
      pagination: {
        loading: false,
        finished: false,
        page: 1
      }
    };
  },
  activated() {
    this.loadMyAttentions();
  },
  methods: {
    loadMyAttentions() {
      if (this.pagination.finished || this.pagination.loading) {
        return;
      }
      this.pagination.loading = true;
      $http
        .get(
          "plugin.circle.frontend.circle-member.my-attention-list",
          {
            page: this.pagination.page
          },
          ""
        )
        .then(({ data: response, result, msg }) => {
          this.pagination.loading = false;
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.pagination.finished = true;
          }
          this.attentions.push(...response.data);
          this.pagination.page++;
        });
    },
    // 取消关注
    unFollow(itemIndex) {
      let member = this.attentions[itemIndex];
      $http
        .post("plugin.circle.frontend.circle-member.cancel-attention", {
          attention_member_id: member.attention_member_id
        })
        .then(({ data: response, result, msg }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          Toast("取消关注成功");
          this.attentions.splice(itemIndex, 1);
        });
    },
    accessMemberCard(isOpenCard, cardId) {
      if (isOpenCard == 1) {
        this.$router.push(
          this.fun.getUrl(
            "BusinessCard",
            {},
            {
              mark_id: cardId
            }
          )
        );
      }
    }
  },
  components: {
    DList,
    VanImage: Image
  }
};
