<template>
  <!-- 小猪欢欢 [#85445] -->
  <!--介绍： 后台开启显示，显示一条会员信息，然后向上轮播显示,点击跳转到该商品的原来的详情页 -->
  <div id="groupTotal">
    <div @click="show = !show">
      <div class="headTop">
        <span>拼团人数</span>
        <span
          >{{ goods_info.join_team_number }}人
          <i class="fa fa-angle-right" style="font-size:1rem;"></i>
        </span>
      </div>
      <van-swipe ref="groupSwipe" :autoplay="2500" style="height: 50px;" vertical :show-indicators="false" v-if="teamInfo.listData.length > 0">
        <van-swipe-item v-for="(item, index) in teamInfo.listData" :key="index">
          <div class="user" v-if="item.has_one_member">
            <div class="left">
              <div class="image">
                <img :src="item.has_one_member.avatar_image" alt="" />
              </div>
              <div class="userName">{{ item.has_one_member.nickname }}</div>
            </div>
            <div class="right">{{ item.has_one_member.mobile }}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-popup v-model="show" get-container="#appMain" position="center" style="background: transparent; height: 25rem; overflow: hidden">
      <div class="groupLIstBox">
        <div class="topHead">
          <div class="txt">
            已成团：<span>{{ success_team_number }}</span>
          </div>
          <div class="txt">
            已开团：<span>{{ open_team_number }}</span>
          </div>
        </div>
        <div class="txtT">参团者信息：</div>
        <div class="groupList" v-for="(item, ind) in teamInfo.listData" :key="ind">
          <div class="imgaeBox" v-if="item.has_one_member">
            <img :src="item.has_one_member.avatar_image" alt="" />
          </div>
          <div class="userinfo" v-if="item.has_one_member">
            <div class="name">{{ item.has_one_member.nickname }}</div>
            <div class="intro">{{ item.has_one_member.mobile }}</div>
          </div>
        </div>
        <div class="isnone" v-if="page >= last_page">没有更多了~</div>
        <div class="isnone" v-else @click="getMoreTeamList">点击加载更多</div>
      </div>
      <div style="transform: rotate(45deg)">
        <i class="iconfont icon-customform_add" @click="show = false"></i>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  inject: ["goods_type"],
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      show: false,
      teamInfo: { newword: false, totalPage: 0, count: 0, page: 1, listData: [] }, //开团列表信息
      open_team_number: 0,
      success_team_number: 0,
      page: 1,
      last_page: 1
    };
  },
  activated() {
    setTimeout(() => {
      // 解决点击跳转拼团详情页返回之后，轮播不自动滚动
      this.$refs.groupSwipe.resize();
    }, 1000);
  },
  mounted() {
    this.show2 = false;
    if (this.goods_info.status == "1") {
      this.getTeamList();
    }
  },
  computed: {},
  methods: {
    getTeamList() {
      let json = {
        id: this.goods_info.id,
        page: this.page
      };
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-join-team-number";
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            this.last_page = response.data.team_member.last_page;
            this.teamInfo.listData = response.data.team_member.data;
            this.open_team_number = response.data.open_team_number;
            this.success_team_number = response.data.success_team_number;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    getMoreTeamList() {
      let json = {
        id: this.goods_info.id,
        page: this.page
      };
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-join-team-number";
      this.page++;
      json.page = this.page;
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            var nextPageData = response.data.team_member.data;
            this.teamInfo.listData = this.teamInfo.listData.concat(nextPageData);
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-customform_add {
  color: #fff;
  font-size: 1.5rem;
}
.groupLIstBox {
  padding: 0 1.09rem 0.94rem 1.09rem;
  border-radius: 0.31rem;
  background-color: #ffffff;
  width: 17.5rem;
  height: 20.97rem;
  margin-bottom: 1.69rem;
  overflow-y: scroll;
  .groupList:last-child {
    border-bottom: none;
  }
  .groupList:first-child {
    border-bottom: none;
  }
  .isnone {
    text-align: center;
    color: #666666;
    font-size: 0.65rem;
    margin-top: 1rem;
  }
  .groupList {
    display: flex;
    align-items: center;
    padding: 0.94rem 0;
    border-bottom: 0.0313rem solid #eaeaea;
    .userinfo {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: hidden;
      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.88rem;
        color: #1f1f1f;
        font-weight: bold;
        margin-bottom: 0.3rem;
        text-align: left;
      }
      .intro {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.75rem;
        color: #666666;
        text-align: left;
      }
    }
    .imgaeBox {
      flex-shrink: 0;
      width: 2.19rem;
      height: 2.19rem;
      background-color: #b9b9b9;
      border-radius: 100%;
      margin-right: 0.69rem;
      img {
        border-radius: 100%;
        width: 100%;
        height: 100%;
      }
    }
  }
  .txtT {
    text-align: left;
    font-size: 0.75rem;
    color: #666666;
    margin-top: 0.91rem;
    margin-bottom: 0.91rem;
  }
  .topHead {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 22;
    background: #fff;
    border-bottom: 0.0313rem solid #eaeaea;
    height: 2.81rem;
    display: flex;
    align-items: center;
    .txt {
      text-align: left;
      font-size: 0.81rem;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      span {
        color: #f91515;
      }
    }
  }
}
#groupTotal {
  background: #fff;
  margin-top: 0.63rem;
}
.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  box-sizing: border-box;
  .left {
    display: flex;
    align-content: center;
    .userName {
      line-height: 1.88rem;
      margin-left: 0.68rem;
    }
    .image {
      width: 1.88rem;
      height: 1.88rem;
      border-radius: 100%;
      img {
        width: 100%;
        height: 1.88rem;
        border-radius: 100%;
      }
    }
  }
}
.headTop {
  padding: 0.875rem;

  display: flex;
  justify-content: space-between;
  border-bottom: 0.0313rem solid #eaeaea;
}
</style>
