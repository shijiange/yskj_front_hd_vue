<template>
  <div class="page">
    <c-title text="修改项目"></c-title>

    <div class="wrapper">
      <div class="inputWrapper">
        <div class="ps">
          <span>姓名</span>
          <span style="color: red;">*</span>
        </div>
        <input type="text" class="input" v-model="fullName" placeholder="请输入姓名" />
        <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
      </div>
      <div class="inputWrapper" v-if="project.project_shell_type != 3">
        <div class="ps">
          <span>发布者</span>
          <span style="color: red;">*</span>
        </div>
        <div class="input" v-if="project.member">{{ project.member.nickname }}</div>
        <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
      </div>
      <div class="inputWrapper">
        <div class="ps">
          <span>预估金额</span>
          <span style="color: red;">*</span>
        </div>
        <input type="number" class="input" v-model="project_amount" placeholder="请输入预估金额" />
        <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
      </div>
      <div class="inputWrapper" v-if="is_modify_amount == 1">
        <div class="ps">
          <span>实际金额</span>
          <span style="color: red;">*</span>
        </div>
        <input type="number" class="input" v-model="actual_amount" placeholder="请输入实际金额" />
        <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
      </div>
      <div class="inputWrapper" @click="addressShow = true">
        <div class="ps">
          <span>地址</span>
          <span style="color: red;">*</span>
        </div>
        <div class="input">{{ addressName }}</div>
        <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
      </div>
      <div class="inputWrapper" v-if="strShow == true" @click="streetShow = true">
        <div class="ps">
          <span>街道</span>
          <span style="color: red;">*</span>
        </div>
        <div class="input">{{ streetName }}</div>
        <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
      </div>
      <div class="inputWrapper" @click="subscribe.show = true">
        <div class="ps">
          <span>预约项目</span>
          <span style="color: red;">*</span>
        </div>
        <div class="input">{{ subscribe.name }}</div>
        <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
      </div>
      <div class="inputWrapper" @click="intention.show = true">
        <div class="ps">
          <span>意向项目</span>
          <span style="color: red;">*</span>
        </div>
        <div class="input">{{ intention.name }}</div>
        <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
      </div>
      <van-cell-group v-if="is_modify_amount == 1" style="padding-left: 0;" class="blcok" :border="false">
        <div style="margin-top: 0.8rem;"><span>凭证</span><span style="color: red;">*</span></div>

        <div
          class="clearfloat"
          style="display: flex; width: 100%; text-align: center; line-height: 5rem; padding: 0.4rem 0 1rem;"
        >
          <template v-for="(item, key) in voucher">
            <div class="photobox" style="float: left; max-width: 25%;" :key="key">
              <img :src="item" style="max-width: 5rem;" />
              <van-icon
                @click="removeImg_1(key)"
                name="close"
                style="width: 1.5rem; height: 1.5rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;"
              />
            </div>
          </template>
          <div style="margin-left: 0.2rem;">
            <van-uploader style="display: block;" :after-read="onRead_2">
              <div
                style="display: flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;"
              >
                <img :src="require('../../../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
              </div>
            </van-uploader>
          </div>
        </div>
      </van-cell-group>
      <c-add-project-form
        :datas="datas"
        ref="addProjectForm"
        v-on:submitSave="saveInfo"
        :tag="1"
        :form_data_id="form_data_id"
      ></c-add-project-form>
    </div>

    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="area"> </yd-cityselect>

    <van-popup v-model="streetShow" position="right" :style="{ width: '100%', height: '100%', overflow: auto }">
      <van-nav-bar title="选择街道">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <van-cell
        :border="false"
        :key="i"
        title-style="text-align:left"
        is-link
        v-for="(item, i) in districtVal"
        @click.native="streetConfirm(item)"
      >
        <span slot="title">{{ item.areaname }}</span>
      </van-cell>
    </van-popup>

    <!-- 预约项目 -->
    <van-popup v-model="subscribe.show" position="bottom" class="fenleiDiv">
      <van-picker ref="subscribe" :columns="category" @confirm="onConfirmSubscribe" show-toolbar />
    </van-popup>

    <!-- 意向项目 -->
    <van-popup v-model="intention.show" position="bottom" class="fenleiDiv">
      <van-picker ref="intention" :columns="category" @confirm="onConfirmIntention" show-toolbar />
    </van-popup>

  </div>
</template>

<script>
import tacitEditprojectController from './tacit_editproject_controller';

export default tacitEditprojectController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(246, 248, 252);
  min-height: 100vh;
}

.wrapper {
  text-align: left;
  padding: 0.531rem 0.813rem;
  background: #fff;

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

/deep/.van-cell:active {
  background-color: none !important;
}
</style>
