<template>
  <van-popup
    round
    position="center"
    style="width: 80%;"
    v-model="showPopup"
    @closed="closePopup"
    :z-index="zIndex"
    closeable
  >
    <div class="d-connect-service">
      <!-- // * 后期如需优化，如联系方式超过4个，请用循环 -->
      <ul class="connect-methods">
        <li class="connect-method_item" v-if="online">
          <a :href="online">
            <img class="connect-method_icon" src="../../../assets/images/kf_online_contect@2x.png" />在线联系
          </a>
        </li>
        <li class="connect-method_item" v-if="tel">
          <a :href="`tel:${tel}`">
            <img class="connect-method_icon" src="../../../assets/images/kf_tel_contect@2x.png" />
            <div class="connect-method-content van-ellipsis">{{ tel }}</div>
          </a>
        </li>
      </ul>
      <div class="connect-qrcode" v-if="qrcode">
        <van-image :src="qrcode"></van-image>
      </div>
      <!-- // * 后期如需优化，如联系方式超过4个，循环的话请用判断数组长度 -->
      <div class="connect-method-empty" v-if="!qrcode&&!tel&&!online">暂无联系方式~</div>
    </div>
  </van-popup>
</template>

<script>
import { Image as VanImage } from "vant";
export default {
  props: {
    zIndex: {
      type: Number,
      defalt: 2
    },
    show: {
      type: Boolean,
      default: false
    },
    qrcode: {
      type: String,
      default: null
    },
    online: {
      type: String,
      default: null
    },
    tel: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showPopup: false
    };
  },
  methods: {
    closePopup() {
      this.$emit("closed");
    }
  },
  watch: {
    show(newV) {
      this.showPopup = newV;
      if (newV) {
        this.$emit("opened");
      }
    }
  },
  components: {
    VanImage
  }
};
</script>

<style scoped>
.d-connect-service {
  padding: 3.1875rem 0;
}

.connect-methods {
  display: flex;
}

.connect-method_item {
  flex: 1;
  width: 50%;
  text-align: center;
}

.connect-method_item:nth-child(odd) {
  position: relative;
}

.connect-method_item:nth-child(odd)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 1px;
  height: 1.625rem;
  background-color: #999;
}

.connect-method_item:nth-child(odd):last-child::after {
  display: none;
}

.connect-method_icon {
  display: block;
  margin-bottom: 0.25rem;
  width: 2.625rem;
  object-fit: cover;
}

.connect-method-content {
  padding: 0 0.625rem;
}

.connect-qrcode {
  padding: 0 0.625rem;
  margin-top: 2rem;
}
</style>