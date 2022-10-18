import cTitle from "components/title";
export default {
  data() {
    return {
      ratetextshow: ["极差", "失望", "一般", "满意", "惊喜"],
      ratetext: "惊喜",
      star: null,
      comment: "" //评论内容
    };
  },
  methods: {
    getStar(value) {
      console.log(value);
      this.ratetext = this.ratetextshow[value - 1];
    },
    toComment() {
      if (this.comment.length == 0) {
        this.$dialog.confirm({ message: "您还没有输入相关的评论内容"})
          .then(() => {
            this.submitData();
          }).catch(() => {});
      } else {
        this.submitData();
      }
    },
    //提交数据到服务器
    submitData() {
      if (this.$route.params.from == 0) {
        this.$router.go("member");
      } else {
        this.$route.params.brother.$emit("selected", "2");
        this.$router.go(-1);
      }
    }
  },
  components: { cTitle }
};
