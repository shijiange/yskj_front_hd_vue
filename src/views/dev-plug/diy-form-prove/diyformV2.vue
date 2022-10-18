<template>
  <div id="all" style="width: 100%;">
    <div id="member">
      <div style="height: 0.005rem; clear: both;"></div>
      <div class="diyform" v-if="status === 0">
        <template v-for="(item, index) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                  clearable
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                  clearable
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyusername'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                  clearable
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                  clearable
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diypwd'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                  clearable
                  type="password"
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                  clearable
                  type="password"
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diytextarea'">
            <van-cell-group :border="false" :title="item.data.tp_name" style="margin-bottom: 10px;" :key="index">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field v-model="item.value" rows="3" autosize type="textarea" maxlength="100" :placeholder="item.data.placeholder" show-word-limit />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycheckbox'">
            <van-checkbox-group v-model="item.value" checked-color="#4cd864" :key="index">
              <van-cell-group :border="false" :title="item.data.tp_name">
                <van-cell title-class="checkbox-text" v-for="(ck, i) in item.data.tp_text" :key="i" clickable :title="ck" @click="toggle(i)" :border="false">
                  <template #right-icon>
                    <van-checkbox :name="ck" ref="checkboxes" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <template v-if="item.type == 'diyselect'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link style="border: solid 1px #ebedf0; border-radius: 4px;">
                <span slot="title">{{ item.data.tp_name }}：</span>
                <select slot="default" v-model="item.value">
                  <option value="">请选择{{ item.data.tp_name }}</option>
                  <option :value="sitem" v-for="(sitem, i) in item.data.tp_text" :key="i">{{ sitem }}</option>
                </select>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyradio'">
            <van-radio-group v-model="item.value" :key="index">
              <van-cell-group :border="false" class="active-detail" :title="item.data.tp_name === '' ? '单选框' : item.data.tp_name" style="padding: 0.5rem 0;">
                <van-cell
                  clickable
                  v-for="(ritem, i) in item.data.tp_text"
                  :key="i"
                  @click="item.value = ritem"
                  center
                  :border="false"
                  title-style="text-align:left"
                  style="border-bottom: solid 1px #ebedf0;"
                >
                  <span slot="title">{{ ritem }}</span>
                  <template #right-icon>
                    <van-radio :name="ritem.toString()">
                      <template #icon="props">
                        <i class="iconfont check-icon " :class="props.checked ? 'icon-record_go' : ''" style=" color: #09bb07; font-size: 25px;"></i>
                      </template>
                    </van-radio>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>

          <template v-if="item.type == 'diyimg'">
            <van-cell-group :title="item.data.tp_name" :border="false" :key="index">
              <div class="clearfloat" style="width: 100%; text-align: center; line-height: 5rem; padding: 1rem; border: solid 0.0625rem #ebedf0; border-radius: 4px; display: flex; flex-wrap: wrap;">
                <template v-for="(val, index) in item[item.name + 'Value2']">
                  <div class="photobox" style="float: left; max-width: 25%;" :key="index">
                    <img :src="val.url" style="max-width: 5rem;" />
                    <van-icon @click="removeImg_1(item, index)" name="close" style="width: 1.2rem; height: 1.2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;" />
                  </div>
                </template>
                <div @click="chooseUpload(item.name)">
                  <van-uploader :disabled="item[item.name + 'Length'].length >= item.data.tp_max" :after-read="onRead_2">
                    <div style="display: flex; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;">
                      <img :src="require('../../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycity'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <span slot="title">{{ item.data.tp_name }}：</span>
                <input slot="default" type="text" @click.stop="showCity = true" @click="openCity(item.name)" v-model="item.value" readonly />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diydate'">
            <van-cell-group :border="false" class="data-text" :key="index">
              <van-cell title-style="text-align:left" style="border: solid 0.0625rem #ebedf0; border-radius: 4px;" center :border="false" @click.native="openPicker(item.name)">
                <span slot="title">{{ item.data.tp_name }}:</span>
                <span slot="default">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>
        </template>
      </div>

      <div class="diyform" v-if="status === 1">
        <van-cell-group class="bgNone already-group" :border="false" v-for="(item, j) in datas" :key="j" :title="item.data_type != 'diytextarea' && item.data_type != 'diyimg' ? '' : item.title">
          <van-cell :border="false" style="border: solid 1px #ebedf0; border-radius: 4px;" center v-if="item.data_type != '1' && item.data_type != '5' && item.data_type != 'diytupian'">
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell>

          <van-cell style="border: solid 1px #ebedf0; border-radius: 4px;" class="already-img diyform-textarea" :border="false" v-if="item.data_type == '1'">
            <van-field v-model="item.value" rows="3" autosize type="textarea" readonly show-word-limit />
          </van-cell>

          <van-cell style="border: solid 1px #ebedf0; border-radius: 4px;" class="already-sub" v-if="item.data_type == '5' || item.data_type == 'diytupian'">
            <template slot="default" style="width: 100%; text-align: left;" v-for="(item1, ind) in item.value">
              <div :key="ind">{{ item1.title }}</div>
            </template>
            <template slot="default" style="width: 100%; text-align: right;" v-for="(item1, ind) in item.value">
              <div class="photobox" style="float: right; max-width: 25%; margin-top: 0.5rem;" :key="ind">
                <img :src="item1" style="max-width: 5rem;" />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <van-popup v-model="pickerShow" position="bottom">
        <van-datetime-picker type="date" title="选择年月日" v-model="pickerValue" @cancel="pickerShow = false" @confirm="setDate" />
      </van-popup>

      <yd-cityselect v-model="showCity" :callback="setCity" :items="district" id="yd-cityselect"></yd-cityselect>

      <div style="height: 0.625rem; clear: both;"></div>
      <!-- 普通表单 -->
      <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
        <slot>
          <van-button style="height: 40px;" size="large" @click.native="submit" type="primary" v-if="status === 0">提交 </van-button>
          <van-button style="height: 40px;" size="large" type="danger" v-if="status === 1">已提交</van-button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  props: {
    status: {
      type: [Number, String],
      default: 1 // 是否已提交,0||未提交、1||已提交
    },
    field: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      click: false,
      diyform: {},
      diydata: [],
      upload_name: "", // 点击上传图片的名字
      datas: [], // 已提交表单后,回显遍历的数组
      uploadUrl: "",
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
      // form_id: "",
      conference: {},
      intro: false,
      // thumb: "",
      description: "", // 详情信息

      loading: false,
      pickerShow: false
    };
  },
  methods: {
    setCity(ret) {
      var retCity = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      this.diydata.forEach(item => {
        if (item.name == this.currentCityKey) {
          this.$set(item, "value", retCity);
        }
      });
    },
    openPicker(name) {
      this.currentDateKey = name;
      this.pickerShow = true;
    },
    setDate(ret) {
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
      return true;
    },
    // vant 多其他图片上传
    onRead_2(e, flag) {
      var index = 0;
      var real_name = "";
      for (let i = 0; i < this.diydata.length; i++) {
        if (this.upload_name == this.diydata[i].name) {
          real_name = this.diydata[i].name;
          index = i;
          break;
        }
      }
      let fd = new FormData();
      if (this.diydata[index][real_name + "Length"] == this.diydata[index].data.tp_max || this.diydata[index][real_name + "Length"] >= this.diydata[index].data.tp_max) {
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
        message: "正在上传图片"
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
              url: responseData.data.img
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
        })
        .catch(error => {
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
      this.diydata[index][real_name + "Length"] = this.diydata[index][real_name + "Value1"].length;
    },
    openCity(name) {
      this.currentCityKey = name;
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
      this.validation();
      if (!this.isValidation) {
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
      that.click = true;
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
      formData.push(formObject);
      console.log("这是diyFormPopup最终的数据==========", formData);
      this.$emit("submit", formData);
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    getDiyFormSingData(fields) {
      let that = this;
      this.loading = true;
      let f;
      console.log("getDiyFormSingData", fields);
      for (var field in fields) {
        if (fields.hasOwnProperty(field)) {
          if (that.types[fields[field].data_type] == "diycheckbox") {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].value ? fields[field].value : [],
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
              value: "",
              type: that.types[fields[field].data_type]
            };
            f[field + "Length"] = 0;
            f[field + "Value1"] = [];
            f[field + "Value2"] = [];
            if (that.identification) {
              let srcVal = fields[field].value;
              if (srcVal) {
                let bb = [];
                srcVal.forEach((v, i) => {
                  bb.push({
                    url: v
                  });
                });
                f[field + "Value1"] = bb;
                f[field + "Value2"] = bb;
                f[field + "Length"] = bb.length;
                console.log(f[field + "Length"], bb, "hhhhhhhhh");
              }
            }
            if (that.form_data_id) {
              let srcVal = fields[field].value;
              let bb = [];
              srcVal.forEach((v, i) => {
                bb.push({
                  url: v
                });
              });
              f[field + "Value1"] = bb;
              f[field + "Value2"] = bb;
              f[field + "Length"] = bb.length;
              console.log(f[field + "Length"], bb, "hhhhhhhhh");
            }
          } else {
            f = {
              name: field,
              data: fields[field],
              value: fields[field].value,
              type: that.types[fields[field].data_type]
            };
          }
          that.diydata.push(f);
          console.log(that.diydata);
        }
      }
    },
    getDiyFormSingDataFalse(fields) {
      let list = {};
      for (let field in fields) {
        if (fields.hasOwnProperty(field)) {
          list = {
            title: fields[field].tp_name,
            value: fields[field].value ? fields[field].value : "",
            data_type: fields[field].data_type
          };
          if (list.data_type == "diyduoxuan" || list.data_type == "diyduoxuankuang") {
            list.value = fields[field].content.join(",");
          }
          this.datas.push(list);
        }
      }
    }
  },
  activated() {},
  mounted() {
    this.diydata = [];
    this.datas = [];
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    if (this.status == 0 && Object.keys(this.field).length != 0) this.getDiyFormSingData(this.field); //未提交表单，可编辑状态
    if (this.status == 1 && Object.keys(this.field).length != 0) this.getDiyFormSingDataFalse(this.field);
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.vant-sure-class {
  .van-field__right-icon {
    color: green;
  }
}

.vant-no-sure-class {
  .van-field__right-icon {
    color: red;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#member {
  padding: 0.5rem 0.5rem 0;
  background: #fff;
}

#tool ul li {
  width: 100% !important;
  padding-left: 0.75rem !important;
}

.yd-cell-title {
  height: 2.5rem !important;
  line-height: 2.5rem !important;
}

.yd-cell-box {
  margin-bottom: 0 !important;
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
  content: "";
  visibility: hidden;
  height: 0;
}

.clearfloat {
  zoom: 1;
}

#member {
  .van-cell-group__title {
    text-align: left;
    padding: 2.5px 12px 5px;
  }

  /deep/ textarea::placeholder {
    color: #555;
  }

  .city-text {
    margin-top: 10px;
    margin-bottom: 10px;

    /deep/ .van-cell__title {
      text-align: left;
      flex: none;
      width: auto;
      margin-right: 0;
    }

    input {
      width: 100%;
      border: none;
      color: #333;
    }

    select {
      width: 100%;
      border: none;
      color: #555;
    }

    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
    }
  }

  .data-text {
    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
    }
  }

  .checkbox-text {
    text-align: left;
    color: #555;
  }

  .data-text {
    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
    }

    .van-cell__value {
      span {
        color: #555;
      }
    }
  }

  .diyform {
    .van-cell__title {
      text-align: left;
      color: #555;
    }

    .diyform-textarea {
      .van-field {
        padding: 10px 0;

        /deep/ textarea {
          color: #555;
        }
      }
    }
  }

  /deep/ .van-cell--clickable:active {
    background-color: #fff;
  }
}

.diy-style {
  margin-bottom: 5px;

  .van-cell {
    padding: 0 12px;
    min-height: 50px;

    .van-cell__title {
      flex: none;
      width: auto;
      white-space: nowrap;
    }

    /deep/ .yd-input > input {
      color: #555;
    }
  }
}

.already-group {
  margin-bottom: 10px;

  .van-cell {
    border: 0.0625rem solid rgb(235, 237, 240);
    border-radius: 4px;
    background-color: rgb(255, 255, 255);

    .van-cell__title {
      flex: none;
      text-align: left;
    }

    .van-cell__value {
      span {
        color: #555;
        font-size: 13px;
      }

      input {
        width: 100%;
        border: none;
        color: #555;
      }
    }

    select {
      width: 100%;
      border: none;
      color: #555;
    }
  }
}
</style>
