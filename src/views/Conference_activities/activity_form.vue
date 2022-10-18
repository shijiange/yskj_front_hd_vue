<template>
  <div id="diy-form" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <div id="member">
      <div
        class="form"
        v-if="payStatus != '1' && type == 'enroll'"
        :class="[index != 0 ? 'formMargin' : '']"
        :style="{
          backgroundColor: datas.params.bgcolor ? datas.params.bgcolor : '#fff',
          paddingTop: type == 'enroll' ? '1rem' : ''
        }"
      >
        <h2
          style="padding: 0.5rem 0;"
          v-if="datas.params.showtitle"
          :style="{
            color: datas.params.titlecolor,
            fontSize: datas.params.titlesize,
            textAlign: datas.params.titleposition
          }"
        >
          {{ datas.params.title }}
        </h2>
        <template v-for="(item,index) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group class="blcok diy-inp" :border="false" :key="index">
              <van-cell
                :border="false"
                center
                :style="{ backgroundColor: datas.params.bgcolor }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
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
            <van-cell-group :key="index"
                            :border="false"
                            :title="item.data.tp_name === '' ? '图片：' : `${item.data.tp_name}：`"
                            class="blcok common-style"
            >
              <div
                class="clearfloat"
                style="width: 100%; text-align: center; line-height: 5rem; padding: 1rem; border: solid 0.0625rem #ebedf0; border-radius: 4px; display: flex; flex-wrap: wrap;"
              >
                <template v-for="(val,i) in item[item.name + 'Value1']">
                  <div class="photobox" style="float: left; max-width: 25%;" @click="chooseUpload(item.name)" :key="i">
                    <img :src="val.url" style="max-width: 5rem;"/>
                    <van-icon
                      @click.stop="removeImg_1(item, i)"
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
            <van-cell-group :key="index"
                            :title="item.data.tp_name === '' ? '文本框' : item.data.tp_name"
                            class="blcok textarea"
                            :border="false"
            >
              <van-cell
                :border="false"
                :style="{ backgroundColor: datas.params.bgcolor }"
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
            <van-checkbox-group v-model="item.value" class="select-item" :key="index">
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
            <van-cell-group class="common-style" :border="false" :key="index">
              <van-cell
                :border="false"
                center
                is-link
                :style="{ backgroundColor: datas.params.bgcolor }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
                <span slot="title">{{ item.data.tp_name === "" ? "下拉框:" : `${item.data.tp_name}：` }}</span>
                <select slot="default" v-model="item.value">
                  <option value="">请选择{{ item.data.tp_name }}</option>
                  <option :value="sitem" v-for="(sitem, i) in item.data.tp_text" :key="i">{{ sitem }}</option>
                </select>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyradio'">
            <van-radio-group v-model="item.value" class="select-item" :key="index">
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
                  style="border-bottom: solid 1px #ccc;"
                  :key="i"
                  :style="{ backgroundColor: datas.params.bgcolor }"
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
            <div :key="index">
              <van-cell-group class="common-style" :border="false">
                <van-cell
                  :border="false"
                  center
                  is-link
                  @click.native="openPicker(item.name)"
                  :style="{ backgroundColor: datas.params.bgcolor }"
                  style="border: solid 1px #ccc; border-radius: 4px;"
                >
                  <span slot="title">{{ item.data.tp_name === "" ? "城市：" : `${item.data.tp_name}：` }}</span>
                  <input
                    slot="default"
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
            <van-cell-group class="common-style" :border="false" :key="index">
              <van-cell
                :border="false"
                center
                is-link
                @click.native="openPicker(item.name)"
                :style="{ backgroundColor: datas.params.bgcolor }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
                <span slot="title">{{ item.data.tp_name === "" ? "日期：" : `${item.data.tp_name}：` }}</span>
                <span slot="default">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyusername'">
            <van-cell-group class="blcok diy-inp" :border="false" :key="index">
              <van-cell
                :border="false"
                center
                :style="{ backgroundColor: datas.params.bgcolor }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
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
            <van-cell-group class="blcok diy-inp" :border="false" :key="index">
              <van-cell
                :border="false"
                center
                :style="{ backgroundColor: datas.params.bgcolor }"
                style="border: solid 1px #ccc; border-radius: 4px;"
              >
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

        <van-popup v-model="pickerShow" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择年月日"
            v-model="pickerValue"
            @cancel="pickerShow = false"
            @confirm="setDate"
          />
        </van-popup>

        <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

        <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
          <van-button size="large" @click.native="submit" type="primary" v-if="status == 0 && type == 'enroll' && payStatus == 0 && loading == true"
          >立即报名
          </van-button
          >
          <!-- <van-button
            size="large"
            @click.native="update"
            type="primary"
            v-if="status === 1 && type == 'enroll' && payStatus == '0'"
          >去付款
          </van-button
          > -->
        </div>
      </div>
      <div
        class="form"
        v-if="(status == 1 && payStatus == '1') || payStatus == '3'"
        :class="[index != 0 ? 'formMargin' : '']"
        :style="{
          backgroundColor: datas.params.bgcolor ? datas.params.bgcolor : '#fff',
          paddingTop: type == 'enroll' || type == 'Detail' ? '1rem' : ''
        }"
      >
        <h2
          style="padding: 0.5rem 0;"
          v-if="datas.params.showtitle"
          :style="{
            color: datas.params.titlecolor,
            fontSize: datas.params.titlesize + 'px',
            textAlign: datas.params.titleposition
          }"
        >
          {{ datas.params.title }}
        </h2>

        <van-cell-group
          class="bgNone already-group"
          :border="false"
          v-for="(item, i) in Backdata"
          :key="i"
          :title="item.data_type != '1' && item.data_type != '5' ? '' : item.title"
          :class="[datas.params.bgcolor ? 'bgNone' : '']"
        >
          <van-cell
            :border="false"
            center
            class="common-style"
            v-if="item.data_type != '1' && item.data_type != '5'"
            style="border: solid 1px #ccc; border-radius: 4px;"
          >
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell>

          <van-cell
            class="already-img"
            :border="false"
            v-if="item.data_type == '1'"
            style="border: solid 1px #ccc; border-radius: 4px; height: 100px;"
          >
            <van-field v-model="item.value" rows="3" autosize type="textarea" readonly show-word-limit/>
          </van-cell>

          <van-cell
            class="already-sub"
            v-if="item.data_type == '5'"
            style="border: solid 1px #ccc; border-radius: 4px; padding: 3px 8px; height: auto;"
          >
            <template slot="default" style="width: 100%; text-align: right;" v-for="(item1,i) in item.value">
              <div class="photobox" style="float: right; max-width: 25%; margin-top: 0.5rem;" :key="i">
                <img :src="item1" style="max-width: 5rem;"/>
              </div>
            </template>
          </van-cell>
        </van-cell-group>

        <van-popup v-model="pickerShow" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择年月日"
            v-model="pickerValue"
            @cancel="pickerShow = false"
            @confirm="setDate"
          />
        </van-popup>

        <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

        <yd-cityselect v-model="showCity1" :callback="setCity1" :items="district"></yd-cityselect>
        <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
          <van-button size="large" type="danger" @click.native="toshaky" v-if="status == 1 && payStatus == '1'&& applyStatus == '0' "
          >去支付
          </van-button
          >
        </div>
        <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
          <van-button size="large" type="danger" @click.native="toshaky" v-if="status == 1 && payStatus == '1' && applyStatus == '1'"
          >已报名
          </van-button
          >
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
  props: [
    "datas",
    "index",
    "page_id",
    "tag",
    "form_data_id",
    "cash",
    "type",
    "info",
    "count",
    "limit",
    "orderId",
    "activityId",
    "payStatus", //判断有没有报名
    "applyStatus" // 判断有没有支付
  ],
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
      status: "", // 是否已提交
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

      pickerShow: false,
      tapFirst:false
    };
  },
  methods: {
    toshaky() {
      if (this.payStatus == 1) {
        Toast("活动已报名,需要去我的报名进行付款");
        this.$router.push(this.fun.getUrl("Myshaky"));
      }
    },
    showIntro() {
      console.log(this.intro);
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
          console.log(this.diydata[i][real_name + "Value1"]);
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
            this.diydata[index][real_name + "Length"]++;
            this.diydata[index][real_name + "Value1"].push({
              url: responseData.data.img
            });
            console.log(this.diydata[index][real_name + "Value1"]);

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
      console.log(item);
      var index = 0;
      var real_name = "";
      console.log(this.diydata, "数据");
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
        if (item.value && item.value.trim) {
          item.value = item.value.trim();
        }
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
    //提交表单后需要将活动id给新接口
    toNew() {
      let that = this;
      let json = {
        form_data_id: this.info.form_id,
        activity_id: this.activityId,
        form_id: this.form_id
      };
      $http
        .get("plugin.activity-apply.api.Activity.getDiyForm", json, "")
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            // if (that.cash <= 0) {
            //   $http
            //     .post("plugin.activity-apply.api.create", that.info, "报名中")
            //     .then(response => {
            //       if (response.result === 1) {
            //         Toast("报名成功");
            //         that.$router.push(that.fun.getUrl("activityHome"));
            //       } else {
            //         Toast(response.msg);
            //       }
            //     })
            //     .catch(err => {
            //       console.log(err);
            //     });
            // } else if (that.cash > 0) {
            $http
              .post("plugin.activity-apply.api.create", that.info, "报名中")
              .then(response => {
                if (response.result === 1) {
                  that.$router.push(
                    that.fun.getUrl("orderpay", {
                      order_ids: response.data.order_ids,
                      route: "enroll"
                    })
                  );
                } else {
                  Toast(response.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
            // }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
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
      var that = this;
      // var url = '';
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
      if (this.count >= this.limit) {
        Toast("报名人数已超过限制");
        return;
      }
      console.log("formObject", formObject);
      formData.push(formObject);
      console.log(formData);
      if(this.tapFirst){
        console.log('已经提交过了.+++++++++++++++++++');
        return;
      }
      this.tapFirst = true;
      $http
        .post("plugin.diyform.api.diy-form.save-diy-form-data", {
          form_data: formData,
          form_id: that.form_id
        })
        .then(
          function(response) {
            if (response.result == 1) {
              that.tapFirst = true;
              that.info.form_id = response.data.form_data_id;
              if (that.type == "enroll") {
                that.toNew();
              }
            } else {
              that.tapFirst = false;
              that.$dialog.alert({ message: response.msg });

            }
          },
          function(response) {
            alert("fail");
          }
        );
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
          let f = {};
          for (var field in fields) {
            // console.log(fields);
            // console.log(fields[field].data_type);
            // console.log(that.types[fields[field].data_type]);
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
          console.log("diyform", that.diydata);
        }
      } else {
        that.$dialog.alert({ message: response.msg });

      }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
    },

    getDiyForm() {
      var that = this;
      let json = {
        form_id: this.form_id
      };
      if (!that.fun.isTextEmpty(that.form_data_id)) {
        json.form_data_id = that.form_data_id;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", json).then(
        function(response) {
          if (response.result === 1) {
            that.status = response.data.status;
            that.loading = true;
            if (response.data.status === 1 && that.payStatus == "1") {
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
                  list.value = fields[field].value.join(",");
                }
                that.Backdata.push(list);
              }
            } else {
              that.diyform = response.data;
              var fields = that.diyform.fields;
              let f = {};
              for (var field in fields) {
                // console.log(fields);
                // console.log(fields[field].data_type);
                // console.log(that.types[fields[field].data_type]);
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
    },
    getOrderDiyForm() {
      var that = this;
      $http
        .get("plugin.diyform.api.diy-form.get-diy-form-by-id", {
          form_id: this.form_id
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.status = 0;
              that.loading = true;
              that.diyform = response.data;
              var fields = that.diyform.fields;
              var f = {};
              for (var field in fields) {
                // console.log(fields);
                // console.log(fields[field].data_type);
                // console.log(that.types[fields[field].data_type]);
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
              console.log("diyform", that.diydata);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getSingleFormData() {
      this.Backdata = [];
      this.diydata = [];
      var that = this;
      let json = {
        form_id: this.form_id
      };
      console.log("啊啊啊啊啊啊啊啊啊啊啊啊", this.form_data_id);
      if (!that.fun.isTextEmpty(that.form_data_id)) {
        json.form_data_id = that.form_data_id;
        console.log("ddddddddddddddddddddddddddddddddddddd", that.form_data_id);
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", json).then(
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
                  list.value = fields[field].value.join(",");
                }
                that.Backdata.push(list);
              }
            } else {
              that.diyform = response.data;
              var fields = that.diyform.fields;
              var f = {};
              for (var field in fields) {
                // console.log(fields);
                // console.log(fields[field].data_type);
                // console.log(that.types[fields[field].data_type]);
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
              console.log("diyform", that.diydata);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    }
  },

  mounted() {
  },
  activated() {
    this.uploadUrl = this.fun.getRealUrl("plugin.diyform.api.diy-form.DiyFormUpload", {});
    this.diydata = [];
    this.Backdata = [];
    setTimeout(() => {
      if (this.datas.data.form_id) {
        this.form_id = this.datas.data.form_id;
        if (this.tag == 1) {
          //从下单页进来的
          this.getSingleFormData();
        } else {
          console.log(123);
          this.getDiyForm();
        }
      }
    }, 1000);
    if (this.datas.get_info) {
      this.getDiyForm1(this.datas.get_info);
    }
  },
  created() {
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
    padding: 0 0.5rem;
  }

  .formMargin {
    margin-top: 1rem;
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

  // 替换ydui新增
  .common-style,
  .already-group {
    margin-bottom: 10px;

    .van-cell {
      padding: 0 12px;
      height: 50px;
      border: 1px solid rgb(204, 204, 204);
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
      border-bottom: 1px solid rgb(204, 204, 204);
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
    .van-cell {
      //  height: auto;
    }

    .van-field {
      padding: 10px 0;
      border: none;
    }

    .already-img {
      // padding:10px 0;
      // height: 75px;
      textarea {
        // height: auto;
        border: none;
      }
    }
  }

  .diy-inp {
    margin-bottom: 10px;

    .van-cell {
      min-height: 50px;
      padding: 0 12px;
    }

    .van-cell__title {
      flex: none;
    }

    /deep/ .yd-input > input {
      color: #555;
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
