<template>
  <div id="subject-detail-mobile">
    <headTemplate text="热门专题"></headTemplate>

    <div class="banner" v-if="datas.special_banner_src">
      <img :src="datas.special_banner_src" alt="" />
    </div>
    <div class="content">
      <div class="title">
        {{datas.special_name}}
      </div>
      <div class="con">
        <div class="time">{{datas.created_at}}</div>
        <div class="look">
          <i class="iconfont icon-ht_operation_perview"></i>
          {{datas.read_num}}
        </div>
      </div>
      <div class="detail">
        <div class="btitle">简介</div>
        <div class="details" v-html="datas.desc">
          
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <caseTemplate :datas="case_data"></caseTemplate>
    <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;">
      {{ $i18n.t('没有更多了') }}~
    </div>
    <serviceTemplate></serviceTemplate>
    <shareTemplate :title="datas.special_name" :desc="datas.desc" :img="datas.special_banner_src" :id="datas.id" type='subject'></shareTemplate>
    
  </div>
</template>

<script>
import subject_detail_mobile_controller from './subject_detail_mobile_controller';

export default subject_detail_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$text-color: #202020;

#subject-detail-mobile {
  background: #fff;

  .banner {
    width: 100%;
    height: 11.25rem;
    padding: 0.9375rem;
    border-radius: 0.625rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.625rem;
    }
  }

  .content {
    padding: 0 0.9375rem;
    text-align: left;
    margin-bottom: 0.5rem;

    .title {
      font-size: 0.875rem;
      color: #333;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .con {
      display: flex;
      line-height: 2rem;

      .time {
        font-size: 0.75rem;
        color: #999;
        flex: 1;
      }

      .look {
        font-size: 0.75rem;
        color: #626262;
        text-align: right;
      }
    }

    .detail {
      padding-top: 0.75rem;

      .btitle {
        font-size: 1rem;
        color: $text-color;
        font-weight: 700;
        border-left: 2px solid $orange;
        padding-left: 0.5rem;
        line-height: 1rem;
      }

      .details {
        padding: 0.5rem 0;
        text-align: left;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .hr {
    width: 100%;
    height: 0.625rem;
    background: #f6f6f6;
  }

  .share {
    position: fixed;
    right: 1.05rem;
    bottom: 8.75rem;
    width: 2.1875rem;
    height: 2.1875rem;
    line-height: 2.1875rem;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    background: #f15353;
  }

  .pop-con {
    color: #333;

    .title {
      color: $text-color;
      font-size: 1rem;
      padding: 1.125rem 0;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      padding: 0 2.5rem 1rem 2.5rem;

      .button {
        width: 3.75rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        .img {
          width: 2.75rem;
          height: 2.75rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          font-size: 0.875rem;
        }
      }
    }

    .cancel {
      line-height: 3rem;
      color: #333;
      text-align: center;
      font-size: 1rem;
      border-top: 1px solid #ebebeb;
    }
  }
}
</style>
