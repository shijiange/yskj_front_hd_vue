<template>
  <div class="upgrade-code">
    <c-title text="升级码"></c-title>
    <img
      src="../../../assets/images/member/upgrade_code/logo@2x.png"
      class="logo"
      srcset="../../../assets/images/member/upgrade_code/logo@3x.png 3x"
    />
    <d-list :loading="upgradeCodeLoading" :finished="upgradeCodeFinished" @load="loadUpgradeCode()">
      <ul class="codes-list">
        <li
          class="codes-item"
          v-for="(codeItem) in codeList"
          :key="codeItem.id"
          @click="viewCodesDetails(codeItem)"
        >
          <div class="codes-content">
            <div class="codes-name">{{ codeItem.code.name }}</div>
            <div
              class="codes-level"
            >升级码等级：{{ codeItem._level_text }}</div>
            <div class="codes-footer">
              <span class="codes-remainder">剩余：{{ codeItem.num-codeItem.used_num }}个</span>
              <span class="codes-view">
                查看
                <i class="iconfont icon-member_right"></i>
              </span>
            </div>
          </div>
          <img
            src="../../../assets/images/member/upgrade_code/group_bgimg@2x.png"
            alt
            class="codes-item-bgimg"
            srcset="../../../assets/images/member/upgrade_code/group_bgimg@3x.png 3x"
          />
        </li>
      </ul>
    </d-list>
  </div>
</template>

<script>
import DList from "@/components/dlist";
import { Toast } from "vant";
export default {
  data() {
    return {
      codeList: [],
      upgradeCodeLoading: false,
      upgradeCodeFinished: false,
      upgradeCodePage: 1
    };
  },
  activated() {
    this.loadUpgradeCode();
  },
  methods: {
    viewCodesDetails(codeItem) {
      this.$router.push(
        this.fun.getUrl(
          "MemberUpgradeCodeGroupDetails",
          {},
          {
            codes_id: codeItem.id
          }
        )
      );
    },
    loadUpgradeCode() {
      if (this.upgradeCodeLoading === true || this.upgradeCodeFinished === true) {
        return;
      }
      this.upgradeCodeLoading = true;
      $http
        .post("plugin.upgrade-code.Frontend.controllers.list.index", {
          page: this.upgradeCodePage
        })
        .then(({ data, msg, result }) => {
          if (result === 0) {
            Toast.fail(msg);
            return;
          }
          const { data: upgradeCodeData, current_page, last_page } = data;
          if (upgradeCodeData.length === 0 || current_page === last_page) {
            this.upgradeCodeFinished = true;
          }
          for (const codeItem of upgradeCodeData) {
            codeItem['_level_text']="";
            if(codeItem['member_level']&&codeItem['dividend_level']){
              codeItem['_level_text']=codeItem['member_level']['level_name']+" + "+codeItem['dividend_level']['level_name'];
            }else if(codeItem['member_level']){
              codeItem['_level_text']=codeItem['member_level']['level_name'];
            }else if(codeItem['dividend_level']){
              codeItem['_level_text']=codeItem['dividend_level']['level_name'];
            }
          }
          this.codeList.push(...upgradeCodeData);
          this.upgradeCodeLoading = false;
          this.upgradeCodePage++;
        });
    }
  },
  components: {
    DList
  }
};
</script>

<style scoped>
.upgrade-code {
  margin-top: 0.19rem;
  min-height: calc(100vh - 0.19rem);
  background: white;
}

.logo {
  margin: 3.72rem auto 0;
  width: 7.56rem;
  height: 4.03rem;
}

.codes-list {
  margin-top: 1.78rem;

  /* padding: 0 1.09rem; */
}

.codes-item {
  position: relative;
  padding: 0.75rem 0.97rem 1.63rem 1.19rem;
  text-align: left;
}

@media screen and (min-width: 768px) {
  .codes-item {
    padding: 0.75rem 1.97rem 1.63rem 2.19rem;
  }
}

.codes-content {
  position: relative;
  z-index: 1;
}

.codes-name {
  font-size: 1.13rem;
  color: white;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
}

.codes-level {
  margin-top: 0.72rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  font-size: 0.94rem;
}

.codes-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1.47rem;
  font-size: 0.75rem;
  color: white;
}

.icon-member_right {
  font-size: 0.75rem;
}

.codes-item-bgimg {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>