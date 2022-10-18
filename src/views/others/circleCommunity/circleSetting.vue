<template>
  <div id="circleSetting">
    <c-title :hide="false" text="圈子设置"></c-title>
    <div class="h2">基础设置</div>
    <div class="itemWrapper" @click="editData(id)">
      <div class="item">
        <div class="name">编辑资料</div>
        <div class="msg">{{ name }}</div>
        <van-icon name="arrow" color="#717171" />
      </div>
    </div>
    <div class="itemWrapper" @click="memberMember(id)">
      <div class="item">
        <div class="name">成员管理</div>
        <div class="msg">{{ member_count }}</div>
        <van-icon name="arrow" color="#717171" />
      </div>
    </div>
    <div class="itemWrapper" @click="audit(id)">
      <div class="item">
        <div class="name">审核列表</div>
        <div class="msg">审核列表</div>
        <van-icon name="arrow" color="#717171" />
      </div>
    </div>
    <div class="h2">权限设置</div>
    <div class="itemWrapper">
      <div class="item">
        <div class="name">成员加入时是否需要审核</div>
        <div class="switch">
          <van-switch
            active-color="#3175fe"
            v-model="is_review_member"
            :active-value="1"
            :inactive-value="0"
            size="20"
            @change="setPermission('review_member')"
          />
        </div>
      </div>
    </div>
    <div class="itemWrapper">
      <div class="item">
        <div class="name">圈子可以被搜索到</div>
        <div class="switch">
          <van-switch
            active-color="#3175fe"
            v-model="is_search"
            :active-value="1"
            :inactive-value="0"
            size="20"
            @change="setPermission('search')"
          />
        </div>
      </div>
    </div>
    <div class="itemWrapper">
      <div class="item">
        <div class="name">自由发言</div>
        <div class="switch">
          <van-switch
            active-color="#3175fe"
            v-model="is_posting"
            :active-value="1"
            :inactive-value="0"
            size="20"
            @change="setPermission('posting')"
          />
        </div>
      </div>
      <div class="desc">关闭后，普通成员无法发表帖子，只有圈主可以</div>
    </div>
    <div class="itemWrapper">
      <div class="item">
        <div class="name">成功发帖是否需要审核</div>
        <div class="switch">
          <van-switch
            active-color="#3175fe"
            v-model="is_review_invitation"
            :active-value="1"
            :inactive-value="0"
            size="20"
            @change="setPermission('review_invitation')"
          />
        </div>
      </div>
      <div class="desc">关闭后，普通成员发表帖子不用审核</div>
    </div>
    <div class="itemWrapper">
      <div class="item">
        <div class="name">开发成员列表</div>
        <div class="switch">
          <!-- <switch style="transform: scale(0.8);" color="#3175fe" /> -->
          <van-switch
            active-color="#3175fe"
            v-model="is_open_member"
            :active-value="1"
            :inactive-value="0"
            size="20"
            @change="setPermission('open_member')"
          />
        </div>
      </div>
      <div class="desc">关闭后，普通成员无法查看圈子内的成员列表</div>
    </div>
    <div class="btns">
      <div class="btn" @click="createCircle">删除圈子</div>
    </div>
  </div>
</template>

<script>
import circleSetting_controller from "./circleSetting_controller";

export default circleSetting_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleSetting {
  .h2 {
    height: 2.2188rem;
    line-height: 2.2188rem;
    font-size: 0.75rem;
    font-weight: bold;
    color: #5c5c5c;
    padding-left: 0.8125rem;
    text-align: left;
  }

  .itemWrapper {
    background-color: #fff;
    padding: 0.7813rem 1rem;
    border-bottom: 0.0313rem solid #f2f2f2;
    text-align: left;

    /* display: flex;
	flex-direction: column;
	justify-content: center; */
    .item {
      display: flex;
      align-items: center;

      .name {
        font-size: 0.9375rem;
        font-weight: bold;
        color: #202020;
        flex: 1;
      }

      .msg {
        font-size: 0.75rem;
        font-weight: bold;
        color: #bbb;
        padding-right: 0.4688rem;
      }
    }

    .desc {
      font-size: 0.75rem;
      font-weight: bold;
      color: #999;
    }
  }

  .btns {
    height: 2.5rem;
    padding: 0 1.0938rem;
    margin-top: 1.25rem;

    .btn {
      height: 2.5rem;
      background-color: #3175fe;
      color: #fff;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9375rem;
    }
  }
}
</style>
