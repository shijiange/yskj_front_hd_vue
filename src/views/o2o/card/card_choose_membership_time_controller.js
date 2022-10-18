import cTitle from "components/title";

const DATA_URL = "plugin.universal-card.api.home.get-goods";

export default {
  data() {
    return {
      nickname: "",
      thumb: "",
      level_name: "",
      priceArr: [],
      isOpen: false,

      currentIndex: 0,

      option_id: 0,
      goods_id: 0,
      date: ""
    };
  },

  activated() {
    this.initData();

    this.getData();
  },

  mounted() {},
  methods: {
    initData() {
      this.nickname = "";
      this.thumb = "";
      this.level_name = "";
      this.priceArr = [];
      this.isOpen = false;
      this.currentIndex = 0;
      this.option_id = 0;
      this.goods_id = 0;
    },
    getData() {
      let json = {
        goods_id: this.$route.params.goods_id,
        level_id: this.$route.params.level_id
      };
      $http
        .get(DATA_URL, json, "加载中")
        .then(res => {
          if (res.result == 1) {
            this.isOpen = this.fun.isTextEmpty(res.data.expire_date)
              ? false
              : true;
            this.nickname = res.data.nickname;
            this.thumb = res.data.thumb;
            this.level_name = res.data.level_name;
            this.priceArr = res.data.level_date;
            this.goods_id = res.data.goods_id;
            this.option_id = res.data.level_date?res.data.level_date[0].option_id:'';
            this.date = res.data.expire_date;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    toggle(index, item) {
      this.option_id = 0;
      this.currentIndex = index;
      this.option_id = item.option_id;
    },

    open() {
      //普通商品
      this.$router.push(
        this.fun.getUrl("goodsorder",{}, {
          tag: "-2",
          goodsId: this.goods_id,
          optionsId: this.option_id,
          total: 1
        })
      );
    }
  },
  components: { cTitle }
};
