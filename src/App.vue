<template>
	<div class = "app" id = "app" @mousemove = "mouseMove" @mouseup = "mouseUp">
		<div class = "sidebar" :style = "sideStyle">
			<tree-view></tree-view>
		</div>
		
		<div class = "content" :style = "contentStyle">
			<code-window></code-window>
		</div>
		<div class = "resizer" :style = "resizerStyle" @mousedown = "mouseDown"></div>
	</div>
</template>

<style>
	.resizer {
		position: absolute;
		width: 16px;
		min-width: 16px;
		min-height: 100vh;
		background-color: none !important;
		cursor: ew-resize;
	}
</style>

<script>
import TreeView from "./components/TreeView";
import CodeWindow from "./components/CodeWindow";

export default {
	name: 'app',
	
	components: {
		TreeView,
		CodeWindow
	},

	data: function() {
		return {
			sideStyle: {
				width: "20%"
			},
			contentStyle: {
				left: "20%"
			},
			resizerStyle: {
				left: `${Math.max( window.innerWidth * 0.2 - 8, 0 ) / window.innerWidth * 100}%`
			},
			drag: false
		}
	},

	methods: {
		mouseMove: function( e ) {
			if ( this.drag ) {
				var percent = ( e.clientX / window.innerWidth ) * 100;
				var percent2 = ( Math.max( e.clientX - 8, 0 ) / window.innerWidth ) * 100;
				this.sideStyle.width = `${percent}%`;
				this.contentStyle.left = `${percent}%`;
				this.resizerStyle.left = `${percent2}%`;
			}
		},

		mouseDown: function() {
			this.drag = true;
		},

		mouseUp: function() {
			this.drag = false;
		}
	}
}
</script>