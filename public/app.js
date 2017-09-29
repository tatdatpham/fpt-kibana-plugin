import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

document.title = 'FPT SIEM';

import chrome from 'ui/chrome';

// Set Kibana dark thmeme
chrome.addApplicationClass('theme-dark');

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/fpt/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiModules
.get('app/fpt', [])
.controller('maliceHelloWorld', function ($scope, $route, $interval) {
  $scope.title = 'FPT';
  $scope.description = 'FPT Kibana Plugin';

  const currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  const unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);
});
