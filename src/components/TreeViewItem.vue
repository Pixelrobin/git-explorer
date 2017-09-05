// BASED ON https://jsfiddle.net/yyx990803/3p0j5sgy

<template>
<li>
	<div
		:class="{folder: isFolder}"
		@click="toggle"
	>
		<octicon :name = "icon" scale = "1.3"></octicon>
		<span class = "name">{{model.name}}</span>
		<!--<span v-if="isFolder">[{{open ? '-' : '+'}}]</span>!-->
	</div>

	<ul v-show="open" v-if="isFolder">
		<item
			class="item"
			v-for="model in children"
			:model="model"
		></item>
	</ul>
</li>
</template>

<script>
import Vue from "vue";
import gg from "../modules/github-getter";
import Octicon from "vue-octicon/components/Octicon.vue";
import { EventBus } from "../modules/EventBus";

// Individual icons
import "vue-octicon/icons/file-directory";
import "vue-octicon/icons/file";
import "vue-octicon/icons/repo";

export default {
	name: "item",

	props: {
		model: Object,
		root: Boolean
	},

	data() {
		var c    = [],
			icon = "";

		if ( this.model.children && this.model.children.length ) {
			c = this.model.children.slice();
			c.sort( ( a, b ) => {
				if ( a.children && !b.children ) return -1;
				if ( b.children && !a.children ) return 1;

				var
					an = a.name.toLowerCase(),
					bn = b.name.toLowerCase();

				if( an < bn ) return -1;
				if( an > bn ) return 1;
				return 0;
			});
		}

		if ( this.root ) icon = "repo";
		else icon = c.length > 0 ? "file-directory" : "file"

		return {
			open: this.root ? true : false,
			children: c,
			isFolder: c.length > 0,
			icon: icon
		}
	},

	computed: {
	},

	methods: {
		toggle: function () {
			if (this.isFolder) {
				this.open = !this.open
			} else {
				EventBus.$emit( "open-file", this.model.path, this.model.name );
			}
		}
	},

	components: {
		Octicon
	}
}
</script>