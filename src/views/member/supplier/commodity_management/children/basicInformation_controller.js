// 上传图片弹信息
import { Toast } from "vant";

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

export default {
  components: {},
  props: {
    DataInfo: {
      type: [String, Number, Object],
      default: []
    },
  },
  data() {
    return {
      photosize: 1024 * 1024 * 4, //图片大小限制,
      goodsHandle_1: {},
      dateshow_1: false,
      regional: "请选择商品分类",
      onConfirmbtnIndex: [],
      titleTest: "商品发布",
      isType: false,//是否为商品发布
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
      // setting sun
      imageUrl: "",
      uploadUrl: "",
      fileList1: [],
      fileList2: [],
      upNumMax: 0,
      //其他图片
      upNumMaxOther: 0,
      fileList3: [],
      fileList4: [],
      //选择分类
      options: [],
      selectedOptions3: [],
      sectionOptions: [],
      jumpState: true,
      number: 1,

      show1: false,
      show2: false,
      checkbox3: ["2"],
      radio1: 1,
      radio: "1",
      list: ["a", "b", "c"],   //引用组件,
      result: ["a", "b"],
      shopText:'',
      minStore:false
    };
  },
  activated() {
    this.init();
    this.urlUp();
    this.getJson();
  },
  mounted() {
    this.init();
    this.urlUp();
    this.getJson();
    var orderHight = document.body.clientHeight;
    //console.log("屏幕高度",orderHight)
    this.minStore = this.$route.params.store == 'supplier'?true:false;
    if (this.$route.params.store == "store") {
      document.getElementById("basicInformation").style.height = (orderHight - 126) + "px";
    }
    else if (this.$route.params.store == "supplier") {
      document.getElementById("basicInformation").style.height = (orderHight - 40) + "px";
    }
  },
  methods: {
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
    //获取数据
    getGoodsJson() {
      let that = this;
      console.log("这是release父组件传过来的DataInfo",that.DataInfo);
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

    //选择分类对接数据
    getJson() {
      let that = this;
      if (that.$route.params.store == "store") {
        let json = { store_id: that.$route.params.store_id };
        $http
          .get(
            "plugin.store-cashier.frontend.store.goods-category.get-category-by-store-id",
            json,
            "加载中"
          )
          .then(
            response => {
              //console.log("显示分类edit", response);
              if (response.result === 1) {
                that.sectionOptions = [];
                for (let i = 0; i < response.data.list.length; i++) {
                  that.sectionOptions.push({
                    id: response.data.list[i].id,
                    value: response.data.list[i].id,
                    label: response.data.list[i].name,
                    children: []
                  });
                  for (
                    let k = 0;
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
        $http.post("plugin.supplier.frontend.goods.get-category", json, "加载中").then(
          function(response) {
            //console.log("显示分类edit", response);
            if (response.result === 1) {
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
                  // that.sectionOptions[i].children = [];
                  for (let k = 0; k < response.data[i].childrens.length; k++) {
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
                      // that.sectionOptions[i].children[k].children = [];
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
              // that.$message.error(response.msg);
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
      console.log("选择分类返回值", value);
      this.selectedOptions3 = value;
    },
    //确认发布
    parentHandleclick() {
      var that = this;
      that.jumpEvent();
      var newArr = [];
      if (that.fileList1.length != 0) {
        for (let i = 0; i < that.fileList1.length; i++) {
          newArr.push(that.fileList1[i].url);
        }
      } else {
        newArr = [];
      }
      var newArr2 = [];
      if (that.fileList3.length != 0) {
        for (let i = 0; i < that.fileList3.length; i++) {
          newArr2.push(that.fileList3[i].url);
        }
      } else {
        newArr2 = [];
      }
      // let urls = "";
      let json = {};

      if (that.$route.params.store == "store") {
        //   urls = "plugin.store-cashier.frontend.store.goods.add-goods";
        json = {
          store_id: that.$route.params.store_id,
          category_pid: that.selectedOptions3[0],
          category_cid: that.selectedOptions3[1],
          title: that.cargon_data.title,
          thumb: that.cargon_data.thumb,
          thumb_url: newArr2,
          //good_content: newArr,
          cost_price: that.cargon_data.cost_price,
          market_price: that.cargon_data.market_price,
          price: that.cargon_data.price,
          // virtual_sales: that.cargon_data.virtual_sales,
          sku: that.cargon_data.sku,
          stock: that.cargon_data.stock
        };
        if (that.isType) {
          json.good_content = newArr;
        }
      } else if (that.$route.params.store == "supplier") {
        // urls = "plugin.supplier.frontend.goods.add-goods";
        json = {
          // store_id: that.$route.params.store_id,
          title: that.cargon_data.title,
          thumb: that.cargon_data.thumb,
          thumb_url: newArr2,
          //good_content: newArr,
          cost_price: that.cargon_data.cost_price,
          market_price: that.cargon_data.market_price,
          price: that.cargon_data.price,
          // virtual_sales: that.cargon_data.virtual_sales,
          sku: that.cargon_data.sku,
          stock: that.cargon_data.stock,
        };
        if (that.isType) {
          json.good_content = newArr;
          json.content_text = that.shopText;//增加商品详情文字
        }
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
      //console.log('基本信息的json数据',json)
      that.$emit("getChildoneData", json);
    },
    //跳转测试
    jumpEvent() {
      this.jumpState = true;
      for (let item in this.cargon_data) {
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
    },
    //商品图片上传
    urlUp() {
      // var uiClass = document.getElementsByClassName('el-cascader__label')[0];
      // uiClass.style.lineHeight = '48px';
      if (this.$route.params.store == "store") {
        this.uploadUrl = this.fun.getRealUrl(
          "upload.uploadPic",
          {}
        );
      } else if (this.$route.params.store == "supplier") {
        this.uploadUrl = this.fun.getRealUrl(
          "upload.uploadPic",
          {}
        );
      }
    },
    handleStoreSuccess(res, file) {
      console.log("------param-----", res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.cargon_data.thumb = res.data.img;
        console.log("url-fabu", this.imageUrl);
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
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
    //  setting sun
    //商店图片
    handleAptiSuccess(res, file) {
      console.log("------param-----", res, file);
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
      console.log("handleStoreRemove:", file, fileList);
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
    },
    //遮挡上传
    occlusion() {
      // this.$message.warning('图片数量已达到上限');
      this.$notify({
        background: "#fef0f0",
        message: "图片数量已达到上限",
        color: "#f56c6c"
      });
    },
    //上传监听
    handleChange(file, fileList) {
      console.log("change--u", file, fileList);
      this.upNumMax = fileList.length;
    },
    //其他图片
    handleAptiSuccessOther(res, file) {
      console.log("------param-----", res, file);
      if (res.result == 1) {
        // this.cargon_data.thumb_url.push(res.data.img);
        this.fileList3.push({
          url: res.data.img
        });
      } else {
        Toast(res.msg);
      }
    },
    //删除上传
    handleAptiRemoveOther(file, fileList) {
      console.log("handleStoreRemove:", file, fileList);
      this.upNumMaxOther = fileList.length;
      let f = file.url;
      if (f) {
        let delIndex = "";
        this.fileList3.forEach(function(val, index, arr) {
          if (val.url == f) {
            delIndex = index;
          }
        });
        this.fileList3.splice(delIndex, 1);
      }
    },
    //遮挡上传
    occlusionOther() {
      // this.$message.warning('图片数量已达到上限');
      this.$notify({
        background: "#fef0f0",
        message: "图片数量已达到上限",
        color: "#f56c6c"
      });
    },
    //上传监听
    handleChangeOther(file, fileList) {
      console.log("change--u", file, fileList);
      this.upNumMaxOther = fileList.length;
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
              } else if (callback === 2) {
                self.multipleMethod_1(blob, true);
              } else {
                self.multipleMethod_2(blob, true);
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
            console.log("url-fabu", That.imageUrl);
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
    // onphotosize_2(e){
    //     this.imgPreview(e.file, 3);
    // this.$notify('上传图片大小不能超过 2MB!');
    // },

    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        this.onRead_1(e, flag);
      }
    },
    multipleMethod_2(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_2(e[i], flag);
        }
      } else {
        this.onRead_2(e, flag);
      }
    },
    //vant 多图片上传
    onRead_1(e, flag) {
      // if (flag !== true) {
      //   if (e && e.length) { // 判断是否是多图上传 多图则循环添加进去
      //     e.forEach(item => {
      //       if (item.file.size > this.photosize) {
      //         this.imgPreview(item.file, 2);
      //         return false;
      //       }
      //     });
      //   } else {
      //     if (e.file.size > this.photosize) {
      //       this.imgPreview(e.file, 2);
      //       return false;
      //     }
      //   }
      // }
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      var That = this;
      let fd = new FormData();
      // if (this.upNumMax == 4 || this.upNumMax >= 4) {
      //   this.$notify("图片数量已达到上限");
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
            Toast.clear();
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
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    removeImg: function(delIndex) {
      this.fileList1.splice(delIndex, 1);
      this.fileList2.splice(delIndex, 1);
      // this.upNumMax = this.fileList2.length;
    },
    //vant 多其他图片上传
    onRead_2(e, flag) {
      // if (flag !== true) {
      //   if (e && e.length) { // 判断是否是多图上传 多图则循环添加进去
      //     e.forEach(item => {
      //       if (item.file.size > this.photosize) {
      //         this.imgPreview(item.file, 3);
      //         return false;
      //       }
      //     });
      //   } else {
      //     if (e.file.size > this.photosize) {
      //       this.imgPreview(e.file, 3);
      //       return false;
      //     }
      //   }
      // }
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      var That = this;
      let fd = new FormData();
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
            // That.upNumMaxOther++;
            Toast.clear();
            That.fileList3.push({
              url: responseData.data.img
            });
            if (flag === true) {
              That.fileList4.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList4.push({
                url: URL.createObjectURL(e.file)
              });
            }
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
    removeImg_1: function(delIndex) {
      this.fileList3.splice(delIndex, 1);
      this.fileList4.splice(delIndex, 1);
      // this.upNumMaxOther = this.fileList3.length;
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
    seleRegional: function() {
      this.dateshow_1 = true;
      // this.$emit("CoverLayer", true);
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
        console.log("1");
      }
    },
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
      this.$emit("CoverLayer", false);
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
    isCoverLayer() {
      this.$emit("CoverLayer", false);
    }
  }
};
