<template>
  <div class="LatelyProjectItem">
    <div class="face">
      <img src="https://p1.ssl.qhimgs1.com/sdr/400__/t0133a84c57d3e996f1.jpg" alt="" />
    </div>
    <div class="leftc">
      <div class="c1">
        <div class="span">待拼单</div>
        <div class="see" v-if="false">查看</div>
        <div class="ope" @click="alertOpe" v-if="true">
          <div class="opeConSeat" :class="[opeConShow ? 'selected' : '']">
            <div class="opeCon" ref="opeCon" :class="[opeConShow ? 'selected' : '']">
              <div class="dianzan" @click.stop="editProject">编辑</div>
              <div class="pinglun" @click.stop="delProject">删除</div>
            </div>
          </div>
        </div>
      </div>
      <div class="c2 cc">宦一晓 | 不吐葡萄皮的葡萄</div>
      <div class="c3 cc">预约项目：整体脸部整形套餐 内含好多哈哈</div>
      <div class="c4 cc">发布时间：2020.08.26 15:14:25</div>
      <div class="c5 cc">
        预约金额：<span class="price">{{ $i18n.t("money") }}25458.00</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opeConShow: false
    };
  },
  mounted() {
    document.addEventListener("touchstart", e => {
      let tree = this.$refs.opeCon;
      if (tree) {
        if (!tree.contains(e.target)) {
          this.opeConShow = false;
        }
      }
    });
  },
  methods: {
    alertOpe() {
      this.opeConShow = true;
    },
    editProject() {
      console.log("点击修改");
      this.opeConShow = false;
    },
    delProject() {
      console.log("点击删除");
      this.opeConShow = false;
      this.$emit("delProject");
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.LatelyProjectItem {
  padding: 0.75rem 0.875rem 0.75rem 0.688rem;
  padding-bottom: 0.75rem;
  display: flex;

  .face {
    width: 5.625rem;
    height: 5.625rem;
    background-color: #ededed;
    margin-top: 0.3rem;
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
    padding-left: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .c1 {
      width: 100%;
      display: flex;
      color: #303030;
      font-size: 0.938rem;
      justify-content: space-between;
      padding-right: 0.875rem;

      .see {
        letter-spacing: 0.038rem;
        color: #818181;
        font-size: 0.75rem;
      }

      .ope {
        width: 1.469rem;
        height: 1rem;
        background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_more@2x.png);
        background-size: 1.469rem 1rem;
        background-repeat: no-repeat;
        position: relative;

        .opeConSeat {
          position: absolute;
          right: 1.8rem;
          top: -0.3rem;
          height: 1.8rem;
          width: 0;
          overflow: hidden;
          transition: 0.3s;

          .opeCon {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 0;
            height: 1.8rem;
            color: #fff;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 0.3rem;
            position: absolute;
            transition: 0.3s;

            .dianzan {
              white-space: nowrap;
              flex: 1;
              height: 1.8rem;
              display: flex;
              justify-content: center;
              line-height: 100%;
              align-items: center;
            }

            .pinglun {
              white-space: nowrap;
              flex: 1;
              height: 1.8rem;
              display: flex;
              justify-content: center;
              line-height: 100%;
              align-items: center;
            }

            &.selected {
              width: 6rem;
            }
          }

          &.selected {
            width: 6rem;
          }
        }
      }
    }

    .cc {
      width: 15rem;
      text-align: left;
      font-size: 0.75rem;
      color: #767676;
      white-space: nowrap;
      line-height: 1.2rem;
      letter-spacing: 0.038rem;
      padding-right: 3rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      color: #fe6059;
    }
  }
}
</style>
