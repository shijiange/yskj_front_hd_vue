<template>
  <div id="case-library-pc">
    <navigation></navigation>
    <div class="all">
      <div class="content-head" style="">
        <div style="padding: 15px; font-size: 18px; font-weight: 700; flex: 1;">发布案例</div>
        <div class="my-publish" @click="gotoMyPublish">我发布的案例</div>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="15%">
        <el-form-item label="案例名称" prop="">
          <el-input v-model="form.case_name" style="width: 70%;" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="案例图标/二维码" prop="thumb">
          <div style="display: flex; width: 70%;">
            <div style="flex: 1; position: relative;" @click="beforeRead('img')">
              <van-uploader :after-read="onRead">
                <div
                  style="padding: 15px; width: 150px; height: 150px; border: 1px dashed #c0ccda; margin: 0 auto; display: flex; border-radius: 5px;"
                >
                  <img
                    :src="form.img_url ? form.img_url : require('../../../../assets/images/up_icon.png')"
                    class="avatar"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </van-uploader>
              <div style="width: 150px; text-align: center; color: #000;">图标</div>
              <i class="el-icon-close" v-if="form.img_url" @click.stop="clearImg('img')" title="点击清除图片"></i>
            </div>
            <div style="flex: 1; position: relative;" @click="beforeRead('img_mini')">
              <van-uploader :after-read="onRead" >
                <div
                  style="padding: 15px; width: 150px; height: 150px; border: 1px dashed #c0ccda; margin: 0 auto; display: flex; border-radius: 5px;"
                >
                  <img
                    :src="form.img_mini_url ? form.img_mini_url : require('../../../../assets/images/up_icon.png')"
                    class="avatar"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </van-uploader>
              <div style="width: 150px; text-align: center; color: #000;">微信小程序</div>
              <i
                class="el-icon-close"
                v-if="form.img_mini_url"
                @click.stop="clearImg('img_mini')"
                title="点击清除图片"
              ></i>
            </div>
            <div style="flex: 1; position: relative;" @click="beforeRead('img_h5')">
              <van-uploader :after-read="onRead">
                <div
                  style="padding: 15px; width: 150px; height: 150px; border: 1px dashed #c0ccda; margin: 0 auto; display: flex; border-radius: 5px;"
                >
                  <img
                    :src="form.img_h5_url ? form.img_h5_url : require('../../../../assets/images/up_icon.png')"
                    class="avatar"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </van-uploader>
              <div style="width: 150px; text-align: center; color: #000;">公众号/H5</div>
              <i class="el-icon-close" v-if="form.img_h5_url" @click.stop="clearImg('img_h5')" title="点击清除图片"></i>
            </div>
          </div>
          <div class="tip">请上传正方形图片</div>
        </el-form-item>
        <el-form-item label="案例简介" prop="content">
          <el-input v-model="form.desc" style="width: 70%;" type="textarea" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="案例介绍" prop="content">
          <tinymce v-model="form.content" style="width: 714px;"></tinymce>
        </el-form-item>
        <el-form-item label="案例标签" prop="content">
          <div v-if="form.label">
            <van-tag
              v-for="(item, index) in form.label"
              :key="index"
              closeable
              size="medium"
              type="primary"
              @close="handleClose(index)"
              style="margin-right: 5px;"
            >
              {{ item.label_name }}
            </van-tag>
          </div>
          <el-popover placement="top" width="200" v-model="label_show">
            <el-input v-model="label_word" size="mini" placeholder="请输入标签名"></el-input>
            <div style="text-align: right; margin: 10px 0;">
              <span @click="label_show = false" style="cursor: pointer;">取消</span>
              <span
                type="primary"
                size="mini"
                @click="sureAddLabel"
                style="margin: 5px 10px; color: #ff5c00; cursor: pointer;"
              >确定</span
              >
            </div>
            <span class="add" slot="reference"
                  style="font-weight: 400; cursor: pointer; padding: 5px; line-height: 20px;"
            >添加标签</span
            >
          </el-popover>
          <el-popover placement="right" width="400" v-model="history_show">
            <div>
              <el-input v-model="label_kwd" size="mini" placeholder="请输入标签名" style="width: 70%;"></el-input>
              <span @click="getLabel(1)" class="add"
                    style="font-weight: 400; padding: 5px; line-height: 20px;">搜索</span>
            </div>
            <div class="label-history" style="min-height: 200px; overflow: auto; margin: 10px 0;">
              <!-- 循环标签 -->
              <div style="display: flex; flex-wrap: wrap;">
                <div
                  v-for="(item, index) in label_list"
                  :key="index"
                  @click="chooseLabel(item)"
                  style="margin: 5px 10px; font-weight: 400; cursor: pointer;"
                >
                  {{ item.label_name }}
                </div>
              </div>
            </div>
            <el-row>
              <el-col align="right">
                <el-pagination
                  layout="prev, pager, next,jumper"
                  @current-change="getLabel"
                  :total="label_total"
                  :page-size="label_per_page"
                  :current-page="label_current_page"
                  background
                ></el-pagination>
              </el-col>
            </el-row>
            <span
              type="text"
              slot="reference"
              @click="getLabel(1)"
              size="small"
              style="color: #ff9b19; margin-left: 20px; cursor: pointer;"
            >历史标签</span
            >
          </el-popover>
        </el-form-item>

        <el-form-item label="案例分类" prop="category">
          <div style="margin: 10px 0;" v-for="(item, index) in form.category_obj" :key="item.id">
            <el-select
              v-model="item.category_first"
              placeholder="请选择一级分类"
              clearable
              @change="changeCategory(index, item.category_first)"
              style="width: 35%;"
            >
              <el-option
                v-for="(item2) in category_list"
                :key="item2.id"
                :label="item2.category_name"
                :value="item2.id"
              ></el-option>
            </el-select>
            <el-select v-model="item.category_second" placeholder="请选择二级分类" clearable style="width: 35%;">
              <el-option
                v-for="item4 in item.second_list"
                :key="item4.id"
                :label="item4.category_name"
                :value="item4.id"
              ></el-option>
            </el-select>
            <span @click="delCategory(index)" class="del">删除</span>
          </div>
          <span @click="addCategory" class="add">添加分类</span>
        </el-form-item>

        <el-form-item label="案例所在省市">
          <el-select
            v-model="form.province"
            placeholder="请选择省"
            clearable
            @change="changePro"
            style="width: 35%;"
            value-key="v"
          >
            <el-option v-for="(item, index) in province_list" :key="index" :label="item.n" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.city_id" placeholder="请选择市" clearable style="width: 35%;">
            <el-option v-for="item in city_list" :key="item.id" :label="item.n" :value="item.v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案例截图" prop="content">
          <div class="tip">建议尺寸：640px*1136px</div>
          <div style="display: flex; flex-wrap: wrap;">
            <div
              class="img-li"
              v-for="(item, index) in form.screen_shot_url"
              :key="index"
              style="min-width: 150px; width: 150px; height: 300px; margin: 0 15px 15px 0; position: relative;"
            >
              <img :src="item" alt="" style="width: 100%; height: 100%;"/>
              <i class="el-icon-close" @click.stop="removeImg(index)" title="点击清除图片" style="right: 7px;"></i>
            </div>
            <div style="flex: 1; position: relative;">
              <van-uploader :after-read="onRead_1">
                <div
                  style="padding: 15px; width: 150px; height: 300px; border: 1px dashed #c0ccda; margin: 0 auto; display: flex; border-radius: 5px;"
                >
                  <img
                    :src="require('../../../../assets/images/up_icon.png')"
                    class="avatar"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </van-uploader>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="" prop="content">
          <span class="submit-button" @click="submitForm">提交</span>
        </el-form-item>
      </el-form>
    </div>
    <bottomAdv></bottomAdv>
    <div class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </div>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import caseLibrary_pc_controller from "./case_library_pc_controller";

