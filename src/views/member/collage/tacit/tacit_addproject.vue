<template>
  <div class="page">
    <c-title text="添加项目"></c-title>

    <div class="wrapper">
      <div class="inputWrapper">
        <div class="ps">
          <span>姓名</span>
          <span style="color: red;">*</span>
        </div>
        <input type="text" class="input" v-model="fullName" placeholder="请输入姓名" />
        <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
      </div>
      <div class="inputWrapper">
        <div class="ps">
          <span>预约金额</span>
          <span style="color: red;">*</span>
        </div>
        <input type="number" class="input" v-model="project_amount" placeholder="请输入预约金额" />
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
      <van-nav-bar title="选择街道" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <van-cell
        :border="false"
        center
        is-link
        :key="i"
        v-for="(item, i) in districtVal"
        @click.native="streetConfirm(item)"
        title-style="text-align:left"
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
import tacitAddprojectController from './tacit_addproject_controller';

export default tacitAddprojectController;
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
</style>
