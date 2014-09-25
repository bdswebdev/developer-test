'use strict';
var app = angular.module('wallet', ['ngStorage']);

app.provider('currency', function () {
    var activeCurrency = "gbp";
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
                },
                getActive: function () {
                    return activeCurrency;
                },
                setActive: function (curr) {
                    activeCurrency = curr;
                }
            }
        }
    }
});


app.controller('MenuCtrl', ['$scope', 'currency', '$localStorage', '$rootScope',
    function ($scope, currency, $localStorage, $rootScope) {
        $scope.currencies = currency;
        $scope.changeActive = function(currency){
            $scope.currencies.setActive(currency);
            $rootScope.$broadcast('UPDATE_CURRENCY',currency);
        }
    }
]);

app.controller('WalletCtrl', ['$scope', 'currency', '$rootScope',
    function ($scope, currency, $rootScope) {
        $scope.currencies = currency;
        $scope.currency = $scope.currencies.list[$scope.currencies.getActive()];
        $rootScope.$on('UPDATE_CURRENCY', function(event, newCurrency) {
            $scope.currency = $scope.currencies.list[newCurrency];
        });
    }
]);