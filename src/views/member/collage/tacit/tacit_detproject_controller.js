
import cDetProjectForm from "../components/det_project_form";
import { Toast } from "vant";

export default {
  components: { cDetProjectForm },
  data() {
    return {
      networkLoading: false,
      currentTime: 0,
      datas: {
        params: { bgcolor: "#fff" },
        data: {
          form_id: 32
        }
      },
      form_data_id: 0,
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

      //预约
      subscribe: {
        name: "",
        show: false,
        parentid: 0,
        childid: 0,
        thirdid: 0
      },

      //意向
      intention: {
        name: "",
        show: false,
        parentid: 0,
        childid: 0,
        thirdid: 0
      },

      fullName: "",
      project_amount: "",
      actual_amount: "",

      shell_type: 0,
      project: {},

      //预约和意向的数据
      category: [],

      form_data: {}
    };
  },
  created() {
    let date = new Date();
    this.currentTime = parseInt(date.getTime());

    if (this.$route.query.detId) {
      this.getProjectConfigInfo();
    } else Toast("系统异常");


  },
  methods: {
    async getProjectConfigInfo() {
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          detProject: "detProject",
          id: this.$route.query.detId
        });
      if (res.result == 1) {
        this.networkLoading = true;
        this.category = res.data.detProject.project.category;
        this.form_data = res.data.detProject.project.form;
        let form = res.data.detProject.project.form;
        let form_data = res.data.detProject.project.form_data;
        for (let i in form) {
          form[i].tp_must = form_data[0][i];
          console.log(form_data[0][i], i);
        }

        this.$nextTick(() => {
          console.log(this.$refs.detProjectForm);
          this.$refs.detProjectForm.formatFormData(form);
        });

        this.project = res.data.detProject.project;
        this.shell_type = res.data.detProject.project.shell_type;
        this.fullName = res.data.detProject.project.project_full_name;
        this.project_amount = res.data.detProject.project.project_amount;
        this.actual_amount = res.data.detProject.project.actual_amount;
        this.applyModel = {
          provinceId: res.data.detProject.project.province_id,
          cityId: res.data.detProject.project.city_id,
          districtId: res.data.detProject.project.district_id,
          streetId: res.data.detProject.project.street_id
        };
        this.processingAddress();
        this.getStreet(this.applyModel.districtId);

        let has_many_project_category = res.data.detProject.project.has_many_project_category;
        for (let i = 0; i < has_many_project_category.length; i++) {
          //预约项目
          let item = has_many_project_category[i];
          if (item.project_type == 1) {
            this.subscribe.name = item.has_one_category.name;
            //意向项目
          } else if (item.project_type == 2) {
            this.intention.name = item.has_one_category.name;
          }
        }
      } else Toast(res.msg);
      console.log(res, district);
    },
    saveInfo(formData) {
      if (this.fullName == "") return Toast("请填写姓名");
      if (this.project_amount == "") return Toast("请输入预约金额");
      if (this.applyModel.districtId == 0) return Toast("请选择地址");
      if (this.subscribe.parentid == 0) return Toast("请选择预约项目");
      if (this.intention.parentid == 0) return Toast("请选择意向项目");
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
      console.log(json);
      this.pushProject(json, category);
    },
    async pushProject(json, category) {
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          addProject: "addProject",
          category,
          data: json
        });
      console.log(res);
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
    subscribeConfirm(item) {
      this.subscribe.name = item.name;
      this.subscribe.parentid = item.id;
      this.subscribe.show = false;
    },
    intentionConfirm(item) {
      this.intention.name = item.name;
      this.intention.parentid = item.id;
      this.intention.show = false;
    },
    // 获取街道
    getStreet(param) {

      $http.get("member.memberAddress.street", { district_id: param })
        .then(response => {

          if (response.result === 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {

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
    }
  }
};