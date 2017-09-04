// BASED ON https://jsfiddle.net/yyx990803/3p0j5sgy

<template>
<li>
	<div
		:class="{bold: isFolder}"
		@click="toggle"
		@dblclick="changeType"
	>
		{{model.name}}
		<span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
	</div>
	
	<ul v-show="open" v-if="isFolder">
		<item
			class="item"
			v-for="model in children"
			:model="model"
		>
		</item>
	</ul>
</li>
</template>

<script>
import Vue from "Vue";
import gg from "../modules/github-getter";

export default {
	name: "item",

	props: {
		model: Object
	},

	data() {
		var c = [];

		if ( this.model.children && this.model.children.length ) {
			c = this.model.children.slice();
			c.sort( ( a, b ) => {
				if ( a.children && !b.children ) return -1;
				if ( b.children && !a.children ) return 1;

				var
					an = a.name.toLowerCase(),
					bn = b.name.toLowerCase();

				if(an < bn) return -1;
				if(an > bn) return 1;
				return 0;
			});
		}

		return {
			open: false,
			children: c
		}
	},

	/*created: function() {
		this.model = {};
	},*/

	computed: {
		isFolder: function () {
			return this.model.children && this.model.children.length;
		}
	},

	methods: {
		toggle: function () {
			if (this.isFolder) {
				this.open = !this.open
			}
		},

		changeType: function () {
			if (!this.isFolder) {
				Vue.set(this.model, 'children', [])
				this.addChild()
				this.open = true
			}
		},

		addChild: function () {
			this.model.children.push({
				name: 'new stuff'
			})
		}
	}
}
</script>