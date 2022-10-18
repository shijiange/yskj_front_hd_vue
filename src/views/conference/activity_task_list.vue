<template>
  <div id="all">
    <c-title :hide="false" text="活动任务"></c-title>

    <div>
      <div id="tool">
        <dt v-if="activityThumb"><img v-lazy="activityThumb" style="width: 100%; height: 9.375rem;" /></dt>
      </div>
      <van-cell-group :border="false" title="活动名称">
        <van-cell :border="false" center title-class="left-title">
          <span slot="title">{{ activityName }}</span>
        </van-cell>
      </van-cell-group>
      <van-cell-group :border="false" title="活动时间">
        <van-cell :border="false" center title-class="left-title">
          <span slot="title">{{ activityDate }}</span>
        </van-cell>
      </van-cell-group>
      <van-cell-group :border="false" title="活动介绍">
        <div id="activity_content" v-html="activityContent"></div>
      </van-cell-group>
    </div>

    <div style="height: 1.25rem;"></div>

    <van-cell-group :border="false" title="活动任务">
      <van-collapse v-model="activeName" accordion :border="false">
        <van-collapse-item
          :name="i"
          :border="false"
          :title="item.title"
          v-for="(item, i) in activityTask"
          :key="i"
          title-class="coll-left"
        >
          <div>
            <van-cell-group :border="false" title="任务进度">
              <van-cell
                :border="false"
                center
                title-class="left-title"
                v-for="(reward, i) in item.reward_detail.condition"
                :key="i"
              >
                <span slot="title">{{ reward.content }}</span>
                <van-checkbox slot="default" v-model="reward.status" disabled>{{ reward.status_name }}</van-checkbox>
              </van-cell>
            </van-cell-group>

            <van-cell-group :border="false" title="任务奖励">
              <van-cell :border="false" center title-class="left-title">
                <van-field
                  v-model="item.reward_detail.reward_content"
                  rows="3"
                  autosize
                  readonly
                  type="textarea"
                  maxlength="100"
                  placeholder="请输入留言"
                  show-word-limit
                />
              </van-cell>
            </van-cell-group>
            <div style="height: 0.625rem;"></div>
            <van-button size="large" type="primary" class="aggre_btn_disabled" v-if="item.reward_status == 0"
              >领取奖励</van-button
            >
            <van-button
              size="large"
              type="primary"
              v-if="item.reward_status == 1"
              style="background: #07c160; margin: 0.5rem auto; width: 90%;"
              @click.native="getReceive(item.id)"
              >领取奖励</van-button
            >
            <van-button size="large" type="primary" class="aggre_btn_disabled" v-if="item.reward_status == 2"
              >已领取奖励</van-button
            >
            <div style="height: 1.25rem;"></div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>
  </div>
</template>

<script>
import activity_task_list_controller from './activity_task_list_controller';
export default activity_task_list_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/member.scss';

.aggre_btn_disabled {
  width: 90%;
  margin: 0.5rem auto;
  background-color: #ccc;
  color: #f0f0f0;
  font-size: 15px;
  height: 45px;
  border-radius: 3px;
  border: none;
}

#tool ul li {
  width: 100% !important;
}

#activity_content {
  padding: 0.625rem;
  font-size: 14px;
  background: #fff;
}

.title {
  flex: 2;
  background: #fff;
  height: 2.8125rem;
  line-height: 2.8125rem;
}

.info {
  height: 2.8125rem;
  flex: 8;
  width: vw;
  line-height: 2.8125rem;
  background: #fff;
}

.yd-cell-box {
  margin-bottom: 0 !important;
}

.yd-btn-block {
  margin-top: 0.1875rem;
}

.checkbox {
  background: #fff;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 0.0625rem solid #ece9e9;
}

.van-cell-group__title {
  padding: 2.5px 12px 5px;
  text-align: left;
}

.left-title {
  text-align: left;
  color: #555;
}

.van-collapse {
  /deep/.coll-left {
    text-align: left;
  }

  /deep/.van-checkbox {
    float: right;
  }

  /deep/.van-field {
    padding: 0;

    textarea {
      color: #555;
    }
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
