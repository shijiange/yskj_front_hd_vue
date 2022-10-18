<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="供应商申请"></c-title>
      <div class="banner" v-if="apply_page_banner">
        <img :src="apply_page_banner"/>
        <!-- <img src="../../../assets/images/supplier.png" alt=""> -->
      </div>

      <div class="main" v-if="supplier_status == 1 && !isDiyForm">
        <!--申请   -->
        <div class="welcome">
          <div class="text">
            <p>请填写申请信息</p>
          </div>
          <div class="info">
            <input type="text" placeholder="设置账号" class="inp" v-model="applyModel.username" />
            <input type="password" placeholder="设置密码" class="inp" v-model="applyModel.password" />
            <span id="tips" v-if="pass_safe == 1">密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符</span>
            <input type="text" placeholder="请填写真实姓名" class="inp" v-model="applyModel.realname" />
            <input type="number" placeholder="请填写手机号码" class="inp" v-model="applyModel.mobile" />
            <input type="text" placeholder="请填写产品类型" class="inp" v-model="applyModel.product" />
            <input type="text" placeholder="请选择地区" class="inp1" v-model="fullAddress" readonly @click="showCity1 = true" />
            <input type="text" v-if="strShow" placeholder="请选择街道" class="inp1" v-model="applyModel.street_name" @click.stop="streetChoose" readonly />

            <van-cell-group class="city-text" v-if='is_open_group === "1"'>
              <van-cell title-style="text-align:left" center :border="false" style="border: 1px solid #757575; border-radius: 0.3125rem; height: 2rem; padding: 0 6px; position: relative;">
                <select slot="default" v-model="applyModel.group_id" style="color: #757575; font-size: 13px;" @change="groupingSelect" @click="groupingClick">
                  <option value="">请选择分组</option>
                  <option :value="item.id" v-for="(item, i) in grouping" :key="i">{{ item.title }}</option>
                </select>
                <van-icon name="arrow" style="position: absolute; top: 25%; right: 0;" v-if="!grouping_info" />
                <van-icon name="arrow-down" style="position: absolute; top: 25%; right: 0;" v-if="grouping_info" />
              </van-cell>
            </van-cell-group>
            <van-cell-group class="city-text" v-if='is_open_category === "1"'>
              <van-cell title-style="text-align:left" center :border="false" style="border: 1px solid #757575; border-radius: 0.3125rem; height: 2rem; padding: 0 6px; position: relative;">
                <select slot="default" v-model="applyModel.category_id" style="color: #757575; font-size: 13px;" @change="industrySelect" @click="industryClick">
                  <option value="">请选择行业</option>
                  <option :value="item.id" v-for="(item, i) in industry" :key="i">{{ item.title }}</option>
                </select>
                <van-icon name="arrow" style="position: absolute; top: 25%; right: 0;" v-if="!industry_info" />
                <van-icon name="arrow-down" style="position: absolute; top: 25%; right: 0;" v-if="industry_info" />
              </van-cell>
            </van-cell-group>
            <div class="item-upload" v-if="groupList.up_aptitude === 1">
              <div class="title">上传营业执照<span class="xi">*</span></div>
              <div class="img_uploader">
                <template v-for="(val, index) in applyModel.aptitude">
                  <div class="photoBox" :key="index">
                    <img :src="val" style="width: 100%;" />
                    <i @click="removeImage(index)"></i>
                  </div>
                </template>
                <van-uploader :after-read="multipleMethod_1" multiple>
                  <van-icon name="plus" />
                </van-uploader>
              </div>
            </div>

            <div class="item-upload" v-if="groupList.is_identity == 1">
              <div class="title">上传身份证<span class="xi">*</span></div>
              <div class="img_uploader" style="display: block;">
                <div @click="upIdCard(1)">
                  <p style="font-weight: bold;" class="list-item border-none">身份证人像面</p>
                  <van-uploader style="width: 100%; height: auto;" :after-read="onReadIdCard">
                    <div style="width: 100%; height: 11rem;">
                      <img :src="id_card_side ? id_card_side : require('../../../assets/images/bg_idcard_up@2x.png')" style="width: 100%; height: 100%;" class="avatar" />
                    </div>
                  </van-uploader>
                </div>

                <div @click="upIdCard(0)">
                  <p style="font-weight: bold;" class="list-item border-none">身份证国徽面</p>
                  <van-uploader style="width: 100%; height: auto;" :after-read="onReadIdCard">
                    <div style="width: 100%; height: 11rem;">
                      <img :src="id_card_front ? id_card_front : require('../../../assets/images/bg_idcard_down@2x.png')" style="width: 100%; height: 100%;" class="avatar" />
                    </div>
                  </van-uploader>
                </div>


              </div>
            </div>
            <!--<el-input type="textarea" :rows="2" placeholder="备注" v-model="applyModel.remark">-->
            <!--</el-input>-->
            <van-cell-group>
              <van-field v-model="applyModel.remark" type="textarea" placeholder="备注" rows="2" />
            </van-cell-group>

            <div class="subPos">
              <input type="submit" value="申请" class="btn" @click="setApplyData" />
              <yzSubscribe v-on:confirm="confirmSub" v-on:error="errorSub" :tagName="'supplier_apply'" :styleWidth="'400px'" :styleHeight="'35px'" :styleSubWidth="'400px'"></yzSubscribe>
            </div>
          </div>
          <div class="checkbox">
            <van-checkbox v-model="agreement" checked-color="#f55955" icon-size="20px">
              <p @click.stop="explainFlag = true" class="label">阅读并同意《供应商协议》</p>
            </van-checkbox>
          </div>
        </div>

        <!--文字说明；后台设置-->
        <div class="vip_main" v-if="!(supplier_info == null || supplier_info == '' || supplier_info == undefined)">
          <div class="title">供应商说明</div>
          <div class="vip">
            <div class="text">
              <div class="t1" v-html="supplier_info"></div>
              <!--<div class="t2">拥有专属推广二维码，用于推广客户；</div>-->
            </div>
          </div>
        </div>
      </div>

      <div class="main" v-if="supplier_status == 2 && isDiyForm">
        <van-cell-group :border="false" class="grop-title">
          <van-cell :border="false" title-class="left-title" center>
            <span slot="title"> 请填写申请信息</span>
          </van-cell>
        </van-cell-group>

        <!--<div class="add-preview" v-show="isPreview" @click="closePreview">
      <img :src="previewImg">
      </div>-->
        <template v-for="(item, index) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group :border="false" class="flex-height" :key="index">
              <van-cell :border="false" center>
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

                <!--<span slot="title">{{ item.data.tp_name }}</span>-->
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

          <div class="image-list" v-if="item.type == 'diyimage'" :key="index">
            <!-- 上传图片 -->
            <section class="otherphoto">
              <div style="height: 50px; text-align: left; padding-left: 13px; line-height: 50px;">
                <span style="font-size: 15px;">{{ item.data.tp_name }}：</span>
              </div>
              <div>
                <div class="imgflex">
                  <!--<el-upload class="upload-demo" :on-change="handleChange" :action="uploadUrl"-->
                  <!--:data="{'attach':item.name}" :on-preview="handlePreview" :on-remove="handleAptiRemove"-->
                  <!--:file-list="fileList1" list-type="picture-card" :on-exceed="handleExceed"-->
                  <!--:before-upload="beforeUpload" :on-success="handleAptiSuccess">-->

                  <!--<div style="width: 100%;height: 100%;background: rgba(45,45,45,0);position: relative;">-->
                  <!--<i class="el-icon-plus"></i>-->
                  <!--<div-->
                  <!--style="width: 100%;height: 100%;background: rgba(45,45,45,0);position: absolute;left: 0px;top:0px;z-index: 99;"-->
                  <!--@click.stop="occlusion()" v-if="upNumMax>=item.data.tp_max">-->
                  <!--</div>-->
                  <!--</div>-->

                  <!--</el-upload>-->
                  <viewer :images="item.imgUrls" class="section" style="display: flex;">
                    <template v-for="(val, index_1) in item.imgUrls">
                      <div class="photobox" :key="index_1">
                        <img :src="val" style="width: 100%;" />
                        <i @click="removeImg(index_1, index)"></i>
                      </div>
                    </template>
                  </viewer>
                  <div @click="setIndex(item.name)">
                    <van-uploader :after-read="onRead_1">
                      <div style="padding: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda; margin-left: 0.2rem; margin-right: 0.2rem;">
                        <img :src="require('../../../assets/images/up_icon.png')" style="width: 100%;" class="avatar" />
                      </div>
                    </van-uploader>
                  </div>
                </div>
              </div>
            </section>

            <!--<div class="list-default-img">
              <span>{{item.data.tp_name}}：</span>
              <input type="file" accept="image/jpeg,image/jpg,image/png" capture="camera" @change="onFileChange($event, item)">
            </div>

              <ul class="list-ul">
              <li class="list-li" v-for="(iu, index) in item.imgUrls"  style="overflow: hidden;position: relative">
                <a class="list-link">
                  <img :src="iu">
                </a>
                <div class="delimg" @click="delImage(item.imgUrls, index)" size="large">删除</div>
              </li>
            </ul>-->
          </div>

          <template v-if="item.type == 'diytextarea'">
            <van-cell-group :border="false" :title="item.data.tp_name" style="margin-bottom: 10px;" :key="index">
              <van-field v-model="item.value" rows="3" autosize type="textarea" maxlength="100" :placeholder="item.data.placeholder" show-word-limit />
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycheckbox'">
            <van-checkbox-group v-model="item.value" checked-color="#4cd864" :key="index">
              <van-cell-group :border="false" :title="item.data.tp_name" class="checkbox-height">
                <van-cell title-class="checkbox-text" v-for="(ck, i) in item.data.tp_text" :key="i" clickable center :title="ck" @click="toggle(i)" :border="false">
                  <template #right-icon>
                    <van-checkbox :name="ck" ref="checkboxes" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <template v-if="item.type == 'diyselect'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link>
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
              <van-cell-group :border="false" class="active-detail checkbox-height" :title="item.data.tp_name">
                <van-cell clickable v-for="(ritem, i) in item.data.tp_text" :key="i" @click="item.value = ritem" center :border="false" title-style="text-align:left">
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

          <template v-if="item.type == 'diycity'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link>
                <span slot="title">{{ item.data.tp_name }}：</span>
                <input slot="default" type="text" @click.stop="showCity = true" @click="openCity(item.name)" v-model="item.value" readonly />
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diydate'">
            <van-cell-group :border="false" class="data-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link @click.native="openPicker(item.name)">
                <span slot="title">{{ item.data.tp_name }}:</span>
                <span slot="default">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyusername'">
            <van-cell-group :border="false" class="flex-height" :key="index">
              <van-cell :border="false" center>
                <van-field style="min-height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="min-height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name }}：</span>-->
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
          <template v-if="item.type == 'diypassword'">
            <van-cell-group :border="false" class="flex-height" :key="index">
              <van-cell :border="false" center>
                <van-field
                  style="height: 30px;"
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
                  style="height: 30px;"
                  v-if="item.data.tp_must == 0"
                  v-model.trim="item.value"
                  :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                  clearable
                  type="password"
                  :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name }}：</span>-->
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
        <template>
          <div class="van-button-group">
            <van-button size="large" style="height: 40px;" @click.native="submit" type="primary">提交申请</van-button>
          </div>
        </template>
        <div class="checkbox">
          <van-checkbox v-model="agreement" checked-color="#07c160" icon-size="20px">
            <p @click.stop="explainFlag = true" class="label">阅读并同意《供应商协议》</p>
          </van-checkbox>
        </div>

        <!--文字说明；后台设置-->
        <div class="vip_main" v-if="!(supplier_info == null || supplier_info == '' || supplier_info == undefined)">
          <div class="title">供应商说明</div>
          <div class="vip">
            <div class="text">
              <div class="t1" v-html="supplier_info"></div>
              <!--<div class="t2">拥有专属推广二维码，用于推广客户；</div>-->
            </div>
          </div>
        </div>
      </div>

      <van-overlay :show="explainFlag" @click="explainFlag = false" z-index="999" :lock-scroll="false">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-slide-up">
            <div class="explainWrapper" v-show="explainFlag" @click.stop>
              <div class="header">
                <div class="title">协议说明</div>
                <i class="iconfont icon-guanbi" @click="explainFlag = false"></i>
              </div>
              <div class="content" v-html="agreementText"></div>
            </div>
          </transition>
        </div>
      </van-overlay>

      <van-popup v-model="pickerShow" position="bottom">
        <van-datetime-picker type="date" title="选择年月日" v-model="pickerValue" @cancel="pickerShow = false" @confirm="setDate" />
      </van-popup>
      <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

      <yd-cityselect v-model="showCity1" :callback="setCity1" :items="district"></yd-cityselect>

       <!-- 街道选择 -->
      <van-popup v-model="streetShow" position="bottom" :overlay="true">
        <van-picker
          title="选择街道"
          show-toolbar
          value-key="areaname"
          :columns="districtVal"
          @confirm="streetConfirm"
          @cancel="onCancel"
        />
      </van-popup>

      <!--申请后展示-->
      <div class="success" v-if="supplier_status == 0">
        <div class="ico"><i class="fa fa-check"></i></div>
        <div class="text">您的申请已经提交，请等待审核！</div>
        <a @click="goHome()">
          <div class="sub">去商城逛逛</div>
        </a>
      </div>

      <!--审核通过后展示，文字后台设置 -->
      <div class="success" v-if="supplier_status == -1">
        <div class="ico"><i class="fa fa-check"></i></div>
        <div class="text">您已通过审核</div>
        <a @click="goHome()">
          <div class="sub">去商城逛逛</div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import supplier_controller from "./supplier_controller";

