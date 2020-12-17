//--Filters and utilities
/**
 * priceFormatter filter
 *
 * formats price with specific style for int or decimals
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('priceFormatter', PriceFormatter);

    /**
     * [PriceFormatter description]
     *
     * @param {float} price
     * @param {string} intClass
     * @param {string} decClass
     * @returns {string} html
     * @example
     * INPUT: {{ 100,99 | priceFormatter:'int-class':'dec-class' }}
     * OUTPUT: '<span class=\'int-class' no-padding\'>&euro;'+100+'</span><span class=\'dec-class' no-padding\'>&euro;'+99+'</span>'
     */
    function PriceFormatter() {
        return function (price, intClass, decClass) {
            if (price != undefined) {
                if (typeof price == 'number') {
                    price = price.toString();
                }
                if (typeof intClass == 'undefined') {
                    intClass = 'price-int';
                }
                if (typeof decClass == 'undefined') {
                    decClass = 'price-decimal';
                }
                var html = '';
                var array = price.split('.');
                html += '<span class=\'' + intClass + ' no-padding\'>&euro;' + array[0] + '</span>';
                if (array.length > 1) {
                    html += '.<span class=\'' + decClass + ' no-padding\'>' + array[1] + '</span>';
                }
                return html;
            }
        }
    }
})();

/**
 * vectorClassPrinter filter
 *
 * returns vector class string correspondig to vector bitmask
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('vectorClassPrinter', VectorClassPrinter);

    VectorClassPrinter.$inject = ['constants'];

    /**
     * Return a label from a vector bitmask.
     * It works also with multibit vectors like train.
     * @param {constants} constants
     * @param {integer} bit
     * @return {string}
     * @example
     * INPUT: {{ 1 | vectorClassPrinter }}
     * OUTPUT: 'flight'
     */
    function VectorClassPrinter(constants) {
        return function (bitmask) {
            if (bitmask === undefined) {
                return false;
            }
            if (bitmask === 0) {
                return false;
            }
            var parsedBitmask = parseInt(bitmask);
            switch (true) {
                case ((constants._VECTORS_BIT_MASK.flight | parsedBitmask) == constants._VECTORS_BIT_MASK.flight) :
                    return 'flight';
                    break;
                case ((constants._VECTORS_BIT_MASK.train | parsedBitmask) == constants._VECTORS_BIT_MASK.train) :
                    return 'train';
                    break;
                case ((constants._VECTORS_BIT_MASK.bus | parsedBitmask) == constants._VECTORS_BIT_MASK.bus) :
                    return 'bus';
                    break;
                case ((constants._VECTORS_BIT_MASK.ferry | parsedBitmask) == constants._VECTORS_BIT_MASK.ferry) :
                    return 'ferry';
                    break;
                case ((constants._VECTORS_BIT_MASK.taxi | parsedBitmask) == constants._VECTORS_BIT_MASK.taxi) :
                    return 'taxi';
                    break;
                case ((constants._VECTORS_BIT_MASK.subway | parsedBitmask) == constants._VECTORS_BIT_MASK.subway) :
                    return 'subway';
                    break;
                case ((constants._VECTORS_BIT_MASK.walk | parsedBitmask) == constants._VECTORS_BIT_MASK.walk) :
                    return 'walk';
                    break;
                case ((constants._VECTORS_BIT_MASK.car | parsedBitmask) == constants._VECTORS_BIT_MASK.car) :
                    return 'car';
                    break;
                case ((constants._VECTORS_BIT_MASK.raidshare | parsedBitmask) == constants._VECTORS_BIT_MASK.raidshare) :
                    return 'raidshare';
                    break;
                case ((constants._VECTORS_BIT_MASK.ancillary | parsedBitmask) == constants._VECTORS_BIT_MASK.ancillary) :
                    return 'ancillary';
                    break;
                case ((constants._VECTORS_BIT_MASK.highspeedtrain | parsedBitmask) == constants._VECTORS_BIT_MASK.highspeedtrain) :
                    return 'train';
                    break;
                case ((constants._VECTORS_BIT_MASK.ncc | parsedBitmask) == constants._VECTORS_BIT_MASK.ncc) :
                    return 'ncc';
                    break;
                case ((constants._VECTORS_BIT_MASK.transit | parsedBitmask) == constants._VECTORS_BIT_MASK.transit) :
                    //return 'transit';
                    return 'walk';
                    break;
                case ((constants._VECTORS_BIT_MASK.ancillarystore | parsedBitmask) == constants._VECTORS_BIT_MASK.ancillarystore) :
                    //return 'ancillarystore';
                    return 'walk';
                    break;
                default:
                    return 'walk';
                    break;
            }
        }
    }
})();

