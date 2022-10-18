<template>
  <div class="LatelyProjectItem">
    <div class="face">
      <img :src="item.release_avatar" alt="" />
    </div>
    <div class="leftc">
      <div class="c1">
        <div class="span">{{ statusArr[item.spell_type] }}</div>
        <div class="see" v-if="item.spell_type != 0" @click="gotoDetProject">查看</div>
        <div class="ope" @click="alertOpe" v-else>
          <div class="opeConSeat" :class="[opeConShow ? 'selected' : '']">
            <div class="opeCon" ref="opeCon" :class="[opeConShow ? 'selected' : '']">
              <div class="dianzan" @click="gotoEditProject">编辑</div>
              <div class="pinglun" @click="delProject">删除</div>
            </div>
          </div>
        </div>
      </div>
      <div class="c2 cc">发布者昵称：{{ item.release_nickname }}</div>
      <div class="c2 cc">客户姓名 | {{ item.project_full_name }}</div>
      <div class="c3 cc">预约项目：{{ subscribe }}</div>
      <div class="c4 cc">发布时间：{{ item.created_at }}</div>

      <div class="c5 cc" v-if="item.spell_type == 0">
        预约金额：<span class="price">{{ $i18n.t("money") }}{{ item.project_amount }}</span>
      </div>
      <div class="c5 cc" v-else>
        实际消费：<span class="price">{{ $i18n.t("money") }}{{ item.actual_amount }}</span>
      </div>

      <div class="c5 cc" v-if="item.next_amount">
        下个阶梯：<span class="price">￥{{ item.next_amount }}</span>
      </div>

      <div class="c5 cc" v-if="item.has_one_relation && item.has_one_relation.has_one_order">
        分红阶段：<span class="price">￥{{ item.has_one_relation.has_one_order.shell_amount }}</span>
      </div>

      <div class="c2 cc" v-if="item.collage_num && item.collage_num > 0">拼单次数：{{ item.collage_num }}</div>

      <div class="btnContainer" v-if="item.spell_type == 2 && power == 1">
        <div class="btn status_2" v-if="item.is_collage == 1">已加入</div>
        <template v-else>
          <div class="btn status_1" @click="addCollage" v-if="item.locking_type == 1">加入拼单车</div>
          <div class="btn status_3" v-if="item.locking_type == 0">加入拼单车</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {},
    power: {
      default: 0
    }
  },
  data() {
    return {
      opeConShow: false,
      statusArr: ["待拼单", "审核中", "拼单中", "已完成"]
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
  computed: {
    subscribe() {
      let str = "没有预约项目";
      let has_many_project_category = this.item.has_many_project_category;
      if (has_many_project_category.length != 0) {
        for (let i = 0; i < has_many_project_category.length; i++) {
          if (has_many_project_category[i].project_type == 1) {
            if (has_many_project_category[i].has_one_category && has_many_project_category[i].has_one_category.name) {
              str = has_many_project_category[i].has_one_category.name;
            }
          }
        }
      }
      return str;
    }
  },
  methods: {
    alertOpe() {
      this.opeConShow = true;
    },
    delProject() {
      this.$emit("delProject", this.item);
    },
    gotoDetProject() {
      this.$router.push(this.fun.getUrl("tacitDetproject", {}, { detId: this.item.id }));
    },
    gotoEditProject() {
      this.$router.push(this.fun.getUrl("tacitEditproject", {}, { detId: this.item.id }));
    },
    addCollage() {
      this.$emit("addCollage", this.item);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.LatelyProjectItem {
  padding: 0.75rem 0;
  display: flex;
  border-bottom: 0.031rem solid #ededed;

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
    // overflow: hidden;
    flex: 1;
    padding-left: 0.719rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .c1 {
      width: 100%;
      display: flex;
      color: #303030;
      font-size: 0.938rem;
      justify-content: space-between;

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
      padding-right: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      color: #fe6059;
    }

    .btnContainer {
      padding-top: 0.688rem;
      width: 100%;
      display: flex;
      justify-content: flex-end;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 0.875rem;

        &.status_1 {
          width: 5.5rem;
          height: 1.75rem;
          color: #fff;
          background-color: #fe5c5a;
        }

        &.status_2 {
          color: #fe5c5a;
          width: 4.25rem;
          height: 1.75rem;
          background-color: #fee;
        }

        &.status_3 {
          color: #fff;
          width: 5.5rem;
          height: 1.75rem;
          background-color: #c6c6c6;
        }
      }
    }
  }
}
</style>