export default supplier_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.subPos {
  position: relative;
}

.van-button-group {
  padding-top: 15px;
  padding-left: 12px;
  padding-right: 12px;
}

#tips {
  text-align: left;
  color: #ff5d5c;
  font-size: 12px;
  display: inline-block;
  padding-left: 12px;
}

.el-input__icon.el-icon-caret-top {
  color: #b8b8b8;
}

.el-input__inner {
  border: 0.0625rem solid #b8b8b8;
  font-size: 12px;
}

.el-select {
  display: block;
  margin-bottom: 0.5rem;
  width: 100%;
  height: 2rem;
  border-radius: 0.3125rem;
  box-sizing: border-box;
  outline: none;
}

.delimg {
  position: absolute;
  top: 0;
  right: 0;
  height: 1.25rem;
  width: 1.875rem;
  color: #fff;
  background-color: red;
}

#income {
  h3 {
    background: #f5f5f5;
    margin: 0;
    padding: 0 0.625rem;
    text-align: left;
    font-weight: normal;
    font-size: 12px;
    height: 2rem;
    box-sizing: border-box;
    line-height: 2rem;

    span {
      color: #999;
    }
  }
}

a {
  text-decoration: none;
  color: #222;
}

input {
  border-width: 0;
  // position: absolute;
  right: 0;
}