/**
 * buyableResults filter
 *
 * returns an array of buyable results
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('buyableResults', BuyableResults);

    BuyableResults.$inject = ['VectorBitmaskService'];

    /**
     * [BuyableResults description]
     * @param {VectorBitmaskService} VectorBitmaskService
     * @param {array} vectors
     * @return {array} buyableVectors
     * @example
     * INPUT: {{ [vectors] | buyableResults }}
     * OUTPUT: [buyableVectors]
     */
    function BuyableResults(VectorBitmaskService) {
        return function (vectors) {
            var buyableVectors = [];
            angular.forEach(vectors, function (vector) {
                if (((vector.bit | VectorBitmaskService.getMainVectors()) == vector.bit) || (vector.buyable == true) || (vector.bit === 256)) {
                    buyableVectors.push(vector);
                }
            });
            return buyableVectors;
        }
    }
})();

/**
 * awsPath filter
 *
 * return awsPath for images.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('awsPath', AwsPath);

    AwsPath.$inject = ['constants'];

    /**
     * [AwsPath description]
     * @param {constants} constants
     * @param {integer} nid
     * @param {integer} type
     * @return {string} awsPath + fileName
     * @example
     * INPUT: {{ 853802 | awsPath:'user' }}
     * OUTPUT: https://s3-eu-west-1.amazonaws.com/wayonara-dev/_users/_avatar_853802.jpg
     */
    function AwsPath(constants) {
        return function (nid, type) {
            var awsPath = null;
            var fileName = null;
            switch (type) {
                case 'user':
                    awsPath = constants._AWS_CDN.userImgPath;
                    fileName = '_avatar_' + nid + '.jpeg';
                    break;
                case 'place':
                    awsPath = constants._AWS_CDN.shardImgPath;
                    fileName = '_cover_' + nid + '.jpeg';
                    break;
                case 'stage':
                    awsPath = constants._AWS_CDN.shardImgPath;
                    fileName = '_cover_' + nid + '.jpeg';
                    break;
                case 'tour':
                    awsPath = constants._AWS_CDN.shardImgPath;
                    fileName = '_cover_' + nid + '.jpeg';
                    break;
            }
            return awsPath + fileName;
        }
    }
})();

/**
 * wnConvertToNumber directive
 *
 * Convert string values for select in integer.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').directive('wnConvertToNumber', WnConvertToNumber);

    /**
     * [WnConvertToNumber description]
     *
     * @param {scope} scope
     * @param {integer} element
     * @param {attrs} attrs
     * @param {ngModel} ngModel
     * @return {integer}
     */
    function WnConvertToNumber() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function (val) {
                    return '' + val;
                });
            }
        };
    }
})();

/**
 * time filter
 *
 * formats trip duration info
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('time', Time);

    /**
     * [Time description]
     * @param  {float}  value
     * @param  {string}  unit
     * @param  {string}  format
     * @param  {Boolean} isPadded
     * @return {string}
     * @example
     * INPUT: {{ 60 | time:'mm':'hhh mmm':false }}
     * OUTPUT: '1h:00m'
     */
    function Time() {
        var conversions = {
            'ss': angular.identity,
            'mm': function (value) {
                return value * 60;
            },
            'hh': function (value) {
                return value * 3600;
            }
        };

        var padding = function (value, length) {
            var zeroes = length - ('' + (value)).length,
                pad = '';
            while (zeroes-- > 0) pad += '0';
            return pad + value;
        };

        return function (value, unit, format, isPadded) {
            var totalSeconds = conversions[unit || 'ss'](value),
                hh = Math.floor(totalSeconds / 3600),
                mm = Math.floor((totalSeconds % 3600) / 60),
                ss = totalSeconds % 60;

            format = format || 'hh:mm:ss';
            isPadded = angular.isDefined(isPadded) ? isPadded : true;
            hh = isPadded ? padding(hh, 2) : hh;
            mm = isPadded ? padding(mm, 2) : mm;
            ss = isPadded ? padding(ss, 2) : ss;

            return format.replace(/hh/, hh).replace(/mm/, mm).replace(/ss/, ss);
        };
    }
})();


/**
 * waitingTime filter
 *
 * Prints waiting time for stopovers.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('waitingTime', WaitingTime);

    /**
     * [WaitingTime description]
     * @param  {array} stopovers
     * @param  {integer} index
     * @return {string} duration
     * @example
     * INPUT: {{ [stopovers] | waitingTime:0 }}
     * OUTPUT: '53m'
     */
    function WaitingTime() {
        return function (stopovers, index) {
            var actualStopover = stopovers[index];
            var nextStopover = stopovers[index + 1];

            var actualStopoverArrival = moment(actualStopover.arrivalDate);
            var nextStopoverDeparture = moment(nextStopover.departureDate);
            return moment.duration(nextStopoverDeparture.diff(actualStopoverArrival)).asMinutes();
            ;

        }
    }
})();


