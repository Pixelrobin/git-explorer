<template>
	<div class="tabnav main pt-3">
		<nav class="tabnav-tabs">
			<a v-for = "tab in tabs" class = "tabnav-tab" :class = "{selected: tab.path === selected}" @click = "selectTab(tab.path)">{{ tab.name }}</a>
		</nav>
	</div>
</template>

<script>
import { EventBus } from "../modules/EventBus"

export default {
	name: "code-window-tabs",

	props: {
		tabs: Array,
		selected: String
	},

	methods: {
		selectTab( path ) {
			console.log( path );
			EventBus.$emit( "select-tab", path );
		}
	}
}
</script>