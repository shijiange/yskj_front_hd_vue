<template>
  <div id="diy-form" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <div id="member">
      <div
        class="form"
        v-if="status == 0"
        :class="[index != 0 ? 'formMargin' : '']"
        :style="{ backgroundColor: datas.params.bgcolor }"
      >
        <template v-for="(item, key) in diydata">
          <template v-if="item.type == 'diyinput'">
            <div class="inputWrapper" :key="key">
              <div class="ps">
                <span>{{ item.data.tp_name === "" ? "输入框" : `${item.data.tp_name}` }}</span>
                <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
              </div>
              <input
                type="text"
                class="input"
                :required="item.data.tp_must == 1"
                v-model="item.value"
                :placeholder="item.data.placeholder"
              />
              <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
            </div>
          </template>

          <!--setting sun-->

          <template v-if="item.type == 'diyimg'">
            <van-cell-group :key="key" style="padding-left: 0;" class="blcok" :border="false">
              <div style="margin-top: 0.8rem;">{{ item.data.tp_name === "" ? "图片：" : `${item.data.tp_name}：` }}</div>

              <div
                :key="key"
                class="clearfloat"
                style="display: flex; width: 100%; text-align: center; line-height: 5rem; padding: 1rem; padding-left: 0; padding-top: 0.4rem;"
                :style="{ backgroundColor: datas.params.bgcolor }"
              >
                <template v-for="(val, index) in item[item.name + 'Value2']">
                  <div class="photobox" style="float: left; max-width: 25%;" :key="index">
                    <img :src="val.url" style="max-width: 5rem;"/>
                    <van-icon
                      @click="removeImg_1(item, index)"
                      name="close"
                      style="width: 1.5rem; height: 1.5rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;"
                    />
                  </div>
                </template>
                <div @click="chooseUpload(item.name)" style="margin-left: 0.2rem;">
                  <van-uploader
                    :disabled="item[item.name + 'Length'].length >= item.data.tp_max"
                    style="display: block;"
                    :after-read="onRead_2"
                  >
                    <div
                      style="display: flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;"
                    >
                      <img
                        :src="require('../../../../assets/images/up_icon.png')"
                        style="max-height: 3rem;"
                        class="avatar"
                      />
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diytextarea'">
            <div
              :key="key"
              style="display: flex; padding-left: 0; border-bottom: 0.031rem solid #dee2ee; padding-right: 0.4rem; padding-top: 0.5rem;"
            >
              <van-field
                style="padding: 0;"
                v-model="item.value"
                rows="3"
                autosize
                maxlength="100"
                type="textarea"
                input-align="right"
                :border="false"
                :placeholder="item.data.placeholder"
              >
                <span slot="label" v-html="diytextareaName(item.data)"></span>
              </van-field>
            </div>
          </template>

          <template v-if="item.type == 'diyselect'">
            <div class="inputWrapper" @click="openDiyradioPopup(item)" :key="key">
              <div class="ps">
                <span> {{ item.data.tp_name === "" ? "下拉框" : item.data.tp_name }}</span>
                <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
              </div>
              <div class="input">{{ item.value }}</div>
              <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
            </div>
          </template>

          <template v-if="item.type == 'diyradio'">
            <div class="inputWrapper" @click="openDiyradioPopup(item)" :key="key">
              <div class="ps">
                <span> {{ item.data.tp_name === "" ? "单选框" : item.data.tp_name }}</span>
                <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
              </div>
              <div class="input">{{ item.value }}</div>
              <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
            </div>
          </template>

          <template v-if="item.type == 'diydate'">
            <div class="inputWrapper" @click="openPicker(item.name)" :key="key">
              <div class="ps">
                <span>{{ item.data.tp_name === "" ? "日期" : `${item.data.tp_name}` }}</span>
                <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
              </div>
              <div class="input">{{ item.value }}</div>
              <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
            </div>
          </template>
        </template>

        <van-popup v-model="diyradioPopupShow" round position="bottom">
          <van-picker
            show-toolbar
            :columns="diyradioPopupColumns"
            @cancel="diyradioPopupShow = false"
            @confirm="callbackDiyradioPopup"
          />
        </van-popup>

        <van-popup v-model="pickerShow" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择年月日"
            v-model="pickerValue"
            @cancel="pickerShow = false"
            @confirm="setDate"
          />
        </van-popup>

        <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
          <div class="submit" @click="submit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import District from "ydui-district/dist/gov_province_city_area_id";
import { Toast } from "vant";
// var haveShop = false;

