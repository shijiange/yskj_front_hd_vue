<template>
  <div id="publish_first" ref="publish_first">
    <c-title :hide="false" text="拍品发布"></c-title>
    <div class="content">
        <div class="item">
            <div class="title">拍品标题</div>
            <div class="input">
              <input type="text" placeholder="请输入拍品标题" v-model="form.title">
            </div>
          </div>
        <div class="item">
              <div class="title">拍品单位(如: 个/件/包)</div>
              <div class="input">
                <input type="text" placeholder="请输入拍品单位" v-model="form.sku">
              </div>
        </div>
        <div class="item">
          <div class="title">拍品库存</div>
          <div class="input">
            <input type="number" placeholder="请输入拍品库存" v-model="form.stock">
          </div>
    </div>
        <div class="item-category">
            <div class="title">拍品分类</div>
            <section
      style="height: 48px; background: white; margin-top: 10px; line-height: 48px;"
      ref="classify"
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
         </div>
        <div class="item-upload">
            <div class="title">拍品图片</div>
            <div class="img_uploader">
                <div class="photoBox" v-if="form.thumb">
                  <img :src="form.thumb"
                       style="width: 100%;" />
                  <i @click="removeImg1"></i>
                </div>
              <van-uploader :after-read="onRead">
                <van-icon name="photograph" />
              </van-uploader>
            </div>
         </div>
         <div class="item-upload">
            <div class="title">其他图片</div>
            <div class="img_uploader">
              <template v-for="(val, index) in form.thumb_url">
                <div class="photoBox" :key="index">
                  <img :src="val"
                       style="width: 100%;" />
                  <i @click="removeImg(index)"></i>
                </div>
              </template>
              <van-uploader :after-read="multipleMethod_1" multiple>
                <van-icon name="photograph" />
              </van-uploader>
            </div>
         </div>
         <div class="item-textarea" v-if="fun.isTextEmpty(form.goods_id)">
            <div class="title">拍品描述</div>
            <textarea class="txt" placeholder="拍品描述" v-model="form.describe"></textarea>
         </div>
         <div class="item-upload" v-if="fun.isTextEmpty(form.goods_id)">
            <div class="title">拍品详情</div>
            <div class="img_uploader">
              <template v-for="(val, index) in form.content">
                <div class="photoBox" :key="index">
                  <img :src="val"
                       style="width: 100%;" />
                  <i @click="removeImg2(index)"></i>
                </div>
              </template>
              <van-uploader :after-read="multipleMethod_2" multiple>
                <van-icon name="photograph" />
              </van-uploader>
          </div>
         </div>
         <div class="item-add">
            <div class="title">拍品属性</div>
            <div style="display: flex; flex-wrap: wrap;">
              <div class="add-spe" v-for="(item,index) in param" :key="index" style="margin-right: 0.5rem;">
                <div class="add-btn" ><span>{{item.attrname}}</span>:<span>{{item.attrvalue}}</span> <i class="iconfont icon-close11" style="margin-left: 0.5rem; font-size: 12px;" @click="deleteAttr(index)"></i></div>

              </div>
              <div class="add-spe">
                <div class="add-btn" @click="addAttr"><span class="icon">+</span><span>添加属性</span></div>
              </div>
            </div>
         </div>
    </div>
    <div class="wrap">
        <div class="left"><van-checkbox v-model="checked" checked-color="#ff0000"></van-checkbox><span @click.stop="show1=true">《竞拍服务协议》</span></div>
        <div class="right-btn" @click.stop="toNext">下一步</div>
    </div>
    <van-popup v-model="show1" position="right" style="width: 100%; height: 100%;">
        <div class="agreement-pop">
            <div class="tit">
              <span>竞拍服务协议</span>
              <i class="iconfont icon-close11"  @click="show1=false"></i>
            </div>
            <div class="pop-content" v-html="protocol">
            </div>
        </div>
    </van-popup>
    <van-popup v-model="show3" position="center" :close-on-masker="false" round style="width: 70%;">
      <div class="pop">
        <div class="top">
          <input class="input" placeholder="属性名" type="text" v-model="attrname"></input>
          <input class="input" placeholder="属性值" type="text" v-model="attrvalue"></input>
        </div>
        <div class="bottom">
          <div style="border-right: #e2e2e2;" @click="show3=false">取消</div>
          <div style="color: #ef3e3e;" @click="pushAttr">确定</div>
        </div>
      </div>
    </van-popup>
    <van-popup @click-overlay="isCoverLayer" v-model="dateshow_1"  position="bottom" :overlay="true" class="fenleiDiv" style="position: absolute;">
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
import publish_first_controller from "./publish_first_controller";

