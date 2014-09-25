'use strict';
var app = angular.module('wallet', ['ngStorage']);

app.provider('currency', function () {
    return {
        $get: function () {
            return {
                list:{
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


app.controller('MenuCtrl', ['$scope', 'currency', '$localStorage', '$rootScope',
    function ($scope, currency, $localStorage, $rootScope) {
        $scope.$storage = $localStorage;
        $scope.$storage = $localStorage.$default({
            activeCurrency: "gbp"
        });
        $scope.currencies = currency;
        
        $scope.changeActive = function(currency){
            $scope.$storage.activeCurrency = currency;
            $rootScope.$broadcast('UPDATE_CURRENCY',currency);
        }
    }
]);

app.controller('WalletCtrl', ['$scope', 'currency', '$localStorage', '$rootScope',
    function ($scope, currency, $localStorage, $rootScope) {
        $scope.currencies = currency;
        $scope.$storage = $localStorage;
        
        $scope.currency = $scope.currencies.list[$scope.$storage.activeCurrency];
        $rootScope.$on('UPDATE_CURRENCY', function(event, newCurrency) {
            $scope.currency = $scope.currencies.list[newCurrency];
        });
    }
]);