<template>
  <div>
    <div class="cell-item" v-for="(item, index) in expendList" :key="index">
      <div class="top-box">
        <div class="avatar">
          <img class="img" :src="item.member&&item.member.avatar_image||''" alt="" />
        </div>
        <div class="user-nick">
          <p class="name van-ellipsis">{{ item.member&&item.member.username||'' }}</p>
          <p class="user-id">ID：{{ item.member_id }}</p>
        </div>
        <div class="amount-statistics">
          <p class="amount">支出：{{ $i18n.t("money") }}{{ item.amount || 0 }}</p>
          <p class="time">{{ item.created_at }}</p>
        </div>
      </div>
      <van-divider></van-divider>
      <div class="remarks">{{ item.remark }}</div>
    </div>
    <yz-blank :datas="expendList" text="空空如也"></yz-blank>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  props: {
    expendList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },

  methods: {},

  components: { yzBlank }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$norFontSize: 14px;
$minFontSize: 12px;

.cell-item {
  padding: 0.56rem;
  background-color: #ffffff;
  border-radius: 0.313rem;
  margin-top: 1rem;
  .top-box {
    display: flex;
    justify-content: space-between;
    align-content: space-between;
  }

  @mixin flx {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .avatar {
    position: relative;
    img {
      width: 2.594rem;
      height: 2.594rem;
      border-radius: 50%;
    }
    .ranking {
      position: absolute;
      bottom: -0.3rem;
      left: 50%;
      transform: translateX(-50%);
      width: 2.594rem;
      padding: 0 0.2rem;
      color: #fff;
      font-size: $minFontSize;
      background-color: #ff5a5a;
      border-radius: 0.563rem;
    }
  }

  .user-nick {
    @include flx();
    flex: 1;
    text-align: left;
    margin-left: 0.67rem;
    .name {
      font-size: $norFontSize;
      max-width: 7rem;
      color: #292929;
    }
    .id {
      font-size: $minFontSize;
      color: #6b6b6b;
    }
  }

  .amount-statistics {
    @include flx();
    text-align: right;
    .amount {
      font-size: $norFontSize;
      font-weight: bold;
      color: #ff5a5a;
    }
    .time {
      font-size: $minFontSize;
      color: #8d8d8d;
    }
  }

  .remarks {
    font-size: 0.75rem;
    line-height: 1.25rem;
    color: #4a4a4a;
    text-align: left;
  }
}
</style>