export default {
  //@props: =>tag待定为标识，1为分期购车的自定义表单，可多次提交修改
  props: ["datas", "index", "page_id", "tag", "form_data_id"],
  data() {
    // var now = new Date();
    // var year = now.getFullYear(); // 年
    // var month = now.getMonth() + 1; // 月
    // var day = now.getDate(); // 日
    // let today = year + '-' + month + '-' + day;
    return {
      diyform: {},
      diydata: [],
      upload_name: "", // 点击上传图片的名字
      Backdata: [], // 已提交表单后,回显遍历的数组
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

      diyradioPopupColumns: [], //单选数据
      diyradioPopupShow: false,
      diyradioPopupItem: {},
      pickerShow: false
    };
  },
  computed: {
    diytextareaName() {
      return data => {
        let name = "文本框";
        if (data.tp_name != "") name = data.tp_name;
        if (data.tp_must == 1) {
          name += "<span style=\"color:red;line-height:200%;\">*</span>";
        }
        return name;
      };
    }
  },
  methods: {
    openDiyradioPopup(item) {
      this.diyradioPopupItem = item;
      this.diyradioPopupShow = true;
      this.diyradioPopupColumns = item.data.tp_text;
    },
    callbackDiyradioPopup(value) {
      this.diyradioPopupItem.value = value;
      this.diyradioPopupShow = false;
    },

    openPicker(name) {
      this.currentDateKey = name;
      console.log("name", name);
      //this.$refs.picker.open();
      this.pickerShow = true;
    },
    setDate(ret) {
      console.log(ret.Format("yyyy-MM-dd"));
      this.diydata.forEach(item => {
        if (item.name == this.currentDateKey) {
          this.$set(item, "value", ret.Format("yyyy-MM-dd"));
        }
      });
    },
    formatFormData(fields, status) {
      let that = this;
      var f, field;
      if (status == 1) {
        for (field in fields) {
          if (that.types[fields[field].data_type] == "diydate") {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].value,
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
              value: fields[field].value,
              type: that.types[fields[field].data_type]
            };
            f[field + "Length"] = 0;
            f[field + "Value1"] = [];
            f[field + "Value2"] = [];
          } else {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].value,
              type: that.types[fields[field].data_type]
            };
          }
          that.diydata.push(f);
        }
      } else if (status == 2) {
        for (field in fields) {
          if (that.types[fields[field].data_type] == "diydate") {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].tp_must,
              type: that.types[fields[field].data_type]
            };
          } else if (that.types[fields[field].data_type] == "diyimg") {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].tp_must,
              type: that.types[fields[field].data_type]
            };
            f[field + "Length"] = fields[field].tp_must.length;
            f[field + "Value1"] = [...fields[field].tp_must];
            f[field + "Value2"] = [...fields[field].tp_must];
          } else {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].tp_must,
              type: that.types[fields[field].data_type]
            };
          }
          that.diydata.push(f);
        }
      }
    },
    // 获得具体表单的名字
    chooseUpload(name) {
      this.upload_name = name;
      console.log(this.upload_name);
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
      var That = this;
      // var real_length = 0;
      // var max_length = 0;
      // var real_list1 = [];
      // var real_list2 = [];
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (this.upload_name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          console.log(real_name);
          index = i;
          // max_length = this.diydata[i].data.tp_max;
          // real_list1 = this.diydata[i][real_name + 'Value1'];
          // real_list2 = this.diydata[i][real_name + 'Value2'];
          // console.log(this.diydata[i][real_name + 'Value1']);
          break;
        }
      }
      let fd = new FormData();
      if (
        this.diydata[index][real_name + "Length"] == this.diydata[index].data.tp_max ||
          this.diydata[index][real_name + "Length"] >= this.diydata[index].data.tp_max
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
        message: " ",
        forbidClick: true
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            That.diydata[index][real_name + "Length"]++;
            That.diydata[index][real_name + "Value1"].push({
              url: responseData.data.img_url
            });
            console.log(That.diydata[index][real_name + "Value1"]);
            if (flag === true) {
              That.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.diydata[index][real_name + "Value2"].push({
                url: URL.createObjectURL(e.file)
              });
            }
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1: function(item, delIndex) {
      console.log(item, delIndex);
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (item.name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          console.log(real_name);
          index = i;
          break;
        }
      }
      this.diydata[index][real_name + "Value1"].splice(delIndex, 1);
      this.diydata[index][real_name + "Value2"].splice(delIndex, 1);
      this.diydata[index][real_name + "Length"] = this.diydata[index][real_name + "Value1"].length;
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
          console.log(item.data.tp_name, item.value);

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
      console.log("submit");
      console.log(this.upload_name);
      this.validation();
      console.log(this.diydata);
      if (!this.isValidation) {
        return;
      }

      this.submitConference();
    },
    submitOk() {
      if (this.tag == 1) {
        this.$emit("submitSave");
      }
    },

    submitConference() {
      var that = this;
      var formData = [];
      var formObject = {};
      this.diydata.forEach(item => {
        if (item.type == "diyimg") {
          var arr = [];
          for (let i = 0; i < item[item.name + 'Value1'].length; i++) {
            arr.push(item[item.name + "Value1"][i].url);
          }
          formObject[item.name] = arr;
        } else {
          formObject[item.name] = item.value;
        }
      });

      //console.log("formObject", formObject);
      formData.push(formObject);
      //console.log(formData);
      that.$emit("submitSave", formData);
      return;
      // let _url =
      //   that.tag != 1 ? 'plugin.diyform.api.diy-form.save-form-data' : 'plugin.diyform.api.diy-form.save-diy-form-data';
      // $http
      //   .post(_url, {
      //     form_data: formData,
      //     form_id: this.form_id
      //   })
      //   .then(
      //     function(response) {
      //       if (response.result == 1) {
      //         console.log(response);
      //         Toast('提交成功');
      //         if (that.tag == 1) {
      //           that.$emit('submitSave', response.data.form_data_id);
      //           that.form_data_id = response.data.form_data_id;
      //           that.diydata = [];
      //           return;
      //         }
      //         that.getDiyForm();
      //       } else {
      //         that.$dialog.alert({message:response.msg});
      //       }
      //     },
      //     function(response) {
      //       alert('fail');
      //     }
      //   );
    },
    getDiyForm1(data) {
      var that = this;
      // $http
      //   .get("plugin.diyform.api.diy-form.getDiyFormTypeMemberData", {
      //     form_id: this.form_id
      //   })
      //   .then(
      //     function(response) {
      if (data) {
        that.status = data.status;
        that.loading = true;
        if (data.status === 1) {
          that.diyform = data;
          that.thumb = data.thumb;
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
            that.Backdata.push(list);
          }
        } else {
          that.diyform = data;
          var fields = that.diyform.fields;
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
          window.diydata = that.diydata;
          console.log("diyform", that.diydata);
        }
      }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },

    getDiyForm() {
      var that = this;
      if (this.fun.isTextEmpty(this.form_id)) {
        console.log("error:: 报单form_id为空！！ url:src\components\temp\form.vue");
        return;
      }
      $http
        .get("plugin.diyform.api.diy-form.getDiyFormTypeMemberData", {
          form_id: this.form_id
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.status = response.data.status;
              that.loading = true;
              if (response.data.status === 1) {
                that.diyform = response.data;
                that.thumb = response.data.thumb;
                const fields = that.diyform.fields;
                for (let field in fields) {
                  var list = {
                    title: fields[field].tp_name,
                    value: fields[field].value,
                    data_type: fields[field].data_type
                  };
                  if (list.data_type == "3") {
                    console.log("有3类型");
                    list.value = fields[field].value.join(",");
                  }
                  that.Backdata.push(list);
                }
              } else {
                that.diyform = response.data;
                var fields = that.diyform.fields;
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
                      value: fields[field].value,
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
                      value: fields[field].value,
                      type: that.types[fields[field].data_type]
                    };
                    f[field + "Length"] = 0;
                    f[field + "Value1"] = [];
                    f[field + "Value2"] = [];
                  } else {
                    f = {
                      name: field,
                      data: fields[field],
                      value: fields[field].value,
                      type: that.types[fields[field].data_type]
                    };
                  }
                  that.diydata.push(f);
                }
                window.diydata = that.diydata;
                console.log("diyform", that.diydata);
              }
            } else {
              that.$dialog.alert({ message: response.msg });

            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  activated() {
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    console.log("88888888888888888888", this.tag, this.form_id);
    //this.getDiyForm();
  },
  created() {
  },
  mounted() {
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    this.diydata = [];
    if (this.datas.data.form_id) {
      this.form_id = this.datas.data.form_id;
    }
    console.log("sssssssssssss", this.tag, this.form_id);
    // if (this.tag == 1) {
    //   //从下单页进来的
    //   // if (this.form_data_id) {
    //   this.getSingleFormData();
    //   // } else {
    //   //   this.getOrderDiyForm();
    //   // }
    // } else {
    //   this.getDiyForm();
    // }
    //this.getDiyForm1(this.datas.get_info);
  }
};
</script>
<style>
  /* #diy-form .yd-cityselect {
    bottom: 3.0625rem;
  } */
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  /* @import "../assets/css/member.scss"; */

  .inputWrapper {
    height: 2.938rem;
    display: flex;
    align-items: center;
    border-bottom: 0.031rem solid #dee2ee;

    .ps {
      width: 5.625rem;
      color: #333;
      font-size: 0.875rem;
      letter-spacing: 0.044rem;
    }

    .input {
      text-align: right;
      flex: 1;
      letter-spacing: 0.044rem;
      color: #999;
      font-size: 0.875rem;
      border: none;

      &::-webkit-input-placeholder {
        color: #999;
      }
    }
  }

  .submit {
    margin-top: 1rem;
    width: 100%;
    height: 2.938rem;
    background-color: #fe5d5a;
    border-radius: 0.313rem;
    letter-spacing: 0.056rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.125rem;
  }

  .yd-cell-title {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
    color: #333 !important;
  }

  .yd-cell-item {
    .yd-cell-left {
      color: #333 !important;
    }
  }

  .yd-btn-block {
    margin-top: 0.1875rem;
  }

  .introTitle {
    border-top: 0.0625rem solid #dedddd;
  }

  .yd-checkbox {
    padding-bottom: 0.625rem;
  }

  .intro {
    padding: 1.25rem;
  }

  .form {
    padding: 0 0.2rem;
  }

  .checkbox {
    background: #fff;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 0.0625rem solid #ece9e9;
    text-align: left;
    padding-left: 0.75rem;
  }

  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #c0ccda;

    /* float: left; */
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }

  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #333;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #333;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */

    color: #333;
  }

  input::-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #333;
  }

  .bgNone {
    background-color: none;
  }
</style>
