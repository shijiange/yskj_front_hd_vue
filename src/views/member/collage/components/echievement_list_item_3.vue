<template>
	<div class="wrapper">
		<div class="topInfo">
			<div class="c1">
				<span class="num">拼单编号: {{item.has_one_order.id}}</span>
				<span class="price">+{{item.price}}</span>
			</div>
			<div class="c2">
				{{item.has_one_order.created_at}}  拼单金额：{{item.has_one_order.shell_amount}}
			</div>
		</div>
		<div class="item" v-for="val in item.project" :key="val.id">
			<template v-if="val.project_shell_type==2 || val.project_shell_type==1">
				<div class="face">
					<img :src="val.release_avatar" alt="">
				</div>
				<div class="leftc">
					<div class="c2 cc" v-if="val.project_shell_type==2">发布者昵称：{{val.release_nickname}}</div>
					<div class="c2 cc">客户姓名 | {{val.project_full_name}}</div>
					<div class="c3 cc">预约项目：{{subscribe(val)}}</div>

					<div class="c5 cc" v-if="item.spell_type==0">预约金额：<span class="price">{{$i18n.t('money')}}{{item.project_amount}}</span></div>
					<div class="c5 cc" v-else >实际消费：<span class="price">{{$i18n.t('money')}}{{item.actual_amount}}</span></div>

					<div class="c5 cc" v-if="val.next_amount">下个阶梯：<span class="price">{{$i18n.t('money')}}{{val.next_amount}}</span></div>
				</div>
			</template>

			<template v-if="val.project_shell_type==3">
				<div class="face">
					<img :src="val.shell_avatar" alt="">
				</div>
				<div class="leftc">
					<div class="c2 cc">拼单者昵称：{{val.shell_nickname}}</div>
					<div class="c5 cc">拼单金额：<span class="price">{{$i18n.t('money')}}{{val.shell_amount}}</span></div>
					<div class="c3 cc">拼单次数：{{val.collage_num}}</div>

					<div class="c4 cc" style="display: flex;">释放时间：
						<template v-if="((val.lock_update_at*1000)-currentTime)>0">
							<van-count-down style="font-size: 0.75rem; color: #767676;" :time="((val.lock_update_at*1000)-currentTime)" format="DD 天 HH 时 mm 分 ss 秒" />
						</template>
						<template v-else>
							已释放
						</template>
					</div>
					<div class="c4 cc">解锁时间：{{val.lock_update_at|timestampToTime}}</div>
				</div>
			</template>

		</div>
	</div>
</template>

<script>


export default {
  props:{
    item:{}
  },
  data:function() {
    return {
      currentTime:0
    };
  },
  created(){
    let date = new Date();
    this.currentTime = parseInt(date.getTime());
  },
  components:{},
  computed:{
    subscribe(){
      return (item)=>{
        let str = "没有预约项目";
        let has_many_project_category = this.item.has_many_project_category;
        if(has_many_project_category.length!=0){
          for(let i=0;i<has_many_project_category.length;i++){
            if(has_many_project_category[i].project_type==1){
              if(has_many_project_category[i].has_one_category && has_many_project_category[i].has_one_category.name){
                str = has_many_project_category[i].has_one_category.name;
              }
							
            }
          }
        }
        return str;
      };
    }
  },
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .wrapper {
    background: #fff;

    .topInfo {
      text-align: left;
      width: 100%;
      height: 3.219rem;
      padding: 0.525rem 0.813rem 0.519rem 0.75rem;
      background: #f6f8fc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .c1 {
        display: flex;
        justify-content: space-between;

        .num {
          color: #333;
          font-size: 0.75rem;
          letter-spacing: 0.038rem;
        }

        .price {
          color: #ff2c29;
          font-size: 0.75rem;
        }
      }

      .c2 {
        text-align: left;
        display: flex;
        color: #6e6f6f;
        font-size: 0.688rem;
      }
    }

    .item {
      padding: 0.75rem 0 0.75rem 0.719rem;
      padding-bottom: 0.75rem;
      display: flex;
      border-bottom: 0.031rem solid #ededed;

      .face {
        width: 5.625rem;
        height: 5.625rem;
        background-color: #ededed;
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
        padding-left: 0.719rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;

        .cc {
          width: 100%;
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
  }

</style>
