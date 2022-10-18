<template>
<!-- 弃用 -->
  <div id="diy-form">
    <div id="member">
      <div class="form" :class="[index != 0 ? 'formMargin' : '']" v-if="status">
        <div v-if="thumb">
          <img :src="thumb" alt="" style="width: 100%;"/>
        </div>
        <template v-for="(item,ind) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group :border="false" class="inp-commont" :key="ind">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field style="min-height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                           clearable
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="min-height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                           clearable
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：` }}</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--slot="default"-->
                <!--required-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 0"-->
                <!--slot="default"-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
              </van-cell>
            </van-cell-group>
          </template>

          <!--setting sun-->
          <template v-if="item.type == 'diyimg'">
            <van-cell-group :key="ind"
                            :border="false"
                            :title="item.data.tp_name === '' ? '图片：' : `${item.data.tp_name}：`"
                            class="blcok common-style"
            >
              <div
                class="clearfloat"
                style="width: 100%; text-align: center; line-height: 5rem; padding: 1rem; border: solid 0.0625rem #ebedf0; border-radius: 4px; display: flex; flex-wrap: wrap;"
              >
                <template v-for="(val,ind) in item[item.name + 'Value1']">
                  <div class="photobox" style="float: left; max-width: 25%;" @click="chooseUpload(item.name)"
                       :key="ind">
                    <img :src="val.url" style="max-width: 5rem;"/>
                    <van-icon
                      @click.stop="removeImg_1(item, index)"
                      name="close"
                      style="width: 1.5rem; height: 1.5rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;"
                    />
                  </div>
                </template>
                <div @click="chooseUpload(item.name)">
                  <van-uploader
                    :disabled="item[item.name + 'Length'].length >= item.data.tp_max"
                    style="display: block;"
                    :after-read="onRead_2"
                  >
                    <div
                      style="display: flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; border: 0.0625rem dashed #ebedf0;"
                    >
                      <img :src="require('../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar"/>
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diytextarea'">
            <van-cell-group :key="ind"
                            :title="item.data.tp_name === '' ? '文本框' : item.data.tp_name"
                            class="blcok textarea"
                            :border="false"
            >
              <van-cell
                :border="false"
                :style="{ backgroundColor: '#ffffff' }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
                <van-field
                  v-model="item.value"
                  rows="3"
                  autosize
                  type="textarea"
                  maxlength="100"
                  :placeholder="item.data.placeholder"
                  show-word-limit
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycheckbox'">
            <van-checkbox-group v-model="item.value" class="select-item" :key="ind">
              <van-cell-group :border="false" :title="item.data.tp_name === '' ? '复选框' : item.data.tp_name">
                <van-cell
                  v-for="(ck, i) in item.data.tp_text"
                  clickable
                  :key="i"
                  center
                  :border="false"
                  @click="toggle(i)"
                >
                  <span slot="title">{{ ck }}</span>
                  <template #right-icon>
                    <van-checkbox :name="ck" ref="checkboxes" checked-color="#4cd864"/>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <template v-if="item.type == 'diyselect'">
            <van-cell-group class="common-style" :border="false" :key="ind">
              <van-cell :border="false" center is-link style="border: solid 1px #ebedf0; border-radius: 4px;">
                <span slot="title">{{ item.data.tp_name === "" ? "下拉框:" : `${item.data.tp_name}：` }}</span>
                <select slot="default" v-model="item.value">
                  <option value="">请选择{{ item.data.tp_name }}</option>
                  <option :value="sitem" v-for="(sitem, i) in item.data.tp_text" :key="i">{{ sitem }}</option>
                </select>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyradio'">
            <van-radio-group v-model="item.value" class="select-item" :key="ind">
              <van-cell-group
                :border="false"
                :title="item.data.tp_name === '' ? '单选框' : item.data.tp_name"
                style="padding: 0.5rem 0;"
              >
                <van-cell
                  center
                  clickable
                  :border="false"
                  @click="item.value = ritem"
                  v-for="(ritem, i) in item.data.tp_text"
                  style="border-bottom: solid 1px #ebedf0;"
                  :key="i"
                >
                  <span slot="title">{{ ritem }}</span>
                  <template #right-icon>
                    <van-radio :name="ritem.toString()">
                      <template #icon="props">
                        <i
                          class="iconfont check-icon "
                          :class="props.checked ? 'icon-record_go' : ''"
                          style=" color: #09bb07; font-size: 25px;"
                        ></i>
                      </template>
                    </van-radio>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>

          <template v-if="item.type == 'diycity'">
            <div :key="ind">
              <van-cell-group :border="false" class="inp-commont city-box">
                <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;" is-link>
                  <span slot="title">{{ item.data.tp_name === "" ? "城市：" : `${item.data.tp_name}：` }}</span>
                  <input
                    slot="default"
                    style="width: 100%;"
                    type="text"
                    @click.stop="showCity = true"
                    @click="openCity(item.name)"
                    v-model="item.value"
                    readonly
                  />
                </van-cell>
              </van-cell-group>
            </div>
          </template>

          <template v-if="item.type == 'diydate'">
            <van-cell-group class="common-style" :border="false" :key="ind">
              <van-cell
                :border="false"
                center
                is-link
                @click.native="openPicker(item.name)"
                :style="{ backgroundColor: '#ffffff' }"
                style="border: solid 1px #ebedf0; border-radius: 4px;"
              >
                <span slot="title">{{ item.data.tp_name === "" ? "日期：" : `${item.data.tp_name}：` }}</span>
                <span slot="default">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyusername'">
            <van-cell-group :border="false" class="inp-commont" :key="ind">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field style="height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：` }}</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--slot="default"-->
                <!--required-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 0"-->
                <!--slot="default"-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
              </van-cell>
            </van-cell-group>
          </template>
          <template v-if="item.type == 'diypwd'">
            <van-cell-group :border="false" class="inp-commont" :key="ind">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field style="height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                           clearable type="password"
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                           clearable type="password"
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：` }}</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--slot="default"-->
                <!--required-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--type="password"-->
                <!--&gt;</yd-input>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 0"-->
                <!--slot="default"-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--type="password"-->
                <!--&gt;</yd-input>-->
              </van-cell>
            </van-cell-group>
          </template>
        </template>

        <div style="width: 90%; margin: 0 auto; padding-bottom: 0.875rem;">
          <van-button size="large" @click.native="submit" type="primary" v-if="!identification">提交</van-button>
        </div>
        <div v-if="description" style="padding-bottom: 0.875rem;">
          <div v-html="description"></div>
        </div>
      </div>

      <!-- 这是查看 -->
      <div class="form" v-if="loading && !status">
        <van-cell-group
          class="bgNone already-group"
          :border="false"
          v-for="(item, i) in diydata"
          :key="i"
          :title="item.data_type != 'diytextarea' && item.data_type != 'diyimg' ? '' : item.title"
        >
          <van-cell
            :border="false"
            center
            class="common-style"
            v-if="item.data_type != 'diytextarea' && item.data_type != 'diyimg'"
            style="border: solid 1px #ccc; border-radius: 4px;"
          >
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell>

          <van-cell
            class="already-img"
            :border="false"
            v-if="item.data_type == 'diytextarea'"
            style="border: solid 1px #ccc; border-radius: 4px; height: 100px;"
          >
            <van-field v-model="item.value" :autosize="misauto" type="textarea" readonly/>
          </van-cell>

          <van-cell
            class="already-sub"
            v-if="item.data_type == 'diyimg'"
            style="border: solid 1px #ccc; border-radius: 4px; padding: 3px 8px; height: auto;"
          >
            <template slot="default" style="width: 100%; text-align: right;" v-for="(item1,i) in item.value">
              <div class="photobox" style="float: right; max-width: 25%; margin-top: 0.5rem;" :key="i">
                <img :src="item1" style="max-width: 5rem;"/>
              </div>
            </template>
          </van-cell>
        </van-cell-group>

      </div>

      <van-popup v-model="pickerShow" position="bottom">
        <van-datetime-picker
          type="date"
          title="选择年月日"
          v-model="pickerValue"
          @cancel="pickerShow = false"
          @confirm="setDate"
        />
      </van-popup>

      <template v-if="showCity">
        <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>
      </template>

      <template v-if="showCity1">
        <yd-cityselect v-model="showCity1" :callback="setCity1" :items="district"></yd-cityselect>
      </template>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
// var haveShop = false;

export default {
  props: ["datas", "form_id", "form_data_id", "status", "thumb", "description","identification","flight"],
  data() {
    // var now = new Date();
    // var year = now.getFullYear(); // 年
    // var month = now.getMonth() + 1; // 月
    // var day = now.getDate(); // 日
    // let today = year + '-' + month + '-' + day;
    return {
      click: false,
      diyform: {},
      diydata: [],
      upload_name: "", // 点击上传图片的名字
      Backdata: [], // 已提交表单后,回显遍历的数组
      share_description: "", // 分享描述
      uploadUrl: "",
      // status: 0, // 是否已提交
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
      showCity1: false,
      district: district,
      currentDateKey: "",
      currentCityKey: "",
      checks: [],
      isValidation: true,
      activity_id: "",
      conference: {},
      intro: false,
      // thumb: this.thumb,
      // description: "", // 详情信息
      loading: false,

      pickerShow: false,
      misauto:{
        maxHeight: 100, minHeight: 40
      }
    };
  },

  methods: {
    showIntro() {
      console.log(this.intro);
      this.intro = true;
    },
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
      console.log("name", name);
      this.pickerShow = true;
      //this.$refs.picker.open();
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
    // 获得具体表单的名字
    chooseUpload(name) {
      this.upload_name = name;
      console.log(this.upload_name, this.diydata);
      return true;
    },
    // vant 多其他图片上传
    onRead_2(e, flag) {
      console.log("s看见傻傻的封杀空间", this.diydata);
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
          console.log(real_name);
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
        message: "上传中",
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
            console.log(this.diydata[index][real_name + "Value1"]);

            // if (flag === true) {
            //   this.diydata[index][real_name + "Value2"].push({
            //     url: URL.createObjectURL(e)
            //   });
            // } else {
            //   this.diydata[index][real_name + "Value2"].push({
            //     url: URL.createObjectURL(e.file)
            //   });
            // }
            // console.log("Value2:::::::",this.diydata[index][real_name + "Value2"]);
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
      console.log(item);
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
    submitConference() {
      if (this.click) {
        return;
      }
      var that = this;
      var formData = [];
      var formObject = {}
        ;(that.click = true),
      setTimeout(() => {
        that.click = false;
      }, 5000);
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
      formData.push(formObject);
      console.log("这是diyFormPopup最终的数据==========", formData);
      if(this.identification){
        this.$emit("gofunarr",formData);
        return;
      }
      $http
        .post("plugin.diyform.api.diy-form.saveDiyFormData", {
          form_data: formData,
          form_id: this.form_id
        })
        .then(
          function(response) {
            if (response.result == 1) {
              console.log(response);
              Toast("提交成功");
              that.$emit("submitsave", response.data.form_data_id);
              return;
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            alert("fail");
          }
        );
    },
    getData(_data) {
      let that = this;
      console.log(this.status, "看看这里的值");
      var fields;
      if (this.status) {
        console.log("提交或编辑");
        fields = _data.fields;
        var f;
        console.log("父组件传过来的自定义表单数据", fields);
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
              if (!this.form_data_id) {
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
              if(this.identification){
                let srcVal = fields[field].value;
                if(srcVal){
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
              if (this.form_data_id) {
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
      } else {
        console.log(that.flight); 
        //这是编辑
        console.log("这是查看已提交aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        var list= {};
        if(this.flight){
          fields = _data.fields;
          for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
              list = {
                title: fields[field].name,
                value: fields[field].value,
                data_type: that.types[fields[field].data_type]
              };
              if (list.data_type == "diyduoxuan" || list.data_type == "diyduoxuankuang") {
                list.value = fields[field].content.join(",");
              }
              that.diydata.push(list);
            }
          }
        }else{
          fields = _data;
          for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
              list = {
                title: fields[field].title,
                value: fields[field].content,
                data_type: fields[field].type
              };
              if (list.data_type == "diyduoxuan" || list.data_type == "diyduoxuankuang") {
                list.value = fields[field].content.join(",");
              }
              that.diydata.push(list);
            }
          }

        }
        console.log("父组件传过来的自定义表单数据", fields);
        
        that.loading = true;
        console.log(that.diydata, "数据数据数据");
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    }
  },
  activated() {
    this.datas = {
      params: { bgcolor: "#fff" },
      data: {
        form_id: ""
      }
    };
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
  },
  created() {
  },
  mounted() {
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    this.diydata = [];
    console.log(this.datas);
    this.getData(this.datas);
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

  #tool ul li {
    width: 100% !important;
    padding-left: 0.75rem !important;
  }

  .yd-cell-title {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
    color: #000 !important;
  }

  .yd-cell-item {
    .yd-cell-left {
      color: #000 !important;
    }
  }

  .yd-btn-block {
    margin-top: 0.1875rem;
  }

  .introTitle {
    border-top: 0.0625rem solid #ebedf0;
  }

  .yd-checkbox {
    padding-bottom: 0.625rem;
  }

  .intro {
    padding: 1.25rem;
  }

  .form {
    padding: 3.25rem 0.5rem 0;
    background: #fff;
  }

  // .formMargin {
  //   margin-top: 1rem;
  // }
  .checkbox {
    background: #fff;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 0.0625rem solid #ebedf0;
    text-align: left;
    padding-left: 0.75rem;
  }

  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #ebedf0;

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

  // 替换ydui新增
  .common-style,
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

  .van-cell-group__title {
    padding: 2.5px 12px 5px;
    font-size: 14px;
    text-align: left;
    color: #888;
    position: relative;
    z-index: 1;
  }

  .textarea {
    margin-bottom: 10px;

    .van-cell {
      padding: 10px 12px;

      /deep/ textarea::placeholder {
        color: #555;
      }
    }

    .van-field {
      padding: 0;
    }
  }

  .select-item {
    margin-bottom: 10px;

    .van-cell {
      border-bottom: 0.0625rem solid rgb(235, 237, 240);
      background-color: rgb(255, 255, 255);
      padding: 0 12px;
      height: 50px;
    }

    .van-cell__title {
      text-align: left;
    }

    .van-cell-group {
      padding: 0;
    }
  }

  .one-inp {
    .van-field {
      padding: 0;
      border: none;

      /deep/ input::placeholder {
        color: #555;
      }
    }
  }

  .already-group {
    .van-field {
      border: none;
    }

    .already-img {
      textarea {
        border: none;
      }
    }
  }

  .inp-commont {
    margin-bottom: 5px;

    .van-cell {
      padding: 0 12px;
      min-height: 50px;
      font-size: 14px;

      .van-cell__title {
        flex: none;
      }
    }

    /deep/ .yd-input > input {
      color: #555;
    }
  }

  .city-box {
    input {
      border: none;
    }
  }

  /deep/ .van-cell--clickable:active {
    background-color: #fff;
  }
</style>
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