.list-ul img {
  width: 80%;
  height: 80%;
}

.list-ul {
  display: flex;
  flex-direction: column;
}

.image-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 0.75rem 0;
  margin-top: -0.625rem;

  .otherphoto {
    .photobox {
      position: relative;
      width: 5rem;
      height: 5rem;
      border: 1px dashed #c0ccda;
      margin-right: 0.2rem;
      margin-left: 0.2rem;
      margin-bottom: 0.2rem;

      img {
        width: 100%;
        height: 100%;
      }

      i {
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        background: url("../../../assets/images/close_iocn.png");
        background-size: 100%;
      }
    }
  }
}

.list-default-img {
  height: 3.125rem;
  text-align: left;
  padding-left: 0.75rem;
}

.supplier {
  overflow: hidden;
}

.supplier .banner img {
  width: 100%;
}

.supplier .main {
  position: relative;
  top: -0.25rem;
}

.welcome {
  padding: 0.625rem;
  background: #fff;

  .text {
    p {
      font-size: 12px;
      color: #666;
      line-height: 1.2rem;
      margin-top: 0;

      span {
        color: #f55955;
      }
    }
  }

  .info {
    margin-top: 0.625rem;

    input {
      position: relative;
      display: block;
      margin-bottom: 0.5rem;
      width: 100%;
      height: 2rem;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      outline: none;
    }

    .inp1 {
      border: 0.0625rem solid #b8b8b8;
    }

    .inp {
      border: 0.0625rem solid #b8b8b8;
    }

    .inp:focus {
      border-color: #f55955;
      box-sizing: border-box;
    }

    span {
      color: #f55955;
    }

    .btn {
      background: #f55955;
      color: #fff;
      margin-bottom: 0.5rem;
      width: 100%;
      height: 2rem;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      line-height: 2rem;

      i {
        display: inline-block;
      }
    }

    .btn:focus {
      background: #d8403c;
    }
  }
}

