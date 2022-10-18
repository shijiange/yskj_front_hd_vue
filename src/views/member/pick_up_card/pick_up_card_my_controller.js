import cTitle from "components/title";

export default {
  components: {
    cTitle
  },
  data() {
    return {
      listData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    toPickCardMyDet(id) {
      this.$router.push(this.fun.getUrl("pickUpCardMyDet", {}, { cardId: id }));
    },
    getData() {
      $http.get("plugin.picking-card.frontend.pickingCard.getIsBindCardList")
        .then((response) => {
          if (response.result === 1) {
            console.log(response);
            this.listData = response.data;
          }
        });
    }
  }
};