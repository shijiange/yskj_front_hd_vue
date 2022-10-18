<!-- 门店拼团 拼团活动列表 -->
<template>
  <div id="o2oGroup_activitylist">
    <c-title :hide="false" text="门店拼团"></c-title>
    <div style="background-color: #fff;">
      <div class="search-box">
        <form @submit.prevent action="#">
          <input
            type="search"
            ref="search_input"
            placeholder="搜索活动标题"
            @keyup.enter="enterSearch"
            v-model="keywords"
          />
        </form>
        <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="enterSearch"></i>
      </div>
    </div>
    <van-tabs v-model="activeName" sticky swipeable @change="handleClick">
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="!fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index">
            <div class="list">
              <div class="top-box">
                <div
                  class="avtive-name"
                  :style="{ backgroundColor: item.status == 1 ? '#ff9454' : item.status == 0 ? '#1bc187' : '#949494' }"
                >
                  {{ item.status == 0 ? '未开始' : item.status == 1 ? '活动中' : '已结束' }}
                </div>
                <div class="Numbering">编号：{{ item.id }}</div>
                <div class="edit-btn" v-if="item.status != 2" @click.stop="editActivity(item.id)"><i class="iconfont icon-appointment_edite"></i> 编辑</div>
              </div>
              <div class="activity">
                <div class="activity-title">{{ item.title }}</div>
                <div class="activity-box">
                  <div class="activity-time">开始时间：{{ fun.timestampToTime(item.start_time) }}</div>
                  <div class="activity-end-btn" v-if="item.status != 2" @click.stop="endGrouplist(item, index)">
                    手动结束
                  </div>
                </div>
              </div>
              <div class="goods-box">
                <img :src="item.has_one_goods.thumb" alt="" />
                <div class="good-title">{{ item.has_one_goods.title }}</div>
              </div>
              <div class="operate-box">
                <div class="operate-child" @click.stop="showShareM(item.id)" v-if="item.status != 2">
                  <i class="iconfont icon-share"></i>
                  活动推广
                </div>
                <div class="operate-child line" @click.stop="gotoUrl('groupDataStatistics', { id: item.id })">
                  <i class="iconfont icon-fontclass-shujutongji"></i>
                  数据统计
                </div>
                <div
                  class="operate-child"
                  @click.stop="gotoUrl('openGroupList', { id: item.id, store_id: $route.params.store_id })"
                >
                  <i class="iconfont icon-fontclass-shangpindingdan"></i>
                  开团列表
                </div>
              </div>
            </div>
          </li>
        </ul>
        <img
          v-if="fun.isTextEmpty(dataList[ind].list)"
          src="../../../assets/images/blank.png"
          alt=""
          style="width: 5rem; margin: 2rem auto;"
        />
      </van-tab>
    </van-tabs>

    <van-popup v-model="showEndP" round class="showEndP-style">
      <div class="EndP-box">
        <div class="EndP-box-title" style="font-size: 14px;">
          <div class="EndP-box-title-child">拼团层级</div>
          <div class="EndP-box-title-child">成员时间</div>
          <div class="EndP-box-title-child">状态</div>
          <div class="EndP-box-title-child">操作</div>
        </div>
        <div class="EndP-box-main">
          <div class="EndP-box-title" v-for="(item, i) in has_many_level" :key="i">
            <div class="EndP-box-title-child">{{ item.member_num }}人团</div>
            <div class="EndP-box-title-child">{{ item.expire_in }}小时</div>
            <div class="EndP-box-title-child">
              {{ item.status == 0 ? '未开始' : item.status == 1 ? '活动中' : '已结束' }}
            </div>
            <div
              class="EndP-box-title-child end-btn"
              v-if="item.status != 2"
              @click.stop="closelevel(item.member_num, item.id, i)"
            >
              手动结束
            </div>
            <div class="EndP-box-title-child end-btn" style="background-color: #949494;" v-if="item.status == 2">
              已结束
            </div>
          </div>
        </div>
      </div>
      <div class="close-btn" @click.stop="showEndP = false">
        <i class="iconfont icon-adsystem_icon_cancle"></i>
      </div>
    </van-popup>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <!-- 海报弹窗 -->
    <van-popup v-model="showposter" position="center" style="background-color: transparent;">
      <img :src="poster_url" alt="" style="width: 16rem;" />
    </van-popup>

    <div class="fixed-btn" @click="createActivity">
      <i class="iconfont icon-life-game-plus"></i>
      <div class="">
        创建
      </div>
    </div>
  </div>
