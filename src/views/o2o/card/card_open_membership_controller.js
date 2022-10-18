import cTitle from "components/title";
const OPEN_INDEX_URL = "plugin.universal-card.api.home.getLevel";

export default {
  data() {
    return {
      listArr: [],
      first:true,
      member_goods:'',
      member_level:'',
      has_one_universal_level:''
    };
  },

  activated() {
    this.initData();
    this.getData();
  },

  mounted() {
    if(this.$route.query.title){
      this.fun.setWXTitle(this.$route.query.title);
    }
  },
  methods: {
    initData() {
      this.listArr = [];
      this.member_goods='';
      this.member_level='';

    },

    getData() {
      let that = this;
      $http
        .get(OPEN_INDEX_URL, {}, "加载中")
        .then(res => {
          if (res.result == 1) {
            that.listArr = res.data.member_level;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNext(kid){
      let that = this;
      let json = {
        level_id : kid
      };
      $http
        .get(OPEN_INDEX_URL, json, "加载中")
        .then(res => {
          if (res.result == 1) {
            console.log(res.data);
            that.member_goods = res.data.member_goods;
            that.member_level = res.data.member_level;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openSubmit(value) {
      //判断是否有周期，先跳去选择商品，然后再去选择周期
      if (!this.fun.isTextEmpty(value.has_one_universal_level.goods_spec)) {
        this.$router.push(
          this.fun.getUrl("NewCardList", {
            level_id: value.id,
            spec : 'goods_spec'
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("NewCardList", {
            level_id: value.id
          })
        );
      }
    }
  },
  components: { cTitle }
};
