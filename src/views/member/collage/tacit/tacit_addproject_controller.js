// 废弃了
import cAddProjectForm from "../components/add_project_form";


import { Toast } from "vant";


export default {
  components: { cAddProjectForm },
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

      //意向
      intention: {
        name: "请选择意向项目",
        show: false,
        parentid: 0,
        childid: 0,
        thirdid: 0
      },

      fullName: "",
      project_amount: "",

      //预约和意向的数据
      category: [],

      form_data: {}
    };
  },
  activated() {

  },
  created() {
    this.getProjectConfigInfo();
  },
  methods: {
    init() {

    },
    async getProjectConfigInfo() {
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          addProject: "addProject"
        });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      if (res.data.addProject.setLevel.is_add_item != 1) {
        this.$dialog.alert({ message: "你当前无添加项目权限" })
          .then(() => {
            this.$router.go(-1);
          }).catch(() => {
          });
      }


      let category = this.formatCategory(res.data.addProject.category);
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
          for (let j = 0; j < category[i].children[k].children.length; j++) {
            let item = category[i].children[k].children[j];
            console.log(item);
            delete item.children;
          }

        }

      }

      this.category = category;
      console.log(this.category);
      this.form_data = res.data.addProject.form_data;
      this.$refs.addProjectForm.formatFormData(this.form_data, 1);


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
    _formatCategory(arr) {
      console.log(this.category[arr[0]]);
      let parentid = this.category[arr[0]].id;
      let childid = this.category[arr[0]].children[arr[1]].id;
      let thirdid = this.category[arr[0]].children[arr[1]].children[arr[2]].id;
      let parentName = this.category[arr[0]].text;
      let childName = this.category[arr[0]].children[arr[1]].text;
      let thirdName = this.category[arr[0]].children[arr[1]].children[arr[2]].text;
      return { parentid, childid, thirdid, parentName, childName, thirdName };

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
      Toast.loading({
        message: "提交中",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          addProject: "addProject",
          category,
          data: json
        });
      Toast.clear();
      if (res.result != 1) {
        Toast(res.msg);
        return;
      }
      this.init();
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
    formatCategory(arr, index = 0) {
      console.log(index);
      let category = [];
      for (let i = 0; i < arr.length; i++) {
        let o1 = {};
        o1.text = arr[i].name;
        o1.id = arr[i].id;
        //o1.values=arr[i].id;
        if (arr[i].has_many_children && arr[i].has_many_children.length != 0) {
          o1.children = this.formatCategory(arr[i].has_many_children, ++index);
          //	o1.values = "123456789";
        } else {
          console.log(index);
          //if(index<3)
          o1.children = [];
          //	o1.values = "123456789";
        }
        category.push(o1);
      }

      return category;
    }
  }
};