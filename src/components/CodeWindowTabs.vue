<template>
	<div class = "tabnav main pt-3">
		<nav class = "tabnav-tabs">
			<transition-group name = "flip-list" tag = "div">
				<a
					v-for = "tab in tabs"
					:key = "tab.path"
					:ref = "tab.path"
					class = "tabnav-tab main no-select"
					:class = "{ selected: tab.path === selected }"
					:style = "{ visibility: tab.path !== drag.path ? 'visible' : 'hidden' }"
					@mousedown = "( event ) => { selectTab( event, tab.path, tab.name ) }"
				>
					<span>{{ tab.name }}</span>
					<octicon class = "ml-1" name = "x" ></octicon>
				</a>
			</transition-group>

			<a
				v-if = "drag.dragging"
				class = "tabnav-tab drag no-select selected"
				:style = "drag.style"
				ref = "/tab-drag"
			>
				{{ drag.name }}
				<octicon class = "ml-1" name = "x"></octicon>
			</a>
		</nav>
	</div>
</template>

<style>
	.flip-list-move {
		transition: transform 0.15s;
	}

	.tabnav-tab.main span {
		display: inline-block;
		position: relative;
		transform: translateX( 10px );
		transition: transform 0.15s ease-out;
		background-color: #24292e;
		z-index: 100;
	}

	.tabnav-tab.main.selected span {
		background-color: white;
	}

	.tabnav-tab.main:hover span {
		transform: translateX( 0 );
	}

	.tabnav-tab .octicon {
		position: relative;
		margin-bottom: 1px;
	}

	.tabnav-tab.main .octicon {
		transform: translateX( -10px );
		transition: transform 0.15s;
	}

	.tabnav-tab.main:hover .octicon {
		transform: translateX( 0 );
	}

	.tabnav-tab.drag {
		z-index: 101;
	}
</style>

<script>
	import Vue from "vue";
	import { EventBus } from "../modules/EventBus";
	import Octicon from "vue-octicon/components/Octicon.vue";

	// octicons
	import "vue-octicon/icons/x";

	var drag = {
		dragging: false,
		path: "",
		index: -1,
		name: "",
		style: {},
		startOffset: 0,
		lastClientX: -1
	}

	// Swap two elements in an array
	var swap = ( array, id1, id2 ) => {

		if ( array[ id1 ] !== undefined && array[ id2 ] !== undefined ) {
			var placeholder = array[ id2 ];

			Vue.set( array, id2, array[ id1 ] );
			Vue.set( array, id1, placeholder );
		}
	}

	// Get the center x position of an element
	var getBoundingClientRectCenter = ( element ) => {
		var bounds = element.getBoundingClientRect();

		return bounds.left + ( bounds.right - bounds.left ) / 2
	}

	var clearSelection = () => {
		// https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
		if (window.getSelection) {
			if (window.getSelection().empty) {  // Chrome
				window.getSelection().empty();
			} else if (window.getSelection().removeAllRanges) {  // Firefox
				window.getSelection().removeAllRanges();
			}
		} else if (document.selection) {  // IE?
			document.selection.empty();
		}
	}

	export default {
		name: "code-window-tabs",

		components: {
			Octicon
		},

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
				var tab    = this.$refs[ path ][ 0 ],
					bounds = tab.getBoundingClientRect();

				clearSelection();

				Vue.set( drag, "dragging", true );
				Vue.set( drag, "path", path );
				Vue.set( drag, "name", name );
				Vue.set( drag, "startOffset", event.clientX - bounds.left );
				Vue.set( drag, "index", this.tabs.findIndex( ( element ) => {
					return element.path === drag.path
				}));

				window.addEventListener( "mousemove", this.mousemove );
				window.addEventListener( "mouseup", this.mouseup );

				this.mousemove( event, true );

				EventBus.$emit( "select-tab", path );
			},

			// These following methods are called by window events
			mousemove( event, first ) {
				var tabBounds = this.$refs[ drag.path ][ 0 ].parentNode.getBoundingClientRect();

				if ( !first ) {
					var
						dragTabBounds = this.$refs[ "/tab-drag" ].getBoundingClientRect(),
						dir           = Math.sign( event.clientX - drag.lastClientX ),

						i = 0, pass = true, sideTab;

					while ( pass ) {
						pass = false;
						sideTab = this.tabs[ drag.index + dir ];

						if ( sideTab !== undefined ) {
							var
								node   = this.$refs[ sideTab.path ][ 0 ],
								center = getBoundingClientRectCenter( node ),
								side   = dir === -1 ? "left" : "right";

							if ( Math.sign( dragTabBounds[ side ] - center ) === dir ) {
								swap( this.tabs, drag.index, ( drag.index += dir ) );
								pass = true;
							}
						}

						i ++;
						if ( i > this.tabs.length ) {
							console.warn( "while loop overflow! This shouldn't happen." );
							break;
						}
					}
				}

				drag.lastClientX = event.clientX;

				Vue.set( drag, "style", {
					left: (
						Math.min(
							Math.max( event.clientX - tabBounds.left - drag.startOffset, 0 ),
							tabBounds.right
						)
					).toString() + "px",
				});
			},

			mouseup( event ) {
				window.removeEventListener( "mousemove", this.mousemove );
				window.removeEventListener( "mouseup", this.mouseup );

				Vue.set( drag, "dragging", false );
				Vue.set( drag, "path", "" );
			}
		},

		destroyed() {
			window.removeEventListener( "mousemove", this.mousemove );
			window.removeEventListener( "mouseup", this.mouseup );
		}
	}
</script>