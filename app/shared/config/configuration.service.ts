import { Injectable } from '@angular/core';

import { Locale } from './locale.model';

declare const webpackGlobalVars: any;

@Injectable()
export class ConfigurationService {
    public static socials = {
        facebook: {
            appId: webpackGlobalVars.facebookAppId
        },
        instagram: {
            authUri: 'https://api.instagram.com/oauth/authorize/?client_id={clientID}&redirect_uri={redirectUri}&response_type=code',
            callbackUri: webpackGlobalVars.host + '/user/social/instagram/retrieve/code',
            clientId: '179c95dbbe1f4337a833d3ec5f4c5a7f',
            popupSize: { width: 500, height: 400 }
        },
        twitter: {
            authUri: webpackGlobalVars.host + '/api/usersocialtwitterverify',
            callbackUri: webpackGlobalVars.host + '/user/social/twitter/callbackurl',
            popupSize: { width: 500, height: 400 }
        }
    };

    public static defaultLocale = 'EN';

    public static locales: Locale[] = [
        { code: 'EN', label: 'English (UK)' },
        { code: 'IT', label: 'Italiano' }
    ];

    public static shardBuilderSelector = {
        expanded: 'EXP',
        full: 'FULL',
        stream: 'STREAM'
    };

    public static api = {
        _ADD_SHARDS: webpackGlobalVars.host + '/api/insertshardscollection',
        _BLOCK_USER: webpackGlobalVars.host + '/api/blockprofile',
        _BUILDSHARDFROMURL: webpackGlobalVars.host + '/api/buildshardfromurl',
        _EDIT_PROFILE: webpackGlobalVars.host + '/api/usereditprofile',
        _FOLLOW: webpackGlobalVars.host + '/api/follow',
        _FOLLOWED_PROFILE: webpackGlobalVars.host + '/api/followedprofile',
        _FOLLOWING_PROFILE: webpackGlobalVars.host + '/api/followingprofile',
        _GET_AUTOCOMPLETE_DATA: webpackGlobalVars.host + '/api/datatoautocomplete/:needle/:locale/:bitMask',
        _GET_AWS_SIGNED_URI: webpackGlobalVars.host + '/api/signedurl',
        _GET_COMMENTS: webpackGlobalVars.host + '/api/retrievecommentscollection/:shardId/:page',
        _GET_LANG_FILE: webpackGlobalVars.host + '/api/labels/:locale',
        _GET_POI_FROM_COORDS: webpackGlobalVars.host + '/api/poifromcoordinates',
        _GET_SHARDS: webpackGlobalVars.host + '/api/shards/:selector',
        _GET_SHARD_BY_ID: webpackGlobalVars.host + '/api/shard/:shardId/:selector',
        _GET_SHARDS_ON_STREAM: webpackGlobalVars.host + '/api/wall/STREAM/{page}',
        _INSERT_COMMENT: webpackGlobalVars.host + '/api/insertcomment',
        _LIKE_SHARD: webpackGlobalVars.host + '/api/like',
        _LOAD_USER_BASE_DATA: webpackGlobalVars.host + '/api/user/:userId',
        _LOAD_USER_FULL_DATA: webpackGlobalVars.host + '/api/userfull/:userId',
        _LOGIN_FACEBOOK: webpackGlobalVars.host + '/api/user/social/facebook/login',
        _LOGIN_INSTAGRAM: webpackGlobalVars.host + '/user/social/instagramlogin',
        _LOGIN_TWITTER: webpackGlobalVars.host + '/api/usersocialtwitterlogin',
        _ONBOARDING_SUGGESTED_PLACES: webpackGlobalVars.host + '/api/suggestedplaces',
        _ONBOARDING_SUGGESTED_USERS: webpackGlobalVars.host + '/api/suggestedusers',
        _PLAN_SHARDS_TO_BOARD: webpackGlobalVars.host + '/api/planshardstoboard',
        _RESET_PASSWORD: webpackGlobalVars.host + '/api/userpwdchange',
        _RETRIEVE_BOARDS: webpackGlobalVars.host + '/api/retrieveboards',
        _RETRIEVE_USER_BOARDS: webpackGlobalVars.host + '/api/retrieveboardsforuserdiary',
        _RETRIEVE_COUNTRIES: webpackGlobalVars.host + '/api/countries/:locale',
        _SUBSCRIBE: webpackGlobalVars.host + '/api/userregisterprofile',
        _UNBLOCK_USER: webpackGlobalVars.host + '/api/unblockprofile',
        _UNFOLLOW: webpackGlobalVars.host + '/api/unfollow',
        _UPDATE_BOARD: webpackGlobalVars.host + '/api/updateboard',
        _UPLOAD_AVATAR: webpackGlobalVars.host + '/api/avatarphoto',
        _USERNIDBYUSERNAME: webpackGlobalVars.host + '/api/usernidbyusername/:username',
        passwordReset: webpackGlobalVars.host + '/api/userpwdchange',
        passwordResetSendEmail: webpackGlobalVars.host + '/api/userpwdchangesendmail',
        signIn: webpackGlobalVars.host + '/user/login_check',
        signInSocialFacebook: webpackGlobalVars.host + '/api/user/social/facebook/login',
        tbEndPoint: 'https://tbl.tradedoubler.com/report?organization=2137566&event=368585&leadNumber=:leadNumber',
        tour: webpackGlobalVars.host + '/api/tour/:tourId'
    };

