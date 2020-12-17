/**
* Vector Bitmask Service.
* @author Simone Pitzianti
*/

(function(){
	'use strict';

	angular.module('wayonara.commons').service('VectorBitmaskService', VectorBitmaskService);
	VectorBitmaskService.$inject = ['$log', 'constants'];

	/**
	* VectorBitmaskService
    *
    * provides methods to execute operations between vectors bitmasks
	*
	* @param $log
	* @param {constants} constants
	* @returns {Object}
	*/
	function VectorBitmaskService($log, constants) {
        //
        this.getNotSelectedAndAncillaries = getNotSelectedAndAncillaries;

        //
        this.getMainVectors = getMainVectors;

        //
        this.getSaleablesVectors = getSaleablesVectors;

        //use to call self.method inside this service
        //var self = this;


        /**
        *
        * getNotSelectedAndAncillaries
        *
        * returns bitmask negated of selected vector type and all ancillaries
        *
        * @param mixed selectedVectorType
        * @returns integer
        *
        */
        function getNotSelectedAndAncillaries(selectedVectorType) {
            $log.debug('-- VectorBitmaskService - selectedVectorType',selectedVectorType);
            $log.debug('-- VectorBitmaskService - ancillaryBitMask',getAncillaryBitMask());
            var bitmask = ~ (getAncillaryBitMask() | parseInt(selectedVectorType));
            $log.debug('-- VectorBitmaskService - notSelectedAndAncillaries bitmask',bitmask);
            return bitmask;
        }

        /**
        * getMainVectors
        * returns main vectors bitmask
        *
        * @returns integer
        *
        */
        function getMainVectors() {
            return ~ getAncillaryBitMask();
        }

        /**
        * getSaleablesVectors
        * returns saleables vectors bitmask
        *
        * @returns integer
        *
        */
        function getSaleablesVectors() {
            return constants._VECTORS_BIT_MASK.train | constants._VECTORS_BIT_MASK.highspeedtrain | constants._VECTORS_BIT_MASK.flight;
        }

        //common service utilities
        function getAncillaryBitMask() {
            return constants._VECTORS_BIT_MASK.ancillary |
                   constants._VECTORS_BIT_MASK.ancillarystore |
                   constants._VECTORS_BIT_MASK.bus |
                   constants._VECTORS_BIT_MASK.car |
                   constants._VECTORS_BIT_MASK.taxi |
                   constants._VECTORS_BIT_MASK.subway |
                   constants._VECTORS_BIT_MASK.transit;
        }



    }
})();
