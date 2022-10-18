<template>
  <div id="store_verification">
    <c-title text="多商户核销"></c-title>
    <van-tabs v-model="active" title-active-color="#ce811d" color="#ce811d" @click="btnSelect">
      <van-tab :title="titled">
        <div class="location" @click.stop="tolocation" v-if="tabsShow">
          <i class="iconfont icon-fontclass-dizhi"></i>
          <span class="address_name">{{ address || "全国" }}</span>
          <van-icon name="arrow-down" />
        </div>
        <div class="order_by">
          <span v-for="(item,index) in orderbyList" :key="index" class="order_by_item">
            <span :class="item.state == 'rise' || item.state == 'drop' ? 'order_by_active' : '' ">{{item.name}}</span>
            <div class="order_by_icon">
              <i class="el-icon-caret-top" @click="orderBy(item.name,'rise')" :class="item.state == 'rise' ? 'order_by_active' : '' "></i>
              <i class="el-icon-caret-bottom" @click="orderBy(item.name,'drop')" :class="item.state == 'drop' ? 'order_by_active' : '' "></i>
            </div>
          </span>
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getIncomplete">
          <van-cell v-for="(item, key) in incompleteList" :key="key" style="margin: 1rem 0;">
            <div class="project_detail" style="background: #fff;">
              <div class="bottom">
                <img :src="item.project_thumb" alt="" />
                <div class="middle">
                  <span class="project_name">{{ item.project_title }}</span>
                  <div class="num">
                    <span>总次数：{{ item.total_count }}</span>
                    <span>已使用：{{ item.used_count }}</span>
                  </div>
                  <span class="verification_name" :style="{ color: item.near_ending === 1 ? '#f14e4e' : '#3486d3' }">到期使用时间：{{ item.end_time }}</span>
                </div>
                <div class="rigth">
                  <div>
                    <span class="num">{{ item.rest_count }}</span
                    >次
                  </div>
                  <span class="verification_num">未使用</span>
                </div>
              </div>
              <div class="write_off">
                <span class="write_off_record" @click="btnVerUser(item.project_title)">使用记录</span>
                <span class="write_off_user" @click="btnUsere(item)">核销使用</span>
                <span class="give" @click="tapBtnGive(item)">转赠</span>
              </div>
              <div class="write_off_store">
                <span class="line"></span>
                <span class="service_store">该{{ projectName }}附近可核销商户</span>
              </div>
              <div class="store">
                <img :src="item.store_thumb" alt="" />
                <div class="store_detail">
                  <span class="store_name">{{ item.store_name }}</span>
                  <span class="date">营业时间:{{ item.store_business_hours_start }}-{{ item.store_business_hours_end }}</span>
                  <div class="location_detail">
                    <div class="store_location">
                      <i class="iconfont icon-order_locate"></i>
                      <span class="address_name">{{ item.store_full_address }}</span>
                    </div>
                    <span>{{ item.store_distance }}{{ item.store_distance_unit }}</span>
                  </div>
                </div>
              </div>
              <div class="more"><span class="see_more" @click="seeMore(item)">查看更多商户</span><van-icon name="arrow" /></div>
            </div>
          </van-cell>
        </van-list>
        <serviceCard></serviceCard>
      </van-tab>
      <van-tab :title="titleIng">
        <van-list v-model="loading_completed" :finished="finished_completed" finished-text="没有更多了" @load="getCompleted" :immediate-check="false" v-if="!tabsShow">
          <van-cell v-for="(item, key) in completed" :key="key">
            <div class="complete">
              <div class="bottom">
                <img :src="item.project_thumb" alt="" />
                <div class="middle">
                  <span class="project_name">{{ item.project_title }}</span>
                  <div class="num">
                    <span>总次数：{{ item.total_count }}</span>
                    <span>已使用：{{ item.used_count }}</span>
                  </div>
                  <span class="fished_time">已完成时间：{{ item.finish_time }}</span>
                </div>
              </div>
              <div class="write_off">
                <span class="write_off_record">已完成</span>
                <span class="write_off_user" @click="btnVerUser(item.project_title)">使用记录</span>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>



    <van-popup v-model="showGivePop" style="width: 70%;" round  class="give-pop" :close-on-click-overlay="false">
      <div class="frame-box">
         <div class="give-title">{{projectName}}转赠</div>
         <div class="user-input">
            <van-field  @keyup="throttleFn" v-model="giveUserId" label="用户id" placeholder="请输入赠送的用户id" required  style="display: block;"/>
            <div :class="['other', {'error': nickname === '查无此用户'}]" v-show="nickname && giveUserId">
                <template v-if="nickname != '查无此用户'">昵称：</template>
                {{ nickname }}
            </div>
         </div>
         <div class="give-num-input">
            <van-field @input="changeNumInput" v-model="giveNum" label="转赠次数" placeholder="请输入转赠次数" required  style="display: block;"/>
            <div :class="['other', {'error': giveNum}]" v-show="giveNum">
                <span>{{ errorNum }}</span>
            </div>
         </div>



         <div class="line"></div>
         <div class="bottom-btns">
           <div class="btn cancel" @click="closeGivePop">取消</div>
           <div class="btn comfirm" @click="giveProject">确定</div>
         </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import my_project_controller from "./my_project_controller";

