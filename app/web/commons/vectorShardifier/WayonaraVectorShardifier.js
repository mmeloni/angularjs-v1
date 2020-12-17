(function(){
	'use strict';

	angular.module('wayonara.tour').directive('wnVectorShardifier', WayonaraVectorShardifier);
	WayonaraVectorShardifier.$inject = ['$log', 'constants'];

	function WayonaraVectorShardifier($log, constants){
		return {
			restrict:'EA',
			replace: true,
			templateUrl: 'web/commons/vectorShardifier/vectorShardifier.html',
            controller: 'VectorShardifierController',
			scope:{
                index: "=",
                model: "=",
                vectorsBit: "=",
                distance: "=",
                price: "=",
                duration: "="
            },
            link: function(scope, element, attribute){
                var vlenght = scope.model.resultSelected.trip.outboundSegment.vectors.length;
                var current;
                for(var n = 0; n < vlenght; n++){
                    current = scope.model.resultSelected.trip.outboundSegment.vectors[n];
                    //raidshare case (or other trip with single vector)
                    if(vlenght-1 == n && ( constants._VECTORS_BIT_MASK.raidshare == current.bit )){
                        scope.orig = current.origin;
                        scope.dest = current.destination;
                        break;
                    }

                    //roundtrip case
                    if(scope.model.hasOwnProperty("linkedNodeRoundtripId")){
                        if(scope.index > scope.model.linkedNodeRoundtripId){
                            if( n == 1){
                                scope.dest = current.origin;
                            }
                            if( n == vlenght-1){
                                scope.orig = current.destination;
                            }
                        }else{
                            if( n == 1){
                                scope.orig = current.origin;
                            }
                            if( n == vlenght-1){
                                scope.dest = current.destination;
                            }
                        }
                    }else{
                        //other cases
                        if( n == 1){
                            scope.orig = current.origin;
                        }
                        if( n == vlenght-1){
                            scope.dest = current.destination;
                        }
                    }
                }

                scope.distance = parseInt(scope.distance/1000);
                scope.duration = parseInt(scope.duration);
                var mmnt = moment.duration(scope.duration, 'minutes');
                scope.sduration={};
                scope.sduration.days= mmnt.days();
                scope.sduration.hours= mmnt.hours();
                scope.sduration.minutes= mmnt.minutes();

                var arcGenerator = new arc.GreatCircle(
                    {x:parseFloat(scope.orig.lon) , y: parseFloat(scope.orig.lat)},
                    {x: parseFloat(scope.dest.lon), y: parseFloat(scope.dest.lat)});

                var arcLine = arcGenerator.Arc(100, {offset: 100});
                var line = new ol.geom.LineString(arcLine.geometries[0].coords);
                line.transform(ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));

                var feature = new ol.Feature({
                    geometry: line
                });

                var iconOrig = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(scope.orig.lon), parseFloat(scope.orig.lat)]))
                });
                var iconDest = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(scope.dest.lon), parseFloat(scope.dest.lat)]))
                });
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 26],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: '../assets/img/pin-place.png'
                    }))
                });

                iconOrig.setStyle(iconStyle);
                iconDest.setStyle(iconStyle);

                var vectorSource = new ol.source.Vector({
                    features: [iconOrig,iconDest]
                });

                var arcSource = new ol.source.Vector({
                    features: [ feature]
                });
                //Layers
                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });

                var arcLayer = new ol.layer.Vector({
                    source: arcSource,
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#41b0a6',
                            width: 6
                        })
                    })
                });

                var rasterLayer = new ol.layer.Tile({
                    preload: 8,
                    source: new ol.source.OSM()
                });

                var view = new ol.View({
                    center: ol.proj.fromLonLat([parseFloat(scope.orig.lon), parseFloat(scope.orig.lat)]),
                    zoom: 6
                });
                var map = new ol.Map({
                    layers: [rasterLayer,  arcLayer, vectorLayer],
                    target: element[0].getElementsByClassName('map')[0],
                    interactions: ol.interaction.defaults({mouseWheelZoom:false}),
                    view: view
                });



                scope.availableVectorArray = [];

                for(var vector in constants._VECTORS_BIT_MASK){
                    if(constants._VECTORS_BIT_MASK[vector] == constants._VECTORS_BIT_MASK.ancillarystore){
                        continue;
                    }
                    if((constants._VECTORS_BIT_MASK[vector] | scope.vectorsBit) == scope.vectorsBit ){
                        var vectorObj = {};
                        vectorObj.bit = constants._VECTORS_BIT_MASK[vector];
                        vectorObj.label = vector;

                        scope.availableVectorArray.push(vectorObj);
                    }
                }
            }
		}
	}
})();
