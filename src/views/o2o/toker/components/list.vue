<template>
  <div id="list" style="">
    <!-- 单次使用 -->
    <div class="onece" v-if="activeNum == 0 && datas.member_once">
      <div style="background-color: #fff; border-radius: 0.47rem;">
        <div class="oneceList" v-for="(item, index) in datas.member_once" :key="index">
          <div class="img">
            <img :src="item.full_img_url" alt="" />
          </div>
          <div class="rightBox">
            <div class="title">{{ item.name }}</div>
            <div class="bottom">
              <div class="bLeft">
                <div class="num">
                  数量：<span>{{ item.quantity }}</span>
                </div>
                <div class="status">{{ datas.once_write_off == 0 ? "未使用" : "已使用" }}</div>
              </div>
              <div class="bRightImg" v-if="datas.once_write_off == 1">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/tokerExchange@3x.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="font-size: 0.75rem; color: #666; text-align: left; margin-top: 1.16rem;" v-show="datas.once_write_off == 1 && datas.use_time">使用时间：{{ datas.use_time }}</div>
    </div>
    <!-- 多次使用 -->
    <div class="is_two" v-if="activeNum == 1">
      <div class="wirbox" v-for="(item, index) in datas.member_many" :key="index" style="margin-bottom: 0.63rem; background-color: #fff;">
        <div class="oneceList" style="background-color: #fff; border-radius: 0.47rem;">
          <div class="img">
            <img :src="item.full_img_url" alt="" />
          </div>
          <div class="rightBox">
            <div class="title">{{ item.name }}</div>
            <div class="bottom">
              <div class="bLeft">
                <div class="num">
                  数量:<span>{{ item.quantity }}</span>
                </div>

                <div class="status" v-show="item.rest_num > 0">未使用{{ item.rest_num }}</div>
                <div class="status" @click.stop="item.cheacked = !item.cheacked" v-show="item.write_off_num > 0">
                  已使用{{ item.write_off_num }}
                  <i class="iconfont icon-member-bottom" v-if="!item.cheacked"></i>
                  <i class="iconfont icon-member-top" v-if="item.cheacked"></i>
                </div>
              </div>
              <div class="bRightImg" v-if="item.rest_num == 0">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/tokerExchange@3x.png" alt="" />
              </div>
              <span class="twoTips" v-if="item.rest_num > 0 && item.single_consumption">一次使用{{ item.single_consumption }}张以上</span>
            </div>
          </div>
        </div>
        <div class="conceal" v-if="item.cheacked">
          <div class="hoursUse" v-for="(itemkey, ind) in item.use_time" :key="ind">使用时间：{{ itemkey }}</div>
        </div>
      </div>
    </div>
    <!-- <div style="height: 3rem; width: 100%;"></div> -->
  </div>
</template>
<script>
export default {
  props: ["datas", "activeNum"],
  data() {
    return {
      coupon_list: [],
      useStatus: false
    };
  },
  activated() {
    console.log(this.datas);
  },
  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.is_two {
  padding: 0 0.94rem;

  .conceal {
    margin: 0 0.75rem;
    border-top: 1px solid #eceaea;
    padding: 0.66rem 0;
    // height: 3.59rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;

    .hoursUse {
      font-size: 0.75rem;
      color: #999;
      line-height: 1.5rem;
    }
  }

  .oneceList {
    padding: 0.75rem 1.25rem 0.75rem 0.91rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .img {
      width: 3.59rem;
      height: 3.59rem;
      background-color: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .rightBox {
      flex: 1;
      height: 3.59rem;
      margin-left: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;

      .title {
        text-align: left;
        font-size: 0.81rem;
        line-height: 0.94rem;
      }

      .bottom {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        justify-content: space-between;

        .twoTips {
          font-size: 0.63rem;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .bLeft {
          display: flex;
          flex: 1;
          align-items: center;

          .status {
            color: #f15353;
            margin-right: 0.3rem;
            white-space: nowrap;
            display: flex;
            align-items: center;
          }

          .status:last-child {
            margin-right: 0;
          }

          .num {
            color: #999;
            white-space: nowrap;
            margin-right: 0.3rem;

            span {
              // margin-left: 0.2rem;
            }
          }
        }

        .bRightImg {
          // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/tokerExchange@3x.png');
          width: 2.34rem;
          height: 2.38rem;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}

.onece {
  padding: 0 0.94rem;

  .oneceList {
    padding: 0.75rem 1.25rem 0.75rem 0.91rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;

    .img {
      width: 3.59rem;
      height: 3.59rem;
      background-color: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .rightBox {
      flex: 1;
      height: 3.59rem;
      margin-left: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        text-align: left;
        font-size: 0.81rem;
        line-height: 0.94rem;
      }

      .bottom {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        justify-content: space-between;

        .twoTips {
          font-size: 0.63rem;
          color: #666;
        }

        .bLeft {
          display: flex;

          .status {
            color: #f15353;
            margin-left: 0.5rem;
          }

          .num {
            color: #999;

            span {
              // margin-left: 0.2rem;
            }
          }
        }

        .bRightImg {
          // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/tokerExchange@3x.png');
          width: 2.34rem;
          height: 2.38rem;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            right: -0.62rem;
            bottom: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
