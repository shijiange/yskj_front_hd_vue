import cTitle from "components/title";

export default {
  data() {
    return {
      goodList: []
    };
  },
  activated() {
    this.level_id = this.$route.params.level_id;
    this.getGoodData();
  },
  methods: {
    getGoodData() {
      $http
        .get("member.member-level.getLevelsGoods", { id: this.level_id })
        .then(response => {
          if (response.result === 1) {
            this.goodList = response.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    buy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    }
  },
  components: { cTitle }
};
