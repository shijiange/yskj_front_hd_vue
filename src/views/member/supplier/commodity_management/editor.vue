<template>
  <section id="goods-edit">
    <c-title :hide="false" text="商品编辑"></c-title>
    <van-tabs>
        <van-tab title="基本信息">
         <section id="edit-a">
            <van-field label="商品名称:" placeholder="请输入商品名称"  v-model="cargon_data.title" center clearable/>
             <van-field  label="商品单位:"
              placeholder="请输入商品单位"
              v-model="cargon_data.sku" center clearable/>
          </section>
          <section
            class="goods_class"
            ref="classify"
          >
            <span
              style="float: left; font-size: 16px; padding-left: 0.625rem; box-sizing: border-box;"
              >商品分类：</span
            >
            <span class="block">
              <van-button
                plain
                type="primary"
                @click="seleRegional"
                style="max-width: 15rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-width: 5rem;"
                >{{ regional }}</van-button
              >
            </span>
            <i class="fa fa-angle-right"></i>
          </section>
          <section id="edit-b">
            <div class="top">
              <div
                style="height: 3.125rem; font-size: 16px; text-align: left; line-height: 3.125rem; padding-left: 10px; box-sizing: border-box;"
              >商品图片：
              </div>
              <div
                style="padding: 0 0.9375rem 0.9375rem 0.9375rem; box-sizing: border-box;"
              >
                <div class="display:flex;">
                  <van-uploader :after-read="onRead">
                    <div
                      style="  width: 6rem; height: 6rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
                    >
                      <img
                        :src="
                          imageUrl
                            ? imageUrl
                            : require('../../../../assets/images/up_icon.png')
                        "
                        style="width: 32%; height: 32%; opacity: 0.6;"
                        class="avatar"
                      />
                    </div>
                  </van-uploader>
                </div>
              </div>
            </div>
          </section>
          <section
              id="otherphoto"
              style="background: white; margin-top: 0.625rem; padding-bottom: 10px; box-sizing: border-box;"
            >
              <div
                style="height: 50px; text-align: left; padding-left: 13px; line-height: 50px;"
              >
                <span style="font-size: 16px;">其他图片：</span>
              </div>
              <div style="text-align: center;" class="clearfloat imgflex">
                <template v-for="(val, index) in fileList2">
                  <div class="photobox" :key="index">
                    <img :src="val.url" style="width: 100%;" />
                    <i @click="removeImg(index)"></i>
                  </div>
                </template>
                <van-uploader :after-read="onRead_1">
                  <div
                    style="  width: 6rem; height: 6rem; border: 1px dashed #c0ccda; display: flex;"
                  >
                    <img
                      :src="require('../../../../assets/images/up_icon.png')"
                      style="width: 32%; height: 32%; opacity: 0.6;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </section>
            <section id="edit-c">
            <van-field  label="商品现价:"
                placeholder="请输入商品现价"
                type="number"
                v-model="cargon_data.price" center clearable/>
               <van-field    label="商品原价:"
                placeholder="请输入商品原价"
                type="number"
                v-model="cargon_data.market_price" center clearable/>
                <van-field    label="商品成本:"
                placeholder="请输入商品成本"
                type="number"
                v-model="cargon_data.cost_price" center clearable/>
            </section>
            <section id="edit-d">
                <van-field      label="商品库存:"
                placeholder="请输入商品库存"
                type="number"
                v-model="cargon_data.stock" center clearable/>
            </section>

        </van-tab>
        <van-tab title="权限">
            <div class="power_box">
                <ul class="member_power">
                    <li>
                        <span>会员等级浏览权限：</span>
                        <input type="text" @click="show1 = true" readonly placeholder="请选择">
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li>
                        <span>会员等级购买权限：</span>
                        <input type="text" @click="show1 = true" readonly placeholder="普通等级；会员等级；">
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li>
                        <span>会员组浏览权限：</span>
                        <input type="text" @click="show2 = true" readonly placeholder="请选择">
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li>
                        <span>会员组购买权限：</span>
                        <input type="text" @click="show2 = true" readonly placeholder="全部会员组">
                        <i class="fa fa-angle-right"></i>
                    </li>
                </ul>
                <ul class="number_power">
                    <li>
                        <span>每次限购数量：</span>
                        <input type="text" placeholder="请输入每次下单限购数量">
                    </li>
                    <li>
                        <span>会员限购总数：</span>
                        <input type="text" placeholder="请输入会员限购的总数">
                    </li>
                    <li>
                        <span>会员每天限购总数：</span>
                        <input type="text" placeholder="请输入会员每天限购数量">
                    </li>
                    <li>
                        <span>会员每周期限购数量：</span>
                        <input type="text" placeholder="请输入会员每周期限购数量">
                    </li>
                    <li>
                        <span>会员每月限购数量：</span>
                        <input type="text" placeholder="请输入会员每月限购数量">
                    </li>
                </ul>
            </div>
        </van-tab>
        <van-tab title="折扣">
            <div class="rebate_box">
                <ul class="type">
                    <li>
                        <span>折扣类型：</span>
                        <van-radio name="1">会员等级</van-radio>
                    </li>
                    <li>
                        <span>折扣方式：</span>
                        <van-radio-group v-model="radio">
                          <van-radio name="1">折扣</van-radio>
                          <van-radio name="2">固定金额</van-radio>
                        </van-radio-group>
                    </li>
                </ul>
                <ul class="member_number">
                    <li>
                        <span>普通会员：</span>
                        <input type="text" placeholder="请输入等级折扣">
                    </li>
                    <li>
                        <span>会员等级1：</span>
                        <input type="text" placeholder="请输入等级折扣">
                    </li>
                    <li>
                        <span>会员等级2：</span>
                        <input type="text" placeholder="请输入等级折扣">
                    </li>
                    <li>
                        <span>会员等级3：</span>
                        <input type="text" placeholder="请输入等级折扣">
                    </li>
                    <li>
                        <span>会员等级4：</span>
                        <input type="text" placeholder="请输入等级折扣">
                    </li>
                </ul>
            </div>
        </van-tab>
    </van-tabs>
    <!-- 弹窗 -->
    <van-popup v-model="show1" position="bottom"  :style="{height:'80%',width:'100%'}">
        <div class="select_box">
            <div class="title">
                <h2>会员等级浏览权限</h2>
                <i class="iconfont icon-guanbi" @click="show1=false"></i>
            </div>
            <div class="list">
                <van-checkbox-group v-model="result">
                  <van-checkbox
                    v-for="(item, index) in list"
                    :key="index"
                    :name="item"
                  >
                    会员等级 {{ item }}
                  </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="select_btn">
                <button type="button">完成</button>
            </div>
        </div>
    </van-popup>
    <van-popup v-model="show2" position="bottom" :style="{height:'80%',width:'100%'}">
        <div class="select_box">
            <div class="title">
                <h2>会员组浏览权限</h2>
                <i class="iconfont icon-guanbi" @click="show2=false"></i>
            </div>
            <div class="list">
                <van-checkbox-group v-model="result">
                  <van-checkbox
                    v-for="(item, index) in list"
                    :key="index"
                    :name="item"
                  >
                    会员组{{ item }}
                  </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="select_btn">
                <button type="button">完成</button>
            </div>
        </div>
    </van-popup>

    <section id="btn">
      <button type="button" @click="confirmationEditor">确认编辑</button>
    </section>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-picker
        :columns="columns"
        @change="onChange"
        @cancel="onCancelbtn"
        @confirm="onConfirmbtn"
        show-toolbar
      />
    </van-popup>
  </section>
