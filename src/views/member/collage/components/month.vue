<template>
	<div class="month">
		<div class="monthHeader">
			<i class="iconfont icon-back" @click="prevYear"></i>
			<div class="year">{{currentSelectedYear}}年</div>
			<i class="iconfont icon-back" @click="nextYear" v-if="currentSelectedYear!=maxYear" style="display: inline-block; transform: rotate(180deg);"></i>
		</div>
		<div class="monthContainer">
			<div class="monthItem" v-for="(item,key) in monthList" :key="key">
				<div class="span" :class="[(item.num==currentMonth && currentSelectedYear==currentYear) ? 'active' : '',item.enabled==true ? 'enabled' : '' ]" @click="selectedMonth(item)">{{item.num}}月</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
  data(){
    return {
      maxYear:0,
      maxMonth:0,
      currentYear:0,
      currentSelectedYear:0,
      currentMonth:0,
      monthList:[]
    };
  },
  mounted(){
    let date = new Date();
    this.currentSelectedYear = date.getFullYear();
    this.maxYear = date.getFullYear();
    this.currentYear = date.getFullYear();
    this.maxMonth = date.getMonth()+1;
    this.currentMonth = date.getMonth()+1;
    this.setMonthItem();
    this.$emit("selectedMonth",{year:this.currentYear,month:this.currentMonth});
  },
  methods:{
    prevYear(){
      this.currentSelectedYear--;
      this.setMonthItem();
    },
    nextYear(){
      this.currentSelectedYear++;
      this.setMonthItem();
    },
    selectedMonth(item){
      if(item.enabled==true) return;
      this.currentYear = this.currentSelectedYear;
      this.currentMonth = item.num;
      this.$emit("selectedMonth",{year:this.currentYear,month:this.currentMonth});
      console.log(this.currentYear,this.currentMonth);
    },
    setMonthItem(){
      this.monthList = [];
      let {maxYear,maxMonth,currentYear,currentMonth,currentSelectedYear} = this;
      console.log(maxYear,maxMonth,currentYear,currentMonth);
      for(let i=1;i<=12;i++){
        let o = {};
        if(i<10) o.num = '0'+i;
        else o.num=i;
        o.enabled  = false;
        if(currentSelectedYear>=maxYear){
          if(i>maxMonth){
            o.enabled = true;
          }
        }
        this.monthList.push(o);
      }
      console.log(this.monthList);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .month {
    width: 100%;
    height: 10rem;
    background: #fff;

    .monthHeader {
      height: 2rem;
      display: flex;
      padding: 0 1.5rem;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .year {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.875rem;
        color: #767676;
        font-weight: bold;
      }
    }

    .monthContainer {
      display: grid;
      grid-template-columns: repeat(4, 25%);
      grid-template-rows: repeat(3, 2.5rem);

      .monthItem {
        color: #666;
        font-size: 0.875rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;

        .active {
          width: 3.625rem;
          height: 1.656rem;
          line-height: 1.656rem;
          background-color: #fee;
          border-radius: 0.828rem;
          color: #ff2c29;
        }

        .enabled {
          color: #a2a2a2;
        }
      }
    }
  }
</style>