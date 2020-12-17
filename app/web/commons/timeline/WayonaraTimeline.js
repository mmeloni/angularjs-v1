(function(){
    'use strict';

    angular.module('wayonara.tour').directive('wnTimelineConnector', WayonaraTimelineConnector);

    WayonaraTimelineConnector.$inject = ['$log'];
    function WayonaraTimelineConnector($log){
        return {
            restrict: 'EA',
            replace: true,
            template:'<div id="connector-index_{{ connectorIndex }}" class="wn-connector"></div>',
            scope: {
                onClick:'&',
                onEnter:'&',
                onLeave:'&',
                start:'=',
                end:'='
            },
            controller: function($scope, $log){
                $scope.connectorIndex = $scope.start.index + 1;
                $scope.onClickCallback = function(event){
                    $log.debug('WayonaraTimelineConnector - clicked:', event);
                };

                $scope.onEnterCallback = function(event){
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this
                        }
                    };

                    $scope.onEnter(callbackParams);
                };

                $scope.onLeaveCallback = function(event){
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this
                        }
                    };

                    $scope.onLeave(callbackParams);
                };
            },
            link: function(scope, element){
                $log.debug('WayonaraTimelineConnector.linking...', scope, element);
                var distance = scope.end.getDomModel().x - scope.start.getDomModel().x - $(scope.start.getDomModel().element).outerWidth();
                var positionLeft = scope.start.getDomModel().x + $(scope.start.getDomModel().element).outerWidth();

                var attrs = {
                    top: '50%',
                    marginTop: '-2px',
                    height: '4px',
                    backgroundColor: '#eceff1'
                };

                //element.append(line);
                element.css(attrs);

                TweenLite.to(element, 0.3, {
                    width: distance,
                    left: positionLeft,
                    onComplete: function(){
                        event = {
                            currentTarget: element
                        };
                        scope.onEnterCallback(event);
                    }
                });
            }
        };
    }
})();

(function(){
    'use strict';

    angular.module('wayonara.tour').directive('wnVehicleSelector', WayonaraVehicleSelector);

    WayonaraVehicleSelector.$inject = ['$log', 'constants'];
    function WayonaraVehicleSelector($log, constants){
        return {
            restrict: 'EA',
            replace: true,
            scope:{
                wnVsCoords: '=',
                wnVsSpacing: '=',
                onEnter: '&',
                onLeave: '&',
                onClick: '&',
                onSelect: '&'
            },
            templateUrl:'web/commons/timeline/timeline-vs.html',
            controller: function($scope, $log){
                $log.debug('-- WayonaraVehicleSelector - $scope', $scope);
                $log.debug('-- WayonaraVehicleSelector - wnVsCoords (activePosition)', $scope.wnVsCoords);
                $scope.vehicles = [
                    {
                        bit: constants._VECTORS_BIT_MASK.flight,
                        icon:'flight'
                    },
                    {
                        bit: constants._VECTORS_BIT_MASK.raidshare,
                        icon:'raidshare'
                    },
                    {
                        bit: constants._VECTORS_BIT_MASK.walk,
                        icon:'walk'
                    },
                    {
                        bit: constants._VECTORS_BIT_MASK.train,
                        icon:'train'
                    }
                ];
                $log.debug('WayonaraVehicleSelector - init...', $scope);

                $scope.onEnterCallback = function(event){
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this
                        }
                    };
                    $scope.onEnter(callbackParams);
                };

                $scope.onLeaveCallback = function(event){
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this
                        }
                    };
                    $(event.currentTarget).remove();
                    $scope.onLeave(callbackParams);
                };

                $scope.onSelectCallback = function(event){
                    var connectorIndex = event.currentTarget.offsetParent.offsetParent.id.split('_');
                    $log.debug('-- WayonaraVehicleSelector.onSelectCallback - event', event.currentTarget);
                    $log.debug('-- WayonaraVehicleSelector.onSelectCallback - event', event);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            position: connectorIndex[1]
                        }
                    };
                    $log.debug('-- WayonaraVehicleSelector.onSelectCallback - callbackParams.attrs', callbackParams.attrs);
                    $scope.onSelect(callbackParams);
                };

                $scope.onClickCallback = function(event){
                    $log.debug('-- WayonaraVehicleSelector.onClickCallback - event', event);

                    var $listSelector = event.currentTarget.children[1];

                    TweenLite.fromTo($listSelector, 0.2, {display:'inline', opacity:0}, {display:'inline', opacity:1});

                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this
                        }
                    };
                    $log.debug('-- WayonaraVehicleSelector.onClickCallback - callbackParams.attrs', callbackParams.attrs);
                    $scope.onClick(callbackParams);
                };
            },
            link: function(scope, element){
                $log.debug('WayonaraVehicleSelector.link - ', scope);
                var animationTimeline = new TimelineLite();
                var top = - (element.height()/2);
                //var left = scope.wnVsCoords.left + (scope.wnVsSpacing/2) - (element.width()/2);
                var left = (scope.wnVsSpacing/2) - (element.width()/2);
                element.css({
                    top: top,
                    left: left
                });

                animationTimeline
                    .from(element, 0.1, {scale:0.1})
                    .to(element, 0.1, {scale:1.4})
                    .to(element, 0.1, {scale:1, onComplete: function(){

                        element.on('click', function(event){
                            scope.onClickCallback(event);
                        });

                        element.css({width: '220px'});
                    }});
            }
        };
    }
})();

