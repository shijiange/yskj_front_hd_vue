import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      id: 0,
      is_edit: false, //是否修改
      category_show: false,
      product_show: false,
      district: district,
      city_show: false,
      unit_price_word: "", //重量后缀
      first_index: -1, //选中的第一级分类的索引值
      pre_first_index: -1,
      category_word: "", //选择分类，拼接的文字，如：'水果/苹果'
      //预选择的分类数据
      pre_category_word: "",
      pre_category_menus: {
        parentid: "",
        childid: "",
        thirdid: ""
      },
      // 产地国家列表
      country_list: [
        "中国",
        "加拿大",
        "德国",
        "美国",
        "巴西",
        "澳大利亚",
        "新西兰",
        "墨西哥",
        "英国",
        "荷兰",
        "意大利",
        "西班牙",
        "爱尔兰",
        "俄罗斯",
        "法国",
        "捷克",
        "智利",
        "阿根廷",
        "乌克兰",
        "瑞士",
        "挪威",
        "芬兰",
        "丹麦",
        "冰岛",
        "苏格兰",
        "巴基斯坦",
        "印度尼西亚",
        "日本",
        "韩国",
        "菲律宾",
        "泰国",
        "新加坡",
        "马来西亚",
        "缅甸"
      ],

      to_examine: "1", //是否审核，暂时用不上
      product_state: [], //期货现货
      unit_price: [], //元/吨
      category_list: [], //分类
      second_list: [],
      third_list: [],
      catlevel: "2", //分类层级

      title: "",
      product_total: "", //供应信息总数
      product_price: "", //供应信息金额
      product_origin: "", //供应信息产地
      province_id: "", //省
      city_id: "", //城市
      product_describe: "", //供应信息名称描述
      unit_price_value: 0, //,
      product_type: 0,
      category_menus: {
        parentid: "",
        childid: "",
        thirdid: ""
      },

      photosize: 1024 * 1024 * 4, // 图片大小限制,
      address: "",
      picture: [],
      fileList2: []
    };
  },

  activated() {
    console.log(district);
    this.initData();
    this.getData();
    if (this.$route.params.id) {
      this.is_edit = true;
      this.id = this.$route.params.id;
      this.getEditData(this.$route.params.id);
    }
    else {
      this.is_edit = false;
      this.id = 0;
    }
  },
  destroyed() {
    // document.querySelector("body").removeAttribute("class");
  },
  watch: {
    unit_price_value() {
      console.log(this.unit_price[this.unit_price_value]);
      let arr = this.unit_price[this.unit_price_value].split("/");
      this.unit_price_word = arr[arr.length - 1];
    }
  },
  mounted() { },
  methods: {
    //初始化数据
    initData() {
      this.category_show = false;
      this.product_show = false;
      this.district = district;
      this.city_show = false;
      this.unit_price_word = "";
      this.first_index = -1;
      this.pre_first_index = -1;
      this.category_word = "";
      //预选择的分类数据
      this.pre_category_word = "";
      this.pre_category_menus = {
        parentid: "",
        childid: "",
        thirdid: ""
      };
      this.to_examine = "1"; //是否审核，暂时用不上
      this.product_state = []; //期货现货
      this.unit_price = []; //元/吨
      this.category_list = []; //分类
      this.second_list = [];
      this.third_list = [];
      this.catlevel = "2"; //分类层级

      this.title = "";
      this.product_total = ""; //供应信息总数
      this.product_price = ""; //供应信息金额
      this.product_origin = ""; //供应信息产地
      this.province_id = ""; //省
      this.city_id = ""; //城市
      this.product_describe = ""; //供应信息名称描述
      this.unit_price_value = 0; //,
      this.product_type = 0;
      this.category_menus = {
        parentid: "",
        childid: "",
        thirdid: ""
      };

      this.photosize = 1024 * 1024 * 4; // 图片大小限制,
      this.address = "";
      this.picture = [];
      this.fileList2 = [];
    },
    // 获得初始化数据
    getData() {
      let that = this;
      $http
        .post("plugin.supply-demand.api.index.InformationData", {
          InformationAdd: "InformationAdd"
        })
        .then(
          response => {
            if (response.result === 1) {
              // Toast(response.msg);
              let InformationAdd = response.data.InformationAdd;
              that.product_state = InformationAdd.product_state;
              that.unit_price = InformationAdd.unit_price;
              that.category_list = InformationAdd.result;
              that.catlevel = InformationAdd.catlevel;
              console.log(that.product_state, that.unit_price);

              // 重量后缀
              let arr = this.unit_price[this.unit_price_value].split("/");
              this.unit_price_word = arr[arr.length - 1];
            } else {
              console.error(response.msg);
              Toast(response.msg);
            }
          },
          function (response) {
            console.log(response);
          }
        );
    },
    // 获得修改数据
    getEditData(id) {
      let json = {
        supplyInformationEdit: "supplyInformationEdit",
        supply_id: id
      };
      $http.post("plugin.supply-demand.api.index.supplyData", json, "").then(
        response => {
          if (response.result === 1) {
            // Toast(response.msg);
            let item = response.data.supplyInformationEdit.item;
            let supplyInformationEdit = response.data.supplyInformationEdit;

            this.title = item.title;
            this.product_type = item.product_type;
            this.unit_price_value = item.unit_price;
            // 重量后缀
            let arr = this.unit_price[this.unit_price_value].split("/");
            this.unit_price_word = arr[arr.length - 1];
            this.product_price = item.product_price;
            this.product_origin = item.product_origin;
            this.product_total = item.product_total;
            this.product_describe = item.product_describe;
            this.picture = item.product_pictures;//图片
            this.province_id = item.province_id;
            this.city_id = item.city_id;

            //地区回显
            let obj = this.district.find(n => {
              return this.province_id == n.v;
            });
            let province = obj;
            console.log(obj);
            let obj2 = province.c.find(n => {
              return this.city_id == n.v;
            });
            let city = obj2;
            this.address = province.n + " " + city.n + " ";


            // 分类回显

            this.category_menus.parentid =
              supplyInformationEdit.category_menus[0].id;
            this.category_menus.childid =
              supplyInformationEdit.category_menus[0].children[0].id;
            this.pre_category_menus.parentid =
              supplyInformationEdit.category_menus[0].id;
            this.pre_category_menus.childid =
              supplyInformationEdit.category_menus[0].children[0].id;
            this.category_word =
              supplyInformationEdit.category_menus[0].name +
              "/" +
              supplyInformationEdit.category_menus[0].children[0].name;
            if (this.catlevel == 3) {
              if (
                supplyInformationEdit.category_menus[0].children[0].children
              ) {
                this.category_word =
                  this.category_word +
                  "/" +
                  supplyInformationEdit.category_menus[0].children[0]
                    .children[0].name;
                this.category_menus.third =
                  supplyInformationEdit.category_menus[0].children[0].children[0].id;
                this.pre_category_menus.third =
                  supplyInformationEdit.category_menus[0].children[0].children[0].id;
              }
            }
          } else {
            console.error(response.msg);
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // 选择产地
    chooseProduct() {
      console.log("change");
      this.product_show = true;
    },
    // 关闭选择产地
    closeProduct() {
      this.product_show = false;
    },
    changeProduct(item) {
      this.product_origin = item;
      this.product_show = false;
    },
    chooseCategory() {
      console.log("change");
      this.category_show = true;
      if (this.first_index == -1) {
        this.second_list = [];
      } else {
        this.second_list = this.category_list[this.first_index].children;
      }
    },

    // 关闭选择分类
    closeCategory() {
      let that = this;
      that.pre_category_menus = JSON.parse(JSON.stringify(that.category_menus));
      that.pre_category_word = "";
      that.category_show = false;
      // that.first_index = that.pre_first_index;
    },
    changeCategoryFirst(index, id) {
      let that = this;
      that.pre_first_index = index;
      that.pre_category_menus.parentid = id;
      that.second_list = that.category_list[index].children;
      // that.pre_category_word = that.category_list[index].name + "/";
    },
    // 选择二级分类
    changeCategorySecond(index, id) {
      let that = this;
      that.pre_category_word = "";
      that.pre_category_menus.childid = id;
      that.category_menus = JSON.parse(JSON.stringify(that.pre_category_menus));
      console.log(that.category_menus);
      that.first_index = that.pre_first_index;
      that.pre_category_word =
        that.category_list[that.first_index].name +
        "/" +
        that.second_list[index].name;
      console.log(that.pre_category_word);
      that.category_word = that.pre_category_word;
      that.category_show = false;
    },
    // 选择三级
    changeCategoryThird(index, index1, id, id1) {
      let that = this;
      that.pre_category_word = "";

      that.pre_category_menus.childid = id;
      that.pre_category_menus.thirdid = id1;

      console.log(that.pre_category_word);
      that.category_menus = JSON.parse(JSON.stringify(that.pre_category_menus));
      console.log(that.category_menus);
      that.first_index = that.pre_first_index;
      that.pre_category_word =
        that.category_list[that.first_index].name +
        "/" +
        that.second_list[index].name +
        "/" +
        that.second_list[index].children[index1].name;
      that.category_word = that.pre_category_word;
      that.category_show = false;
    },
    submitForm() {
      let that = this;
      var json = {};
      if (!this.validation()) {
        console.log("表单验证不通过");
        return false;
      }
      if (this.is_edit == true) {
        json = {
          supplyEdit: "supplyEdit",
          supply_id: this.id,
          title: that.title,
          product_total: that.product_total, //供应信息总数
          product_price: that.product_price, //供应信息金额
          product_origin: that.product_origin, //供应信息产地
          product_pictures: that.picture,
          province_id: that.province_id, //省
          city_id: that.city_id, //城市
          product_describe: that.product_describe, //供应信息名称描述
          unit_price: that.unit_price_value,
          product_type: that.product_type,
          category: that.category_menus
        };
      }
      else {
        json = {
          supplyAdd: "supplyAdd",
          title: that.title,
          product_total: that.product_total, //供应信息总数
          product_price: that.product_price, //供应信息金额
          product_origin: that.product_origin, //供应信息产地
          product_pictures: that.picture,
          province_id: that.province_id, //省
          city_id: that.city_id, //城市
          product_describe: that.product_describe, //供应信息名称描述
          unit_price: that.unit_price_value, //,
          product_type: that.product_type,
          category: that.category_menus
        };
      }

      console.log(json);

      $http.post("plugin.supply-demand.api.index.supplyData", json, "").then(
        response => {
          if (response.result === 1) {
            Toast("操作成功");
            that.$router.go(-1);
          } else {
            console.error(response.msg);
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    validation() {
      if (!this.title) {
        Toast('请输入产品名称');
        return false;
      }
      if (!this.category_menus.parentid) {
        Toast('请选择产品分类');
        return false;
      }
      if (!this.product_price) {
        Toast('请输入单价');
        return false;
      }
      if (!/^([1-9][0-9]*)+(.[0-9]{1,})?$/.test(this.product_price)) {
        Toast('请输入正确单价');
        return false;
      }
      if (!this.product_total) {
        Toast('请输入数量');
        return false;
      }
      if (!/^([1-9][0-9]*)+(.[0-9]{1,})?$/.test(this.product_total)) {
        Toast('请输入正确数量');
        return false;
      }
      if (this.picture.length == 0) {
        Toast('请上传产品图片');
        return false;
      }
      if (!this.province_id) {
        Toast('请选择仓库地址');
        return false;
      }
      if (!this.city_id) {
        Toast('请选择仓库地址');
        return false;
      }
      if (!this.product_describe) {
        Toast('请输入产品描述');
        return false;
      }
      if (!this.product_origin) {
        Toast('请选择产地');
        return false;
      }
      return true;
    },
    // 选择城市回调
    changeCity(res) {
      console.log(res);
      this.province_id = res.itemValue1;
      this.city_id = res.itemValue2;
      this.address = res.itemName1 + " " + res.itemName2 + " ";
    },

    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      // if (flag) {
      //   fd.append("file", e);
      // } else {
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      // }
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            That.picture.push(responseData.data.img_url);
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
    // 超出压缩
    onphotosize(e) {
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
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
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
            canvas.toBlob(function (blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                // self.onRead_1(blob, true)
                self.multipleMethod_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    // 删除图片

    removeImg: function (delIndex) {
      this.picture.splice(delIndex, 1);
    }
  },
  components: { cTitle }
};
