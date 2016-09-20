//
// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//   console.log(navigator.notification);
//   navigator.notification.alert("Olá", function (argument) {
//     // body...
//   });
// }
var gps = {};
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log("navigator.geolocation works well");
}
// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    gps = position.coords;
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);

$(function () {

  var $taskList = $('.taskList');
  var $newTaskInput = $('#newTaskInput');
  var $addNewTask = $('#addNewTask');
  var taskList = [];

  if (window.localStorage) {
    taskList = JSON.parse(window.localStorage.getItem('taskList'));

    var newTask = '';

    if (taskList) {
      for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].done) {
          newTask = '<li class="done" data-key="' + taskList[i].key + '">';
        } else {
          newTask = '<li data-key="' + taskList[i].key + '">';
        }
        newTask += '<span>';
        newTask += taskList[i].task;
        newTask += '</span>';
        if (taskList[i].latitude) {
          newTask += '<span> ' + taskList[i].latitude + ' ' + taskList[i].longitude + '</span>';
        }
        newTask += '</li>';

        $taskList.append(newTask);
      }
    } else {
      taskList = [];
    }
  }

  $addNewTask.on('click', function () {
    var key = Date.now();
    var task = $newTaskInput.val();

    taskList.push({
      key: key,
      task: task,
      done: false,
      latitude: gps.latitude,
      longitude: gps.longitude
    });

    var taskHTML = '<li data-key="' + key + '"><span>' + task + '</span>';
    taskHTML += '<span> ' + gps.latitude + ' ' + gps.longitude + '</span>';
    taskHTML += '</li>';
    $taskList.append(taskHTML);

    if (window.localStorage) {
      window.localStorage.setItem('taskList', JSON.stringify(taskList));
    }
    console.log(JSON.parse(window.localStorage.getItem('taskList')));
  });


  var taskTouchStart;
  var taskTouchEnd;
  var taskTouchStartx;
  var taskTouchEndx;
  var elementStart;
  var elementEnd;

  $taskList.on('touchstart', 'li', function (event) {
    elementStart = event.currentTarget;
    taskTouchStart = $(elementStart).attr('data-key');
    taskTouchStartx = event.originalEvent.touches[0].pageX;
  });

  $taskList.on('touchend', 'li', function (event) {
    elementEnd = event.currentTarget;
    taskTouchEnd = $(elementEnd).attr('data-key');
    taskTouchEndx = event.originalEvent.changedTouches[0].pageX;

    if (elementStart === elementEnd) {
      if (taskTouchEndx > taskTouchStartx + 100) {
        $(elementEnd).toggleClass('done');

        var mappedtaskList = taskList.map(function (task) {
          if (task.key + '' == taskTouchEnd + '') {
            task.done = !task.done;
          }
          return task;
        });
        window.localStorage.setItem('taskList', JSON.stringify(mappedtaskList));
      }

      if ( taskTouchStartx > taskTouchEndx + 100) {
        $(elementEnd).hide('slow', function () {
          $(this).remove();

          var filteredtaskList = taskList.filter(function (el) {
            return el.key + '' != taskTouchStart + '';
          });

          window.localStorage.setItem('taskList', JSON.stringify(filteredtaskList));
        });

      }
    }

  });


});
