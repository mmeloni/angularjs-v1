(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnGrid', WayonaraGrid);

	WayonaraGrid.$inject = ['$log', '$rootScope'];
	function WayonaraGrid($log, $rootScope){
		return {
			restrict: 'E',
			template:'<div class="wn-grid"></div>',
			scope:{
				tileTmplUrl:'@',
				tilesController:'@',
				gridIdentity:'=',
				ngModel:'=',
				onAddTile: '&',
				onRemoveTile: '&',
				dynamize: '='
			},
			require:['^ngModel'],
			controller: function($scope, $log, $compile){
				$log.debug('WayonaraGridController ---', $scope);

				$scope.config = {
					tileModel: '<wn-tile ng-model="tiles[%index%]" grid-identity="gridIdentity" tile-tmpl-url="{{tileTmplUrl}}" on-add="onAddTileCallback()" on-remove="onRemoveTileCallback()" tile-controller="%tileController%" tile-size="%tileSize%"></wn-tile>'
				};

				/* Grid configuration */
				$scope.grid = {
					self: null,
					elements: [],
					rows: 0,
					cols: 0
				};

                /** Update Grid on events **/
                $rootScope.$on('WN_EVT_RENDER_GRID',function(event,data){
                    if(data && data.items){
                        $scope.ngModel = data.items;
                        $scope.render($scope.grid.self, data.gridId || null);
                    }else{
                        $scope.render($scope.grid.self);
                    }
                });
                /** Update Grid on events **/

				/* Tiles grid */
				$scope.tiles = $scope.ngModel || [];

				/* Callback Methods */
				$scope.onAddTileCallback = function(){
					$scope.onAddTile();
				};

				$scope.onRemoveTileCallback = function($scope){
					$scope.onRemoveTile();
				};

				$scope.clearTiles = function(){
					var $tiles = $scope.grid.self.find('.wn-tile');
					$tiles.remove();
				};

				/* Rendering Methods */
				$scope.render = function(element, gridId){
                    var $grid;
                    if(gridId){
                        $grid = element.find('.shard-grid-'+ gridId +' .wn-grid');
                    }else{
                        $grid = element.find('.wn-grid');
                    }

                    //Refresh delle tiles
                    $scope.tiles = $scope.ngModel;
                    $scope.grid.self = element;

					$log.debug('WayonaraGridController.render() - ', $grid, $scope);

					if(typeof $scope.tiles !== 'undefined' && $grid){
						$scope.clearTiles();
						for(var index=0; index < $scope.ngModel.length; index++){
                            var tileSize = ($scope.dynamize == true) ? $scope.getRandomSize() : 'sm';

							var $tile = angular.element(
								$scope.config.tileModel
									.replace(new RegExp('%index%', 'g'), index)
									.replace(new RegExp('%tileController%', 'g'), $scope.tilesController)
                                    .replace(new RegExp('%tileSize%', 'g'), tileSize)
							);

                            $log.debug('WayonaraGridController.render() - ', $tile);
							$grid.append(($tile));
                            $compile($tile)($scope);

                            $log.debug('WayonaraGridController.render() - after appending: ', $grid);
						}
					}

					$log.debug('WayonaraGridController.', $grid);
				};

				$scope.getRandomSize = function(){
                    var randomSize = Math.floor(Math.random() * 100);
                    var classSize = '';
                    if(randomSize >= 0 && randomSize <1) {
                        //--large (_triple_shard_)
                        classSize = 'lg';
                    }
                    else if(randomSize>=1 && randomSize<10){
                        //--medium (_double_shard_)
                        classSize = 'md';
                    }
                    else {
                        //-small (_single_shard_)
                        classSize = 'sm';
                    }

                    return classSize;
                };
			},
			link: function(scope, element){
				scope.$evalAsync(function(){
					$log.debug('WayonaraGridController - Rendering...');
					scope.render(element);
				});
			}
		};
	}
})();
