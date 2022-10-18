<template>
  <div id="verification_record">
    <c-title text='核销记录'></c-title>
    <div class="top_line">
      <div class="num_row">
        <div class="all_num">
          <div class="today">
            <div class="today_num">
              <span class="line_num">{{ today_count || 0 }}</span
              ><span class="line">今日核销次数</span>
            </div>
            <div class="today_income">
              <span class="line_num">{{ total_count || 0 }}</span
              ><span class="line">核销总次数</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail_val">
        <span class="record_detail">记录明细</span>
        <van-cell-group>
          <van-field v-model="project_name" :placeholder=" projectName + '名称'" />
          <div class="search"><span class="name" @click="btnSearch">搜索</span></div>
        </van-cell-group>
      </div>

      <div class="date">
        <div class="date_detail" @click="showPopup">
          <van-cell title="选择日期区间" :value="date"></van-cell><span style="width: 100%;">{{ start_date_show || '起始时间'}} - {{ end_date_show || '终止时间'}}</span
          >
          <van-icon name="arrow" v-if="!start_date_show || !end_date_show"/>
          <van-icon name="cross" v-if="start_date_show || end_date_show" @click="btnDelTime"/>
        </div>
        <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }" :close-on-click-overlay="false">
          <van-datetime-picker v-model="currentDate" type="date" title="选择年月" :formatter="formatter" @cancel="btnCancel" @confirm="btnFinished" />
        </van-popup>
      </div>
    </div>
    <d-list :loading="upgradeCodeLoading" :finished="upgradeCodeFinished" @load="getWriteOff()" v-if="!show">
      <div class="bottom_line" v-for="item in verRecordedData" style="background: #fff;" :key="item.id">
        <div class="top">
          <span class="date">{{ item.created_at }}</span>
          <span class="name">{{ item.store_name }}</span>
        </div>
        <div class="bottom">
          <div class="img_row"><img :src="item.project_thumb" alt=""/></div>
          <div class="middle">
            <span class="project_name">{{ item.project_title }}</span>
            <div class="num">
              <span>总次数：{{ item.total_count }}</span>
              <span>未使用次数：{{ item.total_rest_count }}</span>
            </div>
            <span class="verification_name">核销员：{{ item.worker_nickname }}</span>
          </div>
          <div class="rigth">
            <span class="num">-{{ item.used_count }}</span>
            <span class="verification_num">核销使用</span>
          </div>
        </div>
      </div>
    </d-list>
    <serviceCard></serviceCard>
  </div>
</template>

<script>
import verification_record_controller from "./verification_record_controller";

export default verification_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#verification_record {
  // .goBack {
  //   background: #fff;
  //   display: flex;
  //   align-items: center;
  //   padding: 0.5rem 0 0.5rem 1rem;
  //   font-size: 16px;
  //   border: solid 0.03rem #ececec;
  //   .top_title {
  //     width: 100%;
  //     align-items: center;
  //   }
  // }
  .top_line {
    .num_row {
      background: #fff;
      margin-bottom: 0.8rem;
      padding: 1.36rem 1.79rem;

      .all_num {
        .line {
          color: #ce811d;
          border-radius: 0.36rem;
        }

        .line_num {
          color: #472612;
          font-size: 20px;
        }

        border-radius: 0.36rem;
        background-image: linear-gradient(0deg, #e1be7e 0%, #efd8a6 100%);
        padding: 1.39rem 0;
        display: flex;
        flex-direction: column;

        .today {
          display: flex;
          justify-content: space-around;

          .today_num {
            display: flex;
            flex-direction: column;
          }

          .today_income {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }

    .record_detail {
      display: flex;
      background: #fff;
      color: #333;
      font-weight: bold;
      padding: 0.71rem 0 0 1.07rem;
    }

    .van-cell-group {
      display: flex;
      align-items: center;
      padding: 0 1.07rem;

      .van-cell {
        border: solid 0.04rem #d5d5d5;
        border-radius: 0.14rem;
        margin: 0.61rem 1rem 0.61rem 0;
        padding: 1rem;
        flex: 4;
        height: 2.14rem;
        display: flex;
        align-items: center;
      }

      .search {
        flex: 1;

        .name {
          background-color: #ce811d;
          color: #fff;
          padding: 0.4rem 0.75rem;
          border-radius: 0.14rem;
        }
      }
    }

    .date {
      .date_detail {
        display: flex;
        align-items: center;
        background: #fff;

        .van-cell {
          font-size: 20px;
          width: 70%;
        }
      }

      .van-cell__title {
        font-size: 14px;
        display: flex;
      }

      .van-cell__value {
        font-size: 14px;
        display: contents;
      }

      .van-icon {
        margin-right: 1.07rem;
      }
    }
  }

  .bottom_line {
    background: #fff;
    margin: 1rem 0;

    .top {
      display: flex;
      justify-content: space-between;
      padding: 1.11rem 1.11rem 0 1.11rem;

      .date {
        font-size: 14px;
        color: #737373;
      }

      .name {
        font-size: 15;
        color: #333;
      }
    }

    .bottom {
      padding: 1.07rem 1.11rem;
      display: flex;

      img {
        width: 4.71rem;
        height: 4.71rem;
        border-radius: 0.36rem;
        margin: 0;
      }

      .middle {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;

        .project_name {
          color: #333;
          font-size: 14px;
          margin: 0 0 0 0.61rem;
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
          margin: 0 0 0 0.61rem;
          color: #ce811d;
          justify-content: space-between;
          font-size: 12px;
        }

        .verification_name {
          display: flex;
          font-size: 12px;
          color: #333;
          margin: 0 0 0 0.61rem;
        }
      }

      .rigth {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        text-align: right;
        justify-content: flex-start;
        align-items: center;

        .num {
          color: #ce811d;
          font-size: 26px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .verification_num {
          width: 4.43rem;
        }
      }
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
</style>
