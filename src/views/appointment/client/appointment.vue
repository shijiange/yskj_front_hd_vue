<template>
  <div id="client-appointment">
    <c-title :hide="false" :text="'我的预约'" :url="'AppointmentMine'">
    </c-title>
    <van-tabs v-model="num" title-active-color="#f49f19" @click="selectTab" color="#f49f19">
      <van-tab title="进行中" name="0">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="project_box" v-for="item in  projectList" :key="item.id">
          <div class="project_list">
            <div class="list_left">
              <div style="width: 5rem; height: 5rem; flex: 0 0 5rem;">
                <img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="list_title">
                <p>{{item.has_one_order_project.project_title}}</p>
                <div style="display: flex;">
                  <div class="list_trtitle">
                    <div style="color: #f49f19;"><i style="font-size: 14px;" class="iconfont icon-dengdaichuli"></i><span>{{item.begin_time}}</span>
                    </div>
                    <div><i style="color: #f49f19;" class="iconfont icon-stores_staff"></i><span class="store_name">{{item.has_one_worker.name}}</span><span
                      class="list_address text_border" style="width: 7.5rem;">{{item.has_one_store.store_name}}</span></div>
                  </div>
                  <!--<div class="list_right">-->
                    <!--<span class="state" @click="createQrc(item)">核销</span>-->
                  <!--</div>-->
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <p class="bottom-address" @click="goToAdress(item.has_one_store.longitude,item.has_one_store.latitude,item.has_one_store.store_name)"><i style="color: #f49f19;" class="iconfont icon-order_locate"></i><span class="list_address">{{item.has_one_store.address}}</span></p>
            <p class="distance">{{item.has_one_store.distance}}{{item.has_one_store.unit}}</p>
          </div>
          <div style="text-align: left; margin: 0.5rem;" v-if="item.remark">
            备注：{{item.remark}}
          </div>
          <div class="bottom-box">
            <div class="cancel-box" @click="cancelIt(item)" v-if="item.show_cancel == 1">取消预约</div>
            <div class="sure-box" @click="createQrc(item)">核销</div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已完成" name="1">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="project_box" v-for="item in  projectList" :key="item.id">
          <div class="project_list">
            <div class="list_left">
              <div style="width: 5rem; height: 5rem; flex: 0 0 5rem;">
                <img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="list_title">
                <p>{{item.has_one_order_project.project_title}}</p>
                <div style="display: flex;">
                  <div class="list_trtitle">
                    <div style="color: #f49f19;"><i style="font-size: 14px;" class="iconfont icon-dengdaichuli"></i><span>{{item.begin_time}}</span>
                    </div>
                    <div><i style="color: #f49f19;" class="iconfont icon-stores_staff"></i><span class="store_name">{{item.has_one_worker.name}}</span><span
                      class="list_address text_border" style="width: 7.5rem;">{{item.has_one_store.store_name}}</span></div>
                  </div>
                  <div class="list_right">
                    <span class="state1" v-if="item.has_many_comment_count <= 0" @click="gotoEvaluate(item)">评价</span>
                    <span class="state1" v-else @click="gotoEvaluate(item)">评价详情</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <p class="bottom-address"><i style="color: #f49f19;" class="iconfont icon-order_locate"></i><span class="list_address">{{item.has_one_store.address}}</span></p>
            <p class="distance">{{item.has_one_store.distance}}{{item.has_one_store.unit}}</p>
          </div>
          <div style="text-align: left; margin: 0.5rem;" v-if="item.remark">
            备注：{{item.remark}}
          </div>
        </div>
      </van-tab>
      <van-tab title="已取消" name="9">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="project_box" v-for="item in  projectList" :key="item.id">
          <div class="project_list">
            <div class="list_left">
              <div style="width: 5rem; height: 5rem; flex: 0 0 5rem;">
                <img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="list_title">
                <p>{{item.has_one_order_project.project_title}}</p>
                <div style="display: flex;">
                  <div class="list_trtitle">
                    <div style="color: #f49f19;"><i style="font-size: 14px;" class="iconfont icon-dengdaichuli"></i><span>{{item.begin_time}}</span>
                    </div>
                    <div><i style="color: #f49f19;" class="iconfont icon-stores_staff"></i><span class="store_name">{{item.has_one_worker.name}}</span><span
                      class="list_address text_border" style="width: 7.5rem;">{{item.has_one_store.store_name}}</span></div>
                  </div>
                  <!--<div class="list_right">-->
                    <!--<span class="state1" v-if="item.has_many_comment_count <= 0" @click="gotoEvaluate(item)">评价</span>-->
                    <!--<span class="state1" v-else @click="gotoEvaluate(item)">评价详情</span>-->
                  <!--</div>-->
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <p class="bottom-address"><i style="color: #f49f19;" class="iconfont icon-order_locate"></i><span class="list_address">{{item.has_one_store.address}}</span></p>
            <p class="distance">{{item.has_one_store.distance}}{{item.has_one_store.unit}}</p>
          </div>
          <div style="text-align: left; margin: 0.5rem;" v-if="item.remark">
            备注：{{item.remark}}
          </div>
        </div>
      </van-tab>
    </van-tabs>


    <!--<van-popup v-model="show" round closeable close-icon="close">-->
    <!--<div class="pop-img">-->
    <!--<p>核销码</p>-->
    <!--<div class="code">-->
    <!--<canvas id="qrccode-canvas"></canvas>-->
    <!--</div>-->
    <!--</div>-->
    <!--</van-popup>-->

    <div class="qrcode" v-show="show">
      <i class="close" @click="show=false"></i>
      <canvas id="qrccode-canvas"></canvas>
      <div style="height: 1.875rem;">请核销员扫码</div>
    </div>
  </div>
