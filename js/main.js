'use strict';
var app = angular.module('wallet', ['ngStorage', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/home.html"
        })
        .state('source', {
            url: "/source",
            templateUrl: "partials/source-view.html"
        })
});

app.provider('currency', function () {
    return {
        $get: function () {
            return {
                list: {
                    eur: {
                        code: "€",
                        class: "eur"
                    },
                    gbp: {
                        code: "£",
                        class: "gbp"
                    },
                    usd: {
                        code: "$",
                        class: "usd"
                    }
                }
            }
        }
    }
});

app.controller('MenuCtrl', ['$scope', 'currency', '$localStorage', '$rootScope', '$state',
    function ($scope, currency, $localStorage, $rootScope, $state) {
        $scope.$storage = $localStorage.$default({
            activeCurrency: "gbp",
            transactions: [],
            balance: 0
        });
        $scope.reset = function () {
            $scope.$storage.transactions = [];
            $scope.$storage.balance = 0;
            $state.go("home", null, { reload: true });
        };

        $scope.currencies = currency;

        $scope.changeActive = function (currency) {
            $scope.$storage.activeCurrency = currency;
            $rootScope.$broadcast('UPDATE_CURRENCY', currency);
        }
    }
]);

app.controller('WalletCtrl', ['$scope', 'currency', '$localStorage', '$rootScope',
    function ($scope, currency, $localStorage, $rootScope) {
        $scope.form = {};
        $scope.form.action = 'add';
        $scope.form.message = '';
        $scope.form.messagetype = '';
        $scope.form.amount = '';
        $scope.currencies = currency;
        $scope.$storage = $localStorage;

        $scope.currency = $scope.currencies.list[$scope.$storage.activeCurrency];

        $scope.save = function () {
            var amount = parseInt($scope.form.amount);
            if ($scope.form.action == 'remove') {
                amount = amount * -1;
            }
            var balance = parseInt($scope.$storage.balance) + amount;
            if(balance >= 0) {
                $scope.$storage.transactions.push({
                    time: Date.now(),
                    amount: amount,
                    balance: balance
                });
                $scope.$storage.balance = balance;
                $scope.form.message = '';
                $scope.form.messagetype = '';
            }
            else {
                $scope.form.message = 'Sorry but you cannot have a negative balance';
                $scope.form.messagetype = 'error';
            }
            $scope.form.amount = "";
        }

        $rootScope.$on('UPDATE_CURRENCY', function (event, newCurrency) {
            $scope.currency = $scope.currencies.list[newCurrency];
        });
    }
]);

app.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }
           return transformedInput;         
       });
     }
   };
});

app.filter('curr', [function () {
    return function (amount, currency) {
        if(amount<0) {
            return "-" + currency + Math.abs(amount);
        }
        else{
            return currency + amount; 
        }
    };
}]);