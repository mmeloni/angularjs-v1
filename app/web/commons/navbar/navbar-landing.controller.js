(function() {
    'use strict';

    angular.module('wayonara.social').controller('NavbarLandingController', NavbarLandingController);

    NavbarLandingController.$inject = ['$scope', '$log', '$compile', 'TranslationService', 'SessionService'];
    function NavbarLandingController($scope, $log, $compile, TranslationService, SessionService) {

        $scope.showLogoInverted = true;
        $scope.showLogo = false;
        
        $scope.cookiesAccepted = SessionService.getCookiesAccepted() || false;
        $scope.acceptCookies = function() {
            $scope.cookiesAccepted = SessionService.setCookiesAccepted(true);
        }        

       updateTranslations();
       $scope.$on('WN_EVT_LANGUAGE_CHANGED', function() {
         $log.debug('Got WN_EVT_LANGUAGE_CHANGED');
         updateTranslations();
       });

       angular.element(window).on('mousewheel.wnScroll DOMMouseScroll.wnScroll', function(event) {
         var $navbar = $('.navbar-fixed-top');
         var $cta = $navbar.find('.login-landing');
         if (document.getElementById('shard-wayonara').getBoundingClientRect().top >= 0) {
             $scope.showLogoInverted = true;
             $scope.showLogo = false;
          TweenLite.set($navbar, { css: { className: '+=navbar-inverse' } });
          TweenLite.set($navbar, { css: { className: '-=navbar-default' } });

          TweenLite.set($cta, { css: { className:'-=inverted' } });
         } else {
          if ($navbar.hasClass('navbar-inverse') === true) {
              $scope.showLogoInverted = false;
              $scope.showLogo = true;
              TweenLite.set($navbar, { css: { className: '-=navbar-inverse' } });
              TweenLite.set($navbar, { css: { className: '+=navbar-default' } });

              TweenLite.set($cta, { css: { className: '+=inverted' } });
          }
         }

       });

       $scope.$on('$destroy',function() {
         $log.debug('Destroying all listeners...');
         angular.element(window).off('mousewheel.wnScroll DOMMouseScroll.wnScroll');
         $('#loginModal').remove();
       });

       $scope.loginButtonIsDisabled = false;

       $scope.showLoginDialog = function() {
         $scope.loginButtonIsDisabled = true;
         var $modalLogin = '<wn-modal-window id="loginModal" item="shard" controller="ModalWindowLoginController" wn-modal-window-tpl="login"></wn-modal-window>';
         $('body').append($compile($modalLogin)($scope));
       };

       $scope.showLoginButton = function() {
         $scope.loginButtonIsDisabled = false;
         $scope.$apply();
       };

       function updateTranslations() {
         $scope.translation = TranslationService.getTranslationLabels();
       }
    }
}());
