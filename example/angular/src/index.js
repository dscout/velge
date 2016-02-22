import angular from 'angular'
import Velge from 'velge'

angular.module('directives', [])
  .directive('velge', () => ({
    restrict: 'E',
    template: '<div class="velge-container"></div>',
    link: function(scope, element, attributes) {
      new Velge(element[0], {
        choices: [
          { name: 'macintosh' },
          { name: 'cortland' }
        ],
        chosen: [
          { name: 'jonagold' },
          { name: 'snow sweet' }
        ]
      })
    }
  }))

angular.module('app', ['directives'])
