<template>
    <div id="voice_list">
        <c-title :hide="false" :text="'音频列表'"></c-title>
        <div id="content">
            <ul class="order">
                <li>共{{total}}章节</li>
                <li @click="changeAsc">{{isAsc?'顺序':'倒序'}}<i class="iconfont icon-order_lower"></i></li>
            </ul>
            <div class="chapter_box">
                <div class="box" v-for="(item,i) in voiceList" :key='i'  @click="toVoice(item)">
                    <ul class="left">
                        <li class="name"><span class="pay-money" v-if="item.has_one_article_pay">付费</span>{{item.title}}</li>
                        <li class="time" v-if="item.belongs_to_category">{{item.virtual_at}}&nbsp;&nbsp;&nbsp;{{item.belongs_to_category.name}}</li>
                    </ul>
                    <div class="right">
                        <i class="iconfont icon-yduibofang"></i>
                        <span>播放</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import voice_list_controller from "./voice_list_controller";

export default voice_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#voice_list {
  padding-top: 42px;
  background: #fff;

  #content {
    .order {
      background: #fff;
      position: fixed;
      top: 2.5rem;
      width: 23.4375rem;
      height: 2.625rem;
      line-height: 2.625rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.625rem;
      border-bottom: solid 0.0625rem #ebebeb;
      font-size: 16px;
      font-weight: bold;

      li:last-child {
        display: flex;
        color: #999;
        font-size: 16px;
        font-weight: normal;

        i {
          font-size: 1.5rem;
          color: #999;
          margin-left: 0.375rem;
        }
      }
    }

    .chapter_box {
      padding-left: 0.875rem;
      padding-bottom: 1.25rem;

      .box {
        padding: 0.625rem 0.625rem 0.625rem 0;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 0.0625rem #ebebeb;

        .left {
          width: 16.25rem;
          text-align: left;

          .name {
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.875rem;

            .pay-money {
              width: 2.125rem;
              height: 1.125rem;
              border-radius: 0.3125rem;
              border: solid 0.0625rem #ff2c29;
              display: inline-block;
              text-align: center;
              line-height: 1.125rem;
              vertical-align: text-top;
              font-size: 12px;
              color: #ff2c29;
              margin-right: 0.2rem;
            }
          }

          .time {
            color: #8c8c8c;
            line-height: 1.875rem;
            font-size: 14px;
          }
        }

        .right {
          display: flex;
          align-items: center;

          i {
            font-size: 1.5rem;
            color: #666;
            margin-right: 0.375rem;
          }

          span {
            font-size: 16px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>