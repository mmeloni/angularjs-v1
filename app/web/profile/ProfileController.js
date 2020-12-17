(function () {
    'use strict';
    angular.module('wayonara.social').controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'target', 'UserService', '$state', '$log', 'translationResolved', 'translatedCountriesResolved', '$uibModal', 'constants', '_', 'FollowService', 'ShardFactory', 'HelperUploadCoverService', '$rootScope'];

    function ProfileController($scope, target, UserService, $state, $log, translationResolved, translatedCountriesResolved, $uibModal, constants, _, FollowService, ShardFactory, HelperUploadCoverService, $rootScope) {
        $scope.translation = translationResolved;

        $scope.applyFilters = HelperUploadCoverService.filterFile;

        $scope.isUploadedAvatar = false;
        $scope.isUploadedCover = false;
        $scope.loadingAvatar = false;

        $log.debug('-- ProfileController - $scope.translation', $scope.translation);

        $scope.translatedCountries = translatedCountriesResolved;
        $log.debug('-- ProfileController - $scope.translatedCountries', $scope.translatedCountries);

        $scope.actor = UserService.getUser();
        $log.debug('-- ProfileController - $scope.actor', $scope.actor);

        $scope.target = target;
        $log.debug('-- ProfileController - $scope.target', $scope.target);

        $scope.translationFollowButton = {
            follow: [translationResolved.follow].join(' '),
            unfollow: [translationResolved.unfollow].join(' ')
        };

        $scope.showFollowButton = false;

        $scope.stats = [
            {
                label: translationResolved.shards,
                value: $scope.target.shardsCount,
                state: {
                    name: 'profile.view.stages',
                    params: {
                        userId: $scope.target.nid
                    }
                }
            },
            {
                label: translationResolved.boards,
                value: $scope.target.boardsCount,
                state: {
                    name: 'profile.view.boards',
                    params: {
                        userId: $scope.target.nid
                    }
                }
                //'/#/profile/'+$scope.target.nid+'/view/boards'
            },
            {
                label: translationResolved.tours,
                value: $scope.target.toursCount,
                state: {
                    name: 'profile.view.tours',
                    params: {
                        userId: $scope.target.nid
                    }
                }
                //'/#/profile/'+$scope.target.nid+'/view/tours'
            },
            {
                label: translationResolved.following,
                value: $scope.target.followingCount,
                state: {
                    name: 'profile.view.following',
                    params: {
                        userId: $scope.target.nid
                    }
                }
                //'/#/profile/'+$scope.target.nid+'/view/following'
            },
            {
                label: translationResolved.followers,
                value: $scope.target.followersCount,
                state: {
                    name: 'profile.view.followers',
                    params: {
                        userId: $scope.target.nid
                    }
                }
                //'/#/profile/'+$scope.target.nid+'/view/followers'
            }
        ];
        // new actionbar view
        $scope.actionbar = {}
        $scope.actionbar.items = $scope.stats;

        if (target.nid == UserService.getUser().nid) {
            $scope.showFollowButton = false;
            if ($state.current.name === 'profile.view.stages' || $state.current.name === 'profile.view') {
                $scope.actionbar.actions = [
                    {
                        key: 'editProfile',
                        label: translationResolved.editProfile,
                        action: function () {
                            $state.go('profileEdit');
                        },
                        status: 'btn-default'
                    }
                ];
            } else {
                $scope.actionbar.actions = [
                    {
                        key: 'cancelEditProfile',
                        label: translationResolved.cancel,
                        action: function () {
                            // $state.go('profile.view.stages', { userId: UserService.getUser().nid });
                            const user = UserService.getUser();

                            $state.go('profileByView', {
                                userNid: user.nid,
                                viewType: 'stages'
                            });
                        },
                        status: 'btn-default'
                    }
                ];
            }
        }

        if (target.nid != UserService.getUser().nid) {
            var labelBlock = (target.isBlockedProfile === true) ? translationResolved.unblock : translationResolved.block;
            var classBlock = (target.isBlockedProfile === false) ? 'btn-default' : 'btn-danger';

            $scope.showFollowButton = true;

            $scope.actionbar.actions = [
                {
                    key: 'user-block',
                    label: labelBlock,
                    action: toggleBlockAction,
                    status: classBlock
                }
            ];
        }

        // BEGIN BLOCK BUTTON LOGIC: better to move in a separate component in future implementations
        function toggleBlockAction() {
            // faking it for a snappier UX
            updateByIsBlocked();

            // actually doing it
            toggleBlock($scope.target.nid, !$scope.target.isBlockedProfile)
                .then(function (response) {
                    $log.debug('-- ProfileController.toggleBlockAction - then', response);
                })
                .catch(function (error) {
                    // rollback because we faked it in advance
                    $log.debug('-- ProfileController.toggleBlockAction - catch', error);
                    updateByIsBlocked();
                });
        }

        function toggleBlock(targetId, isTargetBlocked) {
            $log.debug('-- ProfileController.toggleBlock - targetId, isTargetBlocked', targetId, isTargetBlocked);
            if (isTargetBlocked === true) {
                return UserService.unblockUser(targetId)
                    .then(function (response) {
                        $log.debug('-- ProfileController.unblockUser - then', response);
                        // return false;
                    })
                    .catch(function (error) {
                        $log.debug('-- ProfileController.unblockUser - catch', error);
                    });
            } else {
                return UserService.blockUser(targetId)
                    .then(function (response) {
                        $log.debug('-- ProfileController.blockUser - then', response);
                        // return true;
                    })
                    .catch(function (error) {
                        $log.debug('-- ProfileController.blockUser - catch', error);
                    });
            }
        }

        function updateByIsBlocked() {
            $scope.target.isBlockedProfile = !$scope.target.isBlockedProfile;
            toggleSetBlockButton($scope.target.isBlockedProfile, translationResolved.block, translationResolved.unblock);
        }

        function toggleSetBlockButton(isBlocked, blockText, unblockText) {
            if (isBlocked === true) {
                return setButtonToUnblock(unblockText);
            } else {
                return setButtonToBlock(blockText);
            }
        }

        function setButtonToBlock(blockText) {
            var item = _.find($scope.actionbar.actions, { key: 'user-block' });
            item.action = toggleBlockAction,
                item.label = blockText;
            item.status = 'btn-default';
        }

        function setButtonToUnblock(unblockText) {
            var item = _.find($scope.actionbar.actions, { key: 'user-block' });
            item.action = toggleBlockAction,
                item.label = unblockText;
            item.status = 'btn-danger';
        }

        // END BLOCK BUTTON LOGIC: better to move in a separate component in future implementations

        /**
         * Save the profile after editing completed.
         * @param {boolean} isValid
         */
        $scope.saveEditedProfile = function (isValid) {
            // When porting to Angular, remember to leverage the URL type and its validation (constructor throws exceptions) for the website property

            $log.debug('-- ProfileController - saveEditedProfile isValid' + isValid);
            $log.debug('-- ProfileController - saveEditedProfile $scope.target', $scope.target);

            //fix user edit broken city
            if ($scope.target.city) {
                var cityInputModel = $scope.target.city.name;
                $scope.target.city = cityInputModel.neo4jId;
                $log.debug('-- ProfileController - $scope.target.city', $scope.target.city);
                $log.debug('-- ProfileController - cityInputModel', cityInputModel);
            }

            //fix user edit broken birthdate
            if ($scope.target.dateOfBirth) {
                var dateOfBirthInputModel = $scope.target.dateOfBirth.date;
                $scope.target.dateOfBirth = dateOfBirthInputModel;
            }

            $scope.loading = true;
            UserService.updateUserData($scope.target)
                .then(function (response) {
                    $log.debug(response);
                    //$scope.profileStatus = translationResolved.success;
                    $scope.target = UserService.deserialize(response);
                    UserService.setUser($scope.target);
                    $state.go('profileEdit', null, { reload: true });
                    $scope.loading = false;
                })
                .catch(function (response) {
                    $log.debug(angular.fromJson(response).message);
                    var profileEval = angular.fromJson(response).message;
                    $scope.profileStatus = $scope.translation[profileEval];
                    $scope.loading = false;
                });
        };

        /**
         * Upload a new _deprecated.avatar.
         */
        //NEW
        $scope.openCropup = function (size) {
            $scope.animationsEnabled = true;
            $scope.isUploadedAvatar = false;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'web/profile/cropup.html',
                controller: 'CropupController',
                size: size,
                resolve: {
                    loggedUser: function () {
                        return $scope.target;
                    }
                }
            });

            modalInstance.result.then(function (response) {
                $log.debug('-- ProfileController - modalInstance.result - response', response);
                $scope.isUploadedAvatar = true;
                $scope.loadingAvatar = true;
                $rootScope.$broadcast('WN_EVT_USER_AVATAR_UPLOADED');
            });
        };

        $scope.ok = function () {
            $scope.isUploadedAvatar = true;
            $log.debug('-- ProfileController.ok - $scope.selected.item', $scope.selected.item);
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $scope.isUploadedAvatar = false;
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * Upload a new cover.
         */
        $scope.uploadCover = function (file) {
            $scope.loading = true;
            $scope.isUploadedCover = false;

            $scope.userCover = file;

            UserService.uploadCover(file, $scope.target.nid)
                .then(function (response) {
                        $scope.loading = false;
                        $scope.isUploadedCover = true;
                        $rootScope.$broadcast('WN_EVT_USER_COVER_UPLOADED');
                    },
                    function (error) {
                        $scope.loading = false;
                        $scope.isUploadedCover = false;
                    }
                )
                .catch(function (response) {
                    $scope.loading = false;
                    $scope.isUploadedCover = false;
                    $log.debug('An error occurred on Upload User Cover');
                    $log.debug(response);
                });
        };

        $scope.setloadingAvatar = function (isLoading) {
            $scope.loadingAvatar = isLoading;
        }

        $scope.setLoading = function (isLoading) {
            $scope.loading = isLoading;
        }

        $scope.$on('WN_EVT_SHARD_CREATED', function (event, data) {
            var needsUpdateShardsCount = data.bit === constants._SHARD_BIT_MASK.stage
                || data.bit === constants._SHARD_BIT_MASK.attraction
                || data.bit === constants._SHARD_BIT_MASK.hotel

            if (needsUpdateShardsCount === true) {
                $scope.stats[0].value += 1;
            }
        });
    }
}());
