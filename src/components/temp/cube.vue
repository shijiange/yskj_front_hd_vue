<template>
  <div id="cube"
       :style="{'background-color':datas.params.bgcolor}">
    <div style="line-height: 10.625rem; text-align: center; color: #999; font-size: 16px;"
         v-if="!hasCube(datas)">
      未设置魔方
    </div>
    <div class="inner">
      <table cellspacing="0"
             cellpadding="0"
             border="0"
             :class="[this.fun.getPhoneEnv() == 3?'pcStyle':'']">
        <tr v-for="(row,i) in datas.params.layout" :key="i">
          <template v-if="row.length !== 0">
            <td v-if="row && col.imgurl"
                v-for="(col, index) in row"
                style="vertical-align: top;"
                :rowspan="col.rows"
                :class="[col.classname, 'rows-'+col.rows, 'cols-'+col.cols]"
                :colspan="col.cols" :key="index">
              <div v-if="!col.isempty && col.imgurl"
                   class="img-box">
                <a :href="col.url|href_filters">
                  <img :src="col.imgurl"
                       style="width: 100%;">
                </a>
              </div>
            </td>

          </template>
          <td v-else
              :style="phoneType === 'IOS'?'':'max-height: 0;display: none'"></td>
        </tr>
      </table>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      mid: this.fun.getKeyByMid(),
      phoneType: ""
    };
  },
  props: ["datas"],
  mounted() {},
  created() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      this.phoneType = "IOS";
    } else if (/(Android)/i.test(navigator.userAgent)) {
      this.phoneType = "Android";
    } else {
      this.phoneType = "Android";
    }
  },
  activated() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      this.phoneType = "IOS";
    } else if (/(Android)/i.test(navigator.userAgent)) {
      this.phoneType = "Android";
    } else {
      this.phoneType = "Android";
    }
  },
  methods: {
    hasCube(item) {
      let has = false;
      let row = 0,
        col = 0;
      for (let i = row; i < 4; i++) {
        for (let j = col; j < 4; j++) {
          if (item.params.layout[i][j] && !item.params.layout[i][j].isempty) {
            has = true;
            break;
          }
        }
      }
      return has;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cube {
  a {
    font-size: 0;
    line-height: 0;
    width: 100%;
  }

  td {
    // width: 50%;
    div {
      // display:-webkit-box;
      display: flex;
    }
    // div:after{
    // 	content:"";
    // 	width:100%;
    // 	height:0;
    // 	display:inline-block;
    // 	overflow:hidden;
    // }
    // a{
    // 	display: inline-block;
    // }
  }

  .cols-1 {
    width: 25vw;
  }

  .cols-2 {
    width: 50vw;
  }

  .cols-3 {
    width: 75vw;
  }

  .pcStyle {
    .cols-1 {
      width: 25%;
    }

    .cols-2 {
      width: 50%;
    }

    .cols-3 {
      width: 75%;
    }
  }
}
</style>