(function(){
    'use strict';

    angular.module('wayonara.tour').directive('wnTimelineTag', WayonaraTimelineTag);

    WayonaraTimelineTag.$inject = ['$log', 'constants', 'vectorClassPrinterFilter'];
    function WayonaraTimelineTag($log, constants, vectorClassPrinterFilter){
        return {
            restrict: 'EA',
            replace: true,
            scope:{
                ngDisabled:'=',
                ngModel:'=',
                onDragStart:'&',
                onDrag:'&',
                onDragEnd:'&',
                onRelease:'&',
                onPress:'&',
                onClick:'&'
            },
            template:'<div class="wn-timetag {{cssClass}}"><span class="wn-icon wn-icon-{{icon}}"></span><span class="wn-timetag-name">{{ngModel.model.name}}</span></div>',
            controller: function($scope, $log){
                $scope.config = {};
                $scope.config.renderMap = {};
                $scope.config.renderMap.shard = {};
                $scope.config.renderMap.shard[constants._SHARD_BIT_MASK.place] = { icon: 'place', cssClass: 'labeled'};
                $scope.config.renderMap.shard[constants._SHARD_BIT_MASK.stage] = { icon: 'place', cssClass: 'not-labeled'};
                $scope.config.renderMap.vehicle = {};
                $scope.config.renderMap.vehicle['flight'] = { icon: 'flight', cssClass: 'not-labeled'};
                $scope.config.renderMap.vehicle['raidshare'] = { icon: 'raidshare', cssClass: 'not-labeled'};
                $scope.config.renderMap.vehicle['walk'] = { icon: 'walk', cssClass: 'not-labeled'};
                $scope.config.renderMap.vehicle['train'] = { icon: 'train', cssClass: 'not-labeled'};

                $scope.onDragStartCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onDragStartCallback() - ', event);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onDragStart(callbackParams);
                };

                $scope.onPressCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onPressCallback() - ', event, $scope.ngModel);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onPress(callbackParams);
                };

                $scope.onDragCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onDragCallback() - ', event);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onDrag(callbackParams);
                };

                $scope.onDragEndCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onDragEndCallback() - ', event);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onDragEnd(callbackParams);
                };

                $scope.onReleaseCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onReleaseCallback() - ', event);
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onRelease(callbackParams);
                };

                $scope.onClickCallback = function(event){
                    $log.debug('WayonaraTimelineTag.onClickCallback() - ',event, ($(this.target).outerWidth()));
                    var callbackParams = {
                        attrs:{
                            event: event,
                            element: this,
                            node: $scope.ngModel
                        }
                    };

                    $scope.onClick(callbackParams);
                };
            },
            link: function(scope, element){
                var model = scope.ngModel.model;
                $log.debug('Linking Timeline tag - ', scope.ngModel);
                switch(model.category){
                    case 'shard' :
                        scope.cssClass = scope.config.renderMap[model.category][model.type]['cssClass'];
                        scope.icon = scope.config.renderMap[model.category][model.type]['icon'];
                    break;
                    case 'vehicle' :
                        var label = vectorClassPrinterFilter(model.type);
                        scope.cssClass = scope.config.renderMap[model.category][label]['cssClass'];
                        scope.icon = scope.config.renderMap[model.category][label]['icon'];
                    break;
                }
                if(model.hasOwnProperty('resultSelected')){
                    scope.cssClass += ' quoted';
                }


                $log.debug('WayonaraTimelineTag - linking...', scope, element);

                if(!scope.ngDisabled){
                    Draggable.create(element, {
                        edgeResistance:1,
                        onPress: scope.onPressCallback,
                        onDragStart: scope.onDragStartCallback,
                        onDrag: scope.onDragCallback,
                        onDragEnd: scope.onDragEndCallback,
                        onRelease: scope.onReleaseCallback,
                        onClick: scope.onClickCallback,
                        zIndexBoost: false
                    });
                }
                else{
                    element.on('click', function(event){
                        scope.onClickCallback(event);
                    });
                }
            }
        }
    }
})();