.supplier .main .vip_main {
  background: #fff;
  margin: 0.9375rem 0;

  .title {
    padding: 0.625rem;
    font-size: 12px;
    border-bottom: 0.0625rem solid #eee;
    text-align: center;
  }

  .vip {
    padding: 0.9375rem 0.625rem;
    overflow: hidden;
    font-size: 12px;
    color: #999;

    .ico1,
    .ico2 {
      width: 15%;
      float: left;
    }

    .ico1 {
      i {
        background: #32cd32;
      }
    }

    .ico2 {
      i {
        background: #fece00;
      }
    }

    .text {
      float: left;
      width: 100%;

      .t1 {
        font-size: 16px;
        color: #333;
        margin-bottom: 0.3125rem;
        text-align: left;
      }

      .t2 {
        text-align: justify;
      }
    }

    i {
      background: #32cd32;
      height: 2.25rem;
      width: 2.25rem;
      border-radius: 1.125rem;
      color: #fff;
      text-align: center;
      line-height: 2.375rem;
      font-size: 1.25rem;
    }
  }

  .vip1 {
    border-bottom: 0.0625rem solid #eee;
  }
}

.supplier .success {
  height: 12.5rem;
  padding-top: 4.0625rem;
  background: #fff;

  .ico {
    height: 4.0625rem;
    width: 4.0625rem;
    margin: auto;
    border: 0.1875rem solid #32cd32;
    border-radius: 4rem;
    color: #32cd32;
    font-size: 2.3rem;
    text-align: center;
    line-height: 4rem;
  }

  .text {
    height: 2rem;
    margin-top: 1.875rem;
    color: #666;
    line-height: 1.6rem;
    text-align: center;
  }

  a .sub {
    height: 2rem;
    width: 80%;
    background: #f55955;
    margin: 1.25rem auto;
    border-radius: 2rem;
    color: #fff;
    line-height: 2rem;
    text-align: center;
    font-size: 14px;
    margin-bottom: 1.25rem;
  }

  a .sub:focus {
    background: #d8403c;
  }
}