export default caseLibrary_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
  $orange: rgb(255, 92, 0);

  #case-library-pc {
    text-align: left;

    .all {
      background: #fff;
      min-height: 100vh;
      width: 1200px;
      margin: 0 auto;
      padding-bottom: 30px;

      .content-head {
        padding-top: 15px;
        display: flex;

        .my-publish {
          padding: 0 15px;
          font-size: 16px;
          font-weight: 700;
          color: rgb(255, 92, 0);
          border: 1px solid rgb(255, 92, 0);
          border-radius: 4px;
          cursor: pointer;
          text-align: right;
          line-height: 40px;
          height: 40px;
          margin-right: 15px;
        }
      }

      .tip {
        color: #999;
      }

      .add {
        display: inline-block;
        cursor: pointer;
        line-height: 40px;
        padding: 0 10px;
        border-radius: 3px;
        color: #fff;
        background: $orange;
      }

      .del {
        display: inline-block;
        cursor: pointer;
        line-height: 40px;
        padding: 0 10px;
        background: #f56c6c;
        border-radius: 3px;
        color: #fff;
      }

      .submit-button {
        display: inline-block;
        cursor: pointer;
        line-height: 40px;
        padding: 0 10px;
        border-radius: 3px;
        color: #fff;
        background: $orange;
      }
    }
  }

  .el-icon-close {
    position: absolute;
    top: 5px;
    right: 90px;
    color: #fff;
    background: #333;
    border-radius: 50%;
    cursor: pointer;
  }

  .el-select-dropdown {
    max-width: 357px;
  }
</style>
