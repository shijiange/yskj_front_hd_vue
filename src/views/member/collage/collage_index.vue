<template>
  <div class="page">
    <c-title text="拼单"></c-title>

    <div class="headerInfo">
      <div class="infoContent">
        <div class="face">
          <img :src="member.avatar" alt="" />
        </div>
        <div class="leftc">
          <div class="c1">{{ member.nickname }}</div>
          <div class="c2">
            <i class="iconfont icon-pd_leveltag"></i>
            <span v-if="agent != null && examine == 2 && agent != '' && agent.has_one_level">{{ agent.has_one_level.name }}</span>
            <span v-else>非会员</span>
          </div>
        </div>
        <router-link class="rightc" :to="fun.getUrl('withdrawal')">
          <div class="icon_img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_withdrawalbg@2x.png" alt="" />
          </div>
          <div class="btn_with">
            立即提现
          </div>
        </router-link>
      </div>
      <div class="descContainer">
        <div class="descItems">
          <div class="descItem" v-for="item in bonus" :key="item.type">
            <div class="price">{{ item.price }}</div>
            <div class="desc">{{ item.type_name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper" v-if="examine != 2">
      <div class="authentication wrapperItem">
        <div class="wrapperItemTitle">身份认证</div>
        <div class="container">
          <div class="authenItem" @click="gotoApply(item.form_id, item.id)" v-for="item in applyLevelList" :key="item.id">
            <div class="icon_img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_member_apply@2x.png" alt="" />
            </div>
            <div class="name" v-if="item">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper" v-if="examine == 2">
      <div class="projectManagement wrapperItem">
        <div class="wrapperItemTitle">项目管理</div>
        <div class="container">
          <div class="projectManagementItem" @click="gotoCollage(1)">
            <div class="icon_img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_order_buying@2x.png" alt="" />
              <i v-if="project.stay_pay">{{ project.stay_pay.stay_count }}</i>
            </div>
            <div class="name">待拼单</div>
          </div>

          <div class="projectManagementItem" @click="gotoCollage(2)">
            <div class="icon_img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_order_sure@2x.png" alt="" />
              <i v-if="project.confirmed">{{ project.confirmed.confirmed_count }}</i>
            </div>
            <div class="name">审核中</div>
          </div>

          <div class="projectManagementItem" @click="gotoCollage(3)">
            <div class="icon_img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_order_ing@2x.png" alt="" />
              <i v-if="project.in_pay">{{ project.in_pay.in_count }}</i>
            </div>
            <div class="name">拼单中</div>
          </div>

          <div class="projectManagementItem" @click="gotoCollage(4)">
            <div class="icon_img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_order_finish@2x.png" alt="" />
              <i v-if="project.compete">{{ project.compete.compete }}</i>
            </div>
            <div class="name">已完成</div>
          </div>
        </div>
      </div>

      <div class="addProject">
        <div class="icon_img">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_addproject@2x.png" alt="" />
        </div>
        <div class="info">
          发布拼单项目，领取奖励
        </div>
        <div class="btn_add" @click="$router.push(fun.getUrl('tacitAddproject'))">添加项目</div>
      </div>

      <div class="latelyProject" v-if="false">
        <div class="latelyTitle">
          <span class="c1">最近添加项目</span>
          <span class="c2" @click="gotoCollage(0)">查看更多</span>
        </div>
        <div class="LatelyProjectList">
          <!-- <project-item @delProject="delProject"></project-item>
					<project-item></project-item>
					<project-item></project-item> -->
          <collage-item1 @delProject="delProject"></collage-item1>
          <collage-item2></collage-item2>
          <collage-item3></collage-item3>
        </div>
        <div class="addProjectIcon" @click="$router.push(fun.getUrl('tacitAddproject'))">
          <i class="iconfont icon-store_plus"></i>
          <span style="margin-left: 0.331rem;">添加项目</span>
        </div>
      </div>

      <div class="otherItems">
        <div class="otherItem" @click="gotoEchievement">
          <div class="icon_img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_level_results@2x.png" alt="" />
          </div>
          <div class="name">业绩榜单</div>
        </div>

        <div class="otherItem" @click="$router.push(fun.getUrl('collageReportform'))">
          <div class="icon_img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_income_satament@2x.png" alt="" />
          </div>
          <div class="name">收入报表</div>
        </div>

        <div class="otherItem" @click="$router.push(fun.getUrl('founderTeam'))" v-if="agent.has_one_level && (agent.has_one_level.is_single_spell == 1 || agent.has_one_level.is_all_spell == 1)">
          <div class="icon_img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_my_team@2x.png" alt="" />
          </div>
          <div class="name">我的团队</div>
        </div>

        <div class="otherItem" @click="$router.push(fun.getUrl('founderSinglepool'))" v-if="agent.has_one_level && (agent.has_one_level.is_single_spell == 1 || agent.has_one_level.is_all_spell == 1)">
          <div class="icon_img">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_order@2x.png" alt="" />
          </div>
          <div class="name">拼单池</div>
        </div>
      </div>
    </div>

    <div class="cursor" v-if="examine == 2" @click="$router.push(fun.getUrl('founderBicycle'))">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_button_bg@2x.png" alt="" />
    </div>
  </div>
</template>

<script>
import collageIndexController from "./collage_index_controller";

export default collageIndexController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(246, 248, 252);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.headerInfo {
  width: 100%;
  height: 10.188rem;
  background-color: #fff;
  border-radius: 0 0 1.656rem 1.656rem;
  padding: 1rem 0 1.594rem 1.563rem;

  .infoContent {
    display: flex;

    .face {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: #ededed;

      img {
        border-radius: 50%;
        width: 3.75rem;
        height: 3.75rem;
      }
    }

    .leftc {
      margin-left: 0.513rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      padding-top: 0.5rem;

      .c1 {
        font-size: 1rem;
        color: #232334;
      }

      .c2 {
        margin-top: 0.444rem;
        display: flex;

        .icon-pd_leveltag {
          color: #ffc547;
        }

        span {
          margin-left: 0.281rem;
          font-size: 0.75rem;
          color: #8f8fb4;
        }
      }
    }

    .rightc {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 4.469rem;
      height: 3.313rem;
      position: relative;

      .icon_img {
        position: absolute;
        right: 0;
        top: 0;
        width: 3.094rem;
        height: 2.344rem;

        img {
          width: 3.094rem;
        }
      }

      .btn_with {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 0.75rem;
        color: #5e4501;
        padding-left: 0.688rem;
        padding-right: 0.719rem;
        display: flex;
        align-items: center;
        height: 1.125rem;
        background-color: #ffc547;
        border-radius: 0.563rem 0 0 0.563rem;
      }
    }
  }

  .descContainer {
    padding-right: 1.688rem;

    .descItems {
      margin-top: 1.594rem;
      display: flex;
      overflow: scroll;
      justify-content: space-between;

      .descItem {
        display: flex;
        flex-direction: column;
        margin-right: 2rem;

        .price {
          font-weight: bold;
          color: #010101;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .desc {
          margin-top: 0.644rem;
          font-size: 0.75rem;
          color: #333;
          white-space: nowrap;
        }
      }
    }
  }
}

.wrapper {
  padding: 0 0.844rem 0 0.75rem;

  .wrapperItem {
    margin-top: 1.188rem;

    .wrapperItemTitle {
      font-weight: bold;
      text-align: left;
      padding-left: 0.688rem;
      font-size: 0.875rem;
      color: #333;
    }
  }

  .authentication {
    .container {
      margin-top: 0.781rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .authenItem {
        display: flex;
        align-items: center;
        width: 10.531rem;
        height: 3.75rem;
        background-color: #fff;
        border-radius: 0.563rem;
        padding-left: 1.25rem;
        margin-bottom: 0.8rem;

        .icon_img {
          width: 1.563rem;
          height: 1.563rem;

          img {
            width: 1.563rem;
          }
        }

        .name {
          padding-left: 0.625rem;
          font-size: 0.875rem;
          color: #1a1a1a;
        }
      }
    }
  }

  .projectManagement {
    .container {
      margin-top: 0.844rem;
      background-color: #fff;
      border-radius: 0.563rem;
      display: flex;
      justify-content: space-around;
      padding-top: 1.688rem;
      padding-bottom: 0.625rem;

      .projectManagementItem {
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon_img {
          width: 1.5rem;
          height: 1.406rem;
          position: relative;

          img {
            width: 1.5rem;
            height: 1.406rem;
          }

          i {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0 0.2rem;
            border-radius: 0.5rem;
            transform: translateX(50%) translateY(-50%);
            font-size: 0.688rem;
            color: #fe5e5a;
            background-color: #fff;
            border: solid 0.031rem #fe5e5a;
          }
        }

        .name {
          margin-top: 0.844rem;
          color: #666;
          font-size: 0.813rem;
        }
      }
    }
  }

  .addProject {
    margin-top: 0.813rem;
    width: 21.875rem;
    height: 8.844rem;
    background-color: #fff;
    border-radius: 0.563rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.906rem;

    .icon_img {
      width: 2.563rem;
      height: 2.969rem;
      margin-top: 1.094rem;

      img {
        width: 2.563rem;
        height: 2.969rem;
      }
    }

    .info {
      margin-top: 0.625rem;
      color: #666;
      font-size: 0.688rem;
    }

    .btn_add {
      margin-top: 0.656rem;
      width: 17.844rem;
      height: 2.313rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fe5d5a;
      border-radius: 0.25rem;
      color: #fff;
      font-size: 0.875rem;
    }
  }

  .latelyProject {
    margin-top: 0.875rem;
    width: 21.875rem;
    background-color: #fff;
    border-radius: 0.563rem;

    .latelyTitle {
      padding-top: 0.844rem;
      padding-left: 0.563rem;
      padding-right: 0.75rem;
      display: flex;
      justify-content: space-between;

      .c1 {
        font-size: 0.875rem;
        color: #333;
      }

      .c2 {
        color: #999;
        font-size: 0.813rem;
      }
    }

    .LatelyProjectList {
      padding-left: 0.563rem;
      padding-right: 0.75rem;
      border-bottom: 0.031rem solid #ededed;
    }

    .addProjectIcon {
      height: 2.563rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fe5d5a;
      font-weight: bold;
    }
  }

  .otherItems {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .otherItem {
      margin-top: 0.875rem;
      display: flex;
      align-items: center;
      width: 10.531rem;
      height: 3.75rem;
      background-color: #fff;
      border-radius: 0.563rem;
      padding-left: 1.25rem;

      .icon_img {
        width: 1.875rem;
        height: 1.875rem;

        img {
          width: 1.875rem;
        }
      }

      .name {
        padding-left: 0.625rem;
        font-size: 0.875rem;
        color: #1a1a1a;
      }
    }
  }
}

.cursor {
  width: 3.188rem;
  height: 3.188rem;
  border-radius: 100%;
  position: fixed;
  bottom: 5.438rem;
  right: 50%;
  transform: translateX(10rem);
  color: #fff;
  background-image: linear-gradient(132deg, #fe7575 0%, #fc3d3d 100%), linear-gradient(#7f5e5e, #7f5e5e);
  background-blend-mode: normal, normal;
  box-shadow: 0 0.125rem 0.5rem 0.125rem rgba(90, 14, 14, 0.24);
  transition: 0.5s;

  &:active {
    transform: translateX(10rem) scale(0.9);
  }

  img {
    width: 3.188rem;
    height: 3.188rem;
  }
}
</style>