    public static autocompleteRolesBitMask = {
        all: 0xFFFFFFFF,
        attraction: 0x00000008,
        city: 0x00000002,
        hotel: 0x00000004,
        user: 0x00000001
    };

    public static defaultImages = {
        avatar: '/assets/img/user_empty.png',
        boardPreview: '/assets/img/empty-board.png',
        shard: '/assets/img/shard-empty.png',
        tourPreview: '/assets/img/empty-tour.png'
    };

    public static awsCdn = {
        buckets: {
            place: '_places',
            shard: '_shards',
            user: '_users'
        },
        defaultPath: 'https://s3-eu-west-1.amazonaws.com/wayonara-' + webpackGlobalVars.env,
        endpoint: webpackGlobalVars.awsWayonaraBucket, // Polling is done directly in S3
        endpointcf: webpackGlobalVars.awsWayonaraCloudfront,
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
        },
        cloudFront: {
            distributionId: webpackGlobalVars.awsWayonaraCloudFrontDistributionId
        },
        key: 'AKIAJOMOCKH5UCPMFZ6A',
        placeImgPath: 'https://s3-eu-west-1.amazonaws.com/wayonara-' + webpackGlobalVars.env + '/_places/',
        region: 'eu-west-1',
        secret: 'ASS8ZqrO0SBGgUtsmDq+/tuVVqMr7qzPnP8XZCV5',
        shardImgPath: webpackGlobalVars.awsWayonaraCloudfront + '/_shards/', // Retrieving image from AWS cloudfront
        userImgPath: webpackGlobalVars.awsWayonaraBucket + '/_users/' // Retrieving image from AWS cloudfront
    };

    public static shardsBitMask = {
        attraction: 0x00000080,
        hotel: 0x00000010,
        link: 0, // unused
        photo: 0x00000001,
        place: 0x00000004,
        placeAttraction: 0x00000040,
        placeHotel: 0x00000020,
        stage: 0x00000002,
        tour: 0x00000008
    };

    public static vectorsBitMask = {
        flight: 0x00000001
    };

    // NOTE: necessary because there is an inconsistency between shard type, place type and icons shown in shards
    public static linkedPlaceType = {
        2: 'place',
        4: 'place',         // needed in modal plan detail from place page
        16: 'hotel',
        32: 'hotel',        // needed in modal plan detail from placeHotel page
        64: 'attraction',    // needed in modal plan detail from placeAttraction page
        128: 'attraction'
    };

    public static sortBitMask = {
        SCORE: 0x00000001
    };

    public static onboardingActionsBitMask = {
        all: 0xFFFFFFFF,
        none: 0x00000000,
        planStage: 0x00000001,
        welcome: 0x00000002
    };

    public static mailingListUri = 'https://wayonara.us10.grid-manage.com/subscribe/post-json?u=70cb3bbe4e92538026a9e25b3&amp;id=41c965be43';

    public static notificationServerUrl = webpackGlobalVars.notificationServerUrl;

    public static fileExtRegEx = /(?:\.([^.]+))?$/;

    public static maxShardWidth = 2560;
    public static maxShardHeight = 1600;

    public static fileExtRegex = /(?:\.([^.]+))?$/;

    public static durations = {
        pollingInterval: 2000,
        pollingMaxTries: 60,
        searchDelay: 300,
        toast: 4000
    };

    public static wayonaraVersion = webpackGlobalVars.wayonaraVersion;

    public static httpStatusCodes = {
        conflict: 409,
        notAcceptable: 406,
        notFound: 404,
        serverError: 500,
        unauthorized: 401
    };
}

export let configurationServiceInjectables: any[] = [ {
    provide: ConfigurationService,
    useClass: ConfigurationService
} ];
