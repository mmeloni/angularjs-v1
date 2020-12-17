/**
 * Board Service.
 * @author Paolo Mastinu (The King)
 * @refactorer Simone Pitzianti (The KingSlayer)
 */
(function(){
    'use strict';

    angular.module('wayonara.shared')
        .service('BoardService', BoardService);

    BoardService.$inject = [
        '$http',
        'SessionService',
        '$log',
        'api'
    ];
    /**
     *
     * @param $http
     * @param SessionService
     * @param $log
     * @param api
     * @constructor
     */
    function BoardService(
        $http,
        SessionService,
        $log,
        api
    ) {

        // finds a board by its id
        this.getBoardById = getBoardById;

        // plan shard to a board
        this.planShardsToBoard = planShardsToBoard;

        // updates a board
        this.updateBoard = updateBoard;

        // gets boards from user
        // NOTE SIMO: exactly what's the difference between this and getDiaryBoards?
        this.getUserBoards = getUserBoards;

        // deletes shard from a board
        this.deleteShardFromBoard = deleteShardFromBoard;

        // deletes a board
        this.deleteBoard = deleteBoard;

        // gets boards from diary
        // NOTE SIMO: exactly what's the difference between this and getUserBoards?
        this.getDiaryBoards = getDiaryBoards;

        function getBoardById(boardId, page, numberShardsForBoard) {
            var uri = api._GET_BOARD_BY_ID;
            var params = { boardId: boardId, page: page, numberShardsForBoard: numberShardsForBoard };
            return $http.post(uri, params, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function planShardsToBoard(boardRequest) {
            var uri = api._PLAN_SHARDS_TO_BOARD;
            return $http.post(uri, boardRequest, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function updateBoard(board) {
            return $http.post(api._UPDATE_BOARD, board, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function getUserBoards(page, numberBoards) {
            var uri = api._RETRIEVE_BOARDS;
            var params = {
                page: page,
                numberBoards: numberBoards
            };
            return $http.post(uri, params, {headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function deleteShardFromBoard(boardRequest) {
            var uri = api._REMOVE_SHARDS_FROM_BOARDS;
            return $http.post(uri, boardRequest, {headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        function deleteBoard(boardId) {
            var uri = api._DELETE_BOARD.replace('{boardId}', boardId);
            return $http.post(uri, {}, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };

        /**
         * Retrieve the user's boards grid.
         * @param nid the user nid
         * @param page the page number
         * @param boards the number of boards per page
         * @param shards the number of shards per board
         *
         * @return {*} the user's boards grid
         */
        function getDiaryBoards(nid, page, boards, shards){
            var uri = api._RETRIEVE_USER_BOARDS;
            var params = { nid: nid, page: page, numberBoards: boards, numberShardsForBoard: shards };

            return $http.post(uri, params, { headers: { 'Authorization': 'Bearer ' + SessionService.getToken() } });
        };
    }
}());