export default publish_first_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#publish_first {
  background-color: #fff;
  height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
  position: relative;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;
    padding-bottom: 2.1875rem;

    .item {
      text-align: left;
      padding: 0.875rem 0;
      border-bottom: solid 1px #f1f1f1;

      .input {
        margin-top: 1.125rem;

        input {
          outline: none;
          border: none;
          width: 100%;
          font-size: 12px;
        }
      }
    }

    .item-category {
      text-align: left;
      padding: 0.875rem 0;
      border-bottom: solid 1px #f1f1f1;

      .category-spe {
        margin-top: 0.75rem;

        .category-btn {
          width: 7.1875rem;
          height: 1.875rem;
          background-image:
            linear-gradient(
              #ff2c29,
              #ff2c29
            ),
            linear-gradient(
              #ff1f1c,
              #ff1f1c
            );
          background-blend-mode:
            normal,
            normal;
          border-radius: 0.9375rem;
          color: #fff;
          display: flex;
          align-items: center;
          font-size: 16px;
          justify-content: center;
        }
      }
    }

    .item-upload {
      text-align: left;
      padding-top: 0.875rem;

      .upload {
        margin-top: 1rem;
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
          background: #f2f2f2;
          margin-left: 0.2rem;
          margin-right: 0.875rem;
          margin-bottom: 0.9375rem;
          display: flex;
          align-items: center;
          justify-content: center;

          .van-icon {
            font-size: 24px;
            line-height: 4.5rem;
            color: #666;
          }
        }
      }
    }

    .item-add {
      text-align: left;
      padding-top: 0.875rem;
      padding-bottom: 0.375rem;
      border-bottom: solid 1px #f1f1f1;

      .add-spe {
        margin-top: 0.75rem;
        display: flex;

        .add-btn {
          padding: 0 0.5rem;
          height: 1.875rem;
          border-radius: 0.9375rem;
          border: solid 0.0625rem #ff1f1c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff1f1c;

          .icon {
            margin-right: 0.25rem;
            font-size: 18px;
          }
        }
      }
    }

    .item-textarea {
      text-align: left;
      padding-top: 0.875rem;

      .txt {
        margin-top: 1rem;
        margin-left: 0.25rem;
        border: none;
        outline: none;
        background-color: #fafafa;
        padding-top: 0.75rem;
        padding-left: 0.75rem;
        height: 8.5rem;
        width: 100%;
        border-radius: 0.3125rem;
      }
    }
  }

  .wrap {
    padding: 0.5rem 1rem;
    width: 100%;
    height: 3.0625rem;
    background-color: #fff;
    box-shadow:
      0 0 0.5rem 0
      rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      color: #f00;
      display: flex;
      align-items: center;
    }

    .right-btn {
      width: 5.8125rem;
      height: 1.875rem;
      background-color: #f00;
      border-radius: 0.9375rem;
      box-sizing: border-box;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .agreement-pop {
    .tit {
      width: 100%;
      position: relative;
      height: 2.8125rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: solid 1px #ccc;
      font-size: 18px;

      i {
        position: absolute;
        right: 2rem;
      }
    }

    .pop-content {
      padding: 0 0.875rem;
      padding-top: 0.75rem;
      text-align: left;
    }
  }

  .pop {
    border-radius: 1rem;
    background-color: #fff;

    .top {
      padding: 1rem;
      border-bottom: solid 1px #e2e2e2;

      .input {
        display: flex;
        color: #666;
        align-items: center;
        outline: none;
        border: none;
        border-bottom: solid 1px #e2e2e2;
        margin-bottom: 1rem;
        width: 100%;
        padding-bottom: 0.5rem;
      }

      .input:last-child {
        margin-bottom: 0;
      }
    }

    .bottom {
      display: flex;
      height: 3rem;
      align-items: center;

      div {
        width: 50%;
      }
    }
  }
}
</style>
