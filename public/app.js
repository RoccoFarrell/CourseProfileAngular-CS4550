// name our angular app
angular.module('mainApp', [
  'ngResource',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap'
  ])

.config(['$resourceProvider', function($resourceProvider){
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])

.config(function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $routeProvider

    .when('/',{
      templateURL: './html/profile.html',
      controller: 'profileController'
    })
})

.factory('courseFactory', function($http, $resource){

  var localCourseFactory = {};

  localCourseFactory.all = function(){
    return $http.get('/api/course');
  };

  localCourseFactory.deleteCourse = function(id){
    return $http.delete('/api/course/' + id);
  };

  localCourseFactory.createCourse = function(courseData){
    //console.log("courseData: ");
    //console.log(courseData);
    return $http.post('/api/course', courseData);
  };

  localCourseFactory.editCourse = function(courseData){
    console.log("courseData: ");
    console.log(courseData);
    return $http.put('/api/course/' + courseData._id, courseData);
  };

  return localCourseFactory;

})

//new user controller
.controller('profileController', function(courseFactory, $scope, $modal){

  var vm = this;
  vm.course = {name: "", category: "", dateCreated: "", description: ""};

  //console.log("Using profile controller");

  courseFactory.all()
  .success(function(data){
    vm.courses = data;

    console.log(data);
  });

  vm.deleteCourse = function(course){
    console.log("Deleting: " + course._id);

    var result = window.confirm("Are you sure you want to delete?");
    if(result == true){
      courseFactory.deleteCourse(course._id)
      .success(function(){
        console.log("Deleted course " + course.name);
      });

      courseFactory.all()
      .success(function(data){
        vm.courses = data;
      });
    }
  }

  vm.openCourseDialogCreate = function(){
    //console.log("trying desperately to open the modal");

    vm.course = {name: "", category: "", dateCreated: "", description: ""};

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        course: function(){
          return vm.course;
          } 
      }
    });

    modalInstance.result.then(function(course){

      vm.course = course;
      console.log(vm.course);
      courseFactory.createCourse(vm.course)
      .success(function(){
        console.log("Added course from modal");
      });

      courseFactory.all()
      .success(function(data){
      vm.courses = data;
      });
    });

    
  };


vm.openCourseDialogEdit = function(course){
    //console.log("trying desperately to open the modal");

    vm.course = {_id: course._id, name: course.name, category: course.category, dateCreated: course.dateCreated, description: course.description};

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'modalInstanceCtrl',
      size: 'lg',
      resolve: {
        course: function(){
          return vm.course;
          } 
      }
    });

    modalInstance.result.then(function(course){

      vm.course = course;
     // console.log(vm.course);
      courseFactory.editCourse(vm.course)
      .success(function(){
        console.log("Edit course from modal");
      });

      courseFactory.all()
      .success(function(data){
      vm.courses = data;
      });
    });

    
  };
})

.controller('modalInstanceCtrl', function($scope, $modalInstance, course){
  $scope.course = course;
  console.log($scope.course);
  //$scope.selected = {
    //course: $scope.courses[0]
  //};

  $scope.ok = function(){
    $modalInstance.close(course);
  };

  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };
});



