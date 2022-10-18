<template>
  <div class="DonateIndex">
    <c-title text="债权人绑定债务人"></c-title>
    <div class="DonateIndexSta" :class="[show ? 'iconNone' : 'iconshow']" v-if="!show">
      <i class="iconfont" :class="[bindStatus ? 'icon-all_select_active' : 'icon-all_filldelete']"></i>
      <div class="resoveStatus">{{ bindStatus ? "绑定成功" : bindErrorTxt?bindErrorTxt:'绑定失败' }}</div>
    </div>
    <div class="donate" :class="[!show ? 'inTO' : '']">
      <div class="user">
        <div class="userimg">
          <img :src="imageUse" alt="" />
        </div>
        <span class="text">{{ nickname }}</span>
      </div>
      <div class="line"></div>
      <div class="bind">
        <span class="vuser">绑定债务人</span>
        <van-field v-model="mobile" label="" placeholder="请输入债务人手机号" @input="getUser" />
      </div>
      <div class="person" v-if="memberShow && member">
        <div class="personImg">
          <img :src="member.avatar_image" alt="" />
        </div>
        <span class="perName">{{ member.username }}</span>
      </div>
      <div class="person" style="font-size: 0.69rem; color: #7b7b7b;" v-else-if="!memberShow">未找到该会员</div>
    </div>
    <div class="btn" @click="bindYzUser">绑定</div>
    <div class="btn" style="margin-top: 1rem; background: #999;" @click="gohome">不绑定，进入商城</div>
  </div>
</template>

<script>
import DonateIndex_controller from "./DonateIndex_controller";

export default DonateIndex_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.iconshow {
  animation: ident 5s;
}

@keyframes ident {
  0% {
    opacity: 0;
    height: 0%;
  }

  50% {
    opacity: 0.75;
    height: 50%;
  }

  100% {
    opacity: 1;
    height: 100%;
  }
}

.iconNone {
  // display: none;
  opacity: 0;
}

.inTO {
  transform: translateY(1.72rem);
  transition: 3s;
}

.DonateIndex {
  min-height: 100vh;
  background: #fff;

  .DonateIndexSta {
    // opacity: 0;
    margin: 0 auto;
    margin-top: 1.66rem;
    // margin-bottom: 3.19rem;
    .iconfont {
      font-size: 3rem;
      color: #f15353;
      border-radius: 100%;
    }

    .resoveStatus {
      font-size: 0.75rem;
      color: #4f4f4f;
    }
  }

  .btn {
    margin: 0 auto;
    width: 20.31rem;
    height: 2.5rem;
    background-color: #f15353;
    border-radius: 0.31rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fffffe;
    font-size: 0.94rem;
    margin-top: 3.88rem;
  }

  .donate {
    width: 20.63rem;
    // height: 11.88rem;
    background-color: #fff;
    box-shadow: 0 0.07rem 0.6rem 0 rgba(216, 216, 216, 0.69);
    border-radius: 0.47rem;
    margin: 0 auto;
    margin-top: 1.09rem;
    padding: 0 1.09rem;
    box-sizing: border-box;
    padding-top: 1.09rem;
    padding-bottom: 0.81rem;

    .person {
      display: flex;
      align-items: center;
      margin-top: 0.81rem;

      .personImg {
        width: 1.41rem;
        height: 1.41rem;
        background-color: #cbc9c9;
        margin-right: 0.41rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .perName {
        font-size: 0.69rem;
      }
    }

    .bind {
      text-align: left;

      .vuser {
        font-size: 0.81rem;
        color: #333;
      }
    }

    .user {
      display: flex;
      align-items: center;

      .userimg {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #cbc9c9;
        border-radius: 100%;
        margin-right: 0.69rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .text {
        flex: 1;
        overflow: hidden;
        text-align: left;
        font-size: 1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .line {
      width: 18.44rem;
      height: 0.03rem;
      background-color: #f1f1f1;
      margin: 1.09rem 0;
    }
  }
}
</style>
