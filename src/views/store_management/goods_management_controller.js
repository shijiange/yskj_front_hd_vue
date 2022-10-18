import cTitle from 'components/title';

export default {
  data() {
    return {
      active: '',
      keyWord: '',
      isBatchOperation: false,
      allCheck: false,
      goodsList: [],
      batchGoods: [], // 批量操作的商品id
      optionBtns: [
        {text: "批量上架", type: "up"},
        {text: "批量下架", type: "down"},
        {text: "批量删除", type: "delete"},],
      btnActive: -1,


      pagination: {
        page: 1,
        total: 0,
        loading: false,
        finished: false
      }
    };
  },
  activated() {
    this.initData();
    this.getGoodsList();
  },
  methods: {
    // 批量操作
    selectBolfun () {
      this.isBatchOperation = true;
    },
    // 全选
    toggleAll () {
      this.$refs.checkboxGroup.toggleAll(this.allCheck);
    },

    // 取消全选操作
    cancelBatchOperation () {
      this.isBatchOperation = false;
    },

    // 商品列表
    getGoodsList () {
      if (this.pagination.loading && this.pagination.finished) {
        return false;
      }
      let requestParams = {
        page: this.pagination.page,
        search: {
          title: this.keyWord
        }
      };
      if (this.active !== '') {
        requestParams.search.status = this.active;
      }
      this.pagination.loading = true;
      $http.post("plugin.shop-assistant.frontend.goods.get-list", {...requestParams}, "loading")
        .then((response) => {
          this.pagination.loading = false;
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          const { data: data, page, per_page, total } = response.data;
          if (this.pagination.page >= page || response.data.data.length < per_page) {
            this.pagination.finished = true;
          }
          this.goodsList = this.pagination.page <= 1 ? data : this.goodsList.concat(data);
          this.pagination.page = this.pagination.page + 1;
          this.pagination.total = total;
        });
    },
    // 不同商品状态
    changeTabs () {
      this.keyWord = '';
      this.goodsList = [];
      this.pagination = {
        page: 1,
        total: 0,
        loading: false,
        finished: false
      };
      this.getGoodsList();
    },
    // 搜索
    searchGoods () {
      this.goodsList = [];
      this.pagination = {
        page: 1,
        total: 0,
        loading: false,
        finished: false
      };
      this.getGoodsList();
    },

    // 上下架
    onShelf (goodsId, option) {
      let tipText = option?'上架':'下架';
      this.$dialog.confirm({title: "提示", message: `是否${tipText}该商品`}).then(() => {
        $http.post("plugin.shop-assistant.frontend.goods.update-on-shelf", {id: goodsId, status: option}, `${tipText}中...`)
          .then((response)=>{
            this.$toast(response.msg);
            if (response.result === 1) {
              this.initData();
              this.getGoodsList();
            }
          });
      }).catch(() => {
        this.$toast("您取消了操作");
      });
    },

    // 删除商品
    deleteGoods (goodsId) {
      this.$dialog.confirm({title: "提示", message: "是否删除该商品"}).then(() => {
        $http.post("plugin.shop-assistant.frontend.goods.delete", {id: goodsId}, '删除中...')
          .then((response)=>{
            this.$toast(response.msg);
            if (response.result === 1) {
              this.initData();
              this.getGoodsList();
            }
          });
      }).catch(() => {
        this.$toast("取消删除");
      });
    },

    // 批量处理器
    handlerBatchOpt (opt, index) {
      this.btnActive = index;
      if (this.batchGoods.length === 0) {
        return this.$toast("请先选择需要批量操作的商品");
      }
      if (opt.type === "up"){
        this.batchOnShelf(1);
      } else if (opt.type === "down"){
        this.batchOnShelf(0);
      } else {
        this.batchDelte();
      }
    },
    // 批量上下架
    batchOnShelf (option) {
      let tipText = option?'上架':'下架';
      this.$dialog.confirm({title: "提示", message: ` 正在进行批量${tipText}操作，是否继续？`}).then(() => {
        $http.post("plugin.shop-assistant.frontend.goods.batch-update-shelf", {ids: this.batchGoods, status: option}, `${tipText}中...`)
          .then((response)=>{
            this.$toast(response.msg);
            if (response.result === 1) {
              this.initData();
              this.getGoodsList();
            }
          });
      }).catch(() => {
        this.$toast("您取消了操作");
      });
    },
    // 批量删除
    batchDelte () {
      this.$dialog.confirm({title: "提示", message: "正在进行批量删除操作，是否继续？"}).then(() => {
        $http.post("plugin.shop-assistant.frontend.goods.batch-delete", {ids: this.batchGoods}, '删除中...')
          .then((response)=>{
            this.$toast(response.msg);
            if (response.result === 1) {
              this.initData();
              this.getGoodsList();
            }
          });
      }).catch(() => {
        this.$toast("取消删除");
      });
    },

    // 初始化
    initData () {
      this.keyWord = '';
      this.goodsList = [];
      this.pagination = {
        page: 1,
        total: 0,
        loading: false,
        finished: false
      };
    },
  },

  components: {cTitle}
};