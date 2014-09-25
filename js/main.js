'use strict';
var app = angular.module('wallet', ['ngStorage']);

app.provider('currency', function () {
    var activeCurrency = "gbp";
    return {
        $get: function () {
            return {
                list: {
                    eur: {
                        code: "&euro;",
                        class: "eur"
                    },
                    gbp: {
                        code: "&pound;",
                        class: "gbp"
                    },
                    usd: {
                        code: "&usd;",
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

app.controller('MenuCtrl', ['$scope', 'currency', '$localStorage',
    function ($scope, currency, $localStorage) {
        $scope.currencies = currency;
        $scope.currencies.setActive("eur");
    }
]);

app.controller('WalletCtrl', ['$scope', 'currency',
    function ($scope, currency) {
    }
]);