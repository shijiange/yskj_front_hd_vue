<template>
  <div id="cloud_index">
    <c-title :hide="false" :text="'会员中心'" :url="'home'"> </c-title>
    <div class="topMember">
      <div class="top">
        <div class="top_img">
          <img :src="avatar_image" alt="" />
        </div>
        <div class="name">{{ member.nickname }}</div>
      </div>
      <div class="bottom">
        <div>
          <div class="bottom_num">{{ member.total_deposit_stock }}</div>
          <div class="bottom_name">提货区总库存</div>
        </div>
        <div>
          <div class="bottom_num">{{ member.total_seal_stock }}</div>
          <div class="bottom_name">封存区总库存</div>
        </div>
      </div>
    </div>
    <div class="cenbox">
      <div class="li">
        <div class="lis" :style="{ backgroundImage: 'url(' + tu1 + ')' }" @click="goth"></div>
        <div class="lis" :style="{ backgroundImage: 'url(' + tu2 + ')' }" @click="goth"></div>
        <div class="lis" :style="{ backgroundImage: 'url(' + tu3 + ')' }" @click="gothdd"></div>
        <div class="lis" :style="{ backgroundImage: 'url(' + tu4 + ')' }" @click="gojd"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cloud_index_controller from './cloud_index_controller';

export default cloud_index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#cloud_index {
  .topMember {
    width: 100%;
    height: 9rem;
    background-image: url('../../../assets/images/cloudhybj1.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .top {
      display: flex;
      align-items: center;

      .top_img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin-left: 0.906rem;
        margin-top: 0.906rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .name {
        font-size: 1rem;
        color: #fff;
      }
    }

    .bottom {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .bottom_num {
        font-size: 1rem;
        line-height: 1.125rem;
        letter-spacing: 0.05rem;
        color: #fff;
      }

      .bottom_name {
        margin-top: 0.719rem;
        font-size: 0.75rem;
        color: #dcdcdc;
      }
    }
  }

  .cenbox {
    width: 100%;
    height: 14.719rem;
    background-color: #fff;

    .li {
      padding: 0.438rem 1.469rem 3.281rem 1.656rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .lis {
      width: 9.375rem;
      height: 4.375rem;
      border-radius: 0.313rem;
      // background-image: url('../../../assets/images/cloudthq2.png');
      background-size: cover;
      background-repeat: no-repeat;
      margin-top: 1.125rem;
    }
  }
}
</style>
