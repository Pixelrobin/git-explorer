<template>
	<div class = "app" id = "app" @mousemove = "mouseMove" @mouseup = "mouseUp">
		<div class = "sidebar" :style = "sideStyle">
				<tree-view></tree-view>
		</div>
		
		<div class = "content" :style = "contentStyle">
			<!--<div class = "resizer" @mousedown = "mouseDown"></div>!-->
			<code-window></code-window>
		</div>
	</div>
</template>

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
			drag: false
		}
	},

	methods: {
		mouseMove: function( e ) {
			if ( this.drag ) {
				var percent = ( e.clientX / window.innerWidth ) * 100;
				this.sideStyle.width = `${percent}%`;
				this.contentStyle.left = `${percent}%`;
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