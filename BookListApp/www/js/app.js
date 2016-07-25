// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var ibmApp = angular.module('ibmApp', ['ionic'])
// Add support for Cordova. 
ibmApp.run(function($ionicPlatform) {
           console.log('>> ibmApp.run ...');
           $ionicPlatform.ready(function() {
             // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
             // for form inputs)
             console.log('>> ibmApp.ready ...');
             if (window.cordova && 
                 window.cordova.plugins && 
                 window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
             }
             if(window.StatusBar) {
               StatusBar.styleDefault();
             }               
               
           });
});
// application config.    
ibmApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $urlRouterProvider - letting us specifsy the default route when loading the module          
    $urlRouterProvider.otherwise('/')
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'partials/book.html',
            controller: 'mainCtrl',
            resolve: {
                books: function (BookService) {
                    return BookService.getBookList();
                }
            }
        })
        
        .state('splash', {
            url: '/',
            /* default url */
            templateUrl: 'pages/splash.html',
            controller: 'splashCtrl'
        })
        
        .state('detail', {
            url: '/detail/:bookId',
            templateUrl: 'partials/details.html',
            controller: 'bookDetailCtrl',
            resolve: {
                bookDetailList: function ($stateParams, BookDetailsService) {
                    return BookDetailsService.getBookDetails($stateParams.bookId);
                },
                bookId: function ($stateParams) {
                    return $stateParams.bookId;
                }
            }
        })
}) // end of app config.
// Add MobileFirst configuration stuff.

var Messages = {
  // Add here your messages for the default language.
  // Generate a similar file with a language suffix containing the translated messages.
  // key1 : message1,
};

var wlInitOptions = {
  // Options to initialize with the WL.Client object.
  // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

function wlCommonInit() {
  console.log(">> wlCommonInit() ..." );      
  var serverUrl = WL.App.getServerUrl(function(success){
      console.log(success);
  }, function(fail){
      console.log(fail);
  });
  
  //Calling to the MobileFirst Server - if we were not using UserLogin then we would leave this uncommented
  //that way when the app starts and connects to the MFP Server it will request an Access Token here
//  WLAuthorizationManager.obtainAccessToken().then(
//        function (accessToken) {
//          console.log(">> Success - Connected to MobileFirst Server");          
//        },
//        function (error) {
//          console.log(">> Failed to connect to MobileFirst Server");          
//        }
//  );

  //manually send data to Analytics on connection
  WL.Analytics.send();    
    
};

