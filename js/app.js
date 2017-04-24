// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

// .constant('HOST', 'http://www.googledrive.com/host/0BzPof9aK-ahTNldCQ0pmQXpTVVU/')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'tabs.html',
    controller: 'AppCtrl',
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'home-tab': {
        templateUrl: 'tab-home.html',
      }
    },
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'settings-tab': {
        templateUrl: 'tab-settings.html',
        controller: 'SettingsCtrl'
      }
    },
    onEnter: function ($state, Auth) {
      if (!Auth.loggedIn()) {
        $state.go('tab.home');
      }
    }
  })

  .state('tab.audit', {
    url: '/audit',
    views: {
      'home-tab': {
        templateUrl: 'audit.html',
        controller: 'AuditCtrl'
      }
    },
    // If the user refreshes browser, we want to go back to home page, instead of audit
    onEnter: function ($ionicHistory, $state) {
      var historyId = $ionicHistory.currentHistoryId();
      // historyId will be null on refresh
      if (!historyId) {
        $state.go('tab.home');
      }
    },
  })

  .state('tab.complete', {
    url: '/complete',
    views: {
      'home-tab': {
        templateUrl: 'complete.html',
        controller: 'CompleteCtrl'
      }
    },
    onEnter: function ($state, Auth) {
      if (!Auth.loggedIn()) {
        $state.go('tab.home');
      }
    }
  })

  .state('tab.download', {
    url: '/download',
    views: {
      'download-tab': {
        templateUrl: 'tab-download.html',
        controller: 'DownloadCtrl'
      }
    },
    onEnter: function ($state, Auth) {
      if (Auth.loggedIn() !== Auth.admin()) {
        console.log('failed auth for tab.download');
        $state.go('tab.home');
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

angular.module('starter.controllers', []);
angular.module('starter.services', []);