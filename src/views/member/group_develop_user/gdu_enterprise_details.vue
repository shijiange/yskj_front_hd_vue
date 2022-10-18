<template>
  <div class="page">
    <c-title text="群拓客"></c-title>

    <div class="header" v-if="details != null">
      <div class="group_img" v-if="false">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_index_bg.png" alt="" />
      </div>
      <div class="wrapper">
        <div class="name">
          {{ details.group_name }} <span class="num">({{ listDataTotal }}人)</span>
        </div>
        <div class="time">创建时间:{{ details.group_created_time_str }}</div>
        <div class="lockguest" v-if="level == 1">
          <div class="text">群主：</div>
          <div class="member">
            <img :src="details.owner_member_avatar" alt="" />
            {{ details.owner_member_nickname }}
          </div>
        </div>
      </div>
      <div class="qrcode" @click="getQrcode(0)">
        <i class="iconfont icon-fontclass-erweima"></i>
      </div>
    </div>
    <div style="padding: 0 0.906rem;" v-if="level == 0">
      <div class="opetItem" @click="getQrcode(1)">
        <div class="text">二维码</div>
        <i class="iconfont icon-fontclass-erweima" style="font-size: 24px;"></i>
        <!-- <i v-if="details.qrcode_url == ''" class="iconfont icon-add1"></i>
        <i v-else-if="details.qrcode_url != ''" class="iconfont icon-fontclass-erweima" style="font-size: 24px;"></i> -->
      </div>
      <div class="opetItem" @click="lockPopup = true">
        <div class="text">锁客会员</div>
        <i class="iconfont icon-add3" v-if="details.owner_member_uid == null"></i>
        <div class="lockinfo" v-if="details.owner_member_uid != null">
          <div class="img">
            <img :src="details.owner_member_avatar" alt="" />
          </div>
          <div class="desc">{{ details.owner_member_nickname }}</div>
        </div>
      </div>
    </div>
    <div class="hr"></div>

    <template v-if="level == 0 && details != null">
      <div class="todayData">
        <div class="today-title">今日数据</div>
        <div class="today-items">
          <div class="today-item">
            <div class="desc">入群</div>
            <div class="num">{{ details.today_join_count }}</div>
          </div>
          <div class="today-item">
            <div class="desc">退群</div>
            <div class="num">{{ details.today_withdraw_count }}</div>
          </div>
          <div class="today-item">
            <div class="desc">新会员</div>
            <div class="num">{{ details.today_new_member_count }}</div>
          </div>
        </div>
      </div>
      <div class="hr"></div>
    </template>

    <div class="chart">
      <div class="chart-title">{{ level == 0 ? "历史数据" : "数据详情" }}</div>
      <div class="history-time" @click="datetimePopup = true">{{ currentTimeText }}<i style="margin-left: 0.4rem;" class="iconfont icon-member-bottom"></i></div>
      <div class="chart-wrapper">
        <line-echarts v-if="details != null" id="gdu_enterprise_details1" :charts="lineCharts"></line-echarts>
      </div>
    </div>
    <div class="hr"></div>

    <template v-if="level == 0 && details != null">
      <div class="chart">
        <div class="chart-title">群情况</div>
        <div class="chart-wrapper">
          <pie-echarts
            id="gdu_enterprise_details2"
            :total_in_count="details.total_in_count"
            :total_withdraw_count="details.total_withdraw_count"
            :total_in_employee_count="details.total_in_employee_count"
            :total_in_customer_count="details.total_in_customer_count"
          ></pie-echarts>
        </div>
      </div>
      <div class="hr"></div>
    </template>

    <template v-if="level == 0 && details != null">
      <div class="chart">
        <div class="chart-title">入群方式</div>
        <div class="chart-wrapper">
          <bar-echarts
            id="gdu_enterprise_details3"
            :total_join_scene_normal_count="details.total_join_scene_normal_count"
            :total_join_scene_link_count="details.total_join_scene_link_count"
            :total_join_scene_qr_count="details.total_join_scene_qr_count"
          ></bar-echarts>
        </div>
      </div>
      <div class="hr"></div>
    </template>

    <div class="groupList">
      <div class="groupList-title" v-if="level == 0">群成员</div>
      <div class="groupList-title" v-if="level == 1">邀请的会员</div>
      <div class="groupList-desc">
        共<span class="num">{{ listDataTotal }}</span
        >名成员
      </div>
      <form action="/">
        <van-search v-model="member_name" shape="round" placeholder="搜索成员" style="padding:10px 0;" @search="getListData" @clear="getListData" />
      </form>
      <div class="filter-wrapper">
        <!-- 邀请会员筛选 -->
        <div class="filter-btn" @click="filterPopup = true">筛选<i class="iconfont icon-fontclass-shaixuan1"></i></div>
        <div class="select-filter-item" v-for="(value, key, index) in filterConfig" :key="index" @click.stop="delFilter(key)">{{ value.name }} <i class="iconfont icon-adsystem_icon_cancle"></i></div>
      </div>

      <div class="group-items">
        <div class="group-item" v-for="item in listData" :key="item.id">
          <enterprise-details-group-item :item="item" :level="level" @handSee="seeMemberInfo"></enterprise-details-group-item>
        </div>
      </div>
    </div>

    <van-popup v-model="filterPopup" position="bottom" closeable round @close="closeFilterPop">
      <!-- 筛选弹窗 -->
      <filterPopup ref="filterPopup" v-on:confirm="confirmFilter" :hidden-member="level == 0 ? true : false" :hidden-fans="level == 0 ? true : false"></filterPopup>
    </van-popup>

    <!-- 上传二维码 -->
    <!-- <van-overlay :show="upImgPopup" @click="upImgPopup = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="upImgPopup" @click.stop>
            <div class="upImgWrapper">
              <div class="up-img-title">上传二维码</div>
              <div class="upImgContainer">
                <van-uploader :after-read="onRead">
                  <div style="padding: 0.2rem; width: 6.563rem; height: 6.563rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;">
                    <img
                      :src="up_qrcode_img ? up_qrcode_img : require('../../../assets/images/up_icon.png')"
                      :style="{ width: up_qrcode_img ? '100%' : '50%', height: up_qrcode_img ? '100%' : '50%' }"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
                <div class="sendBtn" @click="saveQrcode">确定</div>
                <div class="tips">注：若上传的二维码有有效期限制，请注意及时更换，避免二维码过期失效~</div>
                <div class="tips" style="padding-top: 0;">只需要上传群二维码，方形图片！</div>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="upImgPopup = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay> -->

    <!-- 锁客搜索 -->
    <van-overlay :show="lockPopup" @click="lockPopup = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="lockPopup" @click.stop>
            <div class="lockWrapper">
              <div class="lockContainer">
                <div class="name">锁客会员</div>
                <div class="search">
                  <input type="text" v-model="lock_search_mobile" placeholder="请输入锁客会员手机号" />
                  <div class="text" @click="queryMember">搜索</div>
                </div>
                <div class="member" v-if="lock_search_loading == 1 && lock_search_member != null">
                  <div class="img">
                    <img :src="lock_search_member.avatar_image" alt="" />
                  </div>
                  <div class="nickname">{{ lock_search_member.nickname }}</div>
                </div>
                <div class="member" v-if="lock_search_loading == 2">找不到该会员</div>
                <div class="sendBtn" @click="bindUser">确定</div>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="lockPopup = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <!-- 会员信息 -->
    <van-overlay :show="memberInfoPopup" @click="memberInfoPopup = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="memberInfoPopup" @click.stop>
            <div class="memberInfoWrapper">
              <div class="memberInfo-title">会员信息</div>
              <div class="memberInfoContainer" v-if="memberInfoData != null">
                <div class="memberInfo-item">
                  <div class="text">会员：</div>
                  <div class="img">
                    <img :src="memberInfoData.customer_avatar" alt="" />
                  </div>
                  <div class="desc">{{ memberInfoData.customer_nickname }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">会员ID：</div>
                  <div class="desc">{{ memberInfoData.customer_uid }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">加入时间：</div>
                  <div class="desc">{{ memberInfoData.join_time_str }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">入群方式：</div>
                  <div class="desc">{{ memberInfoData.join_scene_desc }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">状态：</div>
                  <div class="desc">{{ memberInfoData.status_desc }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">邀请人：</div>
                  <div class="img">
                    <img :src="memberInfoData.invitor_avatar" alt="" />
                  </div>
                  <div class="desc">{{ memberInfoData.invitor_nickname }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">邀请会员：</div>
                  <div class="img">
                    <img :src="memberInfoData.invite_member_avatar" alt="" />
                  </div>
                  <div class="desc">{{ memberInfoData.invite_member_nickname }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">注册时间：</div>
                  <div class="desc">{{ memberInfoData.createtime_str }}</div>
                </div>
                <div class="memberInfo-item">
                  <div class="text">系统推荐人：</div>
                  <div class="img">
                    <img :src="memberInfoData.group_owner_member_avatar" alt="" />
                  </div>
                  <div class="desc">{{ memberInfoData.group_owner_member_nickname }}</div>
                </div>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="memberInfoPopup = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <qrcode :show.sync="qrcodePopup" :img="qrcodeImg"></qrcode>

    <van-popup v-model="datetimePopup" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" @confirm="confirmTime" />
    </van-popup>
  </div>
</template>

<script>
import gduEnterpriseDetailsController from "./gdu_enterprise_details_controller";

export default gduEnterpriseDetailsController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
}

.header {
  display: flex;
  width: 100%;
  height: 5rem;
  padding: 0.625rem;
  background-color: #fff;

  .group_img {
    width: 3.125rem;
    height: 3.125rem;

    img {
      width: 3.125rem;
      height: 3.125rem;
    }
  }

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0.625rem;
    text-align: left;

    .name {
      font-size: 0.938rem;
      color: #333;

      .num {
        font-size: 0.75rem;
        color: #999;
      }
    }

    .time {
      margin-top: 0.1rem;
      font-size: 0.75rem;
      color: #999;
    }

    .lockguest {
      display: flex;
      align-items: center;
      margin-top: 0.3rem;
      font-size: 0.75rem;
      color: #999;

      .member {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: #333;

        img {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          margin-right: 0.144rem;
        }
      }
    }
  }

  .qrcode {
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 2.2rem;
      color: #222;
    }
  }
}

.opetItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2.781rem;
  border-bottom: 0.03rem solid #f2f2f2;

  &:last-child {
    border-bottom: none;
  }

  .lockinfo {
    display: flex;

    .img {
      margin-right: 0.219rem;
      width: 1.094rem;
      height: 1.125rem;

      img {
        width: 1.094rem;
        height: 1.125rem;
        border-radius: 50%;
      }
    }

    .desc {
      font-size: 0.875rem;
      color: #333;
    }
  }
}

.hr {
  width: 100%;
  height: 0.625rem;
  background: #f2f2f2;
}

.todayData {
  width: 100%;
  height: 7.188rem;
  padding: 0.906rem;
  text-align: left;

  .today-title {
    font-weight: bold;
    font-size: 1.125rem;
    color: #17243e;
  }

  .today-items {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;

    .today-item {
      width: 6.75rem;
      height: 3.125rem;
      padding: 0.363rem 0.563rem;
      background-color: #f3f5f9;
      border-radius: 0.469rem;
      background-repeat: no-repeat;
      background-size: 1.781rem 1.25rem;
      background-position: right bottom;

      &:nth-child(1) {
        background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_today1.png);
      }

      &:nth-child(2) {
        background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_today2.png);
      }

      &:nth-child(3) {
        background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_today3.png);
      }

      .desc {
        font-size: 0.688rem;
        color: #757575;
      }

      .num {
        font-weight: bold;
        font-size: 1.125rem;
        color: #333;
      }
    }
  }
}

