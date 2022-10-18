import cTitle from "components/title";
import { Toast } from "vant";
import yzSubscribe from "components/ui_components/yz_subscribe";
// import District from 'ydui-district/dist/gov_province_city_area_id'

// const IS_SUPPLIER = -1; // todo 已经成为供应商，无需再申请
// const REPEAT_APPLY = 0; // todo 已经提交申请，等待审核。
// const VISIT_SUCCESS = 1; // todo 访问成功
export default {
  data() {
    return {
      explainFlag: false,
      agreement: false,
      agreementText: "",
      setname: "",
      supplier_status: -2,
      supplier_info: "",
      supplier_form: "",
      isDiyForm: 0,
      applyModel: {
        username: "",
        password: "",
        realname: "",
        mobile: "",
        product: "",
        remark: "",
        // 省市区
        province_name: "",
        city_name: "",
        district_name: "",
        street_name: "",
        group_id:'',
        category_id:'',
        aptitude:[],
        identity: [],
      },
      diyform: {},
      diydata: [],
      types: {
        "88": "diyusername",
        "99": "diypassword",
        "0": "diyinput",
        "1": "diytextarea",
        "3": "diycheckbox",
        "4": "diyradio",
        "2": "diyselect",
        "7": "diydate",
        "9": "diycity",
        "5": "diyimage"
      },
      pickerValue: new Date(),
      showCity: false,
      showCity1: false,
      district: district,
      currentDateKey: "",
      currentCityKey: "",
      checks: [],
      isValidation: true,
      activity_id: "",
      form_id: "",
      conference: {},
      intro: false,
      thumb: "",
      imgUrls: [],
      urlArr: [],
      isPhoto: true,
      btnTitle: "",
      isModify: false,
      previewImg: "",
      isPreview: false,
      currentImageField: "",
      pass_safe: 0,

      startDate: new Date("1900-01-01"),

      imageUrl: "",
      uploadUrl: "",
      fileList1: [],
      upNumMax: 0,
      // 完整地址
      fullAddress: "",
      showAddress: false,
      pickerShow: false,

      // 图片上传
      // form: {
      //   aptitude: []
      // },
      photosize: 1024 * 1024 * 4, //图片大小限制,
      fileList2: [],
      // group_id:'',
      grouping:[],
      is_open_category:'',
      is_open_group:'',
      groupList:[],
      // category_id:'',
      industry:[],
      // 控制图标方向
      grouping_info:false,
      industry_info:false,

      //街道数据
      districtVal: [],
      streetShow: false,
      strShow: false,

      id_card_front: "",
      id_card_side: "",

      // 自定义图片
      apply_page_banner:"",
    };
  },

  activated() {
    this.showAddress = false;
    this.fullAddress = "";
    this.supplier_status = -2;
    this.pass_safe = 0;
    this.diyform = {};
    this.diydata = [];
    this.getData();
    this.imgUrls = [];
    this.currentImageField = "";
    this.pickerShow = false;
    this.id_card_front = "";
    this.id_card_side = "";
    this.upEvent();
    this.getApply();
  },
  // mounted() {},
  watch: {
    "applyModel.password"(newname, oldname) {
      this.msgText = this.checkStrong(newname);
      let element = document.getElementById("tips");
      if (!element) {
        return;
      }
      if (this.msgText == 3) {
        // element.style.color = "#00D1B2";
        element.style.display = "none";
      } else {
        element.style.display = "#D33047";
        element.style.display = "inline-block";
      }
    }
  },

  methods: {
    // 分组
    groupingSelect(){
      this.grouping_info = false;
      this.groupingClick();
      this.applyModel.aptitude = [];
      this.id_card_front = "";
      this.id_card_side = "";

      if(!this.applyModel.group_id){
        this.groupList = [];
        return;
      }
      this.groupList = this.grouping.find(v => v.id === this.applyModel.group_id);
    },
    groupingClick(){
      this.grouping_info = !this.grouping_info;
    },
    // 行业
    industrySelect(){
      this.industry_info = false;
      this.industryClick();
    },
    industryClick(){
      this.industry_info = !this.industry_info;
    },
    // 删除图片
    removeImage: function(delIndex) {
      this.applyModel.aptitude.splice(delIndex, 1);
    },
    // 点击获取上传图片信息
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onReadMore(e[i], flag);
        }
      } else {
        this.onReadMore(e, flag);
      }
    },

    // 上传身份证
    upIdCard (i) {
      this.idI = i;
    },
    onReadIdCard (e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file);
      }
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (this.idI === 0) {
              this.id_card_front = responseData.data.img_url;
            } else {
              this.id_card_side = responseData.data.img_url;
            }
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },

    // vant 多图片上传
    onReadMore(e, flag) {
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
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
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
            That.applyModel.aptitude.push(responseData.data.img_url);
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
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify('上传图片大小不能超过 2MB!')
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
              if (callback === 1) {
                self.onReadIdCard(blob, true);
              } else {
                self.multipleMethod_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    // 获取申请数据
    getApply(){
      let that = this;
      $http.get("plugin.supplier.supplier.controllers.apply.supplier-apply.index").then(
        function(response) {
          console.log(response.data,'获取申请数据');
          if (response.result == 1) {
            that.grouping = response.data.groups;
            that.industry = response.data.categorys;
            that.is_open_group = response.data.is_open_group;
            that.is_open_category = response.data.is_open_category;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    checkStrong(sValue) {
      var modes = 0;
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes;
      if (/\d/.test(sValue)) modes++; //数字
      if (/[a-z]/.test(sValue)) modes++; //小写
      if (/[A-Z]/.test(sValue)) modes++; //大写
      // if (/\W/.test(sValue)) modes++; //特殊字符

      //逻辑处理
      if(modes == 3){
        return sValue.length < 8 ? 2 : 3;
      }else{
        return modes;
      }
    },
    // 获取数据
    getData() {
      let that = this;
      let json = {};

      $http.get("plugin.supplier.supplier.controllers.apply.supplier-apply", json, "加载中...").then(function(response) {
        console.log(response.data);
        if (response.result == 1) {
          that.supplier_status = response.data.status;
          that.pass_safe = response.data.safe;
          that.agreementText = response.data.agreement;
          that.apply_page_banner = response.data.apply_page_banner;

          if (that.supplier_status == 1) {
            if (response.data.is_open_region == "1") {
              that.showAddress = true;
            }
            that.checkEnableDiyForm();
            that.supplier_info = response.data.signature;
            if (that.supplier_info) {
              that.supplier_info = that.supplier_info.replace(/(\r\n|\n|\r)/gm, "<br />");
            }
            return;
          }
          // that.supplier_info = response.data.signature
          // console.log(that.supplier_info)
        } else {
          Toast(response.msg);
        }
      }, function(response) {
        console.log(response);
      });
    },

    // 验证开启表单
    checkEnableDiyForm() {
      let that = this;
      let json = {};
      $http.get("plugin.supplier.supplier.controllers.apply.supplier-apply.is-enable-diyform", json, "").then(function(response) {
        console.log(response.data);
        if (response.result == 1) {
          that.supplier_status = 2;
          that.isDiyForm = 1;
          that.form_id = response.data.form_id;
          that.getForm();
        }
      }, function(response) {
        console.log(response);
      });
    },

    // 获取表单信息
    getForm() {
      var that = this;
      $http.get("plugin.diyform.api.diy-form.get-diy-form-by-id", {
        "form_id": this.form_id,
        "i": this.fun.getKeyByI(),
        "type": this.fun.getTyep()
      }).then(function(response) {
        if (response.result == 1) {
          that.diyform = response.data;
          var fields = that.diyform.fields;
          var f = {};
          for (var field in fields) {
            if (that.types[fields[field].data_type] == "diycheckbox") {
              f = {
                name: field,
                data: fields[field],
                value: [],
                type: that.types[fields[field].data_type]
              };
            } else if (that.types[fields[field].data_type] == "diydate") {
              f = {
                name: field,
                data: fields[field],
                value: "2018-03-29",
                type: that.types[fields[field].data_type]
              };
            } else if (that.types[fields[field].data_type] == "diyimage") {
              f = {
                name: field,
                data: fields[field],
                imgUrls: [],
                isPhoto: false,
                type: that.types[fields[field].data_type]
              };
            } else {
              f = {
                name: field,
                data: fields[field],
                value: "",
                type: that.types[fields[field].data_type]
              };
            }

            that.diydata.push(f);
          }
          console.log("diyform", that.diydata);
        }
      }, function(response) {
        alert("fail");
        // error callback
      });
    },
    // onFileChange: function (event, item) {
    //   console.log('e.target', item)
    //   var files = event.target.files || event.dataTransfer.files
    //   if (!files.length) return
    //   this.createImage(files, event, item)
    // },
    createImage: function(file, e, item) {
      // console.log('1111')
      lrz(file[0], { width: 480 }).then(function(rst) {
        item.imgUrls.push(rst.base64);
        console.log("item", item);
        return rst;
      }).always(function() {
        // 清空文件上传控件的值
        e.target.value = null;
      });
    },
    delImage: function(item, index) {
      this.$dialog.confirm({
        title: "删除",
        mes: "确定删除该图片?",
        opts: () => {
          console.log(item.constructor);
          console.log("delitem:", item);
          console.log("delitemindex:", index);
          // if (index == 1) {
          item.splice(index, 1);
          // }
          // Toast({mes: '你点了确定', timeout: 1000})
        }
      });
      /*mui.confirm('确定删除该图片?','提示', btnArray, function(e) {
        if (e.index == 1) {
          vm.imgUrls.splice(index, 1)
        }
      })*/

    },

    /*saveImage: function(){
      let vm = this
      let urlArr = [],
      imgUrls = this.imgUrls

      for(let i = 0; i < imgUrls.length; i++) {
        if(imgUrls[i].indexOf('file') == -1) {
          //urlArr.push(imgUrls[i].split(',')[1])
          urlArr.push(imgUrls[i])
        } else {
          urlArr.push(imgUrls[i])
        }
      }

      //数据传输操作
              $http.post('upload_handler.php', {
                  imgs: urlArr
              }).then(function (response) {
                  console.log(response)
              }, function (response) {
                  //alert(response.body.msg)
              })
              return
    },*/
    confirmSub(e){
      this.setApplyData();
    },
    errorSub(){
      this.setApplyData();
    },
    // 提交数据
    setApplyData() {
      console.log(this.applyModel);

      if (this.fun.isTextEmpty(this.applyModel.username)) {
        Toast("请填写账号");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.password)) {
        Toast("请填写密码");
        return;
      }

      if (this.msgText != 3 && this.pass_safe == 1) {
        Toast("请正确填写密码");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.realname)) {
        Toast("请填写真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.mobile)) {
        Toast("请填写手机号码");
        return;
      }

      if (this.fun.isMoblie(this.applyModel.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.product)) {
        Toast("请填写产品类型");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.group_id) && this.is_open_group === "1" ) {
        Toast("请选择分组");
        return;
      }
      if (this.fun.isTextEmpty(this.applyModel.category_id) && this.is_open_category === "1") {
        Toast("请选择行业");
        return;
      }
      if (this.fun.isTextEmpty(this.applyModel.aptitude) && this.groupList.up_aptitude === 1) {
        Toast("上传营业执照");
        return;
      }
      if (this.groupList.is_identity === 1 && this.fun.isTextEmpty(this.id_card_side) && this.fun.isTextEmpty(this.id_card_front)) {
        Toast("上传个人身份证");
        return;
      }

      if (!this.agreement) {
        Toast("请先阅读协议");
        return;
      }

      this.applyModel.identity[0] = this.id_card_front;
      this.applyModel.identity[1] = this.id_card_side;
      console.log(this.applyModel.aptitude,'111');
      let that = this;


      let json = { "apply": JSON.stringify(this.applyModel) };

      $http.get("plugin.supplier.supplier.controllers.apply.supplier-apply.apply", json, "提交中...").then(function(response) {
        console.log(response.data);
        if (response.result == 1) {
          that.supplier_status = response.data.status;
        } else {
          Toast(response.msg);
        }
      }, function(response) {
        console.log(response);
      });
    },

    // 去商城
    goHome() {
      this.$router.push(this.fun.getUrl("home"));
    },

    setCity(ret) {
      var retCity = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      console.log("retCity", retCity);
      console.log("currentCityKey", this.currentCityKey);
      this.diydata.forEach(item => {
        if (item.name == this.currentCityKey) {
          this.$set(item, "value", retCity);
        }
      });
    },
    openPicker(name) {
      this.currentDateKey = name;
      this.pickerShow = true;
      console.log("name", name);
      //this.$refs.picker.open()
    },
    setDate(ret) {
      console.log(ret.Format("yyyy-MM-dd"));
      this.diydata.forEach(item => {
        if (item.name == this.currentDateKey) {
          this.$set(item, "value", ret.Format("yyyy-MM-dd"));
        }
      });
      this.pickerShow = false;
    },
    openCity(name) {

      this.currentCityKey = name;
    },
    goback() {
      this.$router.go(-1);
    },
    validation() {
      this.isValidation = true;
      this.diydata.forEach(item => {
        if (item.data.tp_must == 1 && !item.value && item.type != "diyimage") {
          console.log(item.data.tp_name, item.value);
          Toast(item.data.tp_name + "必须填写哦");
          this.isValidation = false;
        }

        if (item.data.tp_must == 1 && item.type == "diyimage") {
          if (item.imgUrls.length < item.data.tp_max) {
            Toast(item.data.tp_name + "必须上传" + item.data.tp_max + "张");
            this.isValidation = false;
          }
        }

        if (item.type == "diycheckbox" && item.value.length == 0) {
          console.log(item.data.tp_name, item.value);
          Toast(item.data.tp_name + "必须选择哦");
          this.isValidation = false;
        }
      });
    },
    submit() {
      console.log("submit");
      this.validation();
      if (!this.isValidation) {
        return;
      }
      if (!this.agreement) {
        Toast("请先阅读协议");
        return;
      }

      this.submitForm();
    },

    // 自定义表单提交
    submitForm() {
      var that = this;
      var formData = [];
      var formObject = {};
      this.diydata.forEach(item => {
        // 图片类型的直接提交图片base64的数组到后台，其它直接传值
        if (item.type == "diyimage") {
          formObject[item.name] = item.imgUrls;
        } else {
          formObject[item.name] = item.value;
        }
      });
      console.log("formObject", formObject);
      formData.push(formObject);
      console.log("要提交了");
      // return;   //todo, 测试先停掉了，需要处理时把return去掉

      let json = { form_id: this.form_id, form_data: formData };
      $http.post("plugin.diyform.api.diy-form.save-diy-form-data", json, "提交中...").then(function(response) {
        if (response.result == 1) {
          that.submitApplyByForm(response.data.form_data_id);
        } else {
          Toast(response.msg);
        }
      }, function(response) {
        // error callback
      });
    },

    submitApplyByForm(fromId) {
      let that = this;
      let json = { "form_data_id": fromId };
      $http.get("plugin.supplier.supplier.controllers.apply.supplier-apply.apply", json, "提交中...").then(function(response) {
        console.log(response.data);
        if (response.result == 1) {
          Toast(response.msg);
          that.$router.go(-1);
        } else {
          Toast(response.msg);
        }
      }, function(response) {
        console.log(response);
      });
    },

    //  setting sun
    // 营业执照上传成功
    handleAptiSuccess(res, file) {
      console.log("------param-----", res);
      if (res.result == 1) {
        for (var i = 0; i < this.diydata.length; i++) {
          if (this.diydata[i].name == res.data.attach) {
            this.diydata[i].imgUrls.push(res.data.img);
          }
        }
      } else {
        Toast(res.msg);
      }
    },
    // 删除上传
    handleAptiRemove(file, fileList) {
      // console.log('handleStoreRemove:', file, fileList, file.response.data.attach)
      this.upNumMax = fileList.length;
      if (!file.response) {
        console.log("上传出错自动删除");
      } else {
        let f = file.response.data.img;
        if (f) {
          for (var i = 0; i < this.diydata.length; i++) {
            if (this.diydata[i].name == file.response.data.attach) {
              let delIndex = "";
              this.diydata[i].imgUrls.forEach(function(val, index, arr) {
                if (val == f) {
                  delIndex = index;
                }
              });
              this.diydata[i].imgUrls.splice(delIndex, 1);
            }
          }
        }
      }
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isPNG = (file.type === "image/png" || file.type === "image/jpeg");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
        // this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$notify("上传头像图片大小不能超过 2MB!");
        // this.$message.error('上传头像图片大小不能超过 2MB!')
        // this.upNumMax = 0
      }
      return isPNG && isLt2M;
    },
    upEvent() {
      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      console.log(this.diydata);
    },
    // 遮挡上传
    occlusion() {
      // this.$message.warning('图片数量已达到上限')
      this.$notify({
        background: "#fef0f0",
        message: "图片数量已达到上限",
        color: "#f56c6c"
      });
    },
    handleChange(file, fileList) {
      this.upNumMax = fileList.length;
    },

    setCity1(value) {
      // 重置街区选择
      this.applyModel.street_name = "";
      this.districtVal = [];
      this.applyModel.province_name = value.itemName1;
      this.applyModel.city_name = value.itemName2;
      this.applyModel.district_name = value.itemName3;
      this.fullAddress = value.itemName1 + " " + value.itemName2 + " " + value.itemName3;
      this.getStreet(value.itemValue3);
    },
    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result == 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    streetChoose() {
      if (this.fun.isTextEmpty(this.fullAddress)) {
        this.$dialog.alert({message:"请先选择所在地区"});
      } else {
        this.streetShow = true;
      }
    },

    streetConfirm(obj) {
      this.applyModel.street_name = obj.areaname;
      this.streetShow = false;
    },
    onCancel() {
      this.streetShow = false;
    },

    // vant 多图片上传
    setIndex(name) {
      this.setname = name;
    },
    onRead_1(e) {
      var That = this;
      let fd = new FormData();
      fd.append("attach", this.setname);
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          for (var i = 0; i < this.diydata.length; i++) {
            if (That.diydata[i].name == responseData.data.attach) {
              That.diydata[i].imgUrls.push(responseData.data.img_url);
            }
          }
        } else {
          Toast(responseData.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    removeImg: function(delIndex, index_1) {
      this.diydata[index_1].imgUrls.splice(delIndex, 1);
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    }

  },
  components: { cTitle,yzSubscribe }
};
