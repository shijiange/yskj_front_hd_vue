<template>
  <div class="page">
    <c-title text="拼单车"></c-title>
    <div class="listItems">
      <div class="item" v-for="(item, key) in listData" :key="key" @click="setLastItemKey(key)">
        <van-checkbox v-model="item.checkbox" @change="handClickCheckbox" :disabled="!item.checkbox && disabled" checked-color="#fe5c5a" icon-size="20px"></van-checkbox>

        <template v-if="item.project_shell_type == 2 || item.project_shell_type == 1">
          <div class="face">
            <img :src="item.release_avatar" alt="" />
          </div>
          <div class="leftc">
            <div class="c2 cc" v-if="item.project_shell_type == 2">发布者昵称：{{ item.release_nickname }}</div>
            <div class="c2 cc">客户姓名 | {{ item.project_full_name }}</div>
            <div class="c3 cc">预约项目：{{ subscribe(item) }}</div>

            <div class="c5 cc" v-if="item.spell_type == 0">
              预约金额：<span class="price">{{ $i18n.t("money") }}{{ item.actual_amount }}</span>
            </div>
            <div class="c5 cc" v-else>
              实际消费：<span class="price">{{ $i18n.t("money") }}{{ item.actual_amount }}</span>
            </div>

            <div class="c5 cc" v-if="item.next_amount">
              下个阶梯：<span class="price">{{ $i18n.t("money") }}{{ item.next_amount }}</span>
            </div>
          </div>
        </template>

        <template v-if="item.project_shell_type == 3">
          <div class="face">
            <img :src="item.shell_avatar" alt="" />
          </div>
          <div class="leftc">
            <div class="c2 cc">拼单者昵称：{{ item.shell_nickname }}</div>
            <div class="c5 cc">
              拼单金额：<span class="price">{{ $i18n.t("money") }}{{ item.shell_amount }}</span>
            </div>
            <div class="c3 cc" v-if="item.collage_num && item.collage_num > 0">拼单次数：{{ item.collage_num }}</div>
            <div class="c4 cc" style="display: flex;">
              释放时间：
              <template v-if="item.lock_update_at * 1000 - currentTime > 0">
                <van-count-down style="font-size: 0.75rem; color: #767676;" :time="item.lock_update_at * 1000 - currentTime" format="DD 天 HH 时 mm 分 ss 秒" />
              </template>
              <template v-else>
                已释放
              </template>
            </div>
            <div class="c4 cc">解锁时间：{{ item.lock_update_at | timestampToTime }}</div>
          </div>
        </template>
      </div>
    </div>

    <div class="botContainer">
      <!-- <van-checkbox v-model="selectAll" @click="handSelectAll" checked-color="#fe5c5a" icon-size="20px">全选</van-checkbox> -->
      <div class="info">
        <div class="count">
          合计：
          <span class="price">{{ $i18n.t("money") }}{{ price }}</span>
        </div>
        <div class="desc">预计佣金：{{ $i18n.t("money") }}{{ reward_amount }}</div>
      </div>
      <div class="confirm" @click="confirmCollage">确认拼单</div>
    </div>

    <van-popup v-model="alertShow" round>
      <div class="alertContainer">
        <template v-if="errorState == 0">
          <div class="tips">金额未达到，暂不能拼单</div>
          <div class="price">还差{{ errorPrice }}元就可以拼单呦~</div>
        </template>
        <template v-if="errorState == 2">
          <div class="tips">金额超标，暂不能拼单</div>
          <div class="price">减少{{ errorPrice }}元就可以拼单呦~</div>
        </template>

        <div class="btns">
          <div class="btn cancel" @click="alertShow = false">取消</div>
          <div class="btn goSinglepool" @click="$router.push(fun.getUrl('founderSinglepool'))">去拼单池</div>
        </div>
      </div>
    </van-popup>

    <div class="cursor" @click="$router.replace(fun.getUrl('collageIndex'))">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_button_bg@2x.png" alt="" />
    </div>
  </div>
</template>

<script>
import founderBicycleController from "./founder_bicycle_controller";

export default founderBicycleController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(246, 248, 252);
  min-height: 100vh;
  padding-bottom: 3.125rem;
}

.listItems {
  background: #fff;
}

.item {
  padding: 0.75rem 0 0.75rem 0.719rem;
  padding-bottom: 0.75rem;
  display: flex;
  border-bottom: 0.031rem solid #ededed;

  .face {
    margin-left: 1rem;
    width: 5.625rem;
    height: 5.625rem;
    background-color: #ededed;
    border-radius: 0.625rem;

    img {
      width: 5.625rem;
      height: 5.625rem;
      border-radius: 0.625rem;
      border: solid 0.031rem #a9a9a9;
    }
  }

  .leftc {
    flex: 1;
    padding-left: 0.719rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .cc {
      width: 14rem;
      text-align: left;
      font-size: 0.75rem;
      color: #767676;
      white-space: nowrap;
      line-height: 1.2rem;
      letter-spacing: 0.038rem;
      padding-right: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      color: #fe6059;
    }
  }
}

.botContainer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3.125rem;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.844rem;

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .count {
      color: #000;
      font-size: 0.75rem;

      .price {
        font-size: 0.875rem;
        color: #ff2c29;
      }
    }

    .desc {
      color: #767676;
      font-size: 0.688rem;
    }
  }

  .confirm {
    margin-left: 0.719rem;
    font-size: 0.875rem;
    width: 5.344rem;
    height: 2.313rem;
    line-height: 2.313rem;
    background-color: #fe5c5a;
    border-radius: 1.156rem;
    color: #fff;
  }
}

.alertContainer {
  width: 16.25rem;
  height: 11.188rem;

  .tips {
    padding-top: 2.219rem;
    color: #000;
    font-weight: bold;
    font-size: 1rem;
  }

  .price {
    margin-top: 0.812rem;
    color: #fe5c5a;
    font-size: 0.875rem;
  }

  .btns {
    padding: 0 1.875rem;
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 5.344rem;
      height: 2.125rem;
      border-radius: 1.063rem;
      font-size: 0.875rem;
      line-height: 2.125rem;

      &.cancel {
        color: #6e6f6f;
        background-color: #efefef;
      }

      &.goSinglepool {
        color: #fff;
        background-color: #fe5c5a;
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
