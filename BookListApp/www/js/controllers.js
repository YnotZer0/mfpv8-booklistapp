// Application controllers.

ibmApp.controller('appCtrl', function ($scope) {
//    $scope.logout = function () {
//        console.log(">> in appCtrl >> logout ... ");
//        $scope.user = {
//            username: "",
//            password: ""
//        };
//    }                    

    $scope.logout = function() {
        console.log(">> in appCtrl >> logout ... ");
        $timeout(function(){        
                    $scope.user = { username: "", password: ""};
        }, 200);                
        WLAuthorizationManager.logout("UserLogin").then(
            function () {
                console.log(">> logout onSuccess");
                $state.transitionTo("splash");  
            },
            function (response) {
                console.log(">> logout onFailure: " + JSON.stringify(response));
                $state.transitionTo("splash");  
            });
    }    
})

ibmApp.controller('mainCtrl', ['$scope', 'books',  function ($scope, books) {
    console.log(">> in mainCtrl ... ");
    //ionicMaterialInk.displayEffect();    
    $scope.books = books;
    
    var event = {viewLoad: 'Book List View'};
    WL.Analytics.log(event, 'Book List View - loaded');
    
}])


ibmApp.controller('bookDetailCtrl', function($scope, BookService,
                             bookDetailList , bookId ,$ionicHistory) {
/*
  $scope.book = {
        "name" : "",
        "author" : "",
        "publisher" : "",
        "isbn" : "",
        "pages" : 0,
        "comment" : "",
        "image" : "",
        "category" : [],
        "id" : ""
  }
*/
  $scope.bookDetails = {};
//  [{"id":"019ce63d645ccbeed3834250d8422987","_rev":"1-00690051be7ae95bb9a239102164f496","name":"Pagans and Christians","author":"Robin Lane Fox","publisher":"Penguin UK","year":"2006-07-06","isbn":"0141022957","pages":800,"comment":"How did Christianity compare and compete with the cults of the pagan gods in the Roman Empire? This scholarly work from award-winning historian, Robin Lane Fox, places Christians and pagans side by side in the context of civil life and contrasts their religious experiences, visions, cults and oracles. Leading up to the time of the first Christian emperor, Constantine, the book aims to enlarge and confirm the value of contemporary evidence, some of which has only recently been discovered.","image":"http://books.google.com/books/content?id=hfERrlgXZUIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api","category":["Pagan","Christian"]}]
  console.log(">> in bookDetailCtrl:" + bookDetailList);
  
  //We can call the Book service to get the values from the cached the list of books
  //unfortunately the book will only contain the fields values displayed on the LIST view and not ALL of the details though
//  $scope.book = BookService.getBookById(bookId);
//  console.log(">> $scope.book:"+JSON.stringify($scope.book));

  //Or we can call the Adapter and get the detailed values fresh from the external server
  $scope.bookDetails = bookDetailList[0]; //as we return an array with 1 value, just extract the [0] element
//  console.log(">> $scope.bookDetails:"+JSON.stringify($scope.bookDetails));
//  $scope.bookDetails.email =  angular.lowercase($scope.bookDetails.email);

  var event = {viewLoad: 'Book Details View'};
  WL.Analytics.log(event, 'Book Details View - loaded');
    
})


