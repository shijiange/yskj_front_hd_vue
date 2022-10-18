import cTitle from "components/title";
// 上传图片弹信息
import { Toast } from 'vant';

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

export default {
  components: { cTitle },
  data() {
    return {
      photosize: 1024 * 1024 * 4, //图片大小限制,
      goodsHandle_1: {},
      dateshow_1: false,
      regional: "请选择商品分类",
      onConfirmbtnIndex: [],
      columns: [
        {
          values: [],
          className: "column1",
          defaultIndex: 0
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 0
        },
        {
          values: [],
          className: "column3",
          defaultIndex: 0
        }
      ],
      cargon_data: {
        title: "",
        sku: "",
        thumb: "",
        price: "",
        market_price: "",
        cost_price: "",
        stock: ""
      },
      //setting sun
      imageUrl: "",
      uploadUrl: "",
      fileList1: [],
      fileList2: [],
      upNumMax: 0,
      //选择分类
      options: [],
      selectedOptions3: [],
      sectionOptions: [],
      jumpState: true,
      show1: false,
      show2: false,
      checkbox3: ['2'],
      radio1: 1,
      radio: '1',
      list: ['a', 'b', 'c'],   //引用组件,
      result: ['a', 'b'],
    };
  },
  //setting sun
  activated() {
    this.init();
    this.urlUp();
    this.getClassifyJson();
    // this.getGoodsJson();
  },
  methods: {
    //初始化
    init() {
      for (var item in this.cargon_data) {
        this.cargon_data[item] = "";
      }
      this.imageUrl = "";
      this.selectedOptions3 = [];
      this.fileList1 = [];
      this.fileList2 = [];
      this.upNumMax = 0;
      this.regional = "请选择商品分类";
    },
    //获取数据
    getGoodsJson() {
      let that = this;
      var urls = "";
      var json = {};
      if (that.$route.params.store == "store") {
        urls = "plugin.store-cashier.frontend.store.goods.get-goods-detail";
        json = { goods_id: that.$route.params.goods_id };
      } else if (that.$route.params.store == "supplier") {
        urls = "plugin.supplier.frontend.goods.goods-detail";
        json = { goods_id: that.$route.params.goods_id };
      }
      $http.post(urls, json).then(
        function(response) {
          if (response.result === 1) {
            that.selectedOptions3 = [];
            that.selectedOptions3 = [
              Number(response.data.category_ids.parentid),
              Number(response.data.category_ids.childid),
              Number(response.data.category_ids.thirdid)
            ];
            /*vant三级联动写入数据*/
            if (Number(response.data.category_ids.parentid)) {
              var categorystring = [];
              var cindex = 0;
              var cindex_1 = 0;
              // var cindex_2 = 0;
              that.options.forEach(function(value, index, array) {
                if (value.id == response.data.category_ids.parentid) {
                  cindex = index;
                  categorystring.push(value.label);
                }
              });
              that.columns[0].defaultIndex = cindex;
              if (Number(response.data.category_ids.childid)) {
                that.options[cindex].children.forEach(function(
                  value,
                  index,
                  array
                ) {
                  if (value.id == response.data.category_ids.childid) {
                    cindex_1 = index;
                    categorystring.push(value.label);
                  }
                });
                if (categorystring.length > 0) {
                  that.columns[1].values = that.goodsHandle_1[
                    categorystring[0]
                  ].map(function(val, index) {
                    return Object.keys(val)[0];
                  });
                }

                // that.columns[1].values = arr;
                that.columns[1].defaultIndex = cindex_1;
                if (Number(response.data.category_ids.thirdid)) {
                  that.options[cindex].children[cindex_1].children.forEach(
                    function(value, index, array) {
                      if (value.id == response.data.category_ids.thirdid) {
                        // cindex_2 = index;
                        categorystring.push(value.label);
                      }
                    }
                  );
                  var arr2 = [];
                  if (categorystring.length > 0) {
                    for (
                      let i = 0;
                      i < that.goodsHandle_1[categorystring[0]].length;
                      i++
                    ) {
                      if (
                        Object.keys(
                          that.goodsHandle_1[categorystring[0]][i]
                        )[0] == categorystring[1]
                      ) {
                        arr2 =
                          that.goodsHandle_1[categorystring[0]][i][
                            categorystring[1]
                          ];
                      }
                    }
                  }

                  that.columns[2].values = arr2;
                  that.columns[2].defaultIndex = cindex_1;
                }
              }
              that.regional = categorystring.join("/");
            }

            that.cargon_data.title = (response.data.title).replace(/&#60;/g, "<").replace(/&#062;/g, ">").replace(/&#038;/g, "&").replace(/&#034;/g, '"').replace(/&#039;/g, "'");
            that.cargon_data.sku = response.data.sku;
            that.imageUrl = response.data.thumb;
            that.cargon_data.thumb = response.data.thumb;
            if (
              response.data.thumb_url != null &&
              response.data.thumb_url != ""
            ) {
              that.fileList1 = [];
              that.fileList2 = [];
              that.upNumMax = response.data.thumb_url.length;
              for (var i = 0; i < response.data.thumb_url.length; i++) {
                that.fileList1.push({
                  url: response.data.thumb_url[i]
                });
                that.fileList2.push({
                  url: response.data.thumb_url[i]
                });
              }
            }

            that.cargon_data.price = response.data.price;
            that.cargon_data.market_price = response.data.market_price;
            that.cargon_data.cost_price = response.data.cost_price;
            that.cargon_data.stock = response.data.stock;
            // that.cargon_data.virtual_sales = response.data.virtual_sales;
          } else {
            that.$notify(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //选择分类对接数据
    getClassifyJson() {
      let that = this;
      if (that.$route.params.store == "store") {
        let json = { store_id: that.$route.params.store_id };
        $http
          .get(
            "plugin.store-cashier.frontend.store.goods-category.get-category-by-store-id",
            json
          )
          .then(
            function(response) {
              // console.log('显示分类edit', response);
              if (response.result == 1) {
                that.sectionOptions = [];
                for (var i = 0; i < response.data.list.length; i++) {
                  that.sectionOptions.push({
                    id: response.data.list[i].id,
                    value: response.data.list[i].id,
                    label: response.data.list[i].name,
                    children: []
                  });
                  for (
                    var k = 0;
                    k < response.data.list[i].childrens.length;
                    k++
                  ) {
                    that.sectionOptions[i].children.push({
                      id: response.data.list[i].childrens[k].id,
                      value: response.data.list[i].childrens[k].id,
                      label: response.data.list[i].childrens[k].name
                    });
                  }
                }
                console.log("---option----", that.sectionOptions);
                that.options = that.sectionOptions;
                /*vant三级联动数据处理*/
                that.goodsHandle_1 = that.goodsHandlefunction_1(that.options);
              } else {
                that.$notify(response.msg);
              }
              that.getGoodsJson();
            },
            function(response) {
              console.log(response);
            }
          );
      } else if (that.$route.params.store == "supplier") {
        let json = {};
        $http.post("plugin.supplier.frontend.goods.get-category", json).then(
          function(response) {
            if (response.result == 1) {
              that.sectionOptions = [];
              for (var i = 0; i < response.data.length; i++) {
                that.sectionOptions.push({
                  id: response.data[i].id,
                  value: response.data[i].id,
                  label: response.data[i].name,
                  children: []
                });

                if (
                  !response.data[i].childrens ||
                  response.data[i].childrens.length < 1
                ) {
                  // 判断是否有二级分类
                } else {
                  that.sectionOptions[i].children = [];
                  for (var k = 0; k < response.data[i].childrens.length; k++) {
                    that.sectionOptions[i].children.push({
                      id: response.data[i].childrens[k].id,
                      value: response.data[i].childrens[k].id,
                      label: response.data[i].childrens[k].name,
                      children: []
                    });

                    if (
                      !response.data[i].childrens[k].childrens ||
                      response.data[i].childrens[k].childrens.length < 1
                    ) {
                      // 判断是否有三级分类
                    } else {
                      that.sectionOptions[i].children[k].children = [];
                      for (
                        var j = 0;
                        j < response.data[i].childrens[k].childrens.length;
                        j++
                      ) {
                        that.sectionOptions[i].children[k].children.push({
                          id: response.data[i].childrens[k].childrens[j].id,
                          value: response.data[i].childrens[k].childrens[j].id,
                          label: response.data[i].childrens[k].childrens[j].name
                        });
                      }
                    }
                  }
                }
              }
              console.log("---option----", that.sectionOptions);
              that.options = that.sectionOptions;
              /*vant三级联动数据处理*/
              that.goodsHandle_1 = that.goodsHandlefunction_1(that.options);
            } else {
              that.$notify(response.msg);
            }
            that.getGoodsJson();
          },
          function(response) {
            console.log(response);
          }
        );
      }
    },
    //选择分类
    classifyChange(value) {
      // console.log('选择分类返回值', value);
      this.selectedOptions3 = value;
    },
    //确认编辑
    confirmationEditor() {
      let that = this;
      that.jumpEvent();
      if (that.jumpState == true) {
        var newArr = [];
        if (that.fileList1.length != 0) {
          for (var i = 0; i < that.fileList1.length; i++) {
            newArr.push(that.fileList1[i].url);
          }
        } else {
          newArr = [];
        }

        let urls = "";
        let json = {};

        if (that.$route.params.store == "store") {
          urls = "plugin.store-cashier.frontend.store.goods.edit-goods";
          json = {
            store_id: that.$route.params.store_id,
            category_pid: that.selectedOptions3[0],
            category_cid: that.selectedOptions3[1],
            goods_id: that.$route.params.goods_id,
            title: that.cargon_data.title,
            thumb: that.cargon_data.thumb,
            thumb_url: newArr,
            cost_price: that.cargon_data.cost_price,
            market_price: that.cargon_data.market_price,
            price: that.cargon_data.price,
            // virtual_sales: that.cargon_data.virtual_sales,
            sku: that.cargon_data.sku,
            stock: that.cargon_data.stock
          };
        } else if (that.$route.params.store == "supplier") {
          urls = "plugin.supplier.frontend.goods.edit-goods";
          json = {
            // store_id: that.$route.params.store_id,
            // category: that.selectedOptions3,
            goods_id: that.$route.params.goods_id,
            title: that.cargon_data.title,
            thumb: that.cargon_data.thumb,
            thumb_url: newArr,
            cost_price: that.cargon_data.cost_price,
            market_price: that.cargon_data.market_price,
            price: that.cargon_data.price,
            // virtual_sales: that.cargon_data.virtual_sales,
            sku: that.cargon_data.sku,
            stock: that.cargon_data.stock
          };
          if (that.selectedOptions3.length < 2) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            this.$refs.classify.className = "classify";
            setTimeout(() => {
              this.$refs.classify.className = "";
            }, 3000);
            that.$notify("必须选择二级分类");
            return;
          } else if (that.selectedOptions3.length < 3) {
            json.category_pid = that.selectedOptions3[0];
            json.category_cid = that.selectedOptions3[1];
          } else {
            json.category_pid = that.selectedOptions3[0];
            json.category_cid = that.selectedOptions3[1];
            json.category_tid = that.selectedOptions3[2];
          }
        }

        $http.post(urls, json).then(
          function(response) {
            if (response.result === 1) {
              that.$router.go(-1);
              that.$notify({
                background: "#f0f9eb",
                message: "修改成功",
                color: "#67c23a"
              });
            } else {
              that.$notify(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      } else {
        that.$notify({
          background: "#fef0f0",
          message: "商品信息不完整",
          color: "#f56c6c"
        });
      }
    },
    //跳转判断
    jumpEvent() {
      this.jumpState = true;
      for (var item in this.cargon_data) {
        if (this.cargon_data[item] == "") {
          this.jumpState = false;
        }
      }
      if (this.selectedOptions3.length == 0) {
        this.jumpState = false;
      }
      if (this.imageUrl == "") {
        this.jumpState = false;
      }
      console.log("--state----", this.jumpState);
    },
    //setting sun
    //商品图片
    //上传url
    urlUp() {
      // var uiClass = document.getElementsByClassName('el-cascader__label')[0];
      // uiClass.style.lineHeight = '48px';
      if (this.$route.params.store == "store") {
        this.uploadUrl = this.fun.getRealUrl(
          "plugin.store-cashier.frontend.store.goods.upload",
          {}
        );
      } else if (this.$route.params.store == "supplier") {
        this.uploadUrl = this.fun.getRealUrl(
          "plugin.supplier.frontend.goods.upload",
          {}
        );
      }
    },
    handleStoreSuccess(res, file) {
      // console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.cargon_data.thumb = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      const isPNG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$notify("上传头像图片大小不能超过 2MB!");
      }
      return isPNG && isLt2M;
    },
    //其他图片
    handleAptiSuccess(res, file) {
      if (res.result == 1) {
        // this.cargon_data.thumb_url.push(res.data.img);
        this.fileList1.push({
          url: res.data.img
        });
      } else {
        Toast(res.msg);
      }
    },
    //删除上传
    handleAptiRemove(file, fileList) {
      this.upNumMax = fileList.length;
      let f = file.url;
      if (f) {
        let delIndex = "";
        this.fileList1.forEach(function(val, index, arr) {
          if (val.url == f) {
            delIndex = index;
          }
        });
        this.fileList1.splice(delIndex, 1);
      }
      // console.log('bingqilin', this.fileList1);
    },
    //遮挡上传
    occlusion() {
      this.$notify({
        background: "#fef0f0",
        message: "图片数量已达到上限",
        color: "#f56c6c"
      });
    },
    //上传监听
    handleChange(file, fileList) {
      // console.log('change--u', file, fileList);
      this.upNumMax = fileList.length;
    },
    imgPreview(file, callback) {
      let self = this;
      //判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        //创建一个reader
        let reader = new FileReader();

        //将图片转成base64格式
        reader.readAsDataURL(file);
        //读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;

          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 400,
              maxHeight = 400;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              console.log(blob);
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    /*vant图片上传*/
    onRead(e, flag) {
      // if (flag !== true) {
      //   if (e.file.size > this.photosize) {
      //     this.imgPreview(e.file, 1);
      //     return false;
      //   }
      // }
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); //第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            if (flag === true) {
              That.imageUrl = URL.createObjectURL(e);
            } else {
              That.imageUrl = URL.createObjectURL(e.file);
            }
            That.cargon_data.thumb = responseData.data.img;
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // onphotosize(e){
    //     this.imgPreview(e.file, 1);
    // this.$notify('上传图片大小不能超过 2MB!');
    // },
    // onphotosize_1(e){
    //     this.imgPreview(e.file, 2);
    // this.$notify('上传图片大小不能超过 2MB!');
    // },
    //vant 多图片上传
    onRead_1(e, flag) {
      // if (flag !== true) {
      //   if (e.file.size > this.photosize) {
      //     this.imgPreview(e.file, 2);
      //     return false;
      //   }
      // }
      var That = this;
      let fd = new FormData();
      // if (this.upNumMax == 4 || this.upNumMax >= 4) {
      //   this.$notify({
      //     background: "#fef0f0",
      //     message: "图片数量已达到上限",
      //     color: "#f56c6c"
      //   });
      //   return false;
      // }
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); //第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      fd.append("attach", "upload");
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            // That.upNumMax++;
            That.fileList1.push({
              url: responseData.data.img
            });
            if (flag === true) {
              That.fileList2.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList2.push({
                url: URL.createObjectURL(e.file)
              });
            }
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeImg: function(delIndex) {
      this.fileList1.splice(delIndex, 1);
      this.fileList2.splice(delIndex, 1);
      // this.upNumMax = this.fileList2.length;
    },
    //处理vant三级联动数据
    // };
    goodsHandlefunction_1(opt) {
      var obj = {};
      var arr = opt.map(function(val, index) {
        return val.label;
      });
      this.columns[0].values = arr;
      if (Array.isArray(opt[0].children)) {
        var c_arr_2 = opt[0].children.map(function(val, index) {
          return val.label;
        });
        this.columns[1].values = c_arr_2;
        if (Array.isArray(opt[0].children[0].children)) {
          var c_arr_3 = opt[0].children[0].children.map(function(val, index) {
            return val.label;
          });
          this.columns[2].values = c_arr_3;
        } else {
          this.columns[2].values = [];
        }
      } else {
        this.columns[1].values = [];
      }

      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(opt[i].children)) {
          var arr_2 = opt[i].children.map(function(val, index) {
            return val.label;
          });
          obj[arr[i]] = arr_2;
        } else {
          obj[arr[i]] = [];
        }
        for (var k = 0; k < opt[i].children.length; k++) {
          if (Array.isArray(opt[i].children[k].children)) {
            var arr_3 = opt[i].children[k].children.map(function(val, index) {
              return val.label;
            });
            obj[arr[i]][k] = { [obj[arr[i]][k]]: arr_3 };
          } else {
            obj[arr[i]][k] = { [obj[arr[i]][k]]: [] };
          }
        }
      }
      return obj;
    },
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) {
      var pval_0 = picker.getColumnValue(0);
      var pval_1 = picker.getColumnValue(1);
      // var pval_2 = picker.getColumnValue(2);

      // getColumnIndex	columnIndex
      if (index == 0) {
        if (this.goodsHandle_1[value[0]].length > 0) {
          var arr = this.goodsHandle_1[value[0]].map(function(val, index) {
            return Object.keys(val)[0];
          });
          picker.setColumnValues(1, arr);
          picker.setColumnValues(2, this.goodsHandle_1[value[0]][0][arr[0]]);
        } else {
          picker.setColumnValues(1, []);
          picker.setColumnValues(2, []);
        }
      } else if (index == 1) {
        var arr2 = [];
        for (var i = 0; i < this.goodsHandle_1[pval_0].length; i++) {
          if (Object.keys(this.goodsHandle_1[pval_0][i])[0] == pval_1) {
            arr2 = this.goodsHandle_1[pval_0][i][pval_1];
          }
        }
        picker.setColumnValues(2, arr2);
      } else if (index == 2) {
        console.log(index);
      }
    },
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
    },
    onConfirmbtn: function(val, index) {
      let idArray = [];
      let option = this.options;
      if (Array.isArray(option) && option.length > 0 && Array.isArray(index)) {
        idArray.push(option[index[0]].id);
        if (
          Array.isArray(option[index[0]].children) &&
          option[index[0]].children.length > 0
        ) {
          idArray.push(option[index[0]].children[index[1]].id);
          if (
            Array.isArray(option[index[0]].children[index[1]].children) &&
            option[index[0]].children[index[1]].children.length > 0
          ) {
            idArray.push(
              option[index[0]].children[index[1]].children[index[2]].id
            );
          }
        } else {
          this.$notify("至少要选择二级分类");
          this.dateshow_1 = false;
          return;
        }
      }
      this.selectedOptions3 = idArray;

      this.dateshow_1 = false;
      if (Array.isArray(val)) {
        this.regional = val.join("/");
      } else {
        this.regional = val;
      }
      this.onConfirmbtnIndex = index;
    }
  }
};
