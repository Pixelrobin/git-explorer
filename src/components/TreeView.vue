<template>
	<div>
 		
	<div class = "header">
		<octicon class = "ml-3" name = "repo" scale = "2"></octicon>
 		<input class="form-control input-sm ml-3" type="text" id="name">
 	</div>

 	<div class = "tree-view border-right">
		<ul>
			<span v-if = "treeLoading">Loading...</span>
			<span v-else-if = "treeError">Error!</span>
			<item v-else-if = "tree" class = "item" :model = "tree" root = "root" ></item>
		</ul>
	</div>
	</div>
</template>

<script>
import TreeViewItem from "./TreeViewItem";
import gg from "../modules/github-getter";
import Octicon from "vue-octicon/components/Octicon.vue";

// Individual icons
import "vue-octicon/icons/repo";


var data = {
  name: 'My Tree',
  children: [
	{ name: 'hello' },
	{ name: 'wat' },
	{
	  name: 'child folder',
	  children: [
		{
		  name: 'child folder',
		  children: [
			{ name: 'hello' },
			{ name: 'wat' }
		  ]
		},
		{ name: 'hello' },
		{ name: 'wat' },
		{
		  name: 'child folder',
		  children: [
			{ name: 'hello' },
			{ name: 'wat' }
		  ]
		}
	  ]
	}
  ]
}

export default {
	name: "tree-view",
	
	components: {
		"item": TreeViewItem,
		Octicon
	},

	computed: {
		isLoaded: () => {
			console.log( loaded );
			return loaded;
		}
	},

	data: () => {
		return {
			treeData: data,
			root: true
		}
	},

	asyncData: {
		tree() {
			return new Promise(( resolve, reject ) => {
				gg.fakeget(
					"/repos/pixelrobin/fec-database/git/trees/master?recursive=1",
					( res, err ) => {
						if ( err ) reject( err );
						else {
							console.log( "got data!" )

							const
								tree = res.tree;

							var obj = {
								name: "fec-database",
								children: []
							};

							var base = {};

							for ( var n = 0; n < tree.length; n ++ ) {
								const blob = tree[ n ].type === "blob";

								var
									path  = tree[ n ].path.split( "/" ),
									array = obj.children,
									file  = blob ? path.pop() : null;

								if ( path.length > 0 ) {
									for ( var p = 0; p < path.length; p ++ ) {
										var find = array.findIndex(( e ) => {
											return e.name === path[ p ]
										});

										if ( find === -1 ) {
											find = array.push({
												name: path[ p ],
												children: []
											}) - 1
										}

										array = array[ find ].children;
									}
								}

								if ( blob ) array.push({
									name: file,
									path: tree[ n ].path,
									size: tree[ n ].size
								});

								//}
							}

							console.log( obj );
							resolve( obj );
						}
					}
				)
			})
		}
	}
}
</script>