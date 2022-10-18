<template>
  <div class="page">
    <c-title text="拼单池"></c-title>
    <!--
        <div class="team">
          <van-tabs v-model="vanTagIndex" @change="changeVanTabIndex">
            <van-tab title="项目拼单池">

            </van-tab>
            <van-tab title="订单拼单池">

            </van-tab>
          </van-tabs>
        </div> -->

    <div class="sortContainer">
      <van-row id="sort">
        <!--<el-row id='sort'>-->
        <!--<el-col :span="show?6:8">-->
        <van-col span="8">
          <!--<el-col :span="show?6:8">-->
          <div
            class="grid-content"
            :class="{ active: sort.tab == 1, up: sort.up == 1, down: sort.down == 1 }"
            @click="toggle($event, 1)"
          >
            时间
          </div>
          <!--</el-col>-->
        </van-col>
        <van-col span="8">
          <!--<el-col :span="show?6:8">-->
          <div
            class="grid-content"
            :class="{ active: sort.tab == 2, up: sort.up == 2, down: sort.down == 2 }"
            @click="toggle($event, 2)"
          >
            价格
          </div>
          <!--</el-col>-->
        </van-col>
        <van-col span="8" @click="screenShow=true">
          <!--<el-col :span="show?6:8">-->

          筛选

        </van-col>
      </van-row>
    </div>

    <div class="listItems">
      <template v-for="item in listData">
        <singlepool-item1 v-if="item.project_shell_type==1" :power="power" :item="item" :key="item.id"
                          @addCollage="addCollage"></singlepool-item1>
        <singlepool-item2 v-if="item.project_shell_type==2" :power="power" :item="item" :key="item.id"
                          @addCollage="addCollage"></singlepool-item2>
        <singlepool-item3 v-if="item.project_shell_type==3" :power="power" :item="item" :key="item.id"
                          @addCollage="addCollage"></singlepool-item3>
      </template>
      <!-- <collage-item2></collage-item2> -->
    </div>


    <van-popup v-model="screenShow" position="right" :style="{ width: '60%' }">
      <div class="srceenContainer">
        <div class="screenTitle">项目金额区间(元)</div>
        <div class="section">
          <input v-model="screenObj.minPrice" type="number" placeholder="最低价">
          <div class="line"></div>
          <input v-model="screenObj.maxPrice" type="number" placeholder="最高价">
        </div>
        <div class="screenTitle">拼单状态</div>
        <div class="status">
          <div class="btn" @click="setScreenStatus(0)" :class="[screenObj.status==0 ? 'active' : '']">全部</div>
          <div class="btn" @click="setScreenStatus(1)" :class="[screenObj.status==1 ? 'active' : '']">未释放</div>
          <div class="btn" @click="setScreenStatus(2)" :class="[screenObj.status==2 ? 'active' : '']">已释放</div>
        </div>
        <div class="botBtns">
          <div class="btn reset" @click="screenOnReset">重置</div>
          <div class="btn confirm" @click="screenOnConfirm">确定</div>
        </div>
      </div>
    </van-popup>


  </div>

</template>


<script>

import founderSinglepoolController from "./founder_singlepool_controller";

export default founderSinglepoolController;

</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background: rgb(246, 248, 252);
    min-height: 100vh;
  }

  .sortContainer {
    position: sticky;
    top: 2.938rem;
  }

  #sort {
    background: #fff;
    line-height: 2.25rem;
    border-bottom: solid 0.0625rem #f9f9f9;
    font-size: 12px;
    color: #333;

    .grid-content.up::after {
      background-position: -10.625rem -0.9375rem;
    }

    .grid-content.down::after {
      background-position: -10.625rem 0;
    }

    .grid-content.up,
    .grid-content.down {
      color: #f15353;
    }

    .grid-content::after {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.625rem;
      background: url(../../../../assets/images/jd-sprites.png) no-repeat;
      background-size: 12.5rem 12.5rem;
      background-position: -10.625rem -1.875rem;
      margin-left: 0.25rem;
    }

    i {
      color: #555;
    }
  }

  .listItems {
    background: #fff;
    padding: 0 0.75rem 0.875rem;
  }

  .srceenContainer {
    height: 100vh;
    padding-left: 0.656rem;
    text-align: left;
    position: relative;

    .screenTitle {
      padding-top: 0.938rem;
      font-size: 0.75rem;
      color: #333;
      letter-spacing: 0.038rem;
    }

    .section {
      margin-top: 1.031rem;
      display: flex;
      align-items: center;

      input {
        width: 5.344rem;
        height: 2rem;
        background-color: #f5f7fb;
        border-radius: 1rem;
        border: none;
        color: #6e6f6f;
        font-size: 0.75rem;
        text-align: center;
      }

      .line {
        margin: 0 0.406rem;
        width: 0.781rem;
        height: 0.063rem;
        background-color: #78797a;
      }
    }

    .status {
      margin-top: 1.063rem;
      padding-right: 0.75rem;
      display: flex;
      justify-content: space-between;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.875rem;
        height: 1.75rem;
        background-color: #f5f7fb;
        border-radius: 0.875rem;
        color: #6e6f6f;
        font-size: 0.75rem;
      }

      .active {
        background-color: #fee;
        color: #ff2c29;
      }
    }

    .botBtns {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.906rem 1.225rem;
      display: flex;
      justify-content: space-between;

      .btn {
        width: 5.344rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 1rem;
        font-size: 0.875rem;

        &.reset {
          background-color: #efefef;
          color: #6e6f6f;
        }

        &.confirm {
          color: #fff;
          background-color: #fe5c5a;
        }
      }
    }
  }

</style>