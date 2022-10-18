<template>
  <div>
    <c-title :text="title" :hide="true"></c-title>
    <div class="box">
      <i
        slot="icon"
        class="iconfont icon-cuowu"
		style="font-size: 4.25rem; color: #f15353;"
      ></i>
      <div class="title">
        <p>{{ message }}</p>
        <p>{{ blurst }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import cTitle from "components/title";

export default {
  data() {
    return {
      title: "ERROR!"
    };
  },
  computed: mapState(["message", "blurst"]),
  mounted() {
    this.$store.commit("MESSAGE", "404 Not Found！");
  },
  components: { cTitle }
};
</script>
<style scoped>
.box {
  width: 100%;
  position: absolute;
  text-align: center;
  top: 10%;
}

.title {
  font-size: 15px;
  color: #999;
}
</style>
