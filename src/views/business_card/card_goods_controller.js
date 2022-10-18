import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show1: false,
      inputs: "",
      goodList: [],
      chooseGood: [],
      chooseItem: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.setGoodsData();
    this.getData();
  },
  methods: {
    initData() {
      this.inputs = "";
      this.show1 = false;

      this.goodList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    setGoodsData() {
      if (window.localStorage.getItem("chooseItem")) {
        this.chooseItem = JSON.parse(window.localStorage.getItem("chooseItem"));
      } else {
        this.chooseItem = [];
      }
      this.chooseGood = [];
      for (let i = 0; i < this.chooseItem.length; i++) {
        this.chooseGood.push(this.chooseItem[i].id);
      }
    },
    chooseGoods(item) {
      if (this.chooseGood.includes(item.goods_id)) {
        this.chooseGood.splice(this.chooseGood.indexOf(item.goods_id), 1);
        for (let i = 0; i < this.chooseItem.length; i++) {
          if (this.chooseItem[i].id == item.goods_id) {
            this.chooseItem.splice(i, 1);
          }
        }
        this.show1 = false;
      } else {
        if (this.chooseGood.length >= 8) {
          this.show1 = true;
        } else {
          this.show1 = false;
          this.chooseItem.push({
            title: item.title,
            price: item.price,
            thumb: item.thumb,
            id: item.goods_id
          });
          this.chooseGood.push(item.goods_id);
        }
      }
      // console.log(this.chooseItem, "chooseItem");
    },
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    sureChoose(event) {
      if (this.chooseGood.length === 0) {
        Toast("请选择商品");
        return;
      }

      // 把选择的商品保存在本地
      window.localStorage.setItem(
        "chooseItem",
        JSON.stringify(this.chooseItem)
      );

      let subStr = new RegExp(
        "business_card/card_goods/" + this.$route.params.id
      );
      let result = window.location.href.replace(
        subStr,
        "business_card/edit_card/" + this.fun.getKey("formCard")
      );
      event.preventDefault();
      location.replace(result);
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getData();
      }
    },
    //获取数据
    getData() {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http
        .get(
          "plugin.overseas.frontend.goods.search-goods",
          {
            "search[keyword]": this.inputs,
            page: this.page,
            "search[category]": this.$route.params.id
          },
          " "
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.goodList = response.data.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.overseas.frontend.goods.search-goods",
            {
              "search[keyword]": this.inputs,
              page: this.page,
              "search[category]": this.$route.params.id
            },
            " "
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.goodList = that.goodList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              console.log(response);
            }
          );
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  components: { cTitle }
};
