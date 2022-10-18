<template>
  <div id="card_collect">
    <c-title :hide="false" :text="'名片收藏'"></c-title>
    <div class="collect">
      <div class="title">
        <div class="block"></div>
        <span>我收藏的名片：{{ collectNum }}个</span>
      </div>
      <div class="other_list">
        <div class="header_box" v-for="(item,i) in collectList" :key='i' @click.stop="toCard(item)">
          <div class="header">
            <img :src="item.card.card_avatar" />
          </div>
          <ul class="text">
            <li class="name">
              <span>{{ item.card.card_name }}</span>
              <i
                v-if="item.is_child"
                class="iconfont icon-card_relation"
                style="color: #f66747;"
              ></i>
              <i
                v-if="item.is_new"
                class="iconfont icon-card_new"
                style="color: #f6c347;"
              ></i>
              <button v-if="item.mutual_save" type="button">互存名片</button>
            </li>
            <li v-if="item.card.member.yz_member && item.card.member.yz_member.level" class="grade">
              {{ item.card.member.yz_member.level.level_name }}
            </li>
          </ul>
          <div
            class="icon_right"
            v-if="item.card.card_mobile || item.card.card_wechat"
          >
            <i @click="showMore(item.id)" class="iconfont icon-more"></i>
          </div>
          <div class="more_box" v-show="item.id === showID">
            <ul class="list">
              <li
                @click="showWeChat(item, '微信')"
                v-if="item.card.card_wechat"
              >
                <i class="iconfont icon-card_weixin1"></i>
                <span>微信</span>
              </li>
              <li
                @click="showWeChat(item, '电话')"
                v-if="item.card.card_mobile"
              >
                <i class="iconfont icon-card_phone"></i>
                <span>电话</span>
              </li>
            </ul>
            <i @click="showMore(item.id)" class="iconfont icon-up"></i>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" style="width: 80%; height: 5rem;">
      <div class="popup">
        <i v-show="showTitle === '微信'" class="iconfont icon-card_weixin1"></i>
        <i v-show="showTitle === '电话'" class="iconfont icon-card_phone"></i>
        {{ showTitle }}：{{ showContent }}
      </div>
    </van-popup>
  </div>
</template>

<script>
import card_collect_controller from "./card_collect_controller";

export default card_collect_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_collect {
  .popup {
    line-height: 4.9rem;
    text-align: center;
    border-radius: 10px;
    font-size: 18px;

    .iconfont {
      font-size: 30px;
      vertical-align: middle;
    }
  }

  .collect {
    background: #fff;
    padding: 0.625rem 0.875rem;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .other_list {
      .header_box {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: solid 0.0625rem #ebebeb;
        position: relative;

        .header {
          width: 3rem;
          height: 3rem;
          border-radius: 3rem;
          background: #f2f2f2;
          overflow: hidden;
          margin-right: 0.625rem;

          img {
            width: 100%;
          }
        }

        .text {
          text-align: left;

          .name {
            display: flex;
            align-items: center;
            line-height: 1.5rem;

            span {
              font-size: 15px;
              margin-right: 0.25rem;
              max-width: 6.25rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .iconfont {
              font-size: 1.5rem;
              margin-right: 0.25rem;
            }

            button {
              border: solid 0.0625rem #50a6f9;
              font-size: 12px;
              color: #50a6f9;
              border-radius: 0.1875rem;
              padding: 0.0625rem 0.375rem;
            }
          }

          .grade {
            line-height: 1.5rem;
            color: #8c8c8c;
            font-size: 13px;
          }
        }

        .icon_right {
          position: absolute;
          right: 0;

          .iconfont {
            display: block;
            width: 2.5rem;
            height: 2.5rem;
            line-height: 2.5rem;
            font-size: 18px;
            color: #999;
          }
        }

        .more_box {
          position: absolute;
          right: 0;
          top: 3.125rem;
          background: rgba(51, 51, 51, 0.8);
          border-radius: 0.25rem;
          z-index: 10;

          .list {
            display: flex;

            li {
              padding: 0.125rem 0.625rem;

              span {
                display: block;
                font-size: 12px;
                color: #fff;
              }

              .iconfont {
                font-size: 1.25rem;
                color: #fff;
              }
            }
          }

          .icon-up {
            color: rgba(51, 51, 51, 0.8);
            font-size: 1.25rem;
            position: absolute;
            top: -0.875rem;
            right: 0.625rem;
          }
        }
      }
    }
  }
}
</style>
