<template>
  <div id="case-subject-detail-pc">
    <navigation></navigation>
    <div class="all">
      <div class="nav">
        <span class="home" @click="gotoHome">首页</span> >
        <span class="case">{{datas.special_name}}</span>
      </div>
      <div class="survey">
        <div class="img">
          <img :src="datas.special_banner_src || emptyImage" alt="" />
        </div>
        <div class="right">
          <div>
            <div class="title">{{datas.special_name}}</div>
            <div class="replenish">
              <span class="time">{{datas.created_at}}</span>
              <span>
                <i class="iconfont icon-card_eye"></i>
                {{datas.read_num}}
              </span>
            </div>
            <div class="describe" v-html="datas.desc">
              <!-- {{datas.desc}} -->
            </div>
            <div class="button">
              <span class="button1">案例总数{{case_data.length}}</span>
              <span class="button2" @click="creatPoster">
                <i class="iconfont icon-bc_eweima"></i>
                生成海报
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <caseTemplate :datas="case_data"></caseTemplate>
      </div>
      
    </div>
    <bottomAdv></bottomAdv>

    <div class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </div>
    <secrvicePc></secrvicePc>
    <van-popup
      v-model="posterShow"
      closeOnClickModal="true"
      style="width: 21.375rem; height: 41.4rem; padding: 0; background: none;"
    >
      <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
        <img v-if="img_url" :src="img_url || emptyImage" style="width: 98%; border-radius: 0.375rem;" />
        <!-- 关闭图标 -->
        <div class="icon_close" @click="posterShow = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import subject_detail_pc_controller from './subject_detail_pc_controller';

export default subject_detail_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-subject-detail-pc {
  background: #fff;
  min-height: 100vh;

  .all {
    width: 1200px;
    margin: 0 auto;
    text-align: left;

    .nav {
      margin: 30px 0;

      .home {
        font-size: 14px;
        color: #333;
      }

      .home:hover {
        color: $orange;
        cursor: pointer;
      }

      .case {
        color: $orange;
      }
    }

    .survey {
      height: 200px;
      display: flex;

      .img {
        height: 100%;
        width: 399px;
        min-width: 399px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        display: flex;
        margin: 0 30px;
        padding: 8px 0;

        .title {
          color: #202020;
          font-size: 22px;
          line-height: 36px;
        }

        .replenish {
          color: #828282;
          font-size: 12px;
          line-height: 24px;

          .time {
            margin-right: 30px;
          }
        }

        .describe {
          color: #666;
          font-size: 16px;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 15px 0;
        }

        .button {
          font-size: 16px;

          span {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
          }

          .button1 {
            background: $orange;
            color: #fff;
          }

          .button2 {
            color: #333;
            cursor: pointer;
          }
        }
      }
    }
  }

  .code_box {
    position: relative;
    display: flex;

    .icon_close {
      position: absolute;
      bottom: 0;
      right: 50%;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: -1.25rem;
      border: 1px solid #fff;
      border-radius: 100%;
      text-align: center;

      i {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #fff;
      }
    }
  }

  .color {
    color: $orange;
  }
}
</style>
