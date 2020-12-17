angular.module('wayonara.config', [])

.constant('constants', {
    _ENV: {
        development: 'dev',
        test: 'test',
        stage: 'stag',
        production: 'prod'
    },
    _DEBUG_ENABLED: (webpackGlobalVars.env=='dev' || webpackGlobalVars.env=='stag'),
    _TOAST_NOTIFICATION_TIMEOUT: 4000,
    _ACL_EVENTS : {
        logged: 'acl-logged',
        notLogged: 'acl-not-logged',
        loginInvalid: 'acl-wrong-credentials',
        timeout: 'acl-session-timeout'
    },
    _SHARD_BIT_MASK : {
        'link': 0,
        'photo':            0x00000001,
        'stage':            0x00000002,
        'tour' :            0x00000008,
        'attraction':       0x00000080,
        'hotel' :           0x00000010,
        'placehotel' :      0x00000020,
        'place' :           0x00000004,
        'placeattraction' : 0x00000040
    },

    // NOTE: necessary because there is an inconsistency between shard type, place type and icons shown in shards
    linkedPlaceType : {
        2: 'place',
        16: 'hotel',
        128: 'attraction'
    },

    //TODO: useless, seek and destroy
    _ONBOARDING_STATUS_MASK: {
        'welcome':0,
        'places':1,
        'users':2,
        'friends':4,
        'home':8
    },
    //TODO: useless, seek and destroy
    _PROFILE_ACTIONS_BIT_MASK : {
        'settings': 0,
        'edit': 0,
        'follow': 1,
        'block':0
    },
    //TODO: useless, seek and destroy
    _STAGE_ACTIONS_BIT_MASK : {
        'follow': 1,
        'addTo': 0
    },
    //TODO: useless, seek and destroy
    _TAGS_BIT_MASK : {
        'poi': 1,
        'interest': 2,
        'user': 3,
        'stage': 4
    },
    _ONBOARDING_ACTIONS_BIT_MASK : {
        'NONE' :        0x00000000,
        'PLAN_STAGE' :  0x00000001,
        'ALL':          0xFFFFFFFF
    },
    _VECTORS_BIT_MASK : {
        'flight':           0x00000001,
        'train' :           0x0001C400,
        'bus':              0x00000004,
        'ferry':            0x00000008,
        'taxi':             0x00000010,
        'subway':           0x00000020,
        'walk':             0x00000040,
        'car':              0x00000080,
        'raidshare':        0x00000100,
        'ancillary':        0x00000200,
        'highspeedtrain':   0x00000400,
        'ncc':              0x00000800,
        'transit':          0x00001000,
        'ancillarystore':   0x00002000
    },

    _BOOKING_PLUGIN_BIT_MASK : {
        'amadeus':      0x00000001,
        'ntv':          0x00000002,
        'trenitalia':   0x00000004,
        'merchant':     0x00000008
    },

    _TOUR_ROLES_BIT_MASK: [
        {label:'MASK_VIEW', value: 1},
        {label:'MASK_EDIT', value: 4},
        {label:'MASK_OWNER', value: 128}
    ],
    _AUTOCOMPLETE_ROLES_BIT_MASK: {
        'user':           0x00000001,
        'city' :          0x00000002,
        'hotel':          0x00000004,
        'attraction':     0x00000008,
        'all' :           0xFFFFFFFF
    },
	_SOCIALS : {
		instagram: {
			authUri: 'https://api.instagram.com/oauth/authorize/?client_id={clientID}&redirect_uri={redirectUri}&response_type=code',
			callbackUri: webpackGlobalVars.host + '/user/social/instagram/retrieve/code',
			clientId: '179c95dbbe1f4337a833d3ec5f4c5a7f',
			popupSize: {'width':500, 'height':400}
		},
		twitter: {
			callbackUri: webpackGlobalVars.host + '/user/social/twitter/callbackurl',
			authUri: webpackGlobalVars.host + '/api/usersocialtwitterverify',
			popupSize: {'width':500, 'height':400}
		}
	},
    _AWS_CDN:{
        defaultPath: 'https://s3-eu-west-1.amazonaws.com/wayonara-'+ webpackGlobalVars.env,
        shardImgPath: webpackGlobalVars.awsWayonaraCloudfront + '/_shards/',
        userImgPath: webpackGlobalVars.awsWayonaraBucket + '/_users/',
        placeImgPath: 'https://s3-eu-west-1.amazonaws.com/wayonara-'+ webpackGlobalVars.env + '/_places/',
        key: 'AKIAJOMOCKH5UCPMFZ6A',
        secret: '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',
        region: 'eu-west-1',
        imgFormats: {
            avatar: '_avatar_',
            cover: '_cover_',
            coverPopover: '_cover_popover_',
            coverTour: '_cover_tour_',
            double: '_double_shard_',
            fullHorizontal: '_horizontal_full_',
            fullVertical: '_vertical_full_',
            original: 'full_shard_',
            quad: '_quad_shard_',
            single: '_single_shard_',
            square: '_square_',
            tourView: '_tour_view_',
            triple: '_triple_shard_'
        }
    },
    _AGES_SELECT: [
        {label:'Age', value: null},
        {label:'0', value: 0},
        {label:'1', value: 1},
        {label:'2', value: 2},
        {label:'3', value: 3},
        {label:'4', value: 4},
        {label:'5', value: 5},
        {label:'6', value: 6},
        {label:'7', value: 7},
        {label:'8', value: 8},
        {label:'9', value: 9},
        {label:'10', value: 10},
        {label:'11', value: 11},
        {label:'12', value: 12},
        {label:'13', value: 13},
        {label:'14', value: 14},
        {label:'15+', value: null}
    ],
    _CREDIT_CARDS_ACCEPTED:[
        {cc:'Visa', url: '../assets/img/card-visa-32@2x.png'},
        {cc:'Amex', url: '../assets/img/card-amex-32@2x.png'},
        {cc:'Mastercard', url: '../assets/img/card-mastercard-32@2x.png'}
    ],
    _TOUR_NAVBAR_EVENTS : {
        book: 'tour-navbar-book-all'
    },

    _API_METHODS: {
        'post': 'POST',
        'get': 'GET'
    },
    _FILE_EXT_REGEX: /(?:\.([^.]+))?$/,
    _STRIPE_PUBLISHABLE_KEY: webpackGlobalVars.stripePublishableKey,
    _MAILING_LIST_URI: 'https://wayonara.us10.grid-manage.com/subscribe/post-json?u=70cb3bbe4e92538026a9e25b3&amp;id=41c965be43',
    _ITINERARY_OPERATION_ENUM: {
        'BOOKING_RECAP': 0x1,
        'BOOKING_FORM': 0x2,
        'BOOKING_PAYMENT': 0x4
    },
    _MAX_SHARD_WIDTH: 2560,
    _MAX_SHARD_HEIGHT: 1600,
    _SHARD_BUILDER_SELECTOR: {
        'expanded': 'EXP',
        'stream': 'STREAM',
        'full': 'FULL'
    }
});
