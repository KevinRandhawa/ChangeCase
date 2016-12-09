angular.module('app',['ui.router'])
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url: '/:error',
        templateUrl: './views/home.html',
        controller: 'MainCtrl',
        resolve: {
          promiseObj: function(factory){
            return factory.getUserData();
          }
        }
      })

    $urlRouterProvider.otherwise('/');
  })
