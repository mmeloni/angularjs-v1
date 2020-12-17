(function(){
    'use strict';

    /**
     * @param {TravelBoxPlace} TravelBoxPlace
     * @returns {TravelBox} TravelBox
     */
    angular.module('wayonara.tour').factory('TravelBox', function (TravelBoxPlace, $log, WayonaraTutorialService, $timeout) {
        /**
         * Creates a new TravelBox.
         * @constructor
         */
        function TravelBox() {
            this.travelBoxPlaces = [];
        }

        //Receives in input the shards grid available in tour and returns the TravelBox Object
        TravelBox.prototype.create = function(shardsIds, ShardsRepository) {
            if( shardsIds !== null ){
                //Qua devo ciclare lo shard repository?
                for (var i = 0; i < shardsIds.length; i++) {
                    var place = null;
                    //Recupero l'oggetto Shard corrispondente nel ShardRepository
                    var shardObject = ShardsRepository[shardsIds[i]];
                    if (shardObject !== null) {
                        var shardGeoPlaceId = shardObject.geoplace.id;
                        //Recupero l'oggetto corrispondente nel ShardRepository
                        var placeObject = ShardsRepository[shardGeoPlaceId];
                    }
                    if (this.getTravelBoxPlaceByPlace(placeObject) !== false) {
                        place = this.getTravelBoxPlaceByPlace(placeObject);
                        place.addShard(shardObject);
                    }
                    else {
                        place = new TravelBoxPlace(placeObject);
                        place.addShard(shardObject);
                        this.travelBoxPlaces.push(place);
                    }
                }
            }
        };

        //Check if place is present in the TravelBox
        TravelBox.prototype.getTravelBoxPlaceByPlace = function(placeObject){

            for(var i=0; i < this.travelBoxPlaces.length; i++){

                if(this.travelBoxPlaces[i].getPlace() === placeObject) {
                    return this.travelBoxPlaces[i];
                }

            }

            return false;

        };

        //Check if place is present in the TravelBox
        TravelBox.prototype.getTravelBoxPlaceByPlaceId = function(placeId){

            for(var i=0; i < this.travelBoxPlaces.length; i++){

                if(this.travelBoxPlaces[i].getPlace().id === placeId) {
                    return this.travelBoxPlaces[i];
                }

            }

            return false;

        };

        return TravelBox;

        // Seems unused, keeping it commented out for now
        // function updateTutorialStep(shardCount) {
        //     var newStep = 'tBoxNoPlaces';

        //     switch (shardCount) {
        //         case 0:
        //             newStep = 'tBoxNoPlaces';
        //             break;
        //         case 1:
        //             newStep = 'tBoxOnePlace'
        //             break;
        //         default:
        //             newStep = 'tBoxTwoPlaces';
        //     }

        //     WayonaraTutorialService.setCurrentStep(newStep);
        // }

    });

})();


/**

 TravelBoxPlace:    Place with the grid of the shards available in this place

 **/
(function(){
    'use strict';

    angular.module('wayonara.tour').factory('TravelBoxPlace', function() {

        //Constructor
        function TravelBoxPlace(place) {
            this.place = place;
            this.shardsList = [];
        }

        TravelBoxPlace.prototype.addShard = function(shard){
            //Check for shard existence
            for (var i = 0; i < this.shardsList.length; i++) {
                var foundedInArray = false;
                if (this.shardsList[i] === shard) {
                    foundedInArray = true;
                    break;
                }
            }
            if( !foundedInArray ){
                this.shardsList.push(shard);
            }
        };

        TravelBoxPlace.prototype.getPlace = function(){
            return this.place;
        };

        TravelBoxPlace.prototype.setPlace = function(place){
            this.place = place;
        };

        TravelBoxPlace.prototype.getShardsList = function(){
            return this.shardsList;
        };

        TravelBoxPlace.prototype.setShardsList = function(shardsList){
            this.shardsList = shardsList;
        };

        return TravelBoxPlace;
    });
}());