/**
 *  momentTimeZone filter
 *
 *  Filter datetime with correct poi timezone.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('momentTimeZone', MomentTimeZone);

    /**
     * [MomentTimeZone description]
     * @param  {datetime} date
     * @param  {string} format
     * @param  {string} timezone [description]
     * @return {datetime} date
     * @example
     * INPUT: {{ vector.departureDate | momentTimeZone:'HH:mm':vector.origin.timezone }}
     * OUTPUT: vector.departureDate in timezone selected
     *
     */
    function MomentTimeZone() {
        return function (date, format, timezone) {
            if (!angular.isUndefined(date) && (timezone != null)) {
                return moment(date).tz(timezone).format(format);
            }
        }
    }
})();


/**
 *  tripSegmentTime filter
 *
 *  Format segment departure and arrival datetime.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('tripSegmentTime', TripSegmentTime);

    /**
     * [TripSegmentTime description]
     * @param  {time} time
     * @param  {string} format
     * @return {string} splittedTimeArray[0]+':'+splittedTimeArray[1];
     * @example
     * INPUT: {{ displayChunk.departureDate | tripSegmentTime:'HH:mm' }}
     * OUTPUT: displayChunk.departureDate + ':' + displayChunk.departureTime
     */
    function TripSegmentTime() {
        return function (time, format) {
            var splittedDateTimeArray = time.split('T');
            var splittedTimeArray = splittedDateTimeArray[1].split(':');

            return splittedTimeArray[0] + ':' + splittedTimeArray[1];
        }
    }
})();


/**
 * passengerAge filter
 *
 * Prints passenger age in text format
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('passengerAge', PassengerAge);

    PassengerAge.$stateful = true;

    /**
     * [PassengerAge description]
     * @param {integer} age
     * @param {translation} translation
     * @return {string}
     * @example
     * INPUT: {{ 56 | passengerAge}}
     * OUTPUT: 'adult'
     */
    function PassengerAge() {
        return function (age, translation) {
            if ((age === '') || (age === null)) {
                return translation.adult;
            }
            else {
                if ((0 <= age) && (age <= 2)) {
                    return translation.infant;
                }
                if ((2 < age) && (age <= 16)) {
                    return translation.children;
                }
            }
        }
    }
})();


/**
 *  shiftDays filter
 *  calculates day shift from vector departure and arrival date.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('shiftDays', ShiftDays);

    /**
     * [ShiftDays description]
     * @param  {string} departureDate
     * @param  {string} arrivalDate
     * @return {string}
     * @example
     * INPUT: {{ segment.startTime | shiftDays:segment.endTime }}
     * OUTPUT: '+1'
     */
    function ShiftDays() {
        return function (departureDate, arrivalDate) {
            var depMoment = moment(departureDate);
            var arrMoment = moment(arrivalDate);
            var depMomentDays = depMoment.format('DDD');
            var arrMomentDays = arrMoment.format('DDD');
            var shiftDays = arrMomentDays - depMomentDays;
            if (shiftDays > 0) {
                return '+' + shiftDays;
            }
        }
    }
})();


/**
 *  checkSaleablesVectorsInTrip filter
 *  analyze trip bitMask and check if there are saleablesVectors.
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('checkSaleablesVectorsInTrip', CheckSaleablesVectorsInTrip);

    CheckSaleablesVectorsInTrip.$inject = ['VectorBitmaskService'];

    /**
     * [CheckSaleablesVectorsInTrip description]
     * @param {VectorBitmaskService} VectorBitmaskService [description]
     * @param  {integer} tripBm [description]
     * @return {Boolean}        [description]
     * @example
     * INPUT: {{ tripBm | checkSaleablesVectorsInTrip }}
     * OUTPUT: true/false
     */
    function CheckSaleablesVectorsInTrip(VectorBitmaskService) {
        return function (tripBm) {
            return ((tripBm & VectorBitmaskService.getSaleablesVectors()) > 0);
        }
    }
})();

/**
 * bookingPluginClassPrinter filter
 *
 * returns vector class string correspondig to booking plugin bitmask
 */
(function () {
    'use strict';

    angular.module('wayonara.commons').filter('bookingPluginClassPrinter', BookingPluginClassPrinter);

    BookingPluginClassPrinter.$inject = ['constants'];

    /**
     * [BookingPluginClassPrinter description]
     * @param {constants} constants
     * @param {integer} bit
     * @return {string}
     * @example
     * INPUT: {{ 1 | BookingPluginClassPrinter }}
     * OUTPUT: 'flight'
     */
    function BookingPluginClassPrinter(constants) {
        return function (bit) {
            switch (parseInt(bit)) {
                case constants._BOOKING_PLUGIN_BIT_MASK.amadeus:
                    return 'flight';
                    break;
                case constants._BOOKING_PLUGIN_BIT_MASK.ntv:
                    return 'train';
                    break;
                case constants._BOOKING_PLUGIN_BIT_MASK.trenitalia:
                    return 'train';
                    break;
            }
        }
    }
}());
