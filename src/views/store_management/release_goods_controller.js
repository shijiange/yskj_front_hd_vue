import baseSet from "./components/base_set";
import permissions from "./components/permissions";
import discount from "./components/discount";
export default {
  data () {
    return {
      active: 0,
      title: "商品发布",
      goodsId: '',
      getUrl: '',
      getJson: {},
      levelList: [], // 权限列表
      groupsList: [],
      isFinished: false,
      goodsInfo: {},
      widgetsInfo: {},
      discountValues: []
    };
  },
  activated () {
    this.init();
    this.goodsId = this.$route.params.id;
    if (this.fun.isTextEmpty(this.goodsId)) {
      this.getJson = {};
      this.getDatUrl = "plugin.shop-assistant.frontend.goods.add";
      this.title = "商品发布";
    } else {
      this.title = "商品修改";
      this.getJson = {id: this.goodsId};
      this.getDatUrl = "plugin.shop-assistant.frontend.goods.get-detail";
    }
    this.getGoodsDetail();
  },

  methods: {
    init () {
      this.active = 0;
      this.title = "商品发布";
      this.goodsId = '';
      this.getUrl = '';
      this.getJson = {};
      this.levelList = [];
      this.groupsList = [];
      this.isFinished = false;
      this.goodsInfo = {};
      this.widgetsInfo = {};
      this.discountValues = [];
    },
    getGoodsDetail () {
      $http.get(this.getDatUrl, this.getJson, "loading")
        .then((response) => {
          this.isFinished = true;
          let {levels, groups, goods, category_menus, dispatch_templates, dispatch_types} = response.data;
          if (response.result !== 1) {
            this.$router.replace(this.fun.getUrl("storeGoodsManagement"));
            return this.$toast(response.msg);
          }
          this.levelList = levels;
          this.groupsList = groups;
          this.goodsInfo = goods;
          this.categoryMenus = category_menus;
          this.dispatchTemplates = dispatch_templates;
          this.dispatchTypes = dispatch_types;
          this.widgetsInfo = goods ? goods.widgets : {};
          // this.discountValues = this.goodsId ? this.widgetsInfo.discount.discount_value : this.levelList;
          this.discountValues = this.levelList;
        });
    },
    releaseGoods () {
      let baseData = this.$refs.refBaseSet ? this.$refs.refBaseSet.validatorData() : {};
      let permissionData = this.$refs.refPermissions ? this.$refs.refPermissions.validatorData() : {};
      let discountData = this.$refs.refDiscount ? this.$refs.refDiscount.validatorData() : {};
      if (!baseData) {
        return false;
      }

      let mergeData = baseData;
      mergeData.widgets.privilege = permissionData;
      mergeData.widgets.discount = discountData;

      if (!this.fun.isTextEmpty(this.goodsId)) {
        // 修改商品
        mergeData.id = this.goodsId;
        this.saveRequest("plugin.shop-assistant.frontend.goods.update", mergeData, "保存中...");
      } else {
        // 添加商品
        this.saveRequest("plugin.shop-assistant.frontend.goods.create", mergeData, "保存中...");
      }
    },
    // 发送保存修改的请求
    saveRequest(url, data, loadingText) {
      $http.post(url, data, loadingText)
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.$router.push(this.fun.getUrl('storeGoodsManagement'));
        });
    },

  },
  components: {
    baseSet,
    permissions,
    discount,
  },
};