import cTitle from "components/title";
import { Toast } from 'vant';
import { ImagePreview } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tapStart: false,
      show: false,
      list: ['全部', '蛋白质', '排毒养颜', '茶饮', '全部', '蛋白质', '排毒养颜', '茶饮'],
      ind: 0,
      showCard: false,
      id: '',
      producer: [],
      goods_list: [],
      classify: [],
      value_s: '',
      classId: '',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  deactivated() {

  },
  activated() {

    this.id = this.$route.params.id;
    this.getData();
    this.getClassify();
    this.onSearch();
  },
  methods: {
    Searchinit() {
      this.classId = 0;
      this.ind = 0;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    goBuy(data) {
      this.$router.push(this.fun.getUrl("managementGoods", { id: data.id, kid: this.id }));
    },
    tapNum(index, id) {
      if (index != this.ind) {
        console.log('1');
        this.ind = index,
        this.classId = id;
      } else if (index == this.ind) {
        console.log('2');
        this.ind = null;
      }
      if(this.ind == null){
        this.ind = 0;
        this.classId = 0;
      }
      this.onSearch();
    },
    proclamation(eid) {
      this.$router.push(this.fun.getUrl("proclamation", { id: eid }));
    },
    tapshowImg(list) {
      ImagePreview(list);
    },
    onClickLeft() {
      this.showCard = false;
    },
    getClassify() {
      $http
        .get(
          "plugin.producer.frontend.goodsCategory.getList",
          { producer_id: this.id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.classify = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .get(
          "plugin.producer.frontend.producer.getProducerCenterById",
          {
            producer_id: this.id,
            page: this.page
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.producer = response.data.producer;
            this.goods_list = response.data.goods_list.data;
            this.total_page = response.data.last_page;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      console.log(this.page, this.total_page);
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        console.log('111111');
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.producer.frontend.goods.searchGoods",
            {
              producer_id: this.id,
              'search[keyword]': this.value_s,
              'search[category]': this.classId,
              page: that.page
            },
            "加载中"
          )
          .then(
            function (response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.goods_list = that.goods_list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              console.error(response.msg);
            }
          );
      }
    },
    onSearch() {
      this.show =false;
      this.page = 1;
      $http
        .get(
          "plugin.producer.frontend.goods.searchGoods",
          {
            page:this.page,
            producer_id: this.id,
            'search[keyword]': this.value_s,
            'search[category]': this.classId
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.goods_list = response.data.data;
            this.total_page = response.data.last_page;
            this.isLoadMore = true;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            this.goods_list = [];
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  components: { cTitle }
};
