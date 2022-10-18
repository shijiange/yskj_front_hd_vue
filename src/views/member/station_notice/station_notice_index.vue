<template>
  <div class="page">
    <c-title text="消息通知" v-if="!fun.isCPS()"></c-title>

    <div class="tool" v-if="messageType.length != 0 || weekMessage.length != 0">
      <span>{{ unreadCount }}条未读消息</span>
      <i style="margin-left: 0.813rem;" class="iconfont icon-massage_clean"></i>
      <span style="margin-left: 0.313rem; flex: 1;" @click="setMessageRead">全部已读</span>
      <i style="color: #666;" @click="gotoSetting" class="iconfont icon-massage_set"></i>
    </div>
    <div class="tool emptyTool" v-else>
      <i style="color: #666;" @click="gotoSetting" class="iconfont icon-massage_set"></i>
    </div>

    <div class="items" v-if="messageType.length != 0">
      <div class="item" v-for="item in messageType" :key="item.id" @click="gotoMessagePage(item)">
        <div class="face">
          <div class="img" :class="item.class_name">
            <i class="iconfont" :class="item.icon"></i>
          </div>
        </div>
        <div class="content">
          <div class="c1">
            <div class="name">{{ item.name }}</div>
            <div class="time">{{ item.last_time }}</div>
          </div>
          <div class="c2">
            <div class="desc">{{ item.desc }}</div>
            <div class="count" v-if="item.no_read > 0">{{ item.no_read }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="weekList" v-if="weekMessage.length != 0">
      <p class="week">最近一周消息</p>
      <div class="weekItem" v-for="(item, key) in weekMessage" :key="item._key" @click="goPages(item, key)">
        <div class="wrapper">
          <div class="face">
            <div class="img" :class="item.class_name">
              <i class="unread" v-if="item.is_read == 1"></i>
              <i class="iconfont" :class="item.icon"></i>
            </div>
          </div>
          <div class="content">
            <div class="head">
              <div class="name">{{ item.title }}</div>
              <div class="time">{{ item.created_at }}</div>
            </div>
            <p class="c1 ca">{{ item.desc }}</p>
            <div class="text" v-if="item.type_id != 1 && item.type_id != 3 && item.type_id != 6">
              <!-- <p class="c2 ca" v-for="(item2,key2) in item.msg_body" :key="key2">{{item.type_id}}{{key2}}{{item2}}</p> -->
              <p class="c2 ca" v-for="(item2, key2) in item.msg_body" :key="key2">{{ msg_body_types[item.type_id] ? msg_body_types[item.type_id][key2] : "未知属性:" }}{{ item2 }}</p>
            </div>

            <div class="anchor" v-else-if="item.msg_body != null && Object.keys(item.msg_body).length != 0">
              <div class="face">
                <img :src="item.msg_body.img" alt="" />
              </div>
              <div class="desc">
                <p class="name">{{ item.msg_body.title }}</p>
                <p v-if="item.type_id == 1 && item.msg_body.desc">{{ item.msg_body.desc }}</p>
                <p class="tips" v-else-if="item.type_id == 3">{{ item.msg_body.desc }}</p>
                <p class="tips" v-else-if="item.type_id == 6 || item.type_id == 1">点击查看</p>
              </div>
            </div>
          </div>
        </div>
        <div class="botm" v-if="item.url != ''">
          <span>查看详情</span>
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
    </div>

    <div class="empty" v-if="messageType.length == 0 && weekMessage.length == 0">
      <div class="img">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/massage_blankpage@3x.png" alt="" />
      </div>
      <p class="text">还没有消息哟</p>
    </div>
  </div>
</template>

<script>
import stationNoticeIndexController from "./station_notice_index_controller.js";

export default stationNoticeIndexController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(250, 250, 250);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
  text-align: left;
}

