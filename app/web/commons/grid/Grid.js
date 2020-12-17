(function(){
	'use strict';

	/**
	 * Defines the Grid model.
	 * @param {Tile} Tile
	 * @param $log
	 */
	angular.module('wayonara.social').factory('Grid', function(Tile, $log){
		function Grid(){
			this.tiles = [];
			this.height = 0;
			this.width = "100%";
			this.gutter = null;
		}

		/**
		 * Parse the model into a new Grid.
		 * @param {Array} model
		 */
		Grid.prototype.parse = function(model){
			for(var index = 0;index < model.length; index++){
				var tmpTile = new Tile(model[index]);
				this.addTile(tmpTile);
			}
		};

		/**
		 *
		 * @param {Tile} tile
		 */
		Grid.prototype.addTile = function(tile){
			tile.setIndex(this.tiles.length);
			this.tiles.push(tile);
		};

		Grid.prototype.removeTile = function(index){
			this.tiles.splice(index, 1);
		};

		Grid.prototype.compose = function(){

		};
	});
})();

(function(){
	'use strict';

	/**
	 * Tile model.
	 */
	angular.module('wayonara.social').factory('Tile', function(){
		function Tile(model){
			this.model = model;
			this.x = 0;
			this.y = 0;
			this.row = null;
			this.rowSpan = 1;
			this.col = null;
			this.colSpan = 1;
			this.width = 0;
			this.height = 0;
			this.positioned = false;
			this.index = null;
		}

		Tile.prototype.getModel = function(){
			return this.model;
		};

		Tile.prototype.setModel = function(model){
			this.model = model;
		};

		Tile.prototype.getX = function(){
			return this.x;
		};

		Tile.prototype.setX = function(x){
			this.x = x;
		};

		Tile.prototype.getY = function(){
			return this.y;
		};

		Tile.prototype.setY = function(y){
			this.y = y;
		};

		Tile.prototype.getRow = function(){
			return this.row;
		};

		Tile.prototype.setRow = function(row){
			this.row = row;
		};

		Tile.prototype.getRowSpan = function(){
			return this.rowSpan;
		};

		Tile.prototype.setRowSpan = function(rowSpan){
			this.rowSpan = rowSpan;
		};

		Tile.prototype.getCol = function(){
			return this.col;
		};

		Tile.prototype.setCol = function(col){
			this.col = col;
		};

		Tile.prototype.getColSpan = function(){
			return this.colSpan;
		};

		Tile.prototype.setColSpan = function(colSpan){
			this.colSpan = colSpan;
		};

		Tile.prototype.getWidth = function(){
			return this.width;
		};

		Tile.prototype.setWidth = function(width){
			this.width = width;
		};

		Tile.prototype.getHeight = function(){
			return this.height;
		};

		Tile.prototype.setHeight = function(height){
			this.height = height;
		};

		Tile.prototype.getPositioned = function(){
			return this.positioned;
		};

		Tile.prototype.setPositioned = function(positioned){
			this.positioned = positioned;
		};

		Tile.prototype.getIndex = function(){
			return this.index;
		};

		Tile.prototype.setIndex = function(index){
			this.index = index;
		}
	});
})();