.chart {
  padding: 0.906rem 0.875rem;

  .chart-title {
    font-size: 1rem;
    text-align: left;
    font-weight: bold;
    color: #17243e;
  }

  .history-time {
    display: inline-flex;
    padding: 0.2rem 0.8rem;
    border: 0.04rem solid #efefef;
    border-radius: 0.3rem;
  }

  .chart-wrapper {
    min-height: 10rem;
  }
}

.groupList {
  padding: 0.906rem 0.875rem;
  text-align: left;

  .groupList-title {
    font-size: 1rem;
    font-weight: bold;
    color: #17243e;
  }

  .groupList-desc {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #999;

    .num {
      color: #f14e4e;
    }
  }

  .group-items {
    .group-item {
      padding-top: 1.5rem;
    }
  }
}

.popupWrapper {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}

.upImgWrapper {
  width: 20.813rem;
  height: 22.469rem;
  border-radius: 0.5rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_qrcodepopup.png);
  background-position: center top;
  background-size: contain;
  background-repeat: no-repeat;

  .up-img-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.3rem;
    font-size: 1.188rem;
    font-weight: bold;
    color: #fff;
  }

  .upImgContainer {
    width: 18.1rem;
    height: 18.75rem;
    margin: 0 auto;
    padding-top: 2.5rem;
    border-bottom-left-radius: 0.938rem;
    border-bottom-right-radius: 0.938rem;
    background: #fff;

    .sendBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14.063rem;
      height: 2.063rem;
      margin: 0 auto;
      margin-top: 3rem;
      font-size: 0.938rem;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 1.031rem;
    }

    .tips {
      padding: 0.5rem 0.9rem;
      color: #ef4747;
      font-size: 0.75rem;
    }
  }
}