</template>

<script>
import o2oGroup_activitylist_controller from './o2oGroup_activitylist_controller';
export default o2oGroup_activitylist_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#o2oGroup_activitylist {
  padding-bottom: 60px;

  .search-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding: 0 0.625rem;
    background-color: #f2f2f2;
    height: 30px;
    line-height: 30px;
    border-radius: 0.875rem;

    form {
      flex: 1;
      text-align: left;
    }

    input {
      width: 85%;
      line-height: 28px;
      border: none;
      color: #333;
    }

    i {
      position: absolute;
      right: 1rem;
      flex: 0 0 1.5rem;
    }
  }

  .content {
    background: #f5f5f5;

    li {
      padding: 0 0.938rem;
      margin-bottom: 0.625rem;
      background: #fff;
      text-align: left;

      .top-box {
        height: 2.625rem;
        line-height: 2.625rem;
        display: flex;
        align-items: center;

        .avtive-name {
          padding: 0 0.625rem;
          height: 1.25rem;
          line-height: 1.25rem;
          background-color: #949494;
          border-radius: 0.125rem;
          overflow: hidden;
          font-size: 0.75rem;
          color: #fff;
        }

        .Numbering {
          flex: 1;
          text-align: left;
          margin: 0 0.625rem;
        }

        .edit-btn {
          color: #f14e4e;
        }
      }

      .goods-box {
        display: flex;
        padding: 0.625rem 0;
        border-top: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;

        img {
          width: 3.125rem;
          height: 3.125rem;
          margin-right: 0.625rem;
        }

        .good-title {
          line-height: 1.25rem;
          height: 2.5rem;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }

      .activity {
        .activity-title {
          height: 2.5rem;
          line-height: 1.25rem;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .activity-box {
          display: flex;
          margin: 0.625rem 0;

          .activity-time {
            flex: 1;
            color: #666;
            font-size: 0.75rem;
          }

          .activity-end-btn {
            padding: 0 0.625rem;
            height: 1.25rem;
            line-height: 1.25rem;
            background-color: #f14e4e;
            border-radius: 0.125rem;
            color: #fff;
            font-size: 0.75rem;
          }
        }
      }

      .operate-box {
        display: flex;
        align-items: center;
        padding: 0.625rem 0;

        .operate-child {
          flex: 1;
          text-align: center;
          color: #888;

          i {
            font-size: 0.875rem;
          }
        }

        .line {
          border-right: 1px solid #c8c8c8;
          border-left: 1px solid #c8c8c8;
        }
      }
    }
  }

  .showEndP-style {
    background-color: transparent;
    padding-bottom: 3.5rem;
  }

  .EndP-box {
    width: 18rem;
    font-size: 0.75rem;
    max-height: 20rem;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #fff;
    border-radius: 1rem;

    .EndP-box-title {
      height: 3rem;
      line-height: 3rem;
      display: flex;
      align-items: center;

      .EndP-box-title-child {
        width: 25%;
      }

      .end-btn {
        width: 3.438rem;
        height: 1.25rem;
        line-height: 1.25rem;
        background-color: #f14e4e;
        border-radius: 0.125rem;
        color: #fff;
      }
    }

    .EndP-box-main {
      flex: 1;
      overflow-y: scroll;
    }
  }

  .close-btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -1rem;

    i {
      width: 2rem;
      height: 2rem;
      font-size: 2.5rem;
      color: #fff;
    }
  }

  .fixed-btn {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    background-color: #f14e4e;
    position: fixed;
    bottom: 7rem;
    left: 50%;
    transform: translateX(7rem);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0.125rem 0.75rem 0.0125rem
      rgba(154, 154, 154, 0.95);
  }
}
</style>
