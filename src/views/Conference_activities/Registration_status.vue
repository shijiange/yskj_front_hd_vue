<template >
  <div id="Registration">
    <c-title :hide="false"
             :text="`报名情况(合计:${total}人)`"></c-title>
    <div class="Registration-content"
         v-if="Registration.length>0">
        <van-pull-refresh v-model="isPullLoad" @refresh="loadTop" success-text="刷新成功">
          <d-list
            @load="getMoreData"
            :loading="isLoading"
            :finished="!isLoadMore"
          >
            <div v-for="(item,index) in Registration" :key="index">
              <div class="list_box"
                  v-if="item.has_one_order.status>=1&&item.has_one_order">
                <div class="box">
                  <div class="user">
                    <div class="user-avator" v-if="item.has_one_member">
                      <img :src="item.has_one_member.avatar_image">
                    </div>
                    <span class="name" v-if="item.has_one_member">{{item.has_one_member.nickname}}</span>
                  </div>
                  <p class="time"><span class="calender">{{item.created_at}}</span></p>
                </div>
              </div>
            </div>
          </d-list>
      </van-pull-refresh>
    </div>
    <div class="blank"
         v-if="Registration.length<=0">
      <img src="../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>
  </div>
</template>
<script>
import Registration_statuscontroller from "./Registration_statuscontroller";
export default Registration_statuscontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#Registration {
  .Registration-content {
    background-color: #fff;
    padding-bottom: 0.5rem;

    .list_box {
      padding: 0 0.5rem;

      .box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #ccc;
        padding: 0.5rem 0;

        .user {
          display: flex;
          align-items: center;

          .user-avator {
            height: 3.25rem;
            width: 3.25rem;
            background: #fff;
            border-radius: 50%;
            border: 0.125rem solid #fff;
            box-sizing: border-box;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            margin-left: 5px;
          }
        }

        .time {
          display: flex;

          .clock {
            margin-left: 5px;
          }
        }
      }
    }

    .list_box:last-of-type .box {
      border-bottom: none;
    }
  }

  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }
}
</style>