<template>
	<div class="page">
		<c-title text="项目详情"></c-title>

		<div class="wrapper" v-if="networkLoading">
			<div class="inputWrapper" v-if="project.project_shell_type!=3">
				<div class="ps">
					<span>姓名</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{fullName}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="project.project_shell_type!=3">
				<div class="ps">
					<span>发布者</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input" v-if="project.member">{{project.member.nickname}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper">
				<div class="ps">
					<span>拼单次数</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input" v-if="project.collage_num">{{project.collage_num}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="project.project_shell_type==3">
				<div class="ps">
					<span>解锁时间</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">
					<template v-if="((project.lock_update_at*1000)-currentTime)>0">
						<van-count-down style="font-size: 0.75rem; color: #767676;" :time="((project.lock_update_at*1000)-currentTime)" format="DD 天 HH 时 mm 分 ss 秒" />
					</template>
					<template v-else>
						已释放
					</template>
				</div>
				
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			
			<div class="inputWrapper">
				<div class="ps">
					<span v-if="shell_type==0">预约金额</span>
					<span v-else>实际金额</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{actual_amount}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="project.order && project.order.has_one_order">
				<div class="ps">
					<span>分红阶段</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{project.order.has_one_order.shell_amount}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="project.project_shell_type!=3">
				<div class="ps">
					<span>地址</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{addressName}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="strShow==true && project.project_shell_type!=3">
				<div class="ps">
					<span>街道</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{streetName}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper">
				<div class="ps">
					<span>预约项目</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{subscribe.name}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<div class="inputWrapper" v-if="project.project_shell_type!=3">
				<div class="ps">
					<span>意向项目</span>
					<span style="color: red;">*</span>
				</div>
				<div class="input">{{intention.name}}</div>
				<i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
			</div>
			<c-det-project-form :datas="datas"
				ref="detProjectForm"
				v-on:submitSave="saveInfo"
				:tag="1"
				:form_data_id="form_data_id"></c-det-project-form>
		</div>
		


	</div>
</template>

<script>
import tacitDetprojectController from './tacit_detproject_controller';

export default tacitDetprojectController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page { background: rgb(246, 248, 252); min-height: 100vh; }

  .wrapper {
    text-align: left;
    padding: 0.531rem 0.813rem;
    background: #fff;

    .inputWrapper {
      height: 2.938rem;
      display: flex;
      align-items: center;
      border-bottom: 0.031rem solid #dee2ee;

      .ps {
        width: 5.625rem;
        color: #333;
        font-size: 0.875rem;
        letter-spacing: 0.044rem;
      }

      .input {
        text-align: right;
        flex: 1;
        letter-spacing: 0.044rem;
        color: #999;
        font-size: 0.875rem;
        border: none;

        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
  }

</style>