</template>

<script>
import appointment_controller from "./appointment_controller";

export default appointment_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #qrccode-canvas {
    width: 9.875rem !important;
    height: 9.875rem !important;
  }

  .pop-img {
    width: 14rem;
    height: 14rem;
    background-color: #fff;
    border-radius: 1.219rem;

    p {
      font-weight: bold;
      font-size: 1rem;
      margin: 1rem 0;
    }

    .code {
      width: 9.875rem;
      height: 9.875rem;
      margin: 1rem auto;

      img {
        width: 9.313rem;
        height: 9.219rem;
      }
    }
  }

  .project_box {
    background: #fff;
    display: flex;
    padding: 1rem 0.5rem;
    flex-direction: column;
    border-bottom: 1px solid #eeeeee;

    .bottom {
      text-align: left;
      display: flex;
      color: #ccc;
      margin-top: 0.5rem;
    }

    .bottom-address {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .bottom-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .cancel-box, .sure-box {
      width: 70px;
      border: 1px solid #333333;
      border-radius: 15px;
      padding: 2px 5px;
    }
    .sure-box{
      margin-left: 20px;
      color: #ffffff;
      background-color: #8c96f8;
      border: 1px solid #8c96f8;
    }
  }

  .project_list {
    display: flex;
    display: -webkit-flex;
    background: #fff;
    justify-content: space-between;
  }

  .project_list .list_left {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
  }

  .project_list .list_right {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 0 0 5rem;
    text-align: center;

    span {
      padding: 0.1rem 0.3rem;
    }
  }

  .distance {
    flex: 0 0 4rem;
    text-align: right;
  }

  .state {
    line-height: 1.5;
    color: #fff;
    background: #8c96f8;
    border-radius: 1rem 0 0 1rem;
  }

  .state1 {
    color: #fff;
    background: #f49f19;
    border-radius: 1rem 0 0 1rem;
  }

  .list_left img {
    width: 5rem;
    height: 5rem;
    border-radius: 5px;
  }

  .list_left .list_title {
    flex: 1;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    padding: 0 0 0 0.5rem;
    justify-content: space-between;
    text-align: left;
    line-height: 1.2rem;
  }

  .list_title p {
    font-size: 1rem;
    height: 2.5rem;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .list_trtitle {
    flex: 1;
  }

  .list_trtitle div {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
  }

  .store_name {
    color: #666;
    width: 2.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text_border {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 1px #f2f2f7 solid;
  }

  .list_title .list_address {
    color: #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .list_button span {
    color: #fff;
    padding: 0 0.5rem;
    font-size: 1rem;
    border-radius: 1rem;
  }

  .list_pre {
    background: #f49f19;
    margin-right: 1rem;
  }

  .list_cancle {
    background: #8c96f8;
  }

  .show {
    display: block;
  }

  .hidden {
    display: none;
  }

  .qrcode {
    margin: 0 auto;
    position: fixed;
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 200px;
    padding-top: 0.5rem;
    border-radius: 20px;

    .close {
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      top: -0.2rem;
      right: -0.2rem;
      background: url("../../../assets/images/close_iocn.png");
      background-size: 100%;
    }
  }

</style>
