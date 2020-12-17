/**
 * Shard model.
 * @author Maurizio Vacca
 */
(function () {

    'use strict';

    angular.module('wayonara.shared').factory('Shard', function () {
        function Shard(){
            this.userId = "";
            this.type = "";
            this.description = "";
            this.title = "";
            this.bit = "";
            this.nearestPoiId = "";
            this.uploadPhotoId = 1;
            this.inputUrl = "";
            this.siteName = "";
        }

        /**
         * Retrieves the type.
         * @returns {string|*} the <code>Shard</code> type
         */
        Shard.prototype.getType = function(){
            return this.type;
        };

        /**
         * Sets the type.
         * @param type the <code>Shard</code> type
         */
        Shard.prototype.setType = function(type){
            this.type = type;
        };

        /**
         * Retrieves the userId.
         * @returns {int} the <code>Shard</code> userId
         */
        Shard.prototype.getUserId = function(){
            return this.userId;
        };

        /**
         * Sets the author.
         * @param author the <code>Shard</code> userId
         */
        Shard.prototype.setUserId = function(userId){
            this.userId = userId;
        };

        /**
         * Retrieves the description.
         * @returns {string|*} the <code>Shard</code> description
         */
        Shard.prototype.getDescription = function (){
            return this.description;
        };

        /**
         * Sets the description.
         * @param description the <code>Shard</code> description
         */
        Shard.prototype.setDescription = function(description) {
            this.description = description;
        };

        /**
         * Retrieves the title.
         * @returns {string|*} the <code>Shard</code> title
         */
        Shard.prototype.getTitle = function(){
            return this.title;
        };

        /**
         * Sets the title.
         * @param title the <code>Shard</code> title
         */
        Shard.prototype.setTitle = function(title) {
            this.title = title;
        };

        /**
         * Retreives the bitmask.
         * @returns {int} the <code>Shard</code> bitmask
         */
        Shard.prototype.getBit = function(){
            return this.bit;
        };

        /**
         * Sets the bitmask.
         * @param bit the <code>Shard</code> bitmask
         */
        Shard.prototype.setBit = function(bit) {
            this.bit = bit;
        };

        /**
         * Retrieves the nearest poi Id.
         * @returns {int} the <code>Shard</code> POI Id
         */
        Shard.prototype.getNearestPoiId = function(){
            return this.nearestPoiId;
        };

        /**
         * Sets the nearest poi Id.
         * @returns {int} the <code>Shard</code> POI Id
         */
        Shard.prototype.setNearestPoiId = function(poi) {
            this.nearestPoiId = poi;
        };

        /**
         * Retrieves the upload photo id.
         * @returns {int} the <code>Shard</code> upload photo Id
         */
        Shard.prototype.getUploadPhotoId = function(){
            return this.uploadPhotoId;
        };

        /**
         * Sets the upload photo id.
         * @returns {int} the <code>Shard</code> upload photo id.
         */
        Shard.prototype.setUploadPhotoId = function(uploadPhotoId) {
            this.uploadPhotoId = uploadPhotoId;
        };

        /**
         * Retrieves the inputUrl.
         * @returns {int} the <code>Shard</code> inputUrl
         */
        Shard.prototype.getInputUrl = function(){
            return this.inputUrl;
        };

        /**
         * Sets the inputUrl.
         * @returns {int} the <code>Shard</code> inputUrl.
         */
        Shard.prototype.setInputUrl = function(inputUrl) {
            this.inputUrl = inputUrl;
        };

        /**
         * Retrieves the siteName.
         * @returns {int} the <code>Shard</code> siteName
         */
        Shard.prototype.getSiteName = function(){
            return this.siteName;
        };

        /**
         * Sets the siteName.
         * @returns {int} the <code>Shard</code> siteName.
         */
        Shard.prototype.setSiteName = function(siteName) {
            this.siteName = siteName;
        };

        return Shard;
    });
})();
