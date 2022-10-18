<template>
  <section id="goods-release">
    <c-title :hide="false"
             :text="`商品${titleTest}`"></c-title>
    <!-- <div class="releaemain"> -->
    <van-tabs class="navClass"
            v-model="active"
            id="navId"
            v-if="this.$route.params.store == 'store'">
      <van-tab title="基本信息"
                    class="navContet"
      >
        <BasicInformation v-on:CoverLayer="isCoverLayer"
                          v-on:getChildoneData="getChildoneData"
                          :DataInfo="DataInfo"
                          ref="mychild"
                          v-if="isQuesetOk" />
      </van-tab>
      <van-tab title="权限"
                    class="navContet"
                    v-if="isShowprivilege">
        <Permissions v-on:CoverLayer="isCoverLayer"
                     :DataInfo="DataInfo"
                     :GoodSetData="GoodSetData"
                     v-on:getChildtwoData="getChildoneData"
                     ref="mychildTwo"
                     v-if="isQuesetOk" />
        <h2 v-if="!isShowprivilege">暂无权限</h2>
      </van-tab>
      <van-tab title="折扣"
                    class="navContet"
                    v-if="isShowdiscount">
        <Discounts v-on:getChildthreeData="getChildoneData"
                   :DataInfo="DataInfo"
                   :GoodSetData="GoodSetData"
                   v-on:getSignthree="getSignthree"
                   ref="mychildThree"
                   v-if="isQuesetOk" />
        <h2 v-if="!isShowdiscount">暂无权限</h2>
      </van-tab>
    </van-tabs>

    <div v-if="this.$route.params.store == 'supplier'"
         class="supplierContent">
      <BasicInformation v-on:CoverLayer="isCoverLayer"
                        v-on:getChildoneData="getChildoneData"
                        :DataInfo="DataInfo"
                        ref="mychild"
                        v-if="isQuesetOk" />
    </div>

    <section id="btn"
             :class="{upzIndex:showCoverLayer, supplierBtn:this.$route.params.store == 'supplier',andriodClass:this.fun.getPhoneEnv()!='1'}"
             v-if="!showCoverLayer"
             :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <button type="button"
              @click="publishEvent()">确认{{titleTest}}</button>
    </section>
    <!-- </div> -->

    <div class="cover-layer"
         v-if="showCoverLayer"
         :class="{supplierCoverL:this.$route.params.store == 'supplier'}"></div>
  </section>
</template>

<script>
import publish from "./release_controller.js";

export default publish;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// 选择分类
.avatar {
  width: 100%;
  height: 100%;
}

.el-cascader {
  width: 15.625rem;
}

#goods-release {
  text-align: left;
  //padding-bottom: 3.875rem;
  // .releaemain{
  //   height: 100%;
  //   width: 100%;
  //   position: absolute;
  //   bottom: 0;
  //   padding-top: 40px;
  .navClass {
    overflow: hidden;

    .van-tab {
      z-index: 999;

      .navContet {
        // position: fixed;
        // width: 100%;
        // //height: auto;
        // top: 82px;
        // left:0;
        // bottom: 0;
        //overflow: scroll;
        z-index: 999;
        background-color: rgb(245, 245, 245);
        width: 100%;
        height: 100%;
      }
    }
  }

  .supplierContent {
    position: relative;
  }
  // }
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

  #btn {
    background-color: #fff;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 999;
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

  .supplierBtn {
    z-index: 99 !important;
  }

  .upzIndex {
    visibility: hidden;
  }

  .andriodClass {
    position: fixed !important;
  }

  //遮盖层
  .cover-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 99;
  }

  .supplierCoverL {
    height: 40px;
    background-color: rgba(0, 0, 0, 0);
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

  .select_box {
    background: #fff;
    width: 100%;
    padding-top: 50px;
    padding-bottom: 60px;

    .title {
      position: fixed;
      top: 0;
      left: 0;
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
}
</style>