.imgflex {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.checkbox {
  padding: 1rem 0 0 1rem;
}

.explainWrapper {
  width: 21.25rem;
  max-height: 22.625rem;
  background-color: #fff;
  border-radius: 1.531rem;
  padding-bottom: 3rem;
  transition: 0.3s;
  padding-top: 0.5rem;

  .header {
    height: 2.596rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .title {
      font-size: 1rem;
      letter-spacing: 0.05rem;
      color: #000;
    }

    .icon-guanbi {
      position: absolute;
      top: 0.875rem;
      right: 1.25rem;
      color: #000;
    }
  }

  .content {
    max-height: 11rem;
    padding-top: 0.562rem;
    font-size: 0.875rem;
    letter-spacing: 0.066rem;
    color: #666;
    padding-left: 1.049rem;
    padding-right: 1.469rem;
    text-align: left;
    text-indent: 1.75rem;
    line-height: 1.5rem;
    overflow-y: scroll;
  }
}

.main {
  .grop-title {
    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
    }
  }

  .van-cell-group__title {
    text-align: left;
    padding: 2.5px 12px 5px;
  }

  .left-title {
    text-align: left;
  }

  /deep/ .van-field__control {
    color: #555;
  }

  /deep/ textarea::placeholder {
    color: #555;
  }

  .checkbox-text {
    text-align: left;
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

  .flex-height {
    margin-bottom: 10px;

    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;

      .van-cell__title {
        flex: none;
        margin-right: 5px;
      }
    }
  }

  .checkbox-height {
    .van-cell {
      padding: 0 12px;
      height: 50px;
    }
  }
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

.item-upload {
  text-align: left;
  padding-top: 0.875rem;

  .data-text {
    .van-cell {
      min-height: 50px;
      padding: 0 12px;
      color: #555;
    }
  }

  .img_uploader {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .photoBox {
      position: relative;
      width: 4.5rem;
      height: 4.5rem;
      border: 1px dashed #c0ccda;
      margin-right: 0.2rem;
      margin-left: 0.2rem;
      margin-bottom: 0.2rem;

      div {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
      }

      i {
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        background: url("../../../assets/images/close_iocn.png");
        background-size: 100%;
      }
    }

    .van-uploader {
      width: 4.5rem;
      height: 4.5rem;
      overflow: hidden;
      background: #fff;
      margin-left: 0.2rem;
      margin-right: 0.875rem;
      margin-bottom: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #757575;

      .van-icon {
        font-size: 24px;
        line-height: 4.5rem;
        color: #666;
      }
    }

    .avatar {
      width: 11.125rem;
      height: 11.125rem;
      display: block;
    }
  }
}
</style>
