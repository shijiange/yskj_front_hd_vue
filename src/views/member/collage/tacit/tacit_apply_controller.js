import { Toast } from "vant";
import cGoodsList from "components/goodsList";

export default {
  components: { cGoodsList },
  data() {
    // var now = new Date();
    // var year = now.getFullYear(); // 年
    // var month = now.getMonth() + 1; // 月
    // var day = now.getDate(); // 日
    // let today = year + "-" + month + "-" + day;
    return {
      headerTagIndex: this.$route.query.levelId,

      click: false,
      diyform: {},
      diydata: [],
      upload_name: "", // 点击上传图片的名字
      datas: [], // 已提交表单后,回显遍历的数组
      share_description: "", // 分享描述
      uploadUrl: "",
      status: 0, // 是否已提交
      types: {
        "0": "diyinput",
        "1": "diytextarea",
        "3": "diycheckbox",
        "4": "diyradio",
        "5": "diyimg",
        "2": "diyselect",
        "7": "diydate",
        "9": "diycity",
        "99": "diypwd",
        "88": "diyusername"
      },
      pickerValue: new Date(),
      showCity: false,
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
      description: "", // 详情信息

      loading: false,
      goodsId: "",
      optionsId: "",
      total: "",

      agreementText: "",
      agreementChoose: false,
      agreementShow: false,

      diyradioPopupColumns: [], 		//单选数据
      diyradioPopupShow: false,
      diyradioPopupItem: {},

      applyLevelList: [],
      goods: [],

      conditionFlag: false,
      team_performance_amount: null,
      direct_push: null,
      member_level: [],

      pickerShow: false
    };
  },
  mounted() {

  },
  computed: {
    diytextareaName() {
      return (data) => {
        let name = "文本框";
        if (data.tp_name != "") name = data.tp_name;
        if (data.tp_must == 1) {
          name += "<span style=\"color:red;line-height:200%;\">*</span>";
        }
        return name;
      };
    }
  },
  created() {

    this.diydata = [];
    this.datas = [];
    this.form_id = this.$route.query.formId;
    if (!this.form_id) {
      //	Toast("该表单不存在！");
      //	this.$router.push(this.fun.getUrl("member"));
    }
    let that = this;
    // this.initShare();
    
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    this.getApplyLevelList();
    this.getLevel(this.$route.query.levelId);
    that.fun.wxShare(
      "",
      { i: that.fun.getKeyByI(),
        type: that.fun.getTyep(),
        mid: that.fun.getKeyByMid() },
      {
        title: that.diyform.title,
        imgUrl: that.thumb,
        description: that.share_description
      }
    );
  },
  methods: {
    initData() {
      this.goods = [];
      this.team_performance_amount = null;
      this.direct_push = null;
      this.member_level = [];
    },
    setHeaderTagIndex(index) {
      this.diydata = [];
      this.datas = [];
      this.getLevel(index);
      this.headerTagIndex = index;
    },
    async getApplyLevelList() {
      let res = await $http
        .get("plugin.collage.api.index.In-formation-data", {
          getEntrance: "getEntrance"
        });
      this.applyLevelList = res.data.getEntrance.level.data;
    },
    async getLevel(levelId) {
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let res = await $http
        .get("plugin.collage.api.index.In-formation-data", {
          getLevel: "getLevel",
          level_id: levelId
        });
      console.log(res.data.getLevel);
      if (res.result != 1) {
        Toast.clear();
        Toast(res.msg);
        this.$router.go(-1);
        return;
      }
      let getLevel = res.data.getLevel;
      if (getLevel.upgraded_form == 1) {
        this.conditionFlag = false;
        this.agreementText = getLevel.agreement;
        this.form_id = getLevel.form_id;
        this.getDiyForm();
      } else if (getLevel.upgraded_form == 0) {
        Toast.clear();
        this.conditionFlag = true;
        this.initData();
        if (getLevel.team_performance_amount) {
          this.team_performance_amount = getLevel.team_performance_amount;
        }
        if (getLevel.direct_push) {
          this.direct_push = getLevel.direct_push;
        }
        if (getLevel.member_level && getLevel.member_level.length != 0) {
          this.member_level = getLevel.member_level;
        }
        if (getLevel.goods_list.length > 0) {
          this.goods = getLevel.goods_list;
        }

      } else Toast.clear();


      console.log(res.data.getLevel);
    },
    async pullLevelAppay(form_data_id) {
      let data = {
        examine: 0,
        level: this.headerTagIndex,
        form_data_id: form_data_id
      };

      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          getLevel: "getLevel",
          level_id: this.headerTagIndex,
          form_id: this.form_id,
          data: data
        });
      console.log(res);
    },
    openDiyradioPopup(item) {
      this.diyradioPopupItem = item;
      this.diyradioPopupShow = true;
      this.diyradioPopupColumns = item.data.tp_text;
    },
    callbackDiyradioPopup(value) {
      this.diyradioPopupItem.value = value;
      this.diyradioPopupShow = false;
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    showIntro() {
      this.intro = true;
    },

    setCity(ret) {
      var retCity = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      // console.log("retCity", retCity);
      // console.log("currentCityKey", this.currentCityKey);
      this.diydata.forEach(item => {
        if (item.name == this.currentCityKey) {
          this.$set(item, "value", retCity);
        }
      });
    },
    openPicker(name) {
      this.currentDateKey = name;
      //this.$refs.picker.open();
      this.pickerShow = true;
    },
    setDate(ret) {
      // console.log(ret.Format("yyyy-MM-dd"));
      this.diydata.forEach(item => {
        if (item.name == this.currentDateKey) {
          this.$set(item, "value", ret.Format("yyyy-MM-dd"));
        }
      });
      this.pickerShow = false;
    },
    // 获得具体表单的名字
    chooseUpload(name) {
      this.upload_name = name;
      // console.log(this.upload_name);
      return true;
    },
    // vant 多其他图片上传
    onRead_2(e, flag) {
      // if (flag !== true) {
      //   if (e.file.size > this.photosize) {
      //     this.imgPreview(e.file, 3);
      //     return false;
      //   }
      // }
      // var That = this;
      // var real_length = 0;
      // var max_length = 0;
      // var real_list1 = [];
      // var real_list2 = [];
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (this.upload_name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          // console.log(real_name);
          index = i;
          // max_length = this.diydata[i].data.tp_max;
          // real_list1 = this.diydata[i][real_name + "Value1"];
          // real_list2 = this.diydata[i][real_name + "Value2"];
          // console.log(this.diydata[i][real_name + "Value1"]);
          break;
        }
      }
      let fd = new FormData();
      if (
        this.diydata[index][real_name + "Length"] ==
        this.diydata[index].data.tp_max ||
        this.diydata[index][real_name + "Length"] >=
        this.diydata[index].data.tp_max
      ) {
        this.$notify({
          background: "#fef0f0",
          message: "图片数量已达到上限",
          color: "#f56c6c"
        });
        return false;
      }
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      fd.append("attach", "upload");

      // 添加加载提示
      Toast.loading({
        message: "",
        forbidClick: true
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            this.diydata[index][real_name + "Length"]++;
            this.diydata[index][real_name + "Value1"].push({
              url: responseData.data.img_url
            });
            // console.log(this.diydata[index][real_name + "Value1"]);

            if (flag === true) {
              this.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e)
              });
            } else {
              this.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e.file)
              });
            }
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        }).catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1: function(item, delIndex) {
      // console.log(item);
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (item.name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          // console.log(real_name);
          index = i;
          break;
        }
      }
      this.diydata[index][real_name + "Value1"].splice(delIndex, 1);
      this.diydata[index][real_name + "Value2"].splice(delIndex, 1);
      this.diydata[index][real_name + "Length"] = this.diydata[index][
        real_name + "Value1"
      ].length;
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
        if (item.data.tp_must == 1 && !item.value && item.type != "diyimg") {
          // console.log(item.data.tp_name, item.value);
          Toast(item.data.tp_name + "必须填写哦");
          this.isValidation = false;
        }
        if (item.data.tp_must == 1 && item.type == "diyimg") {
          if (item[item.name + "Length"] <= 0) {
            this.isValidation = false;
            Toast(item.data.tp_name + "必须填写哦");
          }
        }
        if (item.type == "diycheckbox" && item.value.length == 0) {
          console.log(item.data.tp_name, item.value);

          Toast(item.data.tp_name + "必须填写哦");
          this.isValidation = false;
        }
      });
    },
    submit() {
      // console.log("submit");
      // console.log(this.upload_name);
      this.validation();
      // console.log(this.diydata);
      if (!this.isValidation) {
        return;
      }
      if (!this.agreementChoose) {
        Toast("请阅读并同意协议");
        return;
      }

      this.submitConference();
    },

    submitConference() {
      if (this.click) {
        return;
      }
      var that = this;
      var formData = [];
      var formObject = {};
      that.click = true,
      setTimeout(() => {
        that.click = false;
      }, 5000);
      this.diydata.forEach(item => {
        if (item.type == "diyimg") {
          var arr = [];
          for (let i = 0; i < item[item.name + "Value1"].length; i++) {
            arr.push(item[item.name + "Value1"][i].url);
          }
          formObject[item.name] = arr;
        } else {
          formObject[item.name] = item.value;
        }
      });

      // console.log("formObject", formObject);
      formData.push(formObject);
      console.log(formData);
      $http
        .post("plugin.diyform.api.diy-form.save-form-data", {
          form_data: formData,
          form_id: that.form_id
        })
        .then(
          function(response) {
            if (response.result == 1) {

              if (that.goodsId) {
                that.$router.push(
                  that.fun.getUrl("goodsorder", {}, {
                    tag: "-2", //立即购买,
                    goodsId: that.goodsId,
                    optionsId: that.optionsId,
                    total: that.total
                  })
                );
              } else {
                that.getDiyForm(true);
              }
            } else {
              Toast(response.msg);
              if (that.goodsId) {
                that.fun.getUrl("activityDiyForm", {
                  id: that.form_id,
                  goodsId: that.goodsId,
                  optionsId: that.optionsId,
                  total: that.total
                });
              } else {
                that.getDiyForm(true);
              }
              return;
            }
          },
          function(response) {
            alert("fail");
          }
        );
    },

    getDiyForm(handClick = false) {
      var that = this;
      if (this.fun.isTextEmpty(this.form_id)) {
        console.log(
          "error:: 报单form_id为空！！ url:src\viewsdiy_form_controller.js"
        );
        return;
      }
      $http
        .get("plugin.diyform.api.diy-form.getDiyFormTypeMemberData", {
          form_id: this.form_id
        })
        .then(
          function(response) {
            Toast.clear();
            if (response.result === 1) {
              that.loading = true;
              if (handClick && response.data.form_data_id) that.pullLevelAppay(response.data.form_data_id);
              if (response.data.status === 1) {
                that.status = response.data.status;
                that.diyform = response.data;
                that.thumb = response.data.thumb;
                that.share_description = response.data.share_description;
                that.description = response.data.description;
                const fields = that.diyform.fields;
                for (let field in fields) {
                  var list = {
                    title: fields[field].tp_name,
                    value: fields[field].value,
                    data_type: fields[field].data_type
                  };
                  if (list.data_type == "3") {
                    list.value = fields[field].value.join(",");
                  }
                  that.datas.push(list);
                }

                return 0;
              }
              that.diyform = response.data;
              var fields = that.diyform.fields;
              that.thumb = response.data.thumb;
              that.share_description = response.data.share_description;
              that.description = response.data.description;
              that.status = response.data.status;
              var f;
              for (var field in fields) {
                // console.log(fields);
                // console.log(fields[field].data_type);
                // console.log(that.types[fields[field].data_type]);
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
                    value: "",
                    type: that.types[fields[field].data_type]
                  };
                  if (f.data.default_time_type === 1) {
                    var now = new Date();
                    var year = now.getFullYear(); // 年
                    var month = now.getMonth() + 1; // 月
                    var day = now.getDate(); // 日
                    var today = year + "-" + month + "-" + day;
                    f.value = today;
                  } else if (f.data.default_time_type === 2) {
                    f.value = f.data.default_time;
                  }
                } else if (that.types[fields[field].data_type] == "diyimg") {
                  f = {
                    name: field,
                    data: fields[field],
                    value: "",
                    type: that.types[fields[field].data_type]
                  };
                  f[field + "Length"] = 0;
                  f[field + "Value1"] = [];
                  f[field + "Value2"] = [];
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
              console.log(that.diydata);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    // 初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.diyform.title)
          ? data.shop.name
          : that.diyform.title;
        let _link = that.fun.isMid(document.location.href, data.info.uid);
        let _imgUrl = that.fun.isTextEmpty(that.thumb)
          ? data.shop.icon
          : that.thumb;
        let _desc = that.fun.isTextEmpty(that.share_description)
          ? data.shop.name
          : that.share_description;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          desc: _desc,
          success: function() {
            // Toast("分享成功")
          }
          // cancel: function () {
          //   Toast("取消分享")
          // }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          // type: 'link', // 分享类型,music、video或link，不填默认为link
          // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // Toast("分享成功")
          }
          // cancel: function () {
          //   Toast("取消分享")
          // }
        });
      });
    }


  }
};
