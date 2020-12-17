(function(){
	/**
	 * Shard Factory.
	 * @author Andrea Zucca
	 */
	'use strict';

    angular.module('wayonara.shared').factory('ShardFactory', ShardFactory);

	function ShardFactory() {
        return { followers: [] };
	}
})();
