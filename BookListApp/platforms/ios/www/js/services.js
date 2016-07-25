
//application services for book, book details, and authentication service.
ibmApp.factory("BookService", function($http){
    console.log( ">> in BookService ...");
    var books = [];

    //call the MFP v8 Adapter that will be available at the following REST API location
    var resourceRequest = new WLResourceRequest(
        "/adapters/BookAdapter/services/list", WLResourceRequest.GET
    );
//[{"id":"019ce63d645ccbeed3834250d8422987","_rev":"1-00690051be7ae95bb9a239102164f496","name":"Pagans and Christians","author":"Robin Lane Fox","image":"http://books.google.com/books/content?id=hfERrlgXZUIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api","category":["Pagan","Christian"]},{"id":"019ce63d645ccbeed3834250d84ef358","_rev":"1-6c905e0c3e09a27a581cc9cdcbf35ed3","name":"Twilight of the Idols","author":"Friedrich Wilhelm Nietzsche","image":"http://placehold.it/140x100","category":["Nietzsche"]},{"id":"019ce63d645ccbeed3834250d8731f3a","_rev":"1-71476f562706a029176a41e89d74d07d","name":"Man and Nature in the Renaissance","author":"Allen G. Debus","image":"http://books.google.com/books/content?id=FX_XtdXtzOoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api","category":["History"]},{"id":"019ce63d645ccbeed3834250d887a5ff","_rev":"1-c22f1a3f9dfe990edb44042c7cbc4419","name":"Magic in the Middle Ages","author":"Richard Kieckhefer","image":"http://books.google.com/books/content?id=9G6ongEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api","category":["History","Magic"]},{"id":"019ce63d645ccbeed3834250d8cbdd61","_rev":"1-baeb37f660668c82cb15ec926962d7f0","name":"Foundations of High Magick","author":"Melita Denning","image":"http://books.google.com/books/content?id=Zn_sAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api","category":["GoldenDawn","Crowley","Alchemy","Hermetics"]},{"id":"019ce63d645ccbeed3834250d8d61f85","_rev":"1-332799b10ea523e7449d15c54ddfd668","name":"The meaning of Religion","author":"Kristensen","category":["Religion"]}....etc...
    return {
        getBookList: function(){
            return resourceRequest.send().then(function(response){
                books = response.responseJSON;
                return books;
            }, function(response){
                console.log("error:" + response);
                return null;
            });
        },
        getBook: function(index){
            return books[index];
        },
        getBookById: function(id){
            var _book;
            angular.forEach(books, function(book) {
                console.log(">> getBookById :" + id + " ==  " + book.id );
                if(book.id == id){ _book = book; } //should break here if found a match
            });
            console.log(">> _book : "+JSON.stringify(_book));
            return _book;
        }
    };
})

ibmApp.factory("BookDetailsService", function($http){
    console.log( ">> in BookDetailsService ...");
    return {
        getBookDetails: function(bookId){
            //using path parameter bookId on the REST API call
            var resourceRequest = new WLResourceRequest(
                "/adapters/BookAdapter/services/details/" + bookId, WLResourceRequest.GET
            );
            return resourceRequest.send().then(function(response){
//[{"id":"019ce63d645ccbeed3834250d8422987","_rev":"1-00690051be7ae95bb9a239102164f496","name":"Pagans and Christians","author":"Robin Lane Fox","publisher":"Penguin UK","year":"2006-07-06","isbn":"0141022957","pages":800,"comment":"How did Christianity compare and compete with the cults of the pagan gods in the Roman Empire? This scholarly work from award-winning historian, Robin Lane Fox, places Christians and pagans side by side in the context of civil life and contrasts their religious experiences, visions, cults and oracles. Leading up to the time of the first Christian emperor, Constantine, the book aims to enlarge and confirm the value of contemporary evidence, some of which has only recently been discovered.","image":"http://books.google.com/books/content?id=hfERrlgXZUIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api","category":["Pagan","Christian"]}]
                return response.responseJSON;
            }, function(response){
                console.log("error:" + response);
                return null;
            });
        }};
 })


/* will be used to validate the username and password */
ibmApp.factory("AuthenticateUserService", function ($http, $q) {
    console.log(">> in AuthenticateUserService ...");
    return {
        authenticatUser: function (user) {            
            // Perform some asynchronous operation, resolve or reject the promise when appropriate.
            
            /* Will be replaced with MFP WLResource Request to authenticate using back end*/                    
            
            // set the deferred 
            var deferred = $q.defer();
            setTimeout(function() {
                if(user.username == "demo" && user.password == "demo"){
                   deferred.resolve(true);
                }else{
                   deferred.reject(false);
                }                                
            }); 
            // return the deferred promise
            return deferred.promise;
        }
    };
})