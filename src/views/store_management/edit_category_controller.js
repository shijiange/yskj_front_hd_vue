import { Toast } from "vant";
export default {
  data() {
    return {
      categoryId: "",
      parentId: "",
      categoryData: {},
      parentData: {},
    };
  },
  activated() {
    this.initData();
    this.categoryId = this.$route.params.id;
    this.parentId = this.$route.params.parentId;
    if (!this.isEmpty(this.categoryId)) {
      this.getData(this.categoryId);
    }
    if (this.parentId && this.parentId != 0) {  // 创建一级分类，父分类等级为0 不需要请求父级数据
      this.getData(this.parentId);
    }
    this.$set(this.categoryData, 'display_order', 0);
  },

  methods: {
    getData(id) {
      $http.get("plugin.shop-assistant.frontend.category.detail", { id }, "loading").then(response => {
        if (response.result !== 1) {
          return this.$toast(response.msg);
        }
        if (!this.isEmpty(this.categoryId)) {
          this.categoryData = response.data;
        } else {
          this.parentData = response.data;
        }
        // 默认排序为0
        this.categoryData.display_order || (this.$set(this.categoryData, 'display_order', 0));
      });
    },
    multipleMethod_1(e, flag, type) {
      if (type === "goods-img") {
        this.LOADER_IMGS = "goodsImgs";
      } else {
        this.LOADER_IMGS = "otherImgs";
      }
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag, type);
        }
      } else {
        this.onRead_1(e, flag, type);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag, type) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            this.$set(That.categoryData, "thumb_src", responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    sureEdit () {
      if (this.isEmpty(this.categoryData.name)) {
        return this.$toast("分类名称不能为空");
      }
      if (!this.isEmpty(this.categoryId)) {
        this.editCategory();
      } else if (!this.isEmpty(this.parentId)) {
        this.addCategory();
      }
    },
    // 修改分类
    editCategory () {
      let sendJson = {};
      let {level, parent_id, name, thumb_src, display_order, is_home, enabled} = this.categoryData;
      sendJson.category = {
        level, parent_id, name, display_order, is_home, enabled,
        thumb: thumb_src,
      };
      sendJson.id = this.categoryId;
      $http.post("plugin.shop-assistant.frontend.category.update", sendJson, "loading").then(response => {
        this.$toast(response.msg);
        if (response.result === 1) {
          this.$router.push(this.fun.getUrl('storeGoodsCatgory'));
        }
      });
    },

    // 添加分类
    addCategory () {
      let sendJson = {};
      let { name, thumb_src, display_order, is_home, enabled} = this.categoryData;
      sendJson.category = {
        name, display_order, is_home, enabled,
        level: this.parentData.level ? this.parentData.level + 1 : 1, // 顶级为一级
        thumb: thumb_src,
        parent_id: this.parentId
      };
      $http.post("plugin.shop-assistant.frontend.category.create", sendJson, "loading").then(response => {
        this.$toast(response.msg);
        if (response.result === 1) {
          this.$router.push(this.fun.getUrl('storeGoodsCatgory'));
        }
      });
    },

    //复制
    onCopySuccess: function (e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onCopyError: function (e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    isEmpty (str) {
      return (str === '' || str === undefined);
    },
    initData () {
      this.categoryId = "";
      this.parentId = "";
      this.categoryData = {};
      this.parentData = {};
    },
  },

  components: {}
};