<template>
  <div id="all" v-show="loading" style="width: 100%;" >
    <c-title :hide="false" :text="diyform.title" v-if="desThumb"></c-title>
    <div id="member">
      <div id="tool" style="">
        <dt v-if="thumb && desThumb">
          <img :src="thumb" style="width: 100%;" />
        </dt>
      </div>
      <div style="height: 0.005rem; clear: both;"></div>
      <div class="diyform" v-if="status === 0 || singleStatus">
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
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`}}
                </div>
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  clearable
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  clearable
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diypwd'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`}}
                </div>
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  clearable
                  type="password"
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  clearable
                  type="password"
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diytextarea'">
            <van-cell-group :border="false" :title="item.data.tp_name" style="margin-bottom: 10px;" :key="index">
              <div slot="title" style="display: flex;align-items: center;">
                <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name}}
              </div>
              <van-cell :border="false" center style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <van-field :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                 v-model="item.value" rows="3" autosize type="textarea" maxlength="100" :placeholder="item.data.placeholder" show-word-limit />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycheckbox'">
            <van-checkbox-group v-model="item.value" checked-color="#4cd864" :key="index">
              <van-cell-group :border="false">
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name === '' ? '复选框' : item.data.tp_name}}
                </div>
                <van-cell title-class="checkbox-text"
                v-for="(ck, i) in item.data.tp_text" :key="i" clickable :title="ck"
                 @click="toggle(i)" :border="false">
                  <template #right-icon>
                    <van-checkbox :name="ck" ref="checkboxes" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <template v-if="item.type == 'diyselect'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false"
               is-link style="border: solid 1px #ebedf0; border-radius: 4px;" >
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name}}
                </div>
                <select slot="default" v-model="item.value" style="text-align: right;">
                  <option value="">请选择{{ item.data.tp_name }}</option>
                  <option :value="sitem" v-for="(sitem, i) in item.data.tp_text" :key="i">{{ sitem }}</option>
                </select>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyradio'">
            <van-radio-group v-model="item.value" :key="index">
              <van-cell-group :border="false" class="active-detail"
                style="padding: 0.5rem 0;" >
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name === '' ? '单选框' : item.data.tp_name}}
                </div>
                <van-cell clickable v-for="(ritem, i) in item.data.tp_text"
                :key="i" @click="item.value = ritem" center
                :border="false" title-style="text-align:left"
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
            <van-cell-group :border="false" :key="index">
              <div slot="title" style="display: flex;align-items: center;">
                <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name}}
              </div>
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
                      <img :src="require('../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycity'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link style="border: solid 0.0625rem #ebedf0; border-radius: 4px;">
                <!-- <span slot="title">{{ item.data.tp_name }}：</span> -->
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name}}
                </div>
                <div slot="default" style="display: flex;align-items: center;">
                  <input type="text" @click.stop="showCity = true" @click="openCity(item.name)" v-model="item.value" readonly>
                  <van-icon name="warning" size="16px" color="red" v-if="item.data.tp_must == 1 && !item.value"/>
                </div>
                <!-- <input slot="default" type="text" @click.stop="showCity = true" @click="openCity(item.name)" v-model="item.value" readonly /> -->
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diydate'">
            <van-cell-group :border="false" class="diy-style" :key="index">
              <van-cell title-style="text-align:left" style="border: solid 0.0625rem #ebedf0; border-radius: 4px;" center :border="false" @click.native="openPicker(item.name)">
                <div slot="title" style="display: flex;align-items: center;">
                  <span style="color:#ee0a24;margin-right: 4px;" v-if="item.data.tp_must == 1">*</span>{{item.data.tp_name}}
                </div>
                <van-field
                  style="min-height: 30px;"
                  :class="[item.value ? 'vant-sure-class' : 'vant-no-sure-class']"
                  v-model.trim="item.value"
                  v-if="item.data.tp_must == 1"
                  readonly
                  clearable
                  :right-icon="item.value ? 'checked' : 'warning'"
                  :placeholder="item.data.placeholder"
                />
                <van-field
                  style="min-height: 30px;"
                  readonly
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  clearable
                  :placeholder="item.data.placeholder"
                />
              </van-cell>
            </van-cell-group>
          </template>
        </template>
      </div>

      <div class="diyform" v-if="status === 1">
        <van-cell-group class="bgNone already-group" :border="false" v-for="(item, j) in datas" :key="j" :title="item.data_type != 'diytextarea' && item.data_type != 'diyimg' ? '' : item.title">
          <!-- <van-cell :border="false" center v-if="item.data_type != '1' && item.data_type != '5'">
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell> -->

          <van-cell :border="false" style="border: solid 1px #ebedf0; border-radius: 4px;" center
          v-if="item.data_type != '1' && item.data_type != '5' && item.data_type != 'diytupian'">
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell>

          <van-cell style="border: solid 1px #ebedf0; border-radius: 4px;" class="already-img diyform-textarea" :border="false"
          v-if="item.data_type == '1'">
            <van-field v-model="item.value" rows="3" autosize type="textarea" readonly show-word-limit />
          </van-cell>

          <van-cell style="border: solid 1px #ebedf0; border-radius: 4px;" class="already-sub"
          v-if="item.data_type == '5' || item.data_type == 'diytupian'">
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
      <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;" v-if="modeType == 'member' && memberBtn">
        <van-button style="height: 40px;" size="large" @click.native="submit" type="primary" v-if="status === 0">提交 </van-button>
        <van-button style="height: 40px;" size="large" type="danger" v-if="status === 1">已提交</van-button>
      </div>
      <!-- 有form_data_id表单 航班 下单填写表单 -->
      <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;" v-if="modeType == 'Single' && memberBtn">
        <van-button style="height: 40px;" size="large" @click.native="submit" type="primary" v-if="!identification">提交</van-button>
        <van-button style="height: 40px;" size="large" type="danger" v-if="status === 1 && !flight">已提交</van-button>
      </div>
      <!-- 活动报名的提交 -->
      <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;" v-if="modeType == 'activity' && memberBtn">
        <van-button style="height: 40px;" size="large" @click.native="submit" type="primary" v-if="status == 0 && payStatus == '0'">立即报名</van-button>
        <van-button style="height: 40px;" size="large" @click.native="toshaky" type="danger" v-if="status == 1 && payStatus == '1' && applyStatus == '0'">去支付</van-button>
        <van-button style="height: 40px;" size="large" type="primary" v-if="status === 1 && payStatus == '1' && applyStatus == '1'">已报名</van-button>
      </div>
      <div v-if="desThumb" style="width: 100%; padding: 0.5rem 0.5rem 5rem 0.5rem; background-color: #fff;">
        <div v-html="description"></div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from "./title";