ibmApp.controller('splashCtrl', ['$scope', '$stateParams', '$timeout', '$state', 'AuthenticateUserService', '$ionicPopup', '$location', function ($scope, $stateParams, $timeout, $state, AuthenticateUserService, $ionicPopup, $location) {
    console.log(">> in splashCtrl - ... ");          
    $scope.user = {
            username: "demo",  //remove these values when not DEMOing
            password: "demo"
        }
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    
//    $scope.doLogin = function () {
//            console.log(">> loginCtrl - $scope.user:" + $scope.user);
//            /* Validation service of user name and password */
//            AuthenticateUserService.authenticatUser($scope.user).then(function(success){                
//                console.log(">> AuthenticateUserService.authenticatUser -> success: " + success);
//                $state.transitionTo("main");                
//            }, function(failed){
//                console.log(">> AuthenticateUserService.authenticatUser -> failed: " + failed);
//                //Notify user wrong username and password.  
//                $scope.showLoginError();
//            });                        
//    }
/* using mfp challenge handler */    
    $scope.doLogin = function () {
    console.log(">> loginCtrl - doLogin - $scope.user:" + $scope.user);            
        if ($scope.isChallenged){
            console.log(">> loginCtrl - doLogin -  $scope.isChallenged == true");            
            $scope.userLoginChallengeHandler.submitChallengeAnswer({
                'username': $scope.user.username, 
                'password': $scope.user.password
            });
        } else {
            console.log(">> loginCtrl - doLogin -  $scope.isChallenged == false");            
            WLAuthorizationManager.login("UserLogin",{
                'username':$scope.user.username, 
                'password':$scope.user.password
            }).then( function () {
                console.log(">> WLAuthorizationManager.login - onSuccess");
                $state.transitionTo("main");                        
            },
            function (response) {
                console.log(">> WLAuthorizationManager.login - onFailure: " + JSON.stringify(response));
                $scope.showLoginError();
            });
        }               
    }  
    $scope.isChallenged = false;
    //The following is the Adapter and The Mandatory Application Scope set for the Mobile Application
    $scope.securityCheckName = 'UserLogin';    
    $scope.userLoginChallengeHandler = null;

    $scope.registerChallengeHandler = function(){        
    console.log(">> in $scope.registerChallangeHandler ... ");
        $scope.userLoginChallengeHandler = WL.Client.createWLChallengeHandler($scope.securityCheckName);    
        $scope.userLoginChallengeHandler.securityCheckName = $scope.securityCheckName;    

        $scope.userLoginChallengeHandler.handleChallenge = function(challenge) {
            console.log(">> in UserLoginChallengeHandler - userLoginChallengeHandler.handleChallenge ...");
            //show the login ...                     
            $scope.user = { username: "", password: ""};            
            $scope.currentPath = $location.path();
            console.log(">> $location.path(): " + $location.path());
            $state.transitionTo("splash");            
            $scope.isChallenged = true;

            var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
            if (challenge.errorMsg !== null){
                statusMsg = statusMsg + "<br/>" + challenge.errorMsg;                
                $timeout(function(){   
                    //want to show only when submit user/pass not when token expired ...
                    if($scope.currentPath == "/"){
                        $scope.showLoginError(statusMsg);    
                    }                    
                 }, 300);        
            }
            console.log(">>> statusMsg : " + statusMsg);
        };

        $scope.userLoginChallengeHandler.processSuccess = function(data) {                
            console.log(">> in UserLoginChallengeHandler - userLoginChallengeHandler.processSuccess ...");        
            $scope.isChallenged = false;     
            $timeout(function(){        
                    $scope.user = { username: "", password: ""};
            }, 200);                    
            $state.transitionTo("main");                
        };

        $scope.userLoginChallengeHandler.handleFailure = function(error) {
            console.log(">> in UserLoginChallengeHandler - userLoginChallengeHandler.handleFailure ...");
            console.log(">> handleFailure: " + error.failure);
            $scope.isChallenged = false;
            if (error.failure !== null){
                alert(error.failure);
            } else {
                alert("Failed to login.");
            }
        };
    }

    //show alert login error ... 
    $scope.showLoginError = function(msg) {
        if(msg == null || msg == undefined) msg = 'Please check your username and password and try again';
        var alertPopup = $ionicPopup.alert({
            title: 'Login Error!',
            template: msg
        });
        alertPopup.then(function(res) {
            console.log('>> Thank you for trying ...');
        });
    };
    //show alert login error ... 
//    $scope.showLoginError = function() {
//        var alertPopup = $ionicPopup.alert({
//            title: 'Login Error!',
//            template: 'Please check your username and password and try again'
//        });
//        alertPopup.then(function(res) {
//            console.log('>> Thank you for trying ...');
//        });
//    };
    
    $scope.doShowLogin = function(){
        console.log(">> SplashCtrl - doShowLogin() ... ");   
        $scope.hideSplashBox();
    }


//The move and hide appear to be a little flaky, so get rid of them?
    $scope.moveSplashBox = function() {
        var splashNextBox = document.getElementById('splash-next-box');
        move(splashNextBox).ease('in-out').y(-515).duration('0.5s').end();
        //move('.signInMsg').rotate(360).end();
    };          
    
    $scope.hideSplashBox = function() {
        var splashNextBox = document.getElementById('splash-next-box');        
        move(splashNextBox).ease('in-out').y(515).duration('0.5s').end(
            function(){
                console.log(">>> showLogin ... ");
                var loginBox = document.getElementById('login-box');
                move(loginBox).ease('in-out').y(-515).duration('0.5s').end();
            }
        );
        //move(loginBox).ease('in-out').y(-385).duration('0.5s').end
    };
    

//comment out, we don't care about waiting a while to see the login details, show immediately
//    $timeout(function(){        
//        //fix android bug where renders splash screen incorrect. 
//        var splashNextBox = document.getElementById('splash-next-box'); 
//        var loginBox = document.getElementById('login-box');
//        splashNextBox.style.display = 'block';
//        loginBox.style.display = 'block'        
//    }, 415);
        
    $timeout(function(){        
        $scope.moveSplashBox();
        var event = {viewLoad: 'Splash View'};
        if(WL!=null && WL!=undefined) WL.Analytics.log(event, 'Splash View - loaded');

        //add a call to register our challengeHandler
        $scope.registerChallengeHandler();

    }, 3000);        
    
}])