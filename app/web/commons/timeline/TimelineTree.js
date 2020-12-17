(function(){
	'use strict';

	/**
	 * @param {TimelineNode} TimelineNode
	 * @returns {TimelineTree} TimelineTree
	 */
	angular.module('wayonara.tour').factory('TimelineTree', function (TimelineNode, $log) {
		/**
		 * Creates a new TimelineTree. Nested sub trees are allowed.
		 * @param {*} config - JSON tree description
		 * @constructor
		 */
		function TimelineTree(config) {
			config = config || {};
			this.nodes = [];
			this.config = config;
			this.parent = null;
			this.config.childrenLabel = config.childrenLabel || 'children';
		}

		TimelineTree.prototype.parse = function(model){
			this.nodes = [];
			for(var i=0;i<model.length;i++){
				this.nodes.push(this.addNode(model[i]));
			}

			$log.debug("TimelineTree.parse()", this);
		};

		TimelineTree.prototype.addNode = function(data){
			var node = new TimelineNode(data.model);
			node.setIndex(this.nodes.length);

			if(data.model[this.config.childrenLabel] instanceof Array && data.model[this.config.childrenLabel].length > 0){
				var children = new TimelineTree();
				children.parse(data.model[this.config.childrenLabel]);
				children.setParent(node);
				node.setChildren(children);
			}

			return node;
		};

		TimelineTree.prototype.isFirst = function(node){
			return node.getIndex() == 0;
		};

		TimelineTree.prototype.isLast = function(node){
			return node.getIndex() == this.nodes.length -1;
		};

		/**
		 * Sets the parent <code>TimelineNode</code>
		 * @param {TimelineNode} node
		 */
		TimelineTree.prototype.setParent = function(node){
			this.parent = node;
		};

		/**
		 * Returns the parent <code>TimelineNode</code>
		 * @returns {TimelineNode}
		 */
		TimelineTree.prototype.getParent = function(){
			return this.parent;
		};

		/**
		 * Returns the node at the specified index.
		 * @param {int} index
		 * @returns {TimelineNode} the node at the specified index
		 */
		TimelineTree.prototype.getNode = function(index){
			return this.nodes[index];
		};

		/**
		 * Insert a new node in a specific position.
		 * @param {TimelineNode} node
		 * @param {int} index
		 */
		TimelineTree.prototype.insert = function(node, index){
			var appendInstead = index > this.nodes.length || index==undefined || index==null;
			$log.debug("TimelineTree.insert - ", node, index, appendInstead, this.nodes.length);

			//--Check if OutOfBound
			if(index>=0 && !appendInstead){
				if(!appendInstead){
					this.nodes.splice(index, 0, node);
					$log.debug("TimelineTree.insert - before cycling...", this.nodes);

					//--O(n)
					this.refreshIndexes();

					$log.debug("TimelineTree.insert - after cycling...", this.nodes);
				}
			}
			else{
				node.setIndex(this.nodes.length);
				this.append(node);
			}
		};

		/**
		 * Move a node to the specific position.
		 * @param {TimelineNode} node
		 * @param {int} index
		 */
		TimelineTree.prototype.move = function(node, index){
			if(index>=0 && index<this.nodes.length){
				this.nodes.splice(node.getIndex(), 1);
				this.insert(node, index);
			}
		};

		TimelineTree.prototype.refreshIndexes = function(){
			for(var j=0;j<this.nodes.length;j++){
				$log.debug("TimelineTree.refreshIndexes - Setting index: " + j);
				this.nodes[j].setIndex(j);
			}
		};

		/**
		 * Checks if the tree is empty.
		 * @returns {boolean}
		 */
		TimelineTree.prototype.isEmpty = function(){
			return this.nodes.length == 0;
		};

		TimelineTree.prototype.append = function(node){
			this.nodes.push(node);
		};

		TimelineTree.prototype.remove = function(node){
			this.nodes.splice(node.getIndex(), 1);
			this.refreshIndexes();
		};

		/**
		 * Swap two nodes.
		 * @param {TimelineNode} nodeA
		 * @param {TimelineNode} nodeB
		 */
		TimelineTree.prototype.swap = function(nodeA, nodeB){
			//--Switching by position is the best way since it costs O(1).
			var tmp = $.extend(nodeA);

			//--Switching position
			nodeA.setIndex(nodeB.getIndex());
			nodeB.setIndex(tmp.getIndex());

			//--Updates the data structure
			this.nodes[nodeB.getIndex()] = nodeB;
			this.nodes[nodeA.getIndex()] = nodeA;
		};

		/**
		 * Get Vehicles TimelineNodes
		 */
		TimelineTree.prototype.getVehiclesTimelineNodes = function(){
			var vehiclesTimelineNodes = [];
			for(var j=0;j<this.nodes.length;j++){
				if(this.nodes[j].model.category === "vehicle"){
					//Inserisco nell'array da restituire
					vehiclesTimelineNodes.push(this.nodes[j]);
				}
			}
			return vehiclesTimelineNodes;
		};

		return TimelineTree;
	});
})();

(function(){
	'use strict';

	angular.module('wayonara.tour').factory('TimelineNode', function() {
		function TimelineNode(model) {
			this.model = model;
			this.domModel = {
				col        : null,
				colspan    : 0,
				element    : null,
				inBounds   : true,
				isDragging : false,
				newTile    : true,
				positioned : false,
				x          : 0,
				y          : 0
			};
			this.shardsCollection = [];
		}

		//--Model & Logic methods
		TimelineNode.prototype.setIndex = function(index){
			this.index = index;
		};

		TimelineNode.prototype.getIndex = function(){
			return this.index;
		};

		TimelineNode.prototype.setChildren = function(children){
			this.children = children;
		};

		TimelineNode.prototype.getChildren = function(){
			return this.children;
		};

		TimelineNode.prototype.hasChildren = function(){
			return this.hasOwnProperty("children");
		};

		//--Rendering methods
		/**
		 * Set the DOM Model.
		 * @param {*} domModel
		 */
		TimelineNode.prototype.setDomModel = function(domModel){
			this.domModel = domModel;
		};

		/**
		 * Returns the domModel
		 * @returns {*}
		 */
		TimelineNode.prototype.getDomModel = function(){
			return this.domModel;
		};

		TimelineNode.prototype.getShardsCollection = function(){
			return this.shardsCollection;
		};

		TimelineNode.prototype.setShardsCollection = function(shardsCollection){
			this.shardsCollection = shardsCollection;
		};

		TimelineNode.prototype.addToShardCollection = function(shard){
			this.shardsCollection.push(shard);
		};

		TimelineNode.prototype.concatToShardsCollection = function(shards){
			var newShardsCollection = this.shardsCollection.concat(shards);
			TimelineNode.prototype.setShardsCollection(newShardsCollection);
		};

		return TimelineNode;
	});
})();