</template>

<script>
import editor from "./editor_controller.js";

export default editor;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// setting sun
.avatar {
  width: 100%;
  height: 100%;
}

.el-cascader {
  width: 15.625rem;
}

#goods-edit,
#goods-release {
  text-align: left;
  padding-bottom: 3.875rem;

  .classify {
    animation: myfirst 3s;
  }

  @keyframes myfirst {
    from {
      background: #f15353;
    }

    to {
      background: #fff;
    }
  }

  .goods_class {
    height: 3rem;
    background: white;
    margin-top: 0.625rem;
    line-height: 3rem;

    .fa {
      position: absolute;
      right: 0.875rem;
      font-size: 1.125rem;
      color: #c9c9c9;
      line-height: 3rem;
    }
  }

  #edit-b {
    background-color: #fff;
    margin-top: 0.625rem;

    .top,
    .bottom {
      padding: 0 0.875rem;
      font-size: 14px;

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

    .top {
      .goods-header {
        display: flex;
        justify-content: space-between;
        height: 3.75rem;
        line-height: 3.75rem;

        .fa {
          font-size: 1.5rem;
          color: #c9c9c9;
          position: absolute;
          right: 0.875rem;
          line-height: 3.75rem;
        }
      }
    }
  }

  #otherphoto {
    .photobox {
      position: relative;
      width: 6rem;
      height: 6rem;
      border: 0.0625rem dashed #c0ccda;
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
        background: url("../../../../assets/images/close_iocn.png");
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

  .select_box {
    background: #fff;
    width: 100%;
    // padding-top: 50px;
    padding-bottom: 60px;

    .title {
      // position: fixed;
      // top: 0;
      // left:0;
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: center;
      font-size: 16px;
      display: flex;
      justify-content: center;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        position: absolute;
        right: 0.625rem;
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    .list {
      padding: 0.625rem 0 0.625rem 0.875rem;

      .van-checkbox {
        line-height: 2.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 15px;
      }
    }

    .select_btn {
      position: fixed;
      width: 100%;
      padding: 0.375rem 0.875rem;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;

      button {
        margin: 0 auto;
        width: 100%;
        height: 2.5rem;
        background: #f15353;
        border-radius: 0.1875rem;
        color: #fff;
        border: none;
        font-size: 16px;
      }
    }
  }

  #btn {
    background-color: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
    border-top: solid 0.0625rem #ebebeb;
    padding: 0 0.875rem;
    margin-top: 1.25rem;

    button {
      height: 2.5rem;
      line-height: 2.5rem;
      border-radius: 0.1875rem;
      margin: 0.375rem 0;
      width: 100%;
      color: #fff;
      font-size: 16px;
      border: none;
      background-color: #f15353;
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

  .imgflex {
    padding: 0 0.9375rem 0.9375rem 0.9375rem;
    display: flex;
    flex-wrap: wrap;
  }

  .power_box {
    .member_power,
    .number_power {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.625rem 0.875rem;

      li {
        display: flex;
        align-items: center;
        height: 2.5rem;
        position: relative;
        font-size: 15px;

        span {
          width: 9.75rem;
        }

        input {
          border: none;
          width: 11.25rem;
        }

        .fa {
          position: absolute;
          right: 0;
          font-size: 1.125rem;
          color: #c9c9c9;
        }
      }

      .list_box {
        padding: 0.625rem 0.875rem;
      }
    }
  }

  .rebate_box {
    .type,
    .member_number {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.625rem 0.875rem;

      li {
        display: flex;
        align-items: center;
        height: 2.5rem;
        position: relative;
        font-size: 15px;

        span {
          width: 6.875rem;
        }

        input {
          border: none;
          width: 11.25rem;
        }

        .fa {
          position: absolute;
          right: 0;
          font-size: 1.125rem;
          color: #c9c9c9;
        }
      }

      .list_box {
        padding: 0.625rem 0.875rem;
      }
    }
  }
}

.van-cell {
  padding: 10px;
  font-size: 16px;
  color: #333;

  /deep/.van-field__label {
    white-space: nowrap;
    color: #333;
  }

  /deep/input::placeholder {
    color: #555;
  }
}
</style>
