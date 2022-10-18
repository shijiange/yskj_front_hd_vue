<!-- 社区团购组件
描述：1.当链接没有自提点信息时，根据定位显示最近的自提点；
      2.当有自提点信息时，切换到该自提点，并影响：
        a.分类页（该分类页面只显示自提点关联的供应商的商品和平台商品（包含聚合供应链商品），
          其他供应商商品不显示，没有关联自提点的供应商商品也不显示。）
        b.下单页数据（下单自提点自动选择到首页显示的自提点） -->
<template>
  <div class="component-selfpick" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="selfpick-box" @click.stop="gotoUrl">
      <i class="iconfont icon-fontclass-dianpu"></i>
      <div class="name">{{ deliverInfo.deliver_name }}</div>
      <template v-if="!deliverInfo.loading">
        <div class="line"></div>
        <div style="font-size: 12px;">切换</div>
        <i class="iconfont icon-member_right"></i>
      </template>
    </div>
  </div>
</template>

<script>
// 自定义样式
const css = function() {
  const { font_color, preview_color } = this.datas;

  return `
        .component-${this.id} .selfpick-box {
            color: ${font_color || "#f8f8f8"};
            background-color: ${preview_color.color};
            background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""})
        }
    `;
};

export default {
  props: ["id", "datas", "styles"],
  data() {
    return {
      activeID: 0,
      deliverInfo: {
        deliver_name: "正在获取中...",
        loading: true //正在获取数据
      }
    };
  },

  mounted() {
    let deliverIDStorage = sessionStorage.getItem("deliverId") || null; //获取当前会话是否存储了自提点id
    let _href = window.location.href; //当前链接
    if (deliverIDStorage) {
      // 当前会话有存储自提点id（可能是链接上储存起来有或者通过手动切换了自提点）
      console.log("当前会话有存储自提点id", this.activeID, deliverIDStorage);
      this.activeID = deliverIDStorage;
    } else if (_href.indexOf("deliverId") > -1) {
      //sessionStorage没有记录，判断是否链接上有
      let _dID = this.fun.getKey("deliverId"); //获取链接上的参数，自提点id
      window.sessionStorage.setItem("deliverId", _dID); //储存到sessionStorage
      this.activeID = _dID;
    }

    this.fun
      .getLocation()
      .then(res => {
        this.getNowPackageDeliver(res.point.lat, res.point.lng);
      })
      .catch(err => {
        this.deliverInfo["deliver_name"] = "获取不到定位,请手动切换选择！";
        this.deliverInfo.loading = false;
        console.log("U_selfpick 定位error：：", err);
      });
  },

  components: {},

  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },

  methods: {
    gotoUrl() {
      if (this.deliverInfo.loading) {
        return;
      }
      this.$router.push(this.fun.getUrl("selectSelfPickupPoint", { tag: 1, deliverId: this.activeID }));
    },
    getNowPackageDeliver(lat, lng) {
      //获取自提点信息
      let _json = {
        lng: lng || "",
        lat: lat || ""
      };
      if (this.activeID) {
        _json.deliver_id = this.activeID;
      }
      $http.get("plugin.package-deliver.frontend.decorate-deliver.getNowPackageDeliver", _json).then(
        response => {
          this.deliverInfo.loading = false;
          if (response.result === 1) {
            this.deliverInfo = response.data;
            window.sessionStorage.setItem("deliverId", response.data.id); //储存到sessionStorage
            this.$emit("refresh", { type: "selfpick" });
          } else {
            this.$toast(response.msg);
            this.deliverInfo["deliver_name"] = "请手动切换选择！";
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.component-selfpick {
  .selfpick-box {
    // background: #ebebeb;
    display: flex;
    align-items: center;
    height: 2.75rem;
    line-height: 2.75rem;
    padding: 0 0.875rem;
    font-size: 14px;

    .name {
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-fontclass-dianpu {
      font-size: 24px;
      margin-right: 0.25rem;
    }

    .line {
      width: 1px;
      height: 0.625rem;
      background: #9f9e9e;
      margin: 0 0.5rem;
    }
  }
}
</style>