import { Toast } from "vant";
export default {
  props: {
    form_id: String,
    goodsId: String,
    optionsId: String,
    total: String,
    form_data_id: String,
    // 父组件的表单内容
    singleDatas: null,
    singleStatus: {
      type: Boolean,
      default: false
    },
    modeType: {
      type: String,
      default: "member"
      // member没有form_data_id ,Single是有form_data_id
    },
    flight: {
      // 航班信息收集用
      type: Boolean,
      default: false
    },
    identification: {
      // 航班信息收集用
      type: Boolean,
      default: false
    },
    // 自定义表单顶部banner和底部详情信息显示
    desThumb: {
      type: Boolean,
      default: true
    },
    // 是否显示 modeType == member 的提交按钮
    memberBtn: {
      type: Boolean,
      default: true
    },
    thumb: {
      type: String,
      default: ""
    },
    methodType: {
      type: String,
      default: ""
    },
    // 活动报名
    payStatus:String,//判断有没有报名
    applyStatus:String,// 判断有没有支付
    type:String, //活动报名标识
    count:Number,
    orderId:Number,
    limit:Number,
    cash:Number,
    info:{
      type:null,
      default:''
    },
    activityId:String,
    tag: String
    // 活动报名
  },
  components: { cTitle },
  data() {
    return {
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
      // form_id: "",
      conference: {},
      intro: false,
      // thumb: "",
      description: "", // 详情信息

      loading: false,
      pickerShow: false,
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
      this.pickerShow = true;
      //this.$refs.picker.open();
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
        message: ""
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
      // console.log("submit");
      // console.log(this.upload_name);
      this.validation();
      // console.log(this.diydata);
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
      // 活动报名人数限制
      if(this.modeType == 'activity' && this.count >= this.limit){
        Toast("报名人数已超过限制");
        return;
      }

      // console.log("formObject", formObject);
      formData.push(formObject);
      console.log("这是diyFormPopup最终的数据==========", formData);
      if (this.identification || this.methodType == "funarr") {
        this.$emit("gofunarr", formData);
        return;
      }
      let urlStr = "";
      if (this.modeType == "member") {
        urlStr = "plugin.diyform.api.diy-form.save-form-data";
      } else if (this.modeType == "activity"){
        urlStr = "plugin.diyform.api.diy-form.save-diy-form-data";
      }else {
        urlStr = "plugin.diyform.api.diy-form.saveDiyFormData";
      }
      $http
        .post(urlStr, {
          form_data: formData,
          form_id: that.form_id
        })
        .then(
          function(response) {
            if (response.result == 1) {
              Toast("提交成功");
              if(that.modeType == "activity" && that.type == "enroll"){
                that.info.form_id = response.data.form_data_id;
                that.toNew();
                return;
              }
              if (that.modeType == "Single") {
                // 返回form_data_id给父组件
                that.$emit("submitsave", response.data.form_data_id);
                return;
              }
              if (that.goodsId) {
                that.$router.push(
                  that.fun.getUrl(
                    "goodsorder",
                    {},
                    {
                      tag: "-2", //立即购买,
                      goodsId: that.goodsId,
                      optionsId: that.optionsId,
                      total: that.total,
                      store_id: that.$route.query.store_id
                    }
                  )
                );
              } else if (that.tag == "coupon") {
                //领券中心填写表单
                that.$router.push(that.fun.getUrl("couponStore", {}));
              } else {
                that.getDiyForm();
              }
            } else {
              Toast(response.msg);
              if (that.goodsId) {
                that.fun.getUrl(
                  "activityDiyForm",
                  {
                    id: that.form_id,
                    goodsId: that.goodsId,
                    optionsId: that.optionsId,
                    total: that.total
                  },
                  {
                    store_id: that.$route.query.store_id
                  }
                );
              } else {
                // that.getDiyForm();
              }
            }
          },
          function(response) {
            console.log("fail");
          }
        );
    },

    getDiyForm() {
      let that = this;
      if (this.fun.isTextEmpty(this.form_id)) {
        console.log("error:: 报单form_id为空！！ url:src/views/diy_form_controller.js");
        return;
      }
      $http
        .get("plugin.diyform.api.diy-form.getDiyFormTypeMemberData", {
          form_id: this.form_id
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.loading = true;
              if (response.data.status === 1) {
                that.status = response.data.status;
                that.diyform = response.data;
                that.thumb = response.data.thumb;
                that.share_description = response.data.share_description;
                that.fun.setWXTitle(that.diyform.title || "表单");
                that.fun.wxShare(
                  "",
                  { mid: that.fun.getKeyByMid() },
                  {
                    title: that.diyform.title,
                    imgUrl: that.thumb,
                    description: that.share_description
                  }
                );
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
              that.fun.setWXTitle(that.diyform.title || "表单");
              that.fun.wxShare(
                "",
                { mid: that.fun.getKeyByMid() },
                {
                  title: that.diyform.title,
                  imgUrl: that.thumb,
                  description: that.share_description
                }
              );
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

    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    // 有form_data_id的请求
    getDiyForm1() {
      let that = this;
      let _json = {
        form_id: this.form_id
      };
      if (this.form_data_id) {
        _json.form_data_id = this.form_data_id;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", _json).then(
        function(response) {
          if (response.result === 1) {
            console.log(response.data);
            if(that.modeType == 'activity'){
              console.log('1111111111111111111111');
              that.status = response.data.status;
              that.singleStatus = response.status;
            }
            console.log('1111111111111111111111');
            if (that.singleStatus) {
              console.log('11111111111111111111112');
              that.diyform = response.data;
              var fields = that.diyform.fields;
              that.thumb = response.data.thumb;
              that.share_description = response.data.share_description;
              that.fun.setWXTitle(that.diyform.title || "表单");
              that.fun.wxShare(
                "",
                { mid: that.fun.getKeyByMid() },
                {
                  title: that.diyform.title,
                  imgUrl: that.thumb,
                  description: that.share_description
                }
              );
              that.description = response.data.description;
              that.status = that.singleStatus;
              let e = {};
              e.fields = fields;
              that.loading = true;
              that.getDiyFormSingData(e);
            } else {
              console.log('11111111111111111111113',that.payStatus);
              console.log("singleStatus为false的时候");
              let e={};
              e.fields = response.data.fields;
              that.loading = true;
              if(that.payStatus != 1){
                that.getDiyFormSingData(e);
              }
              that.getDiyFormSingDataFalse(e);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getDiyFormSingData(e) {
      console.log(e, "getDiyFormSingData");
      let fields = e.fields;
      let that = this;
      that.loading = true;
      var f;
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
    getDiyFormSingDataFalse(e) {
      console.log("这是查看已提交aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", e);
      let _data = e;
      if (_data.status) {
        this.status = _data.status;
      }
      let that = this;
      let fields;
      that.loading = true;
      var list = {};
      console.log(this.flight, "11111");
      if (this.flight) {
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
            that.datas.push(list);
            console.log(that.diydata);
          }
        }
      } else if(this.modeType == 'activity'){

        fields = _data.fields;
        console.log(fields);
        for (let field in fields) {
          if (fields.hasOwnProperty(field)) {
            list = {
              title: fields[field].tp_name,
              value: fields[field].value?fields[field].value:'',
              data_type: fields[field].data_type
            };
            if (list.data_type == "diyduoxuan" || list.data_type == "diyduoxuankuang") {
              list.value = fields[field].content.join(",");
            }
            that.datas.push(list);
          }
        }
        console.log(that.datas);
      }else {
        console.log(_data);
        fields = _data;
        that.status = 1;
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
            that.datas.push(list);
          }
        }
        console.log(that.datas);
      }
    }
  },
  activated() {
    console.log("22222222212",this.info);
  },
  mounted() {
    this.diydata = [];
    this.datas = [];
    console.log("22222222212",this.singleDatas);
    if(this.modeType == 'activity'){
      this.uploadUrl = this.fun.getRealUrl("plugin.diyform.api.diy-form.DiyFormUpload", {});
    }else{
      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    }
    if (this.modeType == "member") {
      this.getDiyForm();
    } else {
      // console.log(this.singleDatas, "modeType==single");
      if (this.singleDatas) {
        // 父组件有返回表单格式不请求处理
        if (this.singleStatus) {
          // console.log("父组件有返回表单格式不请求处理,编辑回显");
          this.getDiyFormSingData(this.singleDatas);
        } else {
          // console.log("父组件有返回表单格式不请求处理,查看");
          this.getDiyFormSingDataFalse(this.singleDatas);
        }
      } else {
        // 父组件只返回form_id子组件内请求数据处理
        this.getDiyForm1();
      }
    }
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
.van-cell--required::before{
  left: 5px;
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