.lockWrapper {
  width: 17.063rem;
  height: 20.869rem;
  padding-top: 8.21rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_lockpopup.png);
  background-position: center top;
  background-size: contain;
  background-repeat: no-repeat;

  .lockContainer {
    position: relative;
    height: 12.5rem;
    background: #fff;
    border-bottom-left-radius: 0.563rem;
    border-bottom-right-radius: 0.563rem;

    .name {
      padding: 0.75rem 0;
      font-size: 0.938rem;
      color: #333;
    }

    .search {
      display: flex;
      align-items: center;
      padding: 0 0.969rem;

      input {
        width: 12.813rem;
        height: 1.875rem;
        padding: 0 0.75rem;
        background-color: #eff0f1;
        border-radius: 0.938rem;
        border: none;
      }

      .text {
        margin-left: 0.519rem;
        font-size: 0.813rem;
        color: #f14e4e;
      }
    }

    .member {
      display: flex;
      padding: 0 0.969rem;
      margin-top: 0.6rem;

      .img {
        width: 1rem;
        height: 1rem;

        img {
          width: 1rem;
          height: 1rem;
          background-color: #dedede;
          border-radius: 50%;
        }
      }

      .nickname {
        margin-left: 0.344rem;
        font-size: 0.75rem;
        color: #666;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .sendBtn {
      position: absolute;
      bottom: 0.938rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14.063rem;
      height: 2.063rem;
      margin: 0 auto;
      margin-top: 3.5rem;
      font-size: 0.938rem;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 1.031rem;
    }
  }
}

