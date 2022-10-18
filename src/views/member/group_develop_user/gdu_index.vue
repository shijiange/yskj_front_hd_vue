<template>
  <div class="page">
    <c-title text="群拓客"></c-title>

    <div class="header">
      <van-sticky :offset-top="40" z-index="1">
        <div class="tabs">
          <div class="tab" :class="{ active: tabIndex == 0 }" @click="setTabIndex(0)">企业员工</div>
          <div class="tab" :class="{ active: tabIndex == 1 }" style="margin-left: 2.469rem;" @click="setTabIndex(1)">会员</div>
        </div>
      </van-sticky>
      <div class="userInfo">
        <div class="face" v-if="employee && employee.member">
          <img :src="employee.member.avatar_image" alt="" />
        </div>
        <div class="nickname" v-if="employee && employee.member">{{ employee.member.nickname }}</div>
      </div>
      <div class="infoList" v-if="tabIndex == 0 && employee != null">
        <div class="infoItem">
          <div class="num">{{ employee.total_chats_count }}</div>
          <div class="desc">我创建群数</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ employee.total_user_count }}</div>
          <div class="desc">群客户总数</div>
          <div class="otherInfo">(未去重)</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ employee.total_distinct_user_count }}</div>
          <div class="desc">群客户总数</div>
          <div class="otherInfo">(去重)</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ employee.total_ingroup_user_count }}</div>
          <div class="desc">在群总人数</div>
          <div class="otherInfo">(未去重)</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ employee.total_distinct_ingroup_user_count }}</div>
          <div class="desc">在群总人数</div>
          <div class="otherInfo">(去重)</div>
        </div>
      </div>
      <div class="infoList" v-if="tabIndex == 1 && owner != null">
        <div class="infoItem">
          <div class="num">{{ owner.total_chats_count }}</div>
          <div class="desc">加入群数</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ owner.unique_invite_member }}</div>
          <div class="desc">邀请会员总数</div>
          <div class="otherInfo">(去重)</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ owner.repeat_invite_member }}</div>
          <div class="desc">邀请会员总数</div>
          <div class="otherInfo">(未去重)</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ owner.total_new_member }}</div>
          <div class="desc">新粉丝总数</div>
        </div>
        <div class="infoItem">
          <div class="num">{{ owner.today_new_member }}</div>
          <div class="desc">今日新粉丝人数</div>
        </div>
      </div>
    </div>

    <div class="history" v-if="tabIndex == 1 && owner != null">
      <div class="history-title">历史记录</div>
      <div class="history-time" @click="datetimePopup = true">{{ currentTimeText }}<i style="margin-left: 0.4rem;" class="iconfont icon-member-bottom"></i></div>
      <div class="history-wrapper">
        <line-echarts id="gdu_index1" :charts="lineCharts"></line-echarts>
      </div>
    </div>

    <div class="enterpriseWrapper">
      <div class="tabs" v-if="tabIndex == 0">
        <div class="tab" :class="{ active: childTabIndex == 0 }" @click="setChildTabIndex(0)">全部</div>
        <div class="tab" :class="{ active: childTabIndex == 1 }" @click="setChildTabIndex(1)">已绑定锁客会员</div>
        <div class="tab" :class="{ active: childTabIndex == 2 }" @click="setChildTabIndex(2)">未绑定锁客会员</div>
      </div>
      <div class="tabs" v-if="tabIndex == 1">
        <div class="tab" :class="{ active: childTabIndex == 3 }" @click="setChildTabIndex(3)">群聊</div>
        <div class="tab" :class="{ active: childTabIndex == 4 }" @click="setChildTabIndex(4)">邀请会员</div>
      </div>
      <div class="searchWrapper">
        <div class="search">
          <i class="iconfont icon-all_search_2"></i>
          <form action="javascript:void 0;">
            <input type="search" v-model="searchText" @keyup.13="getListData" placeholder="搜索群" />
          </form>
        </div>
        <template v-if="tabIndex == 1 && childTabIndex == 4">
          <div class="search" style="margin:0 0.5rem;">
            <i class="iconfont icon-all_search_2"></i>
            <form action="javascript:void 0;">
              <input type="search" v-model="searchMemberName" @keyup.13="getListData" placeholder="搜索会员昵称" />
            </form>
          </div>

          <van-button type="primary" size="mini" color="#f14e4e" @click="getListData">搜索</van-button>
        </template>
      </div>

      <div class="filter-wrapper" v-if="tabIndex == 1 && childTabIndex == 4">
        <!-- 邀请会员筛选 -->
        <div class="filter-btn" @click="filterPopup = true">筛选<i class="iconfont icon-fontclass-shaixuan1"></i></div>
        <div class="select-filter-item" v-for="(value, key, index) in filterConfig" :key="index" @click.stop="delFilter(key)">{{ value.name }} <i class="iconfont icon-adsystem_icon_cancle"></i></div>
      </div>

      <div class="groupList">
        <div class="groupItem" v-for="item in listData" :key="item.id">
          <index-group-item v-if="childTabIndex != 4" @handQrcode="showQrcode" :share="tabIndex == 0 ? true : false" :level="tabIndex" :item="item"></index-group-item>
          <inviter-member-item :item="item" v-if="childTabIndex == 4"></inviter-member-item>
        </div>
      </div>
    </div>

    <qrcode :show.sync="qrcodePopup" :img="qrcodeImg"></qrcode>

    <van-popup v-model="datetimePopup" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" @confirm="confirmTime" />
    </van-popup>

    <van-popup v-model="filterPopup" position="bottom" closeable round @close="closeFilterPop">
      <filterPopup ref="filterPopup" v-on:confirm="confirmFilter"></filterPopup>
    </van-popup>

    <share-poster :pid="posterID" v-model="sharePopup" :img="qrcodeImg"></share-poster>
  </div>
