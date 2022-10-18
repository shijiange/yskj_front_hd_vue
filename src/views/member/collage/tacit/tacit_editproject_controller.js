// 废弃了
import cAddProjectForm from "../components/add_project_form";
import { Toast } from "vant";

export default {
  components: {  cAddProjectForm },
  data() {
    return {
      datas: {
        params: { bgcolor: "#fff" },
        data: {
          form_id: 32
        }
      },
      form_data_id: 32,
      //地址
      addressShow: false,
      area: district,
      addressName: "请选择地址",
      // 省，市，区,街道
      province: "",
      city: "",
      district: "",

      applyModel: {
        // 省市区 街道id
        provinceId: 0,
        cityId: 0,
        districtId: 0,
        streetId: 0,
        address: ""
      },
      //街道
      streetName: "请选择街道",
      strShow: false,
      streetShow: false,
      districtVal: [],

      //预约
      subscribe: {
        name: "请选择预约项目",
        show: false,
        parentid: 0,
        childid: 0,
        thirdid: 0
      },
      initSubscribeFlag: false,
      //意向
      intention: {
        name: "请选择意向项目",
        show: false,
        parentid: 0,
        childid: 0,
        thirdid: 0
      },
      initIntentionFlag: false,


      fullName: "",
      project_amount: "",
      actual_amount: "",
      project: {},

      //预约和意向的数据
      category: [],

      voucher: [],

      form_data: {},
      is_modify_amount: 0		//是否有修改权限(实际金额和凭证)
    };
  },
  created() {
    if (this.$route.query.detId) {
      this.getProjectConfigInfo();
    } else Toast("系统异常");

  },
  watch: {
    "subscribe.show"() {
      if (!this.initSubscribeFlag) {
        this._initSubscribe();
      }
    },
    "intention.show"() {
      if (!this.initIntentionFlag) {
        this._initIntention();
      }
    }
  },
  methods: {
    async getProjectConfigInfo() {
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          editProject: "editProject",
          id: this.$route.query.detId
        });

      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      this.is_modify_amount = res.data.editProject.setLevel.is_modify_amount;
      this.project = res.data.editProject.project;
      // if(res.data.editProject.setLevel.is_modify_amount!=1){


      let category = this.formatCategory(res.data.editProject.category);
      console.log(category);
      for (let i = 0; i < category.length; i++) {
        if (category[i].children.length == 0) {
          category[i].children.push({ text: "", id: 0, children: [{ text: "", id: 0 }] });
        } else if (category[i].children[0].children.length == 0) {
          category[i].children[0].children.push({ text: "", id: 0 });
        }
        for (let k = 0; k < category[i].children.length; k++) {
          if (category[i].children[k].children.length == 0) {
            category[i].children[k].children.push({ text: "", id: 0 });
          }
        }
      }
      this.category = category;
      let has_many_project_category = res.data.editProject.project.has_many_project_category;
      console.log(has_many_project_category);
      for (let i = 0; i < has_many_project_category.length; i++) {
        //预约项目
        let item = has_many_project_category[i];
        if (item.project_type == 1) {
          this.subscribe.name = item.has_one_category.name;
          this._formatSubscribe(item.category_ids);
          //意向项目
        } else if (item.project_type == 2) {
          this.intention.name = item.has_one_category.name;
          this._formatIntention(item.category_ids);
        }
      }


      let form = res.data.editProject.form_data;
      let form_data = res.data.editProject.project.form_data;
      for (let i in form) {
        if (form[i].data_type == 5) {
          let imgArr = form_data[0][i];
          form[i].tp_must = [];
          if (imgArr.length != 0) {
            for (let k of imgArr) {
              form[i].tp_must.push({ url: k });
            }
          }
        } else {
          form[i].tp_must = form_data[0][i];
        }

      }
      this.$refs.addProjectForm.formatFormData(form, 2);


      this.fullName = res.data.editProject.project.project_full_name;
      this.voucher = res.data.editProject.project.voucher_url;
      this.project_amount = res.data.editProject.project.project_amount;
      if (res.data.editProject.project.actual_amount != "0.00") {
        this.actual_amount = res.data.editProject.project.actual_amount;
      }

      this.applyModel = {
        provinceId: res.data.editProject.project.province_id,
        cityId: res.data.editProject.project.city_id,
        districtId: res.data.editProject.project.district_id,
        streetId: res.data.editProject.project.street_id
      };
      this.processingAddress();
      this.getStreet(this.applyModel.districtId);


    },
    onConfirmSubscribe(evt) {
      let arr = this.$refs.subscribe.getIndexes();
      let obj = this._formatCategory(arr);
      this.subscribe.parentid = obj.parentid;
      this.subscribe.childid = obj.childid;
      this.subscribe.thirdid = obj.thirdid;
      if (obj.parentName != "" && obj.parentName != null) this.subscribe.name = obj.parentName;
      if (obj.childName != "" && obj.childName != null) this.subscribe.name = obj.childName;
      if (obj.thirdName != "" && obj.thirdName != null) this.subscribe.name = obj.thirdName;
      this.subscribe.show = false;
    },
    _formatSubscribe(ids) {
      let idArr = ids.split(",");
      this.subscribe.parentid = idArr[0] ? idArr[0] : 0;
      this.subscribe.childid = idArr[1] ? idArr[1] : 0;
      this.subscribe.thirdid = idArr[2] ? idArr[2] : 0;

    },
    _initSubscribe() {

      this.initSubscribeFlag = true;
      let category = this.category;
      let childArr = [];
      let thirdArr = [];
      if (this.subscribe.parentid != 0) {
        for (let i = 0; i < category.length; i++) {
          if (category[i].id == this.subscribe.parentid) {
            this.$nextTick(() => {
              this.$refs.subscribe.setColumnIndex(0, i);
            });
            childArr = category[i].children;
            break;
          }
        }
      }
      if (this.subscribe.childid != 0) {
        for (let i = 0; i < childArr.length; i++) {
          if (childArr[i].id == this.subscribe.childid) {
            this.$nextTick(() => {
              this.$refs.subscribe.setColumnIndex(1, i);
            });
            thirdArr = childArr[i].children;
            break;
          }
        }
      }
      if (this.subscribe.thirdid != 0) {
        for (let i = 0; i < thirdArr.length; i++) {
          if (thirdArr[i].id == this.subscribe.thirdid) {
            this.$nextTick(() => {
              this.$refs.subscribe.setColumnIndex(2, i);
            });
            break;
          }
        }
      }
    },
    onConfirmIntention(evt) {
      let arr = this.$refs.intention.getIndexes();
      let obj = this._formatCategory(arr);
      this.intention.parentid = obj.parentid;
      this.intention.childid = obj.childid;
      this.intention.thirdid = obj.thirdid;
      if (obj.parentName != "" && obj.parentName != null) this.intention.name = obj.parentName;
      if (obj.childName != "" && obj.childName != null) this.intention.name = obj.childName;
      if (obj.thirdName != "" && obj.thirdName != null) this.intention.name = obj.thirdName;
      this.intention.show = false;
    },
    _formatIntention(ids) {
      let idArr = ids.split(",");
      this.intention.parentid = idArr[0] ? idArr[0] : 0;
      this.intention.childid = idArr[1] ? idArr[1] : 0;
      this.intention.thirdid = idArr[2] ? idArr[2] : 0;

    },
    _initIntention() {

      this.initIntentionFlag = true;
      let category = this.category;
      let childArr = [];
      let thirdArr = [];
      if (this.intention.parentid != 0) {
        for (let i = 0; i < category.length; i++) {
          if (category[i].id == this.intention.parentid) {
            this.$nextTick(() => {
              this.$refs.intention.setColumnIndex(0, i);
            });
            childArr = category[i].children;
            break;
          }
        }
      }
      if (this.intention.childid != 0) {
        for (let i = 0; i < childArr.length; i++) {
          if (childArr[i].id == this.intention.childid) {
            this.$nextTick(() => {
              this.$refs.intention.setColumnIndex(1, i);
            });
            thirdArr = childArr[i].children;
            break;
          }
        }
      }
      if (this.intention.thirdid != 0) {
        for (let i = 0; i < thirdArr.length; i++) {
          if (thirdArr[i].id == this.intention.thirdid) {
            this.$nextTick(() => {
              this.$refs.intention.setColumnIndex(2, i);
            });
            break;
          }
        }
      }
    },
    _formatCategory(arr) {
      console.log(arr);
      let parentid = this.category[arr[0]].id;
      let childid = this.category[arr[0]].children[arr[1]].id;
      let thirdid = this.category[arr[0]].children[arr[1]].children[arr[2]].id;
      let parentName = this.category[arr[0]].text;
      let childName = this.category[arr[0]].children[arr[1]].text;
      let thirdName = this.category[arr[0]].children[arr[1]].children[arr[2]].text;
      return { parentid, childid, thirdid, parentName, childName, thirdName };
    },
    //处理地址
    processingAddress() {
      let addressName = "";
      for (let i = 0; i < district.length; i++) {
        if (district[i].v == this.applyModel.provinceId) {
          let cityArr = district[i].c;
          addressName += district[i].n + " ";
          for (let j = 0; j < cityArr.length; j++) {
            if (cityArr[j].v == this.applyModel.cityId) {
              let quArr = cityArr[j].c;
              addressName += cityArr[j].n + " ";
              for (let k = 0; k < quArr.length; k++) {
                if (quArr[k].v == this.applyModel.districtId) {
                  addressName += quArr[k].n;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
      this.addressName = addressName;
      console.log(addressName);
    },
    saveInfo(formData) {
      if (this.fullName == "") return Toast("请填写姓名");
      if (this.project_amount == "" || this.project_amount == 0) return Toast("请输入预估金额");
      if (this.is_modify_amount == 1) {
        if (this.actual_amount == "" || this.actual_amount == 0) return Toast("请输入实际金额");
      }

      if (this.applyModel.districtId == 0) return Toast("请选择地址");
      if (this.subscribe.parentid == 0) return Toast("请选择预约项目");
      if (this.intention.parentid == 0) return Toast("请选择意向项目");
      if (this.is_modify_amount == 1) {
        if (this.voucher.length < 1) return Toast("请上传至少一张凭证");
      }

      let json = {};
      let category = [{
        parentid: this.subscribe.parentid,
        childid: this.subscribe.childid,
        thirdid: this.subscribe.thirdid,
        project_type: 1
      }, {
        parentid: this.intention.parentid,
        childid: this.intention.childid,
        thirdid: this.intention.thirdid,
        project_type: 2
      }];
      json.spell_type = 0;
      json.type = 0;
      json.form_data = formData;
      json.province_id = this.applyModel.provinceId;
      json.city_id = this.applyModel.cityId;
      json.district_id = this.applyModel.districtId;
      json.street_id = this.applyModel.streetId;
      json.project_full_name = this.fullName;
      json.project_amount = this.project_amount;
      json.actual_amount = this.actual_amount;
      json.voucher = this.voucher;
      json.is_modify_amount = this.is_modify_amount;
      console.log(json);
      this.pushProject(json, category);
    },
    async pushProject(json, category) {
      Toast.loading({
        message: "提交中",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          editProject: "editProject",
          category,
          id: this.$route.query.detId,
          data: json
        });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }

      this.$router.go(-1);

      console.log(res);
    },
    // 地址回调
    addressCallback(obj) {
      // this.form.street = ""
      // this.districtVal = ""
      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.provice = obj.itemName1;
      this.city = obj.itemName2;
      this.district = obj.itemName3;

      console.log(obj.itemValue1, obj.itemValue2, obj.itemValue3);

      this.applyModel.provinceId = obj.itemValue1;

      this.applyModel.cityId = obj.itemValue2;

      this.applyModel.districtId = obj.itemValue3;
      console.log("地址回调");
      this.getStreet(obj.itemValue3);
    },
    streetConfirm(item) {
      this.streetName = item.areaname;
      this.applyModel.streetId = item.id;
      // console.log(this.applyModel.streetId)
      this.streetShow = false;
    },
    onRead_2(e) {
      // 添加加载提示
      let fd = new FormData();
      fd.append("file", e.file);
      fd.append("attach", "upload");
      Toast.loading({
        message: " ",
        forbidClick: true
      });
      let uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      axios
        .post(uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            this.voucher.push(responseData.data.img_url);
          } else {
            Toast(responseData.msg);
          }
          Toast.clear();
        })
        .catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1(key) {
      this.voucher.splice(key, 1);
    },
    /*
		subscribeConfirm(item){
			this.subscribe.name = item.name;
			this.subscribe.parentid = item.id;
			this.subscribe.show = false;
		},
		intentionConfirm(item){
			this.intention.name = item.name;
			this.intention.parentid = item.id;
			this.intention.show = false;
		},
		*/
    // 获取街道
    getStreet(param) {

      $http.get("member.memberAddress.street", { district_id: param })
        .then(response => {

          if (response.result === 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
              this.districtVal = response.data;
              this.strShow = true;
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id == this.applyModel.streetId) {
                  this.streetName = response.data[i].areaname;
                  break;
                }
              }
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        }).catch(error => {
          console.log("失败了");
          console.log(error);
        });
    },
    formatCategory(arr) {
      let category = [];
      for (let i = 0; i < arr.length; i++) {
        let o1 = {};
        o1.text = arr[i].name;
        o1.id = arr[i].id;
        //o1.values=arr[i].id;
        if (arr[i].has_many_children && arr[i].has_many_children.length != 0) {
          o1.children = this.formatCategory(arr[i].has_many_children);
          //	o1.values = "123456789";
        } else {
          o1.children = [];
          //	o1.values = "123456789";
        }
        category.push(o1);
      }
      return category;
    }
  }
};