(function(){
    'use strict';

    angular.module('wayonara.tour').directive('wnTimeline', WayonaraTimeline);

    WayonaraTimeline.$inject = ['$log', '$compile', 'TimelineTree', 'TimelineNode', '$q', 'constants', '$rootScope'];
    function WayonaraTimeline($log, $compile, TimelineTree, TimelineNode, $q, constants, $rootScope){
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="wn-timeline-wrapper"><div class="wn-timeline"></div></div>',
            scope: {
                ngDisabled:'=',
                onNodeAdded: '&',
                onNodeRemoved: '&',
                onNodeClicked:'&',
                onNodeReleased:'&',
                onChange:'&',
                ngModel: '='
            },
            controller: function ($scope, $log, ShardService){
                $log.debug('WayonaraTimelineController');

                $scope.config = {
                    gutter: 100,
                    threshold: '50%',
                    zIndex: 10,
                    tagSelector: '.wn-timetag',
                    timelineSelector: '.wn-timeline',
                    connectorSelector: '.wn-connector',
                    vsSelector: '.wn-vs'
                };

                /* Original timetags. TODO: load contents from service */
                $scope.timelineTree = new TimelineTree();
                $scope.timelineTree.parse($scope.ngModel);
                $scope.vsHover = false;
                $log.debug('WayonaraTimeline - Generated tree:', $scope.timelineTree);

                /* Rendered timetags */
                $scope.$timetags = [];
                $scope.activeNode = null;
                $scope.scrollConfig = {
                    registered: false,
                    sections: {
                        previous: false,
                        next: false,
                        current: 0,
                        total: 0
                    }
                };

                /* Dependencies templates. */

                $scope.dependencies = {
                    connector:'<wn-timeline-connector start="timelineTree.nodes[%start%]" end="timelineTree.nodes[%end%]" on-enter="hoverConnector(attrs)"></wn-timeline-connector>',

                    timetag:'<wn-timeline-tag ng-model="timelineTree.nodes[%index%]" on-press="nodePressed(attrs)" on-drag="nodeDrag(attrs)" on-release="nodeRelease(attrs)" on-click="explodeNode(attrs)" ng-disabled="ngDisabled"></wn-timeline-tag>',

                    vehicleSelector:'<wn-vehicle-selector wn-vs-coords="activePosition" wn-vs-spacing="config.gutter" on-select="selectVehicle(attrs)"></wn-vehicle-selector>',

                    emptyState:'<div class="empty-state">Drag a place here and compose your timeline!</div>',
                    removeTooltip:'<div class="tooltip bottom timetag-remove-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">Remove</div></div>',
                    scrollCtrl:'<button class="ui-action-button compact default timeline-scroll-ctrl previous" ng-show="scrollConfig.sections.previous" ng-click="scrollLeft()"><span class="wn-icon wn-icon-arrow-left"></span></button><button class="ui-action-button compact default timeline-scroll-ctrl next" ng-show="scrollConfig.sections.next" ng-click="scrollRight()"><span class="wn-icon wn-icon-arrow-right"></span></button>'
                };

                /* Event listeners */
                $scope.$on('WN_EVT_BREADCRUMB_HOME', function(){
                    $scope.timelineTree = new TimelineTree();
                    $scope.timelineTree.parse($scope.ngModel);
                    $scope.activeNode = null;

                    $scope.clearTags();
                    $scope.clearConnectors();
                    $scope.render($($scope.config.timelineSelector));
                    $scope.compose('init');
                });

                $scope.$on('WN_EVT_TIMELINE_ADD_NODE', function(event, args){
                    $scope.addNode(args.node, -1);
                });

                $scope.$on('WN_EVT_TIMELINE_REMOVE_NODE', function(event, args){
                    $scope.removeNode($scope.timelineTree.nodes[args.nodeIndex]);
                    $scope.onChange();
                    $scope.clearTags();
                    $scope.clearConnectors();
                    $scope.render($($scope.config.timelineSelector));
                    $scope.compose('init');
                });

                $scope.$on('WN_EVT_TIMELINE_KEEP_ONEWAY', function(event, args){
                    delete $scope.timelineTree.nodes[args.nodeVectorIndex].model.linkedNodeRoundtripId;
                    delete $scope.timelineTree.nodes[args.nodeVectorLinkedRoundtripIndex].model.linkedNodeRoundtripId;

                    $scope.onChange();
                    $scope.clearTags();
                    $scope.clearConnectors();
                    $scope.render($($scope.config.timelineSelector));
                    $scope.compose('init');
                });

                $scope.$on('WN_EVT_TIMELINE_UPDATED', function(event, args) {
                    if (args === undefined) {
                        $scope.clearTags();
                        $scope.clearConnectors();
                        $scope.render($($scope.config.timelineSelector));
                        $scope.compose('init');
                    }
                });

                $scope.$on('WN_EVT_TL_SELECT_SUBTREE', function(event, args){
                    setTimeout(function(){
                        $log.debug('WayonaraTimline.WN_EVT_TL_SELECT_SUBTREE --- ');
                        $scope.selectSubTree(args.index);
                    }, 1000);
                });

                /* Nodes methods */
                $scope.nodePressed = function(attrs) {
                    var element = attrs.element;
                    $log.debug('Node pressed:', element);
                    $scope.selectedNode = {
                        x: element.x,
                        y: element.y
                    };
                };

                $scope.nodeDragStart =function(attrs){
                    $log.debug('WayonaraTimeline - drag started: ', attrs.event);
                    $scope.tooltipAdded = false;
                };

                $scope.nodeDrag = function(attrs) {
                    var element = attrs.element;
                    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    var hitRemove = element.y - $scope.selectedNode.y > 90;
                    var $tooltip = $('.timetag-remove-tooltip');

                    $scope.clearConnectors();

                    if(hitRemove){
                        if(!$scope.tooltipAdded){
                            $(element.target).addClass('removable');
                            $(document.body).append($scope.dependencies.removeTooltip);
                            $scope.tooltipAdded = true;
                        }

                        TweenLite.fromTo(
                            $tooltip,
                            0.4,
                            {opacity:1, x:element.x - ($scope.scrollConfig.sections.current * viewportWidth) +  $(element.target).width()/2, y: $(element.target).offset().top + $(element.target).height(), top: 0, left:0},
                            {opacity:1, x:element.x - ($scope.scrollConfig.sections.current * viewportWidth) +  $(element.target).width()/2, y: $(element.target).offset().top + $(element.target).height(), top: 0, left:0}
                        );
                        $log.debug(element.x, element.y, $tooltip);
                    }
                    else{
                        $(element.target).removeClass('removable');
                        $tooltip.remove();
                        $scope.tooltipAdded = false;
                    }

                    var node = attrs.node;
                    var vehicles = $scope.getConnectedVehicles(node);
                    $scope.removeConnectedVehicles(vehicles);

                    for(var index=0; index<$scope.$timetags.length; index++){
                        var shiftRight = element.x > $scope.selectedNode.x && node.getIndex() < index;
                        var shiftLeft = element.x < $scope.selectedNode.x && node.getIndex() > index;

                        if(element.hitTest($scope.$timetags[index], $scope.config.threshold) && (shiftLeft || shiftRight) && !hitRemove){
                            $log.debug('WayonaraTimeline.nodeDrag() - moving ', node, index);
                            $scope.moveNode(node, index);
                        }
                    }
                };

                $scope.canBeExploded = function(node){
                    return (node.model.category!== 'vehicle' && node.model.type === constants._SHARD_BIT_MASK.place && !$scope.ngDisabled);
                };

                $scope.explodeNode = function(attrs){
                    $log.debug('WayonaraTimeline.explodeNode() - ', attrs);

                    /** @var {TimelineNode} node */
                    var node = attrs.node, subtimeline;

                    if($scope.canBeExploded(node)){
                        if(node.hasChildren()){
                            subtimeline = node.getChildren();
                        }
                        else{
                            subtimeline = new TimelineTree();
                            node.setChildren(subtimeline);
                            subtimeline.setParent(node);
                        }

                        $log.debug('WayonaraTimeline.explodeNode() - ', node.hasChildren(), subtimeline);

                        var animationTimeline = new TimelineMax();
                        var $tags = $($scope.config.tagSelector);

                        animationTimeline.to($tags, 0.25, {
                            x : 0,
                            y : 0,
                            onComplete: function(){
                                //--Clear tags
                                $scope.clearTags();
                                $scope.clearConnectors();

                                $scope.timelineTree = subtimeline;
                                $scope.activeNode = node;
                                $log.debug('WayonaraTimeline.explodeNode() - ', $scope);

                                $scope.render($($scope.config.timelineSelector));
                                $scope.compose('init');
                                $scope.onNodeClicked({'node': node, 'tree': $scope.timelineTree});

                                $scope.$apply();
                            }
                        }, 'reflow');
                    }
                    else{
                        $scope.onNodeClicked({'node': node, 'tree': $scope.timelineTree});
                    }

                };

                /**
                 * Remove the selected node.
                 * @param {TimelineNode} node
                 */
                $scope.removeNode = function(node){
                    $log.debug('WayonaraTimeline.removeNode() - node - ', node, $scope.activeNode);
                    $log.debug('WayonaraTimeline.removeNode() - timelineTree - ', $scope.timelineTree);

                    var vehicles = $scope.getConnectedVehicles(node);

                    if($scope.activeNode === null){
                        $scope.ngModel.splice(node.getIndex(), 1);
                    }
                    else{
                        $scope.ngModel[$scope.activeNode.getIndex()].model.children.splice(node.getIndex(), 1);
                        if(typeof($scope.ngModel[$scope.activeNode.getIndex()].shardsCollection) !== 'undefined' && $scope.ngModel[$scope.activeNode.getIndex()].shardsCollection != null){
                            $scope.ngModel[$scope.activeNode.getIndex()].shardsCollection.splice(node.getIndex(), 1);
                        }
                    }

                    //remove connected vehicles if node is a place
                    $scope.removeConnectedVehicles(vehicles);

                    //first purge potential linked roundtrip node if node is a vehicle
                    if(node.model.linkedNodeRoundtripId){
                        var linkedNodeRoundtripId = node.model.linkedNodeRoundtripId;
                        if( typeof(linkedNodeRoundtripId)!=='undefined' && linkedNodeRoundtripId !== null ){
                            $scope.ngModel.splice(linkedNodeRoundtripId, 1);
                            $scope.timelineTree.remove($scope.timelineTree.nodes[linkedNodeRoundtripId]);
                        }
                    }

                    //then purge node
                    $scope.timelineTree.remove(node);

                    //unshift potential linkedRoundtripId inside timeline
                    angular.forEach($scope.timelineTree.nodes, function(timelineTreeNode, timelineTreeNodeIndex) {
                        if(timelineTreeNode.model.linkedNodeRoundtripId){
                            if(timelineTreeNode.model.linkedNodeRoundtripId > node.getIndex()){
                                timelineTreeNode.model.linkedNodeRoundtripId--;
                            }
                        }
                    });

                    $scope.onNodeRemoved({'node': node, 'tree': $scope.timelineTree});

                    $rootScope.$broadcast('WN_EVT_TIMELINE_UPDATED', $scope.timelineTree);

                    $log.debug('WayonaraTimeline.removeNode() - vehicles', vehicles);
                };

                /**
                 * Return the grid of vehicles connected to the specified node.
                 * @param node
                 * @returns {TimelineNode[]}
                 */
                $scope.getConnectedVehicles = function(node){
                    var leftNode, rightNode, vehicles = [];
                    $log.debug('WayonaraTimeline.getConnectedVehicles() - actual node:', node);
                    if(!$scope.timelineTree.isFirst(node)){
                        leftNode = $scope.timelineTree.getNode(node.getIndex() - 1);
                        if(leftNode.model.category =='vehicle'){
                            //push leftNode in vehicles array if not already present
                            if((vehicles.indexOf(leftNode) === -1) && (vehicles.indexOf(leftNode) === -1)){
                                vehicles.push(leftNode);
                            }
                            if(leftNode.model.linkedNodeRoundtripId){
                                var leftNodeLinkedRoundtripNode = $scope.timelineTree.nodes[leftNode.model.linkedNodeRoundtripId];
                                //push leftNodeLinkedRoundtripNode in vehicles array if not already present
                                if((vehicles.indexOf(leftNodeLinkedRoundtripNode) === -1) && (vehicles.indexOf(leftNodeLinkedRoundtripNode) === -1)){
                                    vehicles.push(leftNodeLinkedRoundtripNode);
                                }

                                $log.debug('WayonaraTimeline.getConnectedVehicles() - leftNode:', leftNode);
                                $log.debug('WayonaraTimeline.getConnectedVehicles() - left node processing: vehicles connected ', vehicles);
                            }
                        }
                    }
                    if(!$scope.timelineTree.isLast(node)){
                        rightNode = $scope.timelineTree.getNode(node.getIndex() + 1);

                        if(rightNode.model.category =='vehicle'){
                            //push rightNode in vehicles array if not already present
                            if((vehicles.indexOf(rightNode) === -1) && (vehicles.indexOf(rightNode) === -1)){
                                vehicles.push(rightNode);
                            }
                            if(rightNode.model.linkedNodeRoundtripId){
                                var rightNodeLinkedRoundtripNode = $scope.timelineTree.nodes[rightNode.model.linkedNodeRoundtripId];
                                //push rightNodeLinkedRoundtripNode in vehicles array if not already present
                                if((vehicles.indexOf(rightNodeLinkedRoundtripNode) === -1) && (vehicles.indexOf(rightNodeLinkedRoundtripNode) === -1)){
                                    vehicles.push(rightNodeLinkedRoundtripNode);
                                }

                                $log.debug('WayonaraTimeline.getConnectedVehicles() - rightNode:', rightNode);
                                $log.debug('WayonaraTimeline.getConnectedVehicles() - right node processing: vehicles connected ', vehicles);
                            }
                        }
                    }
                    $log.debug('WayonaraTimeline.getConnectedVehicles() - vehicles connected ', vehicles);
                    return vehicles;
                };

                /**
                 * Remove a grid of vehicles from the timeline.
                 * @param {TimelineNode[]} vehicles
                 */
                $scope.removeConnectedVehicles = function(vehicles){
                    var node;
                    $log.debug('WayonaraTimeline.removeConnectedVehicles() - vehicles to remove ', vehicles);
                    if(vehicles.length >0){
                        for(var i=0;i<vehicles.length;i++){
                            node = vehicles[i];
                            if($scope.activeNode === null){
                                $scope.ngModel.splice(node.getIndex(), 1);
                            }
                            else{
                                $scope.ngModel[$scope.activeNode.getIndex()].model.children.splice(node.getIndex(), 1);
                            }
                            $scope.timelineTree.remove(node);
                            $log.debug('WayonaraTimeline.removeConnectedVehicles() - node removed', node);
                        }
                    }
                };

                /**
                 * Move the selected node at the desired index
                 * @param {TimelineNode} node the selected node
                 * @param {int} index the desired index
                 */
                $scope.moveNode = function(node, index){
                    var $tagsList = $($scope.config.tagSelector);
                    var insert = node.getIndex() > index ? 'insertBefore' : 'insertAfter';

                    $log.debug('WayonaraTimeline.moveNode() - Original DOM: ', $tagsList, node.getIndex(), index, insert);

                    //purge roundtrip linked node and resultSelected of linkedNodeRoundtrip
                    if(node.model.linkedNodeRoundtripId){
                        var linkedNodeRoundtripId = node.model.linkedNodeRoundtripId;
                        if( typeof(linkedNodeRoundtripId)!=='undefined' && linkedNodeRoundtripId !== null ){
                            if( typeof($scope.timelineTree.nodes[linkedNodeRoundtripId].model.resultSelected)!=='undefined' && $scope.timelineTree.nodes[linkedNodeRoundtripId].model.resultSelected !== null ){
                                delete $scope.timelineTree.nodes[linkedNodeRoundtripId].model.resultSelected;
                                delete $scope.timelineTree.nodes[linkedNodeRoundtripId].model.linkedNodeRoundtripId;
                                $scope.timelineTree.refreshIndexes();
                            }
                        }
                    }

                    //purge vector node if contains resultSelected
                    if( typeof(node.model.resultSelected)!=='undefined' && node.model.resultSelected !== null ){
                        delete $scope.timelineTree.nodes[node.getIndex()].model.resultSelected;
                        delete $scope.timelineTree.nodes[node.getIndex()].model.linkedNodeRoundtripId;
                        $scope.timelineTree.refreshIndexes();
                    }

                    //--Updates the model
                    if($scope.activeNode === null){
                        $scope.ngModel.splice(node.getIndex(), 1);
                        $scope.ngModel.splice(index, 0, {model: node.model});
                    }
                    else{
                        $scope.ngModel[$scope.activeNode.getIndex()].model.children.splice(node.getIndex(), 1);
                        $scope.ngModel[$scope.activeNode.getIndex()].model.children.splice(index, 0, {model: node.model});
                    }

                    $tagsList.eq(node.getIndex())[insert]($tagsList.eq(index));

                    $scope.timelineTree.move(node, index);
                    $log.debug('WayonaraTimeline.moveNode() - DOM Changed: ', $tagsList, $scope.timelineTree, $scope.ngModel);

                    $rootScope.$broadcast('WN_EVT_TIMELINE_UPDATED', $scope.timelineTree);

                    //TODO - animations and position checks should be refactored
                    //$scope.clearTags();
                    //$scope.render($($scope.config.timelineSelector));
                    //$scope.compose();
                };

                $scope.clearTags = function(){
                    var $tags = $($scope.config.tagSelector);
                    $tags.remove();
                };

                $scope.clearConnectors = function(){
                    //--Clear connectors
                    var $connectors = angular.element($scope.config.connectorSelector);
                    $connectors.each(function(index, connector){
                        TweenLite.to(connector, 0.4, {
                            width:0,
                            onComplete: function(){
                                $(connector).remove();
                            }
                        });
                    });

                };

                $scope.nodeRelease = function(attrs){
                    $log.debug('WayonaraTimeline - node released: ', attrs);
                    var element = attrs.element;

                    TweenMax.to(attrs.element.target, 0.5, {
                        x: $scope.selectedNode.x,
                        y: $scope.selectedNode.y
                    });

                    var shiftRight  = element.x > $scope.selectedNode.x;
                    var shiftLeft   = element.x < $scope.selectedNode.x;
                    var hitRemove   = element.y - $scope.selectedNode.y > 90;

                    if(hitRemove){
                        $(element.target).remove();
                        $('.timetag-remove-tooltip').remove();

                        $scope.tooltipAdded = false;
                        $scope.removeNode(attrs.node);
                    }
                    if(shiftLeft || shiftRight || hitRemove){
                        $scope.onChange();
                        $scope.clearTags();
                        $scope.clearConnectors();
                        $scope.render($($scope.config.timelineSelector));
                        $scope.compose('released');
                    }
                };

                $scope.addNode = function(model, index){
                    var node = new TimelineNode(model);

                    $scope.timelineTree.insert(node, index);

                    //shift linkedRoundtripId in node if present (places are pushed at the end of timeline, so update needed only for node vehicles added)
                    if(model.category === 'vehicle' && model.type === 1){
                        angular.forEach($scope.timelineTree.nodes, function(timelineTreeNode, timelineTreeNodeIndex) {
                            if(timelineTreeNode.model.linkedNodeRoundtripId){
                                if(timelineTreeNode.model.linkedNodeRoundtripId > index){
                                    timelineTreeNode.model.linkedNodeRoundtripId++;
                                }
                            }
                        });
                    }

                    //Ricavo la shard dal model nel caso sia una shard e non un place quindi devo aggiungerla solo dal dettaglio della timeline
                    if(model.category === 'shard' && model.type === 2){
                        //Ricavo l'oggetto shard dall'id
                        ShardService.getShardById(model.id).then(
                            function(response){
                                var shardAdded = response.data;
                                if(typeof(shardAdded) != 'undefined' &&  shardAdded != null){
                                    node.addToShardCollection(shardAdded);
                                }
                            }
                        );

                    }

                    $log.debug('WayonaraTimeline.addNode() - ', node);
                    $log.debug('WayonaraTimeline.addNode() - timelineTree - ', $scope.timelineTree);

                    $scope.onChange();
                    $scope.clearTags();
                    $scope.clearConnectors();
                    $scope.render($($scope.config.timelineSelector));
                    $scope.compose('init');

                    $rootScope.$broadcast('WN_EVT_TIMELINE_UPDATED', $scope.timelineTree);
                };

                /**
                 * Manages the Timeline scrolling.
                 */
                $scope.toggleScroll = function(){

                    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    var elemWidth = $($scope.config.timelineSelector)[0].scrollWidth;
                    angular.element($scope.config.timelineSelector).width(elemWidth);

                    if(viewportWidth < elemWidth && !$scope.scrollConfig.registered){
                        $log.debug('WayonaraTimeline.toggleScroll() - registering scroll...');
                        $scope.scrollConfig.registered = true;

                        var scrollCtrl = $compile(angular.element($scope.dependencies.scrollCtrl))($scope);
                        scrollCtrl.insertAfter($scope.config.timelineSelector);
                    }
                    else if(viewportWidth > elemWidth && $scope.scrollConfig.registered){
                        $log.debug('WayonaraTimeline.toggleScroll() - de-registering scroll...');
                        angular.element('.timeline-scroll-ctrl').remove();
                        $scope.scrollConfig.registered = false;
                    }

                    if($scope.scrollConfig.registered){
                        $scope.scrollConfig.sections.total = parseInt(elemWidth/viewportWidth);
                        $scope.scrollConfig.sections.next = true;
                    }
                };

                $scope.scrollLeft = function(){
                    var $timeline = angular.element($scope.config.timelineSelector);
                    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

                    if($scope.scrollConfig.sections.current > 0){
                        TweenLite.to($timeline, 0.6, {left:'+=' + (viewportWidth * $scope.scrollConfig.sections.current - (viewportWidth / 2))});
                        $scope.scrollConfig.sections.current--;
                        $scope.scrollConfig.sections.next = true;

                        if($scope.scrollConfig.sections.current === 0){
                            $scope.scrollConfig.sections.previous = false;
                        }
                    }
                };

                $scope.scrollRight = function(){
                    var $timeline = angular.element($scope.config.timelineSelector);
                    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

                    if($scope.scrollConfig.sections.current < $scope.scrollConfig.sections.total){
                        $scope.scrollConfig.sections.current++;

                        TweenLite.to($timeline, 0.6, {left:'-=' + (viewportWidth * $scope.scrollConfig.sections.current - (viewportWidth / 2) )});

                        if($scope.scrollConfig.sections.current === $scope.scrollConfig.sections.total){
                            $scope.scrollConfig.sections.next = false;
                        }

                        if($scope.scrollConfig.sections.current === 1){
                            $scope.scrollConfig.sections.previous = true;
                        }
                    }
                };

                /* Connectors methods */
                $scope.showVehicleSelector = function(event, connector){
                    $log.debug('WayonaraTimeline.showVehicleSelector() - ', event, connector);
                    var startNode = connector.start
                    var endNode = connector.end;
                    var $connectors = angular.element($scope.config.connectorSelector);

                    if(startNode.model.category !== 'vehicle'
                        && endNode.model.category !== 'vehicle'
                        && !$scope.ngDisabled
                        && (startNode.model.id !== endNode.model.id)
                    ){
                        $scope.activePosition = $(event.currentTarget).position();

                        $scope.vehicleSelectorIndex = connector.start.index + 1;

                        $log.debug('WayonaraTimeline.showVehicleSelector() - connector.start:', connector.start);
                        $log.debug('WayonaraTimeline.showVehicleSelector() - vehicleSelectorIndex:', $scope.vehicleSelectorIndex);
                        $log.debug('WayonaraTimeline.showVehicleSelector() - activePosition:', $scope.activePosition);

                        var $vehicleSelector = angular.element($scope.dependencies.vehicleSelector);
                        $log.debug('WayonaraTimeline.showVehicleSelector() - $vehicleSelector:', $vehicleSelector);

                        angular.element($connectors[$scope.vehicleSelectorIndex-1]).append($vehicleSelector);
                        $compile($vehicleSelector)($scope);
                    }
                };

                $scope.removeVehicleSelector = function(){
                    $log.debug('WayonaraTimeline.removeVehicleSelector', $scope.vsHover);

                    setTimeout(function(){
                        if(!$scope.vsHover){
                            var $vehicleSelector = $($scope.config.vsSelector);

                            var animationTimeline = new TimelineMax();
                            animationTimeline
                                .to($vehicleSelector, 0.1, {scale:1.4})
                                .to($vehicleSelector, 0.3, {
                                    scale:0.1,
                                    opacity:0,
                                    onComplete:function(){
                                        $vehicleSelector.remove();
                                    }
                                });
                        }
                    },150);
                };

                $scope.selectVehicle = function(attrs){
                    $log.debug('WayonaraTimeline.selectVehicle - $($scope.config.vsSelector)', $($scope.config.vsSelector));
                    $log.debug('WayonaraTimeline.selectVehicle - attrs', attrs);
                    $log.debug('WayonaraTimeline.selectVehicle - attrs.position', attrs.position);

                    $scope.vsHover = false;
                    $scope.removeVehicleSelector();

                    var model = {
                        id:'',
                        type:attrs.element.vehicle.bit,
                        name:'',
                        category:'vehicle'
                    };

                    $scope.ngModel.splice(attrs.position, 0, {model:model});
                    $log.debug('WayonaraTimeline.selectVehicle - $scope.ngModel', $scope.ngModel);

                    $scope.addNode(model, attrs.position);
                };

                $scope.hoverConnector = function(attrs){

                    var event = attrs.event;
                    var connector = attrs.element;

                    $scope.showVehicleSelector(attrs.event, connector);

                };

                /* Rendering methods */
                $scope.render = function(element){
                    $log.debug('WayonaraTimeline - rendering...', $scope);
                    var $timeline = element;

                    var $emptyState = angular.element('.empty-state');
                    $emptyState.remove();

                    if($scope.timelineTree.isEmpty()){
                        $timeline.append($scope.dependencies.emptyState);
                    }
                    else{
                        for(var index in $scope.timelineTree.nodes){
                            var $timetag = angular.element($scope.dependencies.timetag.replace(new RegExp('%index%', 'g'), index));
                            $timeline.append($timetag);

                            $compile($timeline.contents())($scope);
                        }
                    }
                };

                $scope.compose = function(step){
                    var $timeline = $($scope.config.timelineSelector)[0];
                    $scope.$timetags = $timeline.getElementsByClassName('wn-timetag');

                    //--Required cause we're going to use $.extend() for merging differences and $.each to iterate
                    var $tags = $($scope.$timetags);
                    var colNumber = 0, lastPosition = 0;

                    $log.debug('WayonaraTimeline.compose() - Tags: ', $tags, $scope.$timetags);
                    $tags.each(function(index, tag){
                        $log.debug('WayonaraTimeline.compose() - Cycling through tags:', tag, index, $scope.timelineTree.getNode(index));
                        var domNodeModel = $scope.timelineTree.getNode(index).getDomModel();

                        TweenLite.to(tag, 0.1, {
                            zIndex:$scope.config.zIndex,
                            onComplete:function(){
                                var x = (colNumber==0) ? lastPosition : $scope.config.gutter + lastPosition + $(tag).prev().outerWidth();

                                $.extend(domNodeModel,{
                                    index : index,
                                    x : x,
                                    element: tag
                                });

                                TweenLite.to(tag, 0.5, {
                                    x: domNodeModel.x,
                                    y: domNodeModel.y,
                                    opacity: 1,
                                    onComplete: function() {
                                        domNodeModel.positioned = true;

                                        var connect = (index > 0);

                                        if (connect && (step === 'init'|| step === 'released')) {
                                            var $connector = angular.element($scope.dependencies.connector
                                                .replace('%start%', (index - 1))
                                                .replace('%end%', index)
                                            );

                                            $(tag).before($connector);
                                            $compile($connector)($scope);
                                        }

                                        $scope.toggleScroll();
                                        $scope.$apply();
                                    }
                                }, 'reflow');

                                colNumber++;
                                lastPosition = x;
                            }
                        }, 'reflow');
                    });
                };

                $scope.selectSubTree = function(index){
                    var selectedNode = $scope.timelineTree.getNode(index);

                    $rootScope.$broadcast('WN_EVT_TIMELINE_UPDATED', $scope.timelineTree);

                    if(selectedNode.model.category === 'vehicle'){
                        $scope.highlightSubTree(selectedNode);

                        if(selectedNode.model.hasOwnProperty('linkedNodeRoundtripId')){
                            var pairedNode = $scope.timelineTree.getNode(selectedNode.model.linkedNodeRoundtripId);
                            $scope.highlightSubTree(pairedNode);
                        }
                    }
                };

                /**
                 * Highlights the selected subtree
                 * @param {TimelineNode} node
                 */
                $scope.highlightSubTree = function(node){
                    var $currentNode = $(node.getDomModel().element);
                    var $prevConnector = $currentNode.prev();
                    var $prevNode = $prevConnector.prev();
                    var $nextConnector = $currentNode.next();
                    var $nextNode = $nextConnector.next();

                    $.each([$currentNode, $prevConnector, $prevNode, $nextConnector, $nextNode], function(index, node){
                        node.addClass('selected');
                    });
                };
            },
            link: function(scope, element){
                var $timeline = element.find(scope.config.timelineSelector);
                scope.render($timeline);

                //--All the after process here
                scope.$evalAsync(function(scope){
                    scope.compose('init');
                    $log.debug('WayonaraTimeline.link() - computed scope: ', scope);
                });
            }
        };
    }
})();
