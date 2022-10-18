<!-- 微社区父组件入口 -->
<template>
  <div id="Microhome" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
    <ul class="nav-class set-pc-style">
      <!-- 底部导航栏 -->
      <router-link :to="fun.getUrl('MicroIndex', {})" tag="li"><i class="iconfont icon-home2" style=""></i> 社区首页</router-link>
      <router-link :to="fun.getUrl('microAttention', {})" tag="li"><i class="iconfont icon-heart"></i>关注</router-link>
      <router-link :to="fun.getUrl('microRelease', {})" tag="li"><img style="width: 2.25rem;" src="../../assets/images/micro_communities/tab_addition.png" alt=""/></router-link>

      <router-link :to="fun.getUrl('microhomepage', {})" tag="li"><i class="iconfont icon-fontclass-pingfen"></i>我的主页</router-link>
      <router-link :to="fun.getUrl('member', {})" tag="li"><i class="iconfont icon-gerenzhongxin"></i>会员中心</router-link>
    </ul>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Microhome.iphoneXStyle {
  padding-bottom: 4rem;

  .nav-class {
    padding-bottom: 24px;
    height: 4.5rem;
  }
}

#Microhome {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 40px;

  .nav-class {
    position: fixed;
    left: 0;
    bottom: 0;
    // height: 2.875rem;
    // line-height: 2.875rem;
    padding: 0.375rem 0;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 999;
    box-shadow: 0 -2px 4px 0 rgba(146, 146, 146, 0.1);

    li {
      height: 100%;
      width: 20%;
      display: flex;
      flex-direction: column;
      font-size: 10px;
      justify-content: center;
      align-items: center;

      span {
        width: 1.25rem;
        height: 1.25rem;
        display: inline-block;
        background-size: 1.25rem 1.25rem;
        background-repeat: no-repeat;
      }

      .iconfont {
        font-size: 22px;
        color: #b5b6b6;
      }

      .home-icon {
        background-image: url("../../assets/images/micro_communities/tab_index_normal.png");
      }

      .attention-icon {
        background-image: url("../../assets/images/micro_communities/tab_focous_normal.png");
      }

      .user-icon {
        background-image: url("../../assets/images/micro_communities/tab_my_normal.png");
      }

      .member-icon {
        background-image: url("../../assets/images/micro_communities/tab_member_normal.png");
      }
    }

    .active {
      color: #e35151;
      .iconfont {
        color: #e35151;
      }

      .home-icon {
        background-image: url("../../assets/images/micro_communities/tab_index_active.png");
      }

      .attention-icon {
        background-image: url("../../assets/images/micro_communities/tab_focus_active.png");
      }

      .user-icon {
        background-image: url("../../assets/images/micro_communities/tab_my_active.png");
      }

      .member-icon {
        background-image: url("../../assets/images/micro_communities/tab_member_active.png");
      }
    }
  }
}
</style>
