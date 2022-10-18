<!-- 基本信息组件 -->
<template>
  <div id="basicInformation" :class="{supplierClass:this.$route.params.store == 'supplier'}">
    <section id="edit-a">
      <ul class="number_power">
        <li>
          <span>商品名称:</span>
          <input type="text" v-model="cargon_data.title" placeholder="请输入商品名称" @blur="clearSrcoll()">
        </li>
        <li>
          <span>商品单位:</span>
          <input type="text" v-model="cargon_data.sku" placeholder="请输入商品单位" @blur="clearSrcoll()">
        </li>
      </ul>
    </section>

    <section
      style="height: 48px; background: white; margin-top: 10px; line-height: 48px;"
      ref="classify"
    >
      <span
        style="float: left; font-size: 16px; padding-left: 10px; box-sizing: border-box;"
      >商品分类：</span
      >
      <span class="block" style="float: left;">
        <van-button
          plain
          type="primary"
          style="max-width: 15rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-width: 5rem;"
          @click="seleRegional"
        >{{ regional }}
        </van-button>
      </span>
    </section>

    <section id="edit-b">
      <div class="top">
        <!-- setting sun -->
        <div
          style="height: 3.125rem; text-align: left; line-height: 3.125rem; padding-left: 10px; box-sizing: border-box;"
        >
          <span style="font-size: 16px;">商品图片：</span>
        </div>
        <div style="text-align: center;">
          <div>
            <van-uploader :after-read="onRead">
              <div
                style="padding: 1rem; width: 6rem; height: 6rem; border: 1px dashed #c0ccda; margin: 0 auto;"
              >
                <img
                  :src="
                    imageUrl
                      ? imageUrl
                      : require('../../../../../assets/images/up_icon.png')
                  "
                  style="width: 100%;"
                  class="avatar"
                />
              </div>
            </van-uploader>
          </div>
        </div>
      </div>
    </section>

    <!-- setting up -->
    <section
      class="otherphoto"
      style="background: white; margin-top: 0.625rem; padding-bottom: 10px; box-sizing: border-box;"
      v-if="!this.$route.params.goods_id"
    >
      <div
        style="height: 50px; text-align: left; padding-left: 13px; line-height: 50px;"
      >
        <span style="font-size: 16px;">商品详情：</span>
      </div>
      <div style="text-align: center;" class="clearfloat imgflex">
        <van-field
        v-model="shopText"
        type="textarea"
        placeholder="请输入商品详情文字"
        v-if="isType && minStore"
      />
        <template v-for="(val, index) in fileList2">
          <div class="photobox" :key="index">
            <img :src="val.url" style="width: 100%;"/>
            <i @click="removeImg(index)"></i>
          </div>
        </template>
        <van-uploader :after-read="multipleMethod_1" multiple>
          <div
            style="padding: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda; margin-left: 0.2rem; margin-right: 0.2rem;"
          >
            <img
              :src="require('../../../../../assets/images/up_icon.png')"
              style="width: 100%;"
              class="avatar"
            />
          </div>
        </van-uploader>
      </div>
    </section>
    <!-- <section class="otherphoto"
      style="background: white; margin-top: 0.625rem; padding-bottom: 10px; box-sizing: border-box;" v-if="isType">
      <div
        style="height: 50px; text-align: left; padding-left: 13px; line-height: 50px;"
      >
        <span style="font-size: 16px;">商品详情文字：</span>
      </div>
      <van-field
        v-model="shopText"
        type="textarea"
        placeholder="请输入商品详情文字"
      />
    </section> -->

    <section
      class="otherphoto"
      style="background: white; margin-top: 0.625rem; padding-bottom: 10px; box-sizing: border-box;"
    >
      <div
        style="height: 50px; text-align: left; padding-left: 13px; line-height: 50px;"
      >
        <span style="font-size: 16px;">其他图片（非必填）：</span>
      </div>
      <div style="text-align: center;" class="clearfloat  imgflex">
        <template v-for="(val, index) in fileList4">
          <div class="photobox" :key="index">
            <img :src="val.url" style="width: 100%;"/>
            <i @click="removeImg_1(index)"></i>
          </div>
        </template>
        <van-uploader :after-read="multipleMethod_2" multiple>
          <div
            style="padding: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda; margin-left: 0.2rem; margin-right: 0.2rem;"
          >
            <img
              :src="require('../../../../../assets/images/up_icon.png')"
              style="width: 100%;"
              class="avatar"
            />
          </div>
        </van-uploader>
      </div>
    </section>

    <section id="edit-c">
      <ul class="number_power">
        <li>
          <span>商品现价:</span>
          <input type="number" v-model="cargon_data.price" placeholder="请输入商品现价" @blur="clearSrcoll()">
        </li>
        <li>
          <span>商品原价:</span>
          <input type="number" v-model="cargon_data.market_price" placeholder="请输入商品原价" @blur="clearSrcoll()">
        </li>
        <li>
          <span>商品成本:</span>
          <input type="number" v-model="cargon_data.cost_price" placeholder="请输入商品成本" @blur="clearSrcoll()">
        </li>
      </ul>
    </section>
    <section id="edit-d">
      <ul class="number_power">
        <li>
          <span>商品库存:</span>
          <input type="number" v-model="cargon_data.stock" placeholder="请输入商品库存" @blur="clearSrcoll()">
        </li>
      </ul>
    </section>
    <div class="bottomPlaceholder"></div>
    <van-popup @click-overlay="isCoverLayer" v-model="dateshow_1" position="bottom" :overlay="true" class="fenleiDiv">
      <van-picker
        :columns="columns"
        @change="onChange"
        @cancel="onCancelbtn"
        @confirm="onConfirmbtn"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script>