</template>

<script>
import gduIndexController from "./gdu_index_controller";

export default gduIndexController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  /deep/.van-sticky--fixed {
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_index_bg.png);
    background-position: top left;
    background-size: cover;
  }
}

.header {
  width: 100%;
  height: 17.188rem;
  padding: 0 0.938rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_index_bg.png);
  background-size: cover;

  .tabs {
    display: flex;
    justify-content: center;
    height: 2.84rem;
    color: #fff;

    .tab {
      font-size: 0.938rem;
      color: #fff;
      display: flex;
      align-items: center;

      &.active {
        font-weight: bold;
        font-size: 1.125rem;
        position: relative;
      }

      &.active::after {
        content: "";
        display: block;
        width: 1.375rem;
        height: 0.188rem;
        background-color: #fff;
        border-radius: 0.094rem;
        position: absolute;
        bottom: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .userInfo {
    display: flex;
    align-items: center;

    .face {
      width: 1.75rem;
      height: 1.75rem;
      background-color: #fff;
      border-radius: 50%;

      img {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
      }
    }

    .nickname {
      margin-left: 0.531rem;
      font-size: 0.938rem;
      color: #fff;
    }
  }

  .infoList {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.625rem;
    grid-row-gap: 0.969rem;
    padding-top: 0.9rem;

    .infoItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 4.419rem;
      width: 100%;
      background: #fff;
      border-radius: 0.188rem;
      border-bottom-width: 0.188rem;
      border-bottom-style: solid;

      &:nth-child(1) {
        border-bottom-color: #fdde99;
      }

      &:nth-child(2) {
        border-bottom-color: #b8eeff;
      }

      &:nth-child(3) {
        border-bottom-color: #e1d4fd;
      }

      &:nth-child(4) {
        border-bottom-color: #c6d2ff;
      }

      &:nth-child(5) {
        border-bottom-color: #ffccbd;
      }

      .num {
        padding-bottom: 0.1rem;
        font-size: 1rem;
        color: #202020;
        font-weight: bold;
      }

      .desc {
        font-size: 0.75rem;
        color: #666;
      }

      .otherInfo {
        font-size: 0.688rem;
        color: #999;
      }
    }
  }
}

.history {
  width: 100%;
  margin: -1rem auto 1rem;
  background-color: #fff;
  border-radius: 0.938rem 0.938rem 0 0;
  border-bottom: 0.625rem solid #eff0f1;

  .history-title {
    padding: 0.938rem 0.938rem 0.506rem 0.938rem;
    text-align: left;
    font-weight: bold;
    font-size: 12px;
    color: #17243e;
  }

  .history-time {
    display: inline-flex;
    padding: 0.2rem 0.8rem;
    border: 0.04rem solid #efefef;
    border-radius: 0.3rem;
  }

  .history-wrapper {
    padding: 0 0.875rem 0.906rem;
    min-height: 10rem;
  }
}

.enterpriseWrapper {
  .tabs {
    margin-top: -1rem;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 2rem;
    border-top-right-radius: 0.938rem;
    border-top-left-radius: 0.938rem;
    background: #fff;

    .tab {
      font-size: 0.875rem;
      color: #666;

      &.active {
        font-size: 1rem;
        color: #f14e4e;
        font-weight: bold;
      }
    }
  }

  .searchWrapper {
    padding: 0 0.938rem;
    padding-top: 1.29rem;
    display: flex;
    align-items: center;

    .search {
      flex: 1;
      height: 1.875rem;
      background-color: #eff0f1;
      border-radius: 1.063rem;
      text-align: left;
      display: flex;
      align-content: center;

      i {
        padding-top: 0.35rem;
        padding-left: 10px;
        color: #666;
        display: flex;
        align-content: center;
      }

      form {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 0.531rem;

        input {
          width: 100%;
          margin-left: 6px;
          font-size: 0.875rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.044rem;
          color: #666;
          border: none;

          &::-webkit-input-placeholder {
            color: #666;
          }
        }
      }
    }
  }

  .filter-wrapper {
    padding: 0.75rem 0.938rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .filter-btn {
      display: flex;
      align-items: flex-end;
      margin-right: 10px;
    }
    .select-filter-item {
      position: relative;
      height: 18px;
      line-height: 18px;
      background-color: #fff4f4;
      border-radius: 2px;
      color: #f25552;
      padding: 0 8px;
      font-size: 10px;
      margin-right: 15px;
      .icon-adsystem_icon_cancle {
        position: absolute;
        top: -8px;
        right: -8px;
      }
    }
    .select-filter-item:nth-child(n + 5) {
      margin-top: 10px;
    }
  }

  .groupList {
    padding: 0 0.938rem;
    padding-bottom: 1rem;

    .groupItem {
      margin-top: 1rem;
    }
  }
}
</style>
