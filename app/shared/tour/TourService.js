(function() {
    'use strict';

    angular.module('wayonara.shared').service('TourService', TourService);

    TourService.$inject = ['$http', 'SessionService', '$log', 'UploadService', 'WayonaraTutorialService', 'api', 'constants', '_'];
    /**
     *
     * @param $http
     * @param {SessionService} SessionService
     * @param $log
     * @param {UploadService} UploadService
     * @param {WayonaraTutorialService} WayonaraTutorialService
     * @constructor
     */
    function TourService($http, SessionService, $log, UploadService, WayonaraTutorialService, api, constants, _) {

        this.getTourById = getTourById;
        this.updateTour = updateTour;
        this.deleteTour = deleteTour;
        this.publishTour = publishTour;

        this.getUserTours = getUserTours;
        this.getUserTourShards = getUserTourShards;

        this.uploadTourCover = uploadTourCover;

        this.addInternalTourParticipant = addInternalTourParticipant;
        this.updateInternalTourParticipant = updateInternalTourParticipant;
        this.deleteInternalTourParticipant = deleteInternalTourParticipant;

        this.addExternalTourParticipant = addExternalTourParticipant;
        this.updateExternalTourParticipant = updateExternalTourParticipant;
        this.deleteExternalTourParticipant = deleteExternalTourParticipant;

        this.getActualUserAsParticipant = getActualUserAsParticipant;

        this.roundtripAnalysis = roundtripAnalysis;
        this.findOnewayQuoted = findOnewayQuoted;

        this.countQuotedVectors = countQuotedVectors;
        this.getTotalPrice = getTotalPrice;

        function getTourById(tourId) {
            return $http.get(api._GET_SHARD_BY_ID.replace('{shardId}', tourId).replace('{selector}', constants._SHARD_BUILDER_SELECTOR.full), {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        // ported - but needed by several AngularJS bits
        function updateTour(tour) {
            WayonaraTutorialService.setCurrentStep(WayonaraTutorialService.triageStepByTour(tour));
            return $http.put(api.tour.replace('{tourId}', tour.id), tour, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function deleteTour(tour) {
            var uri = api.tour.replace('{tourId}', tour.id);
            return $http.delete(uri, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function publishTour(tour) {
            return $http.post(api._PUBLISH_TOUR, tour, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function getUserTours(user,pageNumber) {
            var uri = api._GET_SHARDS.replace('{selector}', constants._SHARD_BUILDER_SELECTOR.stream);
            var params = {
                user: user,
                page: pageNumber,
                bit: constants._SHARD_BIT_MASK.tour
            };
            return $http.post(uri, params, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function getUserTourShards(user, bit, pageNumber, status, queryString) {
            var uri = api._GET_SHARDS.replace('{selector}', constants._SHARD_BUILDER_SELECTOR.expanded);
            var params = {
                user: user,
                bit: bit,
                page: pageNumber,
                status: status,
                queryString: queryString
            };
            return $http.post(uri, params, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function uploadTourCover(file, tourId) {
            var re = constants._FILE_EXT_REGEX;
            var ext = re.exec(file.name)[1];
            var fileName = 'full_tour_' + tourId + '.' + ext;
	        return UploadService.uploadContent(file, 'tour', fileName);
        };

        function addInternalTourParticipant(data) {
            var uri = api._ADD_INTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function updateInternalTourParticipant(data) {
            $log.debug('TourService.updateInternalTourParticipant', data)
            var uri = api._UPDATE_INTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function deleteInternalTourParticipant(data) {
            var uri = api._DELETE_INTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function addExternalTourParticipant(data) {
            var uri = api._ADD_EXTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function updateExternalTourParticipant(data) {
            var uri = api._UPDATE_EXTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function deleteExternalTourParticipant(data) {
            var uri = api._DELETE_EXTERNAL_TOUR_PARTICIPANT;
            return $http.post(uri, data, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        function getActualUserAsParticipant(tour, user) {
            var userAsParticipant = null;
            if (angular.isDefined(tour.participants) && tour.participants !== null) {
                for (var i = 0; i < tour.participants.length; i++) {
                    if (tour.participants[i].nid === user.nid) {
                        userAsParticipant = tour.participants[i];
                    }
                }
            }
            return userAsParticipant;
        }

        /**
        * roundtripAnalysis
        *
        * analyze timeline to find roundtrip solutions and linking nodes between, checking the id proprerties of linked places
        *
        * @author Simone Pitzianti
        * @param {*} timeline
        * @param integer nodeIndex
        * @returns timeline
        *
        */
        function roundtripAnalysis(timeline, selectedNodeIndex) {
            $log.debug('-- TourQuoteController:roundtripAnalysis timeline', timeline);
            $log.debug('-- TourQuoteController:roundtripAnalysis selectedNodeIndex', selectedNodeIndex);
            var selectedNodeOriginId = timeline[parseInt(selectedNodeIndex) - 1].model.id;
            var selectedNodeDestinationId = timeline[parseInt(selectedNodeIndex) + 1].model.id;

            angular.forEach(timeline, function(node, nodeIndex) {
                if (node.model.category === 'vehicle') {
                    if ((timeline[parseInt(nodeIndex) - 1].model.id === selectedNodeDestinationId) && (timeline[parseInt(nodeIndex) + 1].model.id === selectedNodeOriginId)) {
                        timeline[parseInt(selectedNodeIndex)].model.linkedNodeRoundtripId = parseInt(nodeIndex);
                        timeline[parseInt(nodeIndex)].model.linkedNodeRoundtripId = parseInt(selectedNodeIndex);
                        $log.debug('-- TourQuoteController:roundtripAnalysis updating linkedNodeRoundtripId in node', selectedNodeIndex, timeline[parseInt(selectedNodeIndex)].model);
                        $log.debug('-- TourQuoteController:roundtripAnalysis updating linkedNodeRoundtripId in node', nodeIndex, timeline[parseInt(nodeIndex)].model);
                    }
                }
            });

            $log.debug('-- TourQuoteController:roundtripAnalysis timeline updated', timeline);

            return timeline;
        }

        /**
        * findOnewayQuoted
        *
        * analyze timeline to find oneway segments already quoted when quoting roundtrip solution
        *
        * @author Simone Pitzianti
        * @param {*} timeline
        * @param integer nodeIndex
        * @returns quotedNode
        *
        */
        function findOnewayQuoted(timeline, selectedNodeIndex) {
            if (timeline[parseInt(selectedNodeIndex)].model.linkedNodeRoundtripId) {
                var linkedNodeRoundtripId = timeline[parseInt(selectedNodeIndex)].model.linkedNodeRoundtripId;

                if ((linkedNodeRoundtripId !== undefined) && (linkedNodeRoundtripId !== null)) {
                    var linkedNodeResult = timeline[parseInt(linkedNodeRoundtripId)].model.resultSelected;

                    // if linkedNode has quoted solution but without returnSegment we are in return segment of a roundtrip
                    if ((linkedNodeResult !== undefined) && (linkedNodeResult !== null) && (linkedNodeResult.trip.returnSegment === null)) {
                        $log.debug('-- TourService.findOnewayQuoted - linkedNodeResult', linkedNodeResult);
                        return linkedNodeResult;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
        * countQuotedVectors
        *
        * analyze tour to calculate count of quoted vectors inside it:
        * -
        *
        * @author Simone Pitzianti
        * @param {*} tour
        * @returns {integer} countQuotedVectors
        *
        */
        function countQuotedVectors(tour) {
            var quotedVectorsCount = 0;

            angular.forEach(tour.timeline, function(node, nodeIndex) {
                if (angular.isDefined(node.model.resultSelected)) {
                    quotedVectorsCount += 1;
                }
            });

            return quotedVectorsCount;
        }

        /**
        * getTotalPrice
        *
        * analyze tour to calculate total price of quoted vectors inside it:
        * -
        *
        * @author Simone Pitzianti
        * @param {*} tour
        * @returns {float} totalPrice
        *
        */
        function getTotalPrice(tour) {
            var tourTotalPrice = 0;
            var sessionPaymentOrder = SessionService.getPaymentOrder();

            if ((sessionPaymentOrder !== undefined) && (sessionPaymentOrder !== null)) {
                if ((sessionPaymentOrder.totalAmountToPay !== undefined) && (sessionPaymentOrder.totalAmountToPay !== null)) {
                    if (sessionPaymentOrder.tourId === tour.id) {
                        tourTotalPrice = sessionPaymentOrder.totalAmountToPay;
                    }
                }
            } else {
                var countedKeys = [];
                _.forEach(tour.timeline, function(node, nodeIndex) {
                    if (angular.isDefined(node.model.resultSelected) && (node.model.resultSelected !== null)) {
                        countedKeys.push(nodeIndex);
                        if ((angular.isDefined(node.model.linkedNodeRoundtripId)) && (node.model.linkedNodeRoundtripId !== null)) {
                            var linkedNodeRoundtripId = node.model.linkedNodeRoundtripId;
                            // roundtrip case
                            countedKeys.push(linkedNodeRoundtripId);
                            if(countedKeys[linkedNodeRoundtripId] !== undefined) {
                                tourTotalPrice += parseFloat(node.model.resultSelected.price);
                            }
                        } else {
                            countedKeys.push(nodeIndex);
                            tourTotalPrice += parseFloat(node.model.resultSelected.price);
                        }
                    }
                });
            }
            return tourTotalPrice;
        }
    }
})();