.memberInfoWrapper {
  width: 20.813rem;
  // height: 22.469rem;
  border-radius: 0.5rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_details_qrcodepopup.png);
  background-position: center top;
  background-size: contain;
  background-repeat: no-repeat;

  .memberInfo-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.3rem;
    font-size: 1.188rem;
    font-weight: bold;
    color: #fff;
  }

  .memberInfoContainer {
    width: 18.1rem;
    // height: 18.75rem;
    margin: 0 auto;
    padding: 1.156rem 0;
    border-bottom-left-radius: 0.938rem;
    border-bottom-right-radius: 0.938rem;
    background: #fff;

    .memberInfo-item {
      display: flex;
      padding: 0 1.25rem;
      margin-bottom: 0.906rem;

      .text {
        font-size: 0.875rem;
        color: #999;
      }

      .img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.218rem;

        img {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
      }

      .desc {
        font-size: 0.875rem;
        color: #333;
      }
    }
  }
}

.qrcodeWrapper {
  .qrcode-img {
    width: 15.938rem;
    height: 21.25rem;
    border-radius: 0.625rem;

    img {
      width: 15.938rem;
      height: 21.25rem;
      background-color: #fff;
      border-radius: 0.625rem;
    }
  }

  .qrcode-tips {
    margin-top: 1rem;
    color: #fff;
    font-size: 0.85rem;
  }
}

.filter-wrapper {
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
  // .select-filter-item:nth-child(n + 5) {
  //   margin-top: 10px;
  // }
}
</style>
