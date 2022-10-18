<template>
  <div class="wrapper">
    <c-title text="兑换流量值"></c-title>
    <div class="surplus">当前流量值：{{ flow }}</div>
    <div class="exchange">
      <div class="explain">
        <span>兑换积分数量</span>
        <span class="num">当前剩余积分：{{ points }}</span>
      </div>
      <div class="input">
        <input type="number" v-model="exchangeCounts" />
      </div>
      <div class="desc">注：1流量值等于{{ exchangeRatio }}积分</div>
      <div
        class="points-comsumed"
        :style="{ visibility: exchangeCounts ? 'visible' : 'hidden' }"
      >{{ pointsComsumed }}</div>
      <div class="btn" @click="exchangeFlow">兑换</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flow: 0,
      points: 0,
      exchangeRatio: 0,
      exchangeCounts: 0,
      pointsComsumed: 0
    };
  },
  mounted() {
    this.fun.setWXTitle("兑换流量值");
    this.getUserStreamDetail();
  },
  methods: {
    getUserStreamDetail() {
      let loading = this.$toast.loading({
        duration: 0,
        overlay: true
      });
      $http.get("plugin.new-media-advertising.frontend.stream.exchange-stream-page").then(({ data: { points, stream, stream_eq_points } }) => {
        loading.clear();
        this.flow = stream;
        this.points = points;
        this.exchangeRatio = stream_eq_points;
      }).catch(() => {
        loading.clear();
      });
    },
    exchangeFlow() {
      if (isNaN(this.exchangeCounts) || this.exchangeCounts < 1) {
        this.$toast("兑换的流量数量必须大于1");
        return;
      }
      let exchangeLoading = this.$toast.loading({
        message: "兑换中",
        duration: 0,
        overlay: true
      });
      $http.post("plugin.new-media-advertising.frontend.stream.exchange-stream", {
        stream: this.exchangeCounts
      }).then(res => {
        exchangeLoading.clear();
        if (res.result == 0) {
          this.$toast(res.msg);
          return;
        }
        this.points -= Number(this.exchangeCounts) * this.exchangeRatio;
        this.flow += Number(this.exchangeCounts);
        this.$toast("兑换成功");
      }).catch(()=>{
        exchangeLoading.clear();
        this.$toast("服务器错误");
      });
    }
  },
  watch: {
    exchangeCounts(newV) {
      let counts = Number(newV) * this.exchangeRatio;
      if (counts > this.points) {
        this.pointsComsumed = "积分不足";
      } else {
        this.pointsComsumed = "需要消耗" + counts + "积分";
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 0.7rem 0.75rem;
  text-align: left;
}

.surplus {
  font-size: 1.2rem;
  color: #333;
}

.exchange {
  width: 100%;

  /* height: 11rem; */
  margin-top: 0.75rem;
  padding: 1.025rem 1.55rem 0.625rem;
  background-color: #fff;
  box-shadow: 0 0.05rem 0.2rem 0 rgba(7, 11, 33, 0.11);
  border-radius: 0.25rem;
}

.exchange .explain {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
}

.exchange .explain .num {
  margin-left: 0.525rem;
  font-size: 0.8rem;
  color: #f15353;
}

.exchange .input {
  margin-top: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 0.025rem solid rgba(245, 245, 245);
}

.exchange .input input {
  width: 100%;
  font-size: 1.275rem;
  color: #333;
  border: none;
}

.exchange .desc {
  color: #888;
  margin-top: 0.475rem;
  font-size: 0.575rem;
}

.exchange .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 1.95rem;
  margin-top: 1rem;
  font-size: 0.775rem;
  color: #fff;
  background-image:
    linear-gradient(#f15353, #f15353),
    linear-gradient(#4d1717, #4d1717);
  background-blend-mode: normal, normal;
  border-radius: 0.3rem;
}

.points-comsumed {
  margin-top: 0.1rem;
  color: #f15353;
  font-size: 0.575rem;
  visibility: hidden;
}
</style>