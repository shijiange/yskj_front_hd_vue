<template>
  <div id="auction_record" ref="auction_record">
    <c-title :hide="false" text="竞拍记录"></c-title>
    <div class="content">
      <div class="record-list">
        <div class="list" v-for="(item,index) in datas" :key="index">
          <div class="item-top">
            <div class="name">
              <div class="avator" v-if="item.has_one_member">
                <img :src="item.has_one_member.avatar">
              </div>
              <div class="nick">
                {{item.has_one_member.nickname}}
              </div>
            </div>
            <div style="color: #f22121; flex: 1;" v-if="item.status==1">当前最高</div>
            <div style="color: #999; flex: 1;" v-if="item.status==-1">出局</div>
            <div style="flex: 0 0 8rem;"><span>{{item.created_at}}</span></div>
          </div>
          <div class="item-bottom">
            <div style="color: #f22121; flex: 1; text-align: left;">{{$i18n.t("money")}}{{item.price}}</div>
            <div style="flex: 1; text-align: right;" v-if="item.status==1">{{item.number}}次出价</div>
            <div style="flex: 1; color: #999; text-align: right;" v-if="item.status==-1">{{item.number}}次出价</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auction_record_controller from "./auction_record_controller";

export default auction_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #auction_record {
    background-color: #fff;
    min-height: 100vh;

    .content {
      background: #fff;
      padding: 0 0.75rem;
      width: 100%;

      .record-list {
        margin-top: 1rem;

        .list {
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #eee;

          .item-top,
          .item-bottom {
            width: 100%;
            display: flex;
            align-items: center;
            font-size: 12px;
          }

          .item-top {
            padding-bottom: 0.5rem;
          }

          .item-bottom {
            justify-content: space-between;
          }

          .name {
            flex: 0 0 8rem;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;

            .avator {
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
              margin-right: 0.25rem;
              display: flex;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .nick {
              font-size: 12px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: flex;
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