export default my_project_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#store_verification {
  .location {
    display: flex;
    background: #fff;
    padding: 0.5rem 1rem;
    align-items: center;

    .iconfont {
      color: #f14e4e;
    }

    .address_name {
      margin: 0 0.46rem 0 0.46rem;
      color: #f14e4e;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .van-icon {
      color: #f14e4e;
    }
  }

  .location_detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: #ce811d;

    .store_location {
      display: flex;
      background: #fff;
      align-items: center;
      width: 10.71rem;

      .address_name {
        margin: 0 0.46rem 0 0.46rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
  }

  .project_detail {
    background: #fff;

    .write_off {
      display: flex;
      justify-content: space-between;
      padding: 1.07rem 0;

      .write_off_record {
        border-radius: 0.1rem;
        border: 0.1rem solid #ce811d;
        color: #ce811d;
        padding: 0.2rem 1.5rem;
      }

      .write_off_user {
        background-color: #ce811d;
        border: 0.1rem solid #ce811d;
        border-radius: 0.1rem;
        color: #fff;
        padding: 0.2rem 1.5rem;
      }

      .give {
        background-color: #f14e4e;
        border-radius: 0.1rem;
        color: #fff;
        padding: 0.2rem 2.5rem;
      }
    }

    .write_off_store {
      margin-bottom: 1.18rem;
      display: flex;
      align-items: center;

      .line {
        width: 0.2rem;
        height: 1.07rem;
        display: block;
        background-color: #ce811d;
        border-radius: 0.07rem;
        margin-right: 0.5rem;
      }

      .service_store {
        color: #202020;
        font-size: 18px;
      }
    }

    .store {
      display: flex;
      padding-bottom: 1.07rem;

      img {
        width: 5rem;
        height: 5rem;
        border-radius: 0.36rem;
        margin: 0;
      }

      .store_detail {
        display: flex;
        flex-direction: column;
        text-align: left;
        justify-content: space-between;
        margin-left: 1rem;

        .store_name {
          font-size: 14px;
          color: #202020;
        }

        .date {
          color: #666;
        }
      }
    }

    .more {
      display: flex;
      align-items: center;
      justify-content: center;

      .see_more {
        margin-right: 1rem;
      }
    }
  }

  .complete {
    background: #fff;
  }

  .bottom {
    display: flex;
    text-align: left;
    align-items: center;

    img {
      width: 4.71rem;
      height: 4.71rem;
      border-radius: 0.36rem;
      margin: 0;
      margin-right: 0.61rem;
    }

    .middle {
      width: 100%;

      .project_name {
        color: #333;
        font-size: 14px;
        text-align: left;
        font-weight: bold;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .num {
        display: flex;
        margin: 0.3rem 0 0.3rem 0;
        color: #ce811d;
        justify-content: space-between;
        font-size: 12px;
      }

      .verification_name {
        display: flex;
        color: #f14e4e;
        font-size: 12px;
        text-align: left;
      }

      .fished_time {
        display: flex;
        font-size: 12px;
        text-align: left;
        color: #666;
      }
    }

    .rigth {
      display: flex;
      flex-direction: column;
      margin-left: 0.5rem;
      text-align: right;
      justify-content: center;
      align-items: center;

      .num {
        color: #ce811d;
        font-size: 26px;
      }

      .verification_num {
        color: #ce811d;
        width: 3.43rem;
      }
    }
  }

  .write_off {
    display: flex;
    justify-content: space-between;
    padding: 1.07rem 1.11rem;

    .write_off_record {
      border-radius: 0.1rem;
      color: #ce811d;
      padding: 0.2rem 2.5rem;
    }

    .write_off_user {
      background-color: #ce811d;
      border-radius: 0.1rem;
      color: #fff;
      padding: 0.2rem 2.5rem;
    }
  }

  .suspension {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 10%;
    transform: translateX(10rem);
    right: 50%;

    img {
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 1.21rem;
    }
  }
}

.give-pop {
  padding: 1rem 1rem 0 1rem;

  .give-title {
    font-size: 1.06rem;
    color: #2c2c2c;
  }

  .other {
    width: 90%;
    margin: 0 auto 0.875rem;
    text-align: left;
    color: #ce811d;
    font-size: 12px;
  }

  .error {
    color: #f14e4e;
  }

  .give-num-input {
    margin: 0.5rem 0 2rem 0;
  }

  .line {
    height: 1px;
    background-color: #d9dbdd;
    transform: scaleY(0.5);
  }

  .bottom-btns {
    display: flex;
    align-items: center;
    height: 2.5rem;

    .btn {
      flex: 1;
      height: 100%;
      line-height: 2.5rem;
    }

    /* .cancel {} */

    .comfirm {
      color: #f14e4e;
    }
  }
}

.order_by_active {
  color: #ce8222;
}

.order_by {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;

  .order_by_item {
    display: flex;

    .order_by_icon {
      display: flex;
      flex-direction: column;
      justify-content: center;

      i {
        line-height: 8px;
      }
    }
  }
}
</style>