.tool {
  height: 2.814rem;
  display: flex;
  align-items: center;
  background: #fff;
  color: #999;
  padding-left: 0.969rem;
  padding-right: 1.063rem;
  filter: drop-shadow(0 1px 10px #969696);

  &.emptyTool {
    background: rgb(250, 250, 250);
    justify-content: flex-end;
  }
}

.items {
  padding-left: 0.781rem;
  background: #fff;

  .item {
    width: 100%;
    display: flex;
    border-bottom: 0.031rem solid #f4f4f4;
    transition: 0.5s;

    &:hover {
      background: #eee;
    }

    .face {
      padding: 0.344rem 0.688rem 0.938rem 0.688rem;

      .img {
        width: 2.875rem;
        height: 2.875rem;
        background-image: linear-gradient(-43deg, #2dadff 0%, #aadaff 100%), linear-gradient(#dfdfdf, #dfdfdf);
        background-blend-mode: normal, normal;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        .iconfont {
          font-size: 1.5rem;
          color: #fff;
        }
      }
    }

    .content {
      flex: 1;
      width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding-right: 1.188rem;

      .c1 {
        display: flex;

        .name {
          flex: 1;
          letter-spacing: 0.075rem;
          color: #333;
          font-size: 1rem;
        }

        .time {
          letter-spacing: 0.056rem;
          color: #999;
          font-size: 0.75rem;
        }
      }

      .c2 {
        display: flex;

        .desc {
          flex: 1;
          padding-right: 0.25rem;
          font-size: 0.875rem;
          letter-spacing: 0.066rem;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .count {
          background-color: #f42a2a;
          border-radius: 0.5rem;
          padding: 0 0.219rem;
          height: 1rem;
          line-height: 1rem;
          color: #fff;
          font-size: 0.75rem;
        }
      }
    }
  }
}

.weekList {
  .week {
    height: 2.781rem;
    letter-spacing: 0.025rem;
    color: #000;
    font-size: 1rem;
    padding-left: 0.188rem;
    padding-top: 0.93rem;
  }

  padding: 0 0.781rem;

  .weekItem {
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding-left: 0.594rem;
    padding-top: 0.719rem;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
    transition: 0.5s;

    &:hover {
      background: #eee;
    }

    .wrapper {
      display: flex;
      padding-bottom: 0.813rem;

      .face {
        width: 2rem;

        .img {
          width: 1.125rem;
          height: 1.125rem;
          background-blend-mode: normal, normal;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          position: relative;

          .iconfont {
            font-size: 0.5rem;
            color: #fff;
          }

          .unread {
            width: 0.313rem;
            height: 0.313rem;
            background-color: #f42a2a;
            border-radius: 50%;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }

      .content {
        padding-right: 0.563rem;
        flex: 1;

        .head {
          display: flex;
          align-items: flex-end;

          .name {
            flex: 1;
            color: #000;
            font-size: 1rem;
          }

          .time {
            font-size: 0.75rem;
            letter-spacing: 0.019rem;
            color: #666;
          }
        }

        .c1 {
          margin-top: 0.719rem;
        }

        .ca {
          font-size: 0.75rem;
          line-height: 1.25rem;
          letter-spacing: 0.019rem;
          color: #666;
        }

        .anchor {
          display: flex;
          padding: 1rem 0 0.531rem 0;

          .face {
            width: 4rem;

            img {
              width: 4rem;
              height: 4rem;
              background-color: #999;
            }
          }

          .desc {
            height: 4rem;
            padding-left: 0.531rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
              letter-spacing: 0.019rem;
              color: #000;
              font-size: 0.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .tips {
              letter-spacing: 0.019rem;
              font-size: 0.75rem;
              color: #f42a2a;
            }
          }
        }
      }
    }

    .botm {
      border-top: 0.031rem solid #f4f4f4;
      height: 1.938rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 0.022rem;
      color: #666;
      font-size: 0.875rem;
    }
  }
}

.empty {
  height: calc(100vh - 12rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  .img {
    text-align: center;
    height: 11.688rem;

    img {
      width: 15.344rem;
      height: 11.688rem;
    }
  }

  .text {
    text-align: center;
    margin-top: 1.125rem;
    font-size: 1rem;
    letter-spacing: 0.075rem;
    color: #c8c8c8;
  }
}

.items .item .face .img1,
.weekList .img1 {
  background-image: linear-gradient(-43deg, #2dadff 0%, #aadaff 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img2,
.weekList .img2 {
  background-image: linear-gradient(-43deg, #ffb228 0%, #ffdd89 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img3,
.weekList .img3 {
  background-image: linear-gradient(-43deg, #36d6a6 0%, #7ce5de 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img4,
.weekList .img4 {
  background-image: linear-gradient(-43deg, #418dfe 0%, #53a3fd 50%, #65b8fb 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img5,
.weekList .img5 {
  background-image: linear-gradient(-43deg, #ff250f 0%, #ff7d7f 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img6,
.weekList .img6 {
  background-image: linear-gradient(-43deg, #2983f8 0%, #2498f2 50%, #1eadeb 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img7,
.weekList .img7 {
  background-image: linear-gradient(-43deg, #7667fe 0%, #8376fe 50%, #9084fd 100%), linear-gradient(#dfdfdf, #dfdfdf);
}

.items .item .face .img8,
.weekList .img8 {
  background-image: linear-gradient(-43deg, #fd5355 0%, #ff96a2 100%), linear-gradient(#dfdfdf, #dfdfdf);
}
</style>
