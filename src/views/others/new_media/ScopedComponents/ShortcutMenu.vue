<template>
  <d-fixed-container :right="right" :bottom="bottom">
    <ul class="shortcut-menu">
      <li
        class="shortcut-menu-item"
        v-for="navItem in navs"
        :key="navItem.text"
        @click="toPage(navItem)"
        v-if="navItem.hidden===false"
      >
        <i class="iconfont" :class="[navItem.icon]"></i>
        {{ navItem.text }}
      </li>
    </ul>
  </d-fixed-container>
</template>

<script>
import DFixedContainer from "../../../../components/other/common/DFixedContainer.vue";
export default {
  props: {
    right: {
      type: String,
      default: "1.9rem"
    },
    bottom: {
      type: String,
      default: "6.06rem"
    },
    navs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    toPage({ link, query }) {
      this.$router.push(this.fun.getUrl(link, {}, query || {}));
    }
  },
  components: {
    DFixedContainer
  }
};
</script>

<style scoped>
.shortcut-menu {
  display: inline-block;
  float: right;

  /* padding: 0.42rem 0.66rem 0.52rem; */
  color: white;
  border-radius: 2rem;
  background-color: #f4a00e;
}

.shortcut-menu-item {
  display: inline-block;
  vertical-align: middle;
  padding: 0.42rem 0.66rem 0.52rem;
  user-select: none;
  cursor: pointer;
  font-size: 0.69rem;
}

.shortcut-menu-item i {
  vertical-align: bottom;
}

.shortcut-menu-item:not(:last-child) {
  padding-right: 0;
}

.shortcut-menu-item:not(:last-child)::after {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.6rem;
  width: 0.06rem;
  height: 0.94rem;
  background-color: #f9d79c;
}

.shortcut-menu-item:active {
  filter: brightness(85%);
}
</style>