import basicInformation from "./basicInformation_controller.js";

export default basicInformation;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  // 选择分类
  .avatar {
    width: 100%;
    height: 100%;
  }

  .el-cascader {
    width: 15.625rem;
  }

  #basicInformation {
    // position:fixed;
    width: 100%;
    // height: auto;
    // top: 0;
    // left:0;
    // bottom: 3.3125rem;
    padding-bottom: 6.8rem;
    overflow: scroll;
    z-index: 999;
    background-color: #f5f5f5;
    height: 100%;
    -webkit-overflow-scrolling: touch; //ios中，通过overflow产生的scroll在滑动时会不流畅，添加上这个属性就能使其流畅滑动
    #edit-b {
      background-color: #fff;
      margin-top: 0.625rem;

      .top,
      .bottom {
        padding: 0 0.875rem;
        font-size: 14px;
        padding-bottom: 0.625rem;

        h1 {
          line-height: 2.25rem;
          text-align: left;
          font-weight: normal;
        }

        .icon {
          padding-top: 1.125rem;
          width: 4.5rem;
          height: 4.5rem;
          background-color: #fafafa;
          font-size: 12px;

          i {
            padding: 0.125rem;
            background-color: #fff;
            border: solid 0.0625rem #ebebeb;
            border-radius: 1.25rem;
          }

          span {
            display: block;
            margin-top: 0.25rem;
          }
        }
      }

      .bottom {
        border-bottom: none;
      }
    }

    .otherphoto {
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

        i {
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          background: url("../../../../../assets/images/close_iocn.png");
          background-size: 100%;
        }
      }
    }

    #edit-c,
    #edit-a {
      margin-top: 0.625rem;
      background-color: #fff;

      ul {
        li {
          height: 2.75rem;
          line-height: 2.75rem;
          padding: 0 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 16px;
          text-align: left;

          input {
            border: none;
            color: #8c8c8c;
            width: 74%;
          }
        }
      }
    }

    #edit-a {
      ul {
        li:last-child {
          border: none;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
            position: absolute;
            right: 0.875rem;
            line-height: 2.75rem;
          }

          input {
            font-size: 14px;
          }
        }
      }
    }

    #edit-d {
      margin-top: 0.625rem;
      background-color: #fff;

      ul {
        li {
          height: 2.75rem;
          line-height: 2.75rem;
          padding: 0 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 16px;
          text-align: left;

          input {
            border: none;
          }
        }

        li:last-child {
          border: none;
        }
      }
    }

    .bottomPlaceholder {
      margin-top: 0.6875rem;
      height: 2.75rem;
      display: block;
    }

    .fenleiDiv {
      min-height: 60%;
      z-index: 9999 !important;
    }

    .imgflex {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .supplierClass {
    // top: 40px!important;
  }
</style>
