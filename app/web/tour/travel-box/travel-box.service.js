(function() {
    'use strict';

    angular.module('wayonara.shared').service('TravelBoxService', TravelBoxService);

    TravelBoxService.$inject = ['$log', 'constants', '_'];
    /**
     *
     * @param $log
     * @param constants
     * @constructor
     */
    function TravelBoxService($log, constants, _) {

        this.init = init;

        this.setCountShardStages = setCountShardStages;
        this.setCountShardHotels = setCountShardHotels;
        this.setCountShardAttractions = setCountShardAttractions;

        this.getCountShardStages = getCountShardStages;
        this.getCountShardHotels = getCountShardHotels;
        this.getCountShardAttractions = getCountShardAttractions;

        this.getShardTitleArrays = getShardTitleArrays;

        var shardStagesCount;
        var shardHotelsCount;
        var shardAttractionsCount;

        function init(travelBoxPlaces) {
            shardStagesCount = 0;
            shardHotelsCount = 0;
            shardAttractionsCount = 0;

            _.each(travelBoxPlaces, function(place) {
                var groupedShardTypes = _.countBy(place.shardsList, 'bit');
                triageShardCountByBit(groupedShardTypes);
            })
        }

        function getShardTitleArrays(shards) {
            var shardTitles = {
                attractions: [],
                hotels: [],
                stages: []
            };

            _.each(shards, function(shard) {
                var shardName = shard.nearestPoi.name;

                switch(shard.bit) {
                    case constants._SHARD_BIT_MASK.stage:
                        shardTitles.stages.push(shardName);
                        break;
                    case constants._SHARD_BIT_MASK.hotel:
                        shardTitles.hotels.push(shardName);
                        break;
                    case constants._SHARD_BIT_MASK.attraction:
                        shardTitles.attractions.push(shardName);;
                        break;
                    default:
                        break;
                }
            });

            return shardTitles;
        }

        function setCountShardStages(value) {
            return shardStagesCount = value;
        }

        function setCountShardHotels(value) {
            return shardHotelsCount = value;
        }

        function setCountShardAttractions(value) {
            return shardAttractionsCount = value;
        }

        function getCountShardStages() {
            return shardStagesCount;
        }

        function getCountShardHotels() {
            return shardHotelsCount;
        }

        function getCountShardAttractions() {
            return shardAttractionsCount;
        }

        function triageShardCountByBit(groupedShardTypes) {
            _.each(groupedShardTypes, function(count, bit) {
                switch (parseInt(bit, 10)) { // we have string keys from the `_.countBy()` above, but numeric constants
                    case constants._SHARD_BIT_MASK.stage:
                        setCountShardStages(getCountShardStages() + count);
                        break;
                    case constants._SHARD_BIT_MASK.hotel:
                        setCountShardHotels(getCountShardHotels() + count);
                        break;
                    case constants._SHARD_BIT_MASK.attraction:
                        setCountShardAttractions(getCountShardAttractions() + count);
                        break;
                    default:
                        break;
                }
            })
        }
    }
}());
