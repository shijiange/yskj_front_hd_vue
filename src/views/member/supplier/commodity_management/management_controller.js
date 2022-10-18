import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  components: {
    cTitle
  },
  data() {
    return {
      commodity_data: [],
      goods_length: "",
      type: "",
      goods_audit: 0,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      goods_search:""
    };
  },
  activated() {
    this.type = this.$route.params.store;
    this.init();
    this.getJson();
    if (this.$route.params.store == "store") {
      this.getGoodsAaudit();
    }
  },
  methods: {
    // 搜索商品
    onSearch() {
      let url = '';
      let json = {};
      if (this.$route.params.store == "store") {
        url = "plugin.store-cashier.frontend.store.goods.get-goods-list";
        json = {
          goods_name:this.goods_search,
          store_id: this.$route.params.store_id
        };
      } else if (this.$route.params.store == "supplier") {
        url = "plugin.supplier.frontend.goods.get-goods-list";
        json = {
          sid: this.$route.params.store_id,
          goods_name:this.goods_search
        };
      }
      $http.get(url,json).then(response => {
        if(response.result == 1){
          if(this.$route.params.store == "store"){
            this.commodity_data = response.data.goods_data.data;
            this.page = response.data.goods_data.current_page
            this.total_page = response.data.goods_data.last_page
          }else{
            this.commodity_data = response.data.list.data;
            this.page = response.data.list.current_page
            this.total_page = response.data.list.last_page
          }
        }else{
          Toast(response.msg)
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    onCancel() {
      this.goods_search = ''
    },
    getGoodsAaudit() {
      $http.get("plugin.store-cashier.frontend.store.setting.get-goods-audit").then(response => {
        if (response.result === 1) {
          this.goods_audit = response.data.goods_audit;
        }
      }, function(response) {
        Toast(response.msg);
      }).catch((err) => {
        console.log(err);
      });
    },
    init() {
      this.goods_length = "";
      this.commodity_data = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.goods_audit = 0;
      this.goods_search = ''
      // this.emptyEditActive();
    },
    changeGoodsStatus(item, index) {
      if (this.$route.params.store === "supplier") {
        return;
      }
      let status = 0;
      if (item.status !== 1) {
        status = 1;
      }
      $http.get("plugin.store-cashier.frontend.store.goods.changeGoodsStatus", {
        goods_id: item.id,
        status: status
      }, "加载中").then(response => {
        if (response.result === 1) {
          this.commodity_data.status = 1;
          if (status === 1) {
            this.commodity_data[index].status = 1;
            Toast("上架成功");
          } else {
            Toast("下架成功");
            this.commodity_data[index].status = 0;
          }
        } else {
          if (status === 1) {
            Toast("上架失败");
          } else {
            Toast("下架失败");
          }
        }
      }, function(response) {
        Toast(response.msg);
      }).catch((err) => {
        console.log(err);
      });
    },
    //商品数据获取
    getJson() {
      var that = this;
      let urls = "";
      let json = {};
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      if (that.$route.params.store == "store") {
        urls = "plugin.store-cashier.frontend.store.goods.get-goods-list";
        json = {
          store_id: that.$route.params.store_id
        };
      } else if (that.$route.params.store == "supplier") {

        urls = "plugin.supplier.frontend.goods.get-goods-list";
        json = {
          sid: that.$route.params.store_id
        };
      }
      $http.post(urls, json, "加载中").then(function(response) {
        if (response.result === 1) {
          that.commodity_data = [];
          if (that.$route.params.store == "store") {
            for (var i = 0; i < response.data.goods_data.data.length; i++) {
              response.data.goods_data.data[i].edit_active = false;
            }
            that.goods_length = response.data.count;
            that.total_page = response.data.goods_data.last_page;
            that.commodity_data = response.data.goods_data.data;
          } else if (that.$route.params.store == "supplier") {
            for (var j = 0; j < response.data.list.data.length; j++) {
              response.data.list.data[j].edit_active = false;
            }
            that.total_page = response.data.list.last_page;
            that.goods_length = response.data.list.total;
            that.commodity_data = response.data.list.data;
          }

          // console.log('--managJson', that.commodity_data);
        } else {
          // 判断权限
          if (response.data.url) {
            that.$notify(response.msg);
            window.location.href = response.data.url;
            return 0;
          }
          // that.$message.error(response.msg);
          that.$notify(response.msg);
        }
      }, function(response) {
        console.log(response);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let urls = "";
      let json = {};

      if (that.$route.params.store == "store") {
        urls = "plugin.store-cashier.frontend.store.goods.get-goods-list";
        json = {
          store_id: that.$route.params.store_id
        };
      } else if (that.$route.params.store == "supplier") {
        urls = "plugin.supplier.frontend.goods.get-goods-list";
        json = {
          sid: that.$route.params.store_id
        };
      }
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = that.page;
        $http.get(urls, json, "加载中").then(function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            if (that.$route.params.store == "store") {
              for (var i = 0; i < response.data.goods_data.data.length; i++) {
                response.data.goods_data.data[i].edit_active = false;
              }
              that.commodity_data = that.commodity_data.concat(response.data.goods_data.data);//数组拼接
            } else if (that.$route.params.store == "supplier") {
              for (var j = 0; j < response.data.list.data.length; j++) {
                response.data.list.data[j].edit_active = false;
              }
              that.commodity_data = that.commodity_data.concat(response.data.list.data);
            }
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        }, function(response) {
          // error callback
        });

      }
    },
    //路由跳转
    routeTake() {
      //商品发布
      this.$router.push(this.fun.getUrl("CommodityRelease", {
        store_id: this.$route.params.store_id,
        store: this.$route.params.store
      }));
      this.emptyEditActive();
    },
    //更多
    moreEvent(index) {
      // console.log('more--ya', index)
      if (this.commodity_data[index].edit_active == false) {
        this.emptyEditActive();
        this.commodity_data[index].edit_active = true;
      } else {
        this.emptyEditActive();
      }

      console.log(this.commodity_data[index].edit_active);
    },
    //清空编辑删除状态
    emptyEditActive() {
      for (var i = 0; i < this.commodity_data.length; i++) {
        this.commodity_data[i].edit_active = false;
      }
    },
    //商品编辑
    editJumpEvent(index) {
      this.$router.push(this.fun.getUrl("CommodityRelease", {
        store_id: this.$route.params.store_id,
        goods_id: this.commodity_data[index].id,
        fromedit: 1,
        store: this.$route.params.store
      }));
    },
    //商品删除
    commodityDelete(index) {
      // console.log(index);
      this.emptyEditActive();
      this.$dialog.confirm({
        title: "提示",
        message: "此操作将永久删除该商品, 是否继续?"
      }).then(() => {
        // on confirm

        var that = this;
        var urls = "";
        var json = {};

        if (that.$route.params.store == "store") {
          urls = "plugin.store-cashier.frontend.store.goods.destroy-goods";
          json = {
            goods_id: that.commodity_data[index].id
          };
        } else if (that.$route.params.store == "supplier") {
          urls = "plugin.supplier.frontend.goods.del-goods";
          json = {
            goods_id: that.commodity_data[index].id
          };
        }

        $http.post(urls, json, "加载中...").then(function(response) {
          console.log("显示", response);
          if (response.result === 1) {
            that.$notify({
              background: "#f0f9eb",
              message: "商品删除成功",
              color: "#67c23a"
            });

            that.commodity_data.splice(index, 1);
            that.goods_length = Number(that.goods_length) - 1;
          } else {
            // that.$message.error(response.msg);
            that.$notify(response.msg);
          }
        }, function(response) {
          console.log(response);
        });
      }).catch(() => {
        // on cancel
        this.$notify({
          background: "#edf2fc",
          message: "已取消删除",
          color: "#909399"
        });
      });
    }

  }
};
