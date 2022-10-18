import cTitle from "components/title";
// import District from "../../gov_province_city_area_id"
import { Toast } from "vant";

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      cat_level: "2",
      linshi1: [],
      linshi2: [],
      attrvalue: "",
      attrname: "",
      param: [],
      show3: false,
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
      form: {
        title: "",
        sku: "",
        describe: "",
        thumb: "",
        thumb_url: [],
        content: [],
        stock: ""
      },
      checked: true,
      protocol: "",
      // 图片
      imageUrl: "",
      fileList2: [],
      photosize: 1024 * 1024 * 4, //图片大小限制,
      goodsHandle_1: {},
      dateshow_1: false,
      regional: "请选择商品分类",
      onConfirmbtnIndex: [],
      titleTest: "商品发布",
      isType: false,//是否为商品发布

      cargon_data: {
        title: "",
        sku: "",
        thumb: "",
        price: "",
        market_price: "",
        cost_price: "",
        stock: ""
      },
      // setting sun
      uploadUrl: "",
      fileList1: [],
      upNumMax: 0,
      //其他图片
      upNumMaxOther: 0,
      fileList3: [],
      fileList4: [],
      //拍品详情
      fileList5: [],
      //选择分类
      options: [],
      selectedOptions3: [],
      sectionOptions: [],
      jumpState: true,
      number: 1,
      fuwenben: "0",
      show1: false,
      show2: false,
      checkbox3: ["2"],
      radio1: 1,
      radio: "1",
      list: ["a", "b", "c"],   //引用组件,
      result: ["a", "b"]
    };
  },
  activated() {
    window.scrollTo(0, 0);
    this.initData();
    this.getAgreement();
    this.init();
    this.getJson();
    if (this.$route.params.id) {
      this.form.goods_id = this.$route.params.id;
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      let json = { art: "editGoods", goods_id: this.$route.params.id };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData", json, "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.form.title = response.data.editGoods.title;
            this.form.sku = response.data.editGoods.sku;
            this.form.thumb = response.data.editGoods.thumb;
            this.form.describe = response.data.editGoods.has_one_auction_goods.describe;
            this.form.content = response.data.editGoods.content;
            this.form.thumb_url = response.data.editGoods.thumb_url;
            this.form.stock = response.data.editGoods.stock;
            response.data.editGoods.has_many_params.forEach((item, index, key) => {
              let obj = {};
              obj.attrvalue = item.value;
              obj.attrname = item.title;
              this.param.push(obj);
            });
            this.selectedOptions3 = response.data.editGoods.has_many_goods_category[0].category_ids.split(",");
            this.fuwenben = "1";
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.cat_level = "2";
      this.attrvalue = "";
      this.attrname = "";
      this.param = [];
      this.show3 = false;
      this.form = {
        sku: "",
        describe: "",
        thumb: "",
        thumb_url: [],
        content: [],
        stock: ""
      };
      this.checked = true;
      this.show1 = false;
      this.protocol = "";
      // 图片
      this.photosize = 1024 * 1024 * 4;
      this.imageUrl = "";
      this.fileList2 = [];
      this.photosize = 1024 * 1024 * 4; //图片大小限制,
      this.goodsHandle_1 = {};
      this.dateshow_1 = false;
      this.regional = "请选择商品分类";
      this.onConfirmbtnIndex = [];
      this.titleTest = "商品发布";
      this.isType = false;//是否为商品发布

      this.cargon_data = {
        title: "",
        sku: "",
        thumb: "",
        price: "",
        market_price: "",
        cost_price: "",
        stock: ""
      };
      // setting sun
      this.imageUrl = "";
      this.uploadUrl = "";
      this.fileList1 = [];
      this.fileList2 = [];
      this.upNumMax = 0;
      //其他图片
      this.upNumMaxOther = 0;
      this.fileList3 = [];
      this.fileList4 = [];
      this.fileList5 = [];
      //选择分类
      this.options = [];
      this.selectedOptions3 = [];
      this.sectionOptions = [];
      this.jumpState = true;
      this.number = 1;
      this.show1 = false;
      this.show2 = false;
      this.checkbox3 = ["2"];
      this.radio1 = 1;
      this.radio = "1";
      this.list = ["a", "b", "c"];   //引用组件,
      this.result = ["a", "b"];
      this.fuwenben = "0";
    },
    deleteAttr(index) {
      this.param.splice(index, 1);
    },
    pushAttr() {
      let json = {
        attrname: this.attrname,
        attrvalue: this.attrvalue
      };
      this.param.push(json);
      this.show3 = false;
    },
    addAttr() {
      this.show3 = true;
      this.attrname = "";
      this.attrvalue = "";
    },
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1;//页面滚动距离
      timer = setInterval(function() {
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition);//页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition);//页面向下滚动
        clearInterval(timer);
      }, 1);
    },
    //初始数据
    init() {
      for (var item in this.cargon_data) {
        this.cargon_data[item] = "";
      }
      this.isType = this.fun.isTextEmpty(this.$route.params.goods_id);//return true为商品发布
      this.selectedOptions3 = [];
      this.imageUrl = "";
      this.fileList1 = [];
      this.fileList2 = [];
      this.fileList3 = [];
      this.fileList4 = [];
      this.upNumMax = 0;
      this.upNumMaxOther = 0;
      this.regional = "请选择商品分类";
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
        this.columns[1].values = opt[0].children.map(function(val, index) {
          return val.label;
        });
        if (opt[0].children[0]) {
          if (Array.isArray(opt[0].children[0].children)) {
            this.columns[2].values = opt[0].children[0].children.map(function(
              val,
              index
            ) {
              return val.label;
            });
          } else {
            this.columns[2].values = [];
          }
        }
        // this.columns[1].values = c_arr_2;
      } else {
        this.columns[1].values = [];
      }

      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(opt[i].children)) {
          obj[arr[i]] = opt[i].children.map(function(val, index) {
            return val.label;
          });
          // obj[arr[i]] = arr_2
        } else {
          obj[arr[i]] = [];
        }
        for (let k = 0; k < opt[i].children.length; k++) {
          if (Array.isArray(opt[i].children[k].children)) {
            let arr_3 = opt[i].children[k].children.map(function(val, index) {
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
    //选择分类对接数据
    getJson() {
      let that = this;
      let json = { art: "getGoodsCategory" };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",
          json,
          "加载中"
        )
        .then(
          response => {
            //console.log("显示分类edit", response);
            if (response.result === 1) {
              if (that.cat_level == "2") {

                that.sectionOptions = [];
                for (let i = 0; i < response.data.getGoodsCategory.length; i++) {
                  that.sectionOptions.push({
                    id: response.data.getGoodsCategory[i].id,
                    value: response.data.getGoodsCategory[i].id,
                    label: response.data.getGoodsCategory[i].name,
                    children: []
                  });
                  for (
                    let k = 0;
                    k < response.data.getGoodsCategory[i].childrens.length;
                    k++
                  ) {
                    that.sectionOptions[i].children.push({
                      id: response.data.getGoodsCategory[i].childrens[k].id,
                      value: response.data.getGoodsCategory[i].childrens[k].id,
                      label: response.data.getGoodsCategory[i].childrens[k].name
                    });
                  }
                }
                console.log("---option----", that.sectionOptions);
                that.options = that.sectionOptions;
                /*vant三级联动数据处理*/
                that.goodsHandle_1 = that.goodsHandlefunction_1(that.options);
              } else if (that.cat_level == "3") {

                that.sectionOptions = [];
                for (var i = 0; i < response.data.getGoodsCategory.length; i++) {
                  that.sectionOptions.push({
                    id: response.data.getGoodsCategory[i].id,
                    value: response.data.getGoodsCategory[i].id,
                    label: response.data.getGoodsCategory[i].name,
                    children: []
                  });

                  if (
                    !response.data.getGoodsCategory[i].childrens ||
                    response.data.getGoodsCategory[i].childrens.length < 1
                  ) {
                    // 判断是否有二级分类
                  } else {
                    // that.sectionOptions[i].children = [];
                    for (let k = 0; k < response.data.getGoodsCategory[i].childrens.length; k++) {
                      that.sectionOptions[i].children.push({
                        id: response.data.getGoodsCategory[i].childrens[k].id,
                        value: response.data.getGoodsCategory[i].childrens[k].id,
                        label: response.data.getGoodsCategory[i].childrens[k].name,
                        children: []
                      });

                      if (
                        !response.data.getGoodsCategory[i].childrens[k].childrens ||
                        response.data.getGoodsCategory[i].childrens[k].childrens.length < 1
                      ) {
                        // 判断是否有三级分类
                      } else {
                        // that.sectionOptions[i].children[k].children = [];
                        for (
                          var j = 0;
                          j < response.data.getGoodsCategory[i].childrens[k].childrens.length;
                          j++
                        ) {
                          that.sectionOptions[i].children[k].children.push({
                            id: response.data.getGoodsCategory[i].childrens[k].childrens[j].id,
                            value: response.data.getGoodsCategory[i].childrens[k].childrens[j].id,
                            label: response.data.getGoodsCategory[i].childrens[k].childrens[j].name
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
              }
            } else {
              this.$dialog.alert({message:response.msg});
            }
            that.getGoodsJson();
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取数据
    getGoodsJson() {
      let that = this;
      //console.log("这是release父组件传过来的DataInfo",that.DataInfo)
      if (!that.isType) {
        //console.log('不为空，goods_id：',that.$route.params.goods_id)

        that.selectedOptions3 = [];
        that.selectedOptions3 = [
          Number(that.DataInfo.category_ids.parentid),
          Number(that.DataInfo.category_ids.childid),
          Number(that.DataInfo.category_ids.thirdid)
        ];
        /*vant三级联动写入数据*/
        if (Number(that.DataInfo.category_ids.parentid)) {
          var categorystring = [];
          var cindex = 0;
          var cindex_1 = 0;
          // var cindex_2 = 0;
          that.options.forEach(function(value, index, array) {
            if (value.id == that.DataInfo.category_ids.parentid) {
              cindex = index;
              categorystring.push(value.label);
            }
          });
          that.columns[0].defaultIndex = cindex;
          if (Number(that.DataInfo.category_ids.childid)) {
            that.options[cindex].children.forEach(function(
              value,
              index,
              array
            ) {
              if (value.id == that.DataInfo.category_ids.childid) {
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
            if (Number(that.DataInfo.category_ids.thirdid)) {
              that.options[cindex].children[cindex_1].children.forEach(
                function(value, index, array) {
                  if (value.id == that.DataInfo.category_ids.thirdid) {
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

        that.cargon_data.title = (that.DataInfo.title).replace(/&#60;/g, "<").replace(/&#062;/g, ">").replace(/&#038;/g, "&").replace(/&#034;/g, "\"").replace(/&#039;/g, "'");
        that.cargon_data.sku = that.DataInfo.sku;
        that.imageUrl = that.DataInfo.thumb;


        // if (
        //   that.DataInfo.content != null &&
        //   that.DataInfo.content != ""
        // ) {
        //   //截取商品详情图片的地址，
        //   var a = that.DataInfo.content;
        //   var gerImgString=/src="[^"]+/g;
        //   //console.log(gerImgString)
        //   var arr =a.match(gerImgString);
        //   //console.log("试试",a.match(gerImgString));
        //   var re_arr=[];
        //   if(!that.fun.isTextEmpty(arr)){
        //     for(var i=0,len=arr.length;i<len;i++){
        //       re_arr.push(arr[i].substr(5));
        //     };
        //   }

        //   //console.log("商品详情的图片数组",re_arr);

        //   that.fileList1 = [];
        //   that.fileList2 = [];
        //   that.upNumMax = that.DataInfo.thumb_url.length;
        //   for (var i = 0; i < re_arr.length; i++) {
        //       that.fileList1.push({
        //       url: re_arr[i]
        //       });
        //       that.fileList2.push({
        //       url: re_arr[i]
        //       });
        //   }
        //   //console.log("fileList1,fileList2",that.fileList1,that.fileList2);
        // }


        that.cargon_data.thumb = that.DataInfo.thumb;
        if (
          that.DataInfo.thumb_url != null &&
          that.DataInfo.thumb_url != ""
        ) {
          that.fileList3 = [];
          that.fileList4 = [];
          that.upNumMax = that.DataInfo.thumb_url.length;
          for (var i = 0; i < that.DataInfo.thumb_url.length; i++) {
            that.fileList3.push({
              url: that.DataInfo.thumb_url[i]
            });
            that.fileList4.push({
              url: that.DataInfo.thumb_url[i]
            });
          }
        }

        that.cargon_data.price = that.DataInfo.price;
        that.cargon_data.market_price = that.DataInfo.market_price;
        that.cargon_data.cost_price = that.DataInfo.cost_price;
        that.cargon_data.stock = that.DataInfo.stock;
        // that.cargon_data.virtual_sales = that.DataInfo.virtual_sales;
      } else {
        console.log("goods_id为空，商品发布");
      }
    },
    seleRegional: function() {
      this.dateshow_1 = true;
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
          this.$emit("CoverLayer", false);
          return;
        }
      }
      this.selectedOptions3 = idArray;
      this.dateshow_1 = false;
      this.$emit("CoverLayer", false);
      if (Array.isArray(val)) {
        this.regional = val.join("/");
      } else {
        this.regional = val;
      }
      this.onConfirmbtnIndex = index;
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
      }
      // else if (index == 2) {
      // }
    },
    /*vant图片上传*/
    onRead(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(
          this.fun.getRealUrl(
            "upload.uploadPic"
          ),
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        )
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.imageUrl = URL.createObjectURL(e);
            } else {
              That.imageUrl = URL.createObjectURL(e.file);
            }
            That.form.thumb = responseData.data.img_url;
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    // onRead2(e, flag) {
    //   let fd = new FormData()

    //   if (flag === true) {
    //     fd.append('file', e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
    //   } else {
    //     fd.append('file', e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
    //   }
    //   var That = this
    //   axios
    //     .post(
    //       this.fun.getRealUrl(
    //         'upload.uploadPic'
    //       ),
    //       fd,
    //       {
    //         headers: { 'Content-Type': 'multipart/form-data' }
    //       }
    //   )
    //     .then(response => {
    //       var responseData = response.data
    //       if (responseData.result === 1) {
    //         Toast.clear()
    //         if (flag === true) {
    //           That.imageUrl = URL.createObjectURL(e)
    //         } else {
    //           That.imageUrl = URL.createObjectURL(e.file)
    //         }
    //         That.form.content = `<img src="${responseData.data.img_url}"  style="width:100%;height:100%;"/>`;
    //       } else {
    //         Toast.clear()
    //         Toast(responseData.msg)
    //       }
    //     })
    //     .catch(error => {
    //       Toast.clear()
    //       console.log(error)
    //     })
    // },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        this.onRead_1(e, flag);
      }
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_2(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_2(e[i], flag);
        }
      } else {
        this.onRead_2(e, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(
          this.fun.getRealUrl(
            "upload.uploadPic"
          ),
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        )
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.fileList2.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList2.push({
                url: URL.createObjectURL(e.file)
              });
            }
            That.form.thumb_url.push(responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    // vant 多图片上传
    onRead_2(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(
          this.fun.getRealUrl(
            "upload.uploadPic"
          ),
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        )
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.fileList5.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList5.push({
                url: URL.createObjectURL(e.file)
              });
            }
            That.form.content.push(responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },

    onphotosize2(e) {
      this.imgPreview(e.file, 2);
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
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
              // self.onRead_1(blob, true)
              self.multipleMethod_1(blob, true);

            }, file.type || "image/png");
          };
        };
      }
    },
    removeImg: function(delIndex) {
      this.form.thumb_url.splice(delIndex, 1);
    },
    removeImg1: function() {
      this.form.thumb = "";
    },
    removeImg2: function(delIndex) {
      this.form.content.splice(delIndex, 1);
    },

    toNext() {
      if (this.fun.isTextEmpty(this.form.title)) {
        Toast("请输入拍品标题");
        return;
      }
      if (this.fun.isTextEmpty(this.form.sku)) {
        Toast("请输入拍品单位");
        return;
      }
      if (this.selectedOptions3.length <= 0) {
        Toast("请选择商品分类");
        return;
      }
      if (!this.checked) {
        Toast("请同意竞拍服务协议");
        return;
      } else {
        let json = {
          form: this.form,
          param_title: this.param.length > 0 ? this.param.map((item) => {
            return item.attrname;
          }) : [],
          param_value: this.param.length > 0 ? this.param.map((item) => {
            return item.attrvalue;
          }) : [],
          category: this.selectedOptions3
        };
        console.log(json);
        this.$router.push(
          this.fun.getUrl("publishSecond", json)
        );
      }

    },
    getAgreement() {
      $http
        .get(
          "plugin.auction.api.index.getAuctionData", {}, "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.protocol = response.data.getAgreement.protocol;
            this.cat_level = response.data.getAgreement.cat_level;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    cTitle
  }
};
