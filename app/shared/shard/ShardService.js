/**
 * Shard Service.
 * @author Maurizio Vacca
 */

(function() {
    'use strict';

    angular.module('wayonara.shared').service('ShardService', ShardService);

    ShardService.$inject = ['$http', 'SessionService', '$log', 'UploadService', 'api', 'constants'];
    /**
     *
     * @param $http
     * @param {SessionService} SessionService
     * @param $log
     * @param {UploadService} UploadService
     * @constructor
    */
    function ShardService($http, SessionService, $log, UploadService, api, constants) {

        this.getTilePicture = function(tileSize) {
            var picSize = null;

            switch (tileSize) {
                case 'sm':
                    picSize = '_single_shard_';
                    break;
                case 'md':
                    picSize = '_double_shard_';
                    break;
                case 'lg':
                    picSize = '_triple_shard_';
                    break;
            }

            return picSize;
        };

        // ported
        this.createShards = function(shards) {
            var shardList = { shards: shards };
            return $http.post(api._ADD_SHARDS, shardList, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        // ported
        this.getShards = function(query, pageNumber) {
            return $http.post(api._GET_SHARDS.replace('{selector}', constants._SHARD_BUILDER_SELECTOR.stream), {'queryString':query, 'page': pageNumber}, {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        // ported
        this.getShardById = function(shardId) {
            return $http.get(api._GET_SHARD_BY_ID.replace('{shardId}', shardId).replace('{selector}', constants._SHARD_BUILDER_SELECTOR.full), {headers: {'Authorization': 'Bearer ' + SessionService.getToken()}});
        };

        this.getStream = function(pageNumber) {
            return $http.get(api._GET_SHARD_ON_STREAM.replace('{page}', pageNumber), { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        this.getDiary = function(user, pageNumber) {
            var uri = api._GET_SHARDS.replace('{selector}', constants._SHARD_BUILDER_SELECTOR.stream);
            var params = { 'user': user, 'page': pageNumber , 'sortModeBm' : 2};
            $log.debug('Calling uri: ' + uri);
            return $http.post(uri, params, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        // ported
        this.getAutocompleteData = function(needle, locale, bitmask) {
            var uri = api._GET_AUTOCOMPLETE_DATA.replace('{needle}', needle).replace('{locale}', locale).replace('{bitMask}', bitmask);
            $log.debug('Calling uri: ' + uri);
            return $http.get(uri, { headers: ('Content-Type: application/json; Charset=UTF-8') });
        };

        // ported
        this.toggleLike = function(shard){
            var uri = api._LIKE_SHARD;
            var params = { shard: shard };
            return $http.post(uri, params, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        // Not implemented, yet
        this.deleteShard = function(shard) {
            return $http.post(api._DELETE_SHARD.replace('{shardId}', shard.id), {}, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        this.reportShard = function(shard) {
            return $http.post(api._REPORT_SHARD.replace('{shardId}', shard.id), {}, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        /**
         * Retrieves the user's shard for a specific location identified by geoplaceId.
         * @param user
         * @param bit
         * @param page
         * @param geoPlaceId
         * @returns {*|HttpPromise}
         */
        this.retrieveShardsByGeoId = function(user, bit, page, geoPlaceId) {
            var uri = api._GET_SHARDS.replace('{selector}', constants._SHARD_BUILDER_SELECTOR.expanded);
            var params = {
                'user': user,
                'bit': bit,
                'page': page,
                'geoPlaceId': geoPlaceId
            };
            return $http.post(uri, params, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });

        };
    }
}());
