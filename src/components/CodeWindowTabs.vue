<template>
	<div class = "tabnav main pt-3">
		<nav class = "tabnav-tabs" ref = "/tabs-root" >
			<a
				v-for = "tab in tabs"
				:key = "tab.path"
				:ref = "tab.path"
				class = "tabnav-tab no-select"
				:class = "{selected: tab.path === selected}"
				@mousedown = "( event ) => { selectTab( event, tab.path, tab.name ) }"
			>
				{{ tab.name }}
			</a>

			<a
				v-if = "drag.dragging"
				class = "tabnav-tab drag no-select selected"
				:style = "drag.style"
			>
				{{ drag.name }}
			</a>
		</nav>
	</div>
</template>

<script>
import Vue from "vue";
import { EventBus } from "../modules/EventBus";

var drag = {
	dragging: false,
	path: "",
	name: "",
	style: {},
	startOffset: 0
}

window.dragLeftPos = 0;

export default {
	name: "code-window-tabs",

	data() {
		return {
			drag: drag
		}
	},

	props: {
		tabs: Array,
		selected: String
	},

	methods: {
		selectTab( event, path, name ) {
			var
				tab = this.$refs[ path ][ 0 ],
				bounds = tab.getBoundingClientRect();

			Vue.set( drag, "dragging", true );
			Vue.set( drag, "path", path );
			Vue.set( drag, "name", name );
			Vue.set( drag, "startOffset", event.clientX - bounds.left );

			window.addEventListener( "mousemove", this.mousemove );
			window.addEventListener( "mouseup", this.mouseup );

			this.mousemove( event );

			EventBus.$emit( "select-tab", path );
		},

		// These following methods are called by window events

		mousemove( event ) {
			var bounds = this.$refs[ "/tabs-root" ].getBoundingClientRect();

			Vue.set( drag, "style", {
				left:
					( Math.min( Math.max( event.clientX - bounds.left, 0 ), bounds.right ) - drag.startOffset )
					.toString() + "px",
			})
		},

		mouseup( event ) {
			window.removeEventListener( "mousemove", this.mousemove );
			window.removeEventListener( "mouseup", this.mouseup );

			Vue.set( drag, "dragging", false );
		}
	},

	destroyed() {
		window.removeEventListener( "mousemove", this.mousemove );
		window.removeEventListener( "mouseup", this.mouseup );
	}
}
</script>