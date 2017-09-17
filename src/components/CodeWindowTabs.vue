<template>
	<div class = "tabnav main pt-3">
		<nav class = "tabnav-tabs">
			<transition-group name = "flip-list" tag = "div">
				<div
					v-for = "( tab, index ) in tabs"
					
					:key = "tab.id"
					:ref = "tab.id"
					
					class  = "tabnav-tab main no-select"
					:class = "{ selected: tab.id === selectedId }"

					@mousedown.left = "( event ) => { selectTab( event, index ) }"

					:style = "{
						visibility: tab.id === drag.id && drag.dragging? 'hidden' : 'visible'
					}"
				>
					<span class = "tab-content" >{{ tab.name }}</span>
					<span @mouseup.middle = "closeTab( index )" >
						<octicon class = "ml-1" name = "x" ></octicon>
					</span>
				</div>
			</transition-group>

			<div
				v-if = "drag.dragging"
				class = "tabnav-tab drag no-select selected"
				:style = "{ left: drag.offset.toString() + 'px' }"
				ref = "~"
			>
				{{ drag.name }}
				<octicon class = "ml-1" name = "x"></octicon>
			</div>
		</nav>
	</div>
</template>

<style>
	.flip-list-move {
		transition: transform 0.15s;
	}

	.tabnav.main {
		overflow: hidden;
		border-style: none !important;
	}

	.tabnav-tab.main {
		transition: transform 0.25s;
		display: inline-block;
	}

	.tabnav-tab.main .tab-content {
		display: inline-block;
		position: relative;
		transform: translateX( 10px );
		transition: transform 0.2s ease-out;
	}

	.tabnav-tab.main:hover span {
		transform: translateX( 0 );
	}

	.tabnav-tab .octicon {
		position: relative;
		margin-bottom: 1px;
	}

	.tabnav-tab.main .octicon {
		/*transform: translateX( -10px );
		transition: transform 0.15s;*/
		opacity: 0;
		transition: opacity 0.15s;
		transition: transform 0.1s;
	}

	.tabnav-tab.main:hover .octicon {
		/*transform: translateX( 0 );*/
		opacity: 1;
	}

	.tabnav-tab.drag {
		position: absolute;
	}

	.tabnav-tab.main .octicon:hover {
		color: red;
		transform: rotate( 6deg );
	}
	.flip-list-enter, .flip-list-leave-to, .flip-list-leave-active {
		transform: translateY(50px) rotate( 15deg );
	}

	.flip-list-leave-active: {
		position: absolute;
	}
</style>

<script>
	import Vue from "vue";
	import { EventBus } from "../modules/EventBus";
	import Octicon from "vue-octicon/components/Octicon.vue";

	// octicons
	import "vue-octicon/icons/x";

	// Swap values of two elements in an array
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
				drag: {
					started: false,
					dragging: false,
					name,
					id: "",
					lastId: "",
					offset: 0,
					startOffset: 0,
					lastClientX: -1
				},

				pos: "",
				tabs: [],
				selectedId: ""
			}
		},

		props: {
		},

		created() {
			this.$bus.on( "create-tab", this.createTab );
		},

		destroyed() {
			this.$bus.off( "create-tab", this.createTab );
		},

		methods: {
			createTab( name, id ) {
				this.tabs.push({
					name: name,
					id: id
				});
			},

			destroyTab( index ) {
				this.releaseTab( null, true );
				this.tabs.splice( index, 1 );
			},

			selectTab( event, index ) {
				if ( event.target.tagName !== "path" && event.target.tagName !== "svg" ) {
					let
						id     = this.tabs[ index ].id,
						name   = this.tabs[ index ].name,
						tab    = this.$refs[ id ][ 0 ],
						bounds = tab.getBoundingClientRect();

					this.drag.lastClientX = event.clientX;
					this.drag.id          = id;
					this.drag.name        = name;
					this.drag.startOffset = event.clientX - bounds.left;

					this.selectedId = this.tabs[ index ].id;

					window.addEventListener( "mousemove", this.moveTab );
					window.addEventListener( "mouseup", this.releaseTab );

					this.pos = 0;

					EventBus.$emit( "select-tab", id );
				} else { 
					this.destroyTab( index );
				}
			},

			moveTab( event, first ) {
				if ( this.drag.dragging ) {
					var tabBounds = this.$refs[ this.drag.id ][ 0 ]
						.parentNode
						.getBoundingClientRect();

					if ( !first ) {
						var
							dragTabBounds = this.$refs[ "~" ].getBoundingClientRect(),
							dir           = Math.sign( event.clientX - this.drag.lastClientX ),

							i = 0, pass = true, sideTab;

						// In case the user likes to move their mouse really fast, we use while
						while ( pass ) {
							pass = false;
							sideTab = this.tabs[ this.drag.index + dir ];

							if ( sideTab !== undefined ) {
								var
									node   = this.$refs[ sideTab.id ][ 0 ],
									center = getBoundingClientRectCenter( node ),
									side   = dir === -1 ? "left" : "right";

								if ( Math.sign( dragTabBounds[ side ] - center ) === dir ) {
									swap( this.tabs, this.drag.index, ( this.drag.index += dir ) );
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

					this.drag.lastClientX = event.clientX;

					Vue.set( this.drag, "offset", Math.min(
						Math.max( event.clientX - tabBounds.left - this.drag.startOffset, 0 ),
						tabBounds.right
					));
				} else {
					if ( Math.abs( event.clientX - this.drag.lastClientX ) > 10 ) {

						var
							tab    = this.$refs[ this.drag.id ][ 0 ],
							bounds = tab.getBoundingClientRect();

						clearSelection();

						this.drag.dragging = true;
						this.drag.index = this.tabs.findIndex( ( element ) => {
							return element.id === this.drag.id
						});

						this.moveTab( event, true );

						this.pos = 0;
					}
				}
			},

			releaseTab( event, skip ) {
				if ( skip !== true ) {
					var
						tab = this.$refs[ this.drag.id ][ 0 ],
						tabBounds = tab.getBoundingClientRect(),
						rootBounds = tab.parentNode.getBoundingClientRect();

					if ( this.drag.dragging )
						this.pos = ( tabBounds.left - rootBounds.left ) - this.drag.offset;

					//Vue.set( drag, "lastid", drag.id );
				}

				window.removeEventListener( "mousemove", this.moveTab );
				window.removeEventListener( "mouseup", this.releaseTab );

				this.drag.dragging = false;
				this.drag.id = "";
			}
		},

		destroyed() {
			window.removeEventListener( "mousemove", this.mousemove );
			window.removeEventListener( "mouseup", this.mouseup );
		}
	}
</script>