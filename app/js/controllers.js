/**
 * Controller
 *
 */
angular.module('pomodoro')
.controller('MainCtrl', function ($scope) {
	$scope.startButton = 'pomodoro';

	$scope.buttons = [
		{
			name: 'Pomodoro',
			key: 'pomodoro',
			seconds: 1500
 		}, {
			name: 'Short Break',
			key: 'short-break',
			seconds: 300
		}, {
			name: 'Long Break',
			key: 'long-break',
			seconds: 900
		}
	];

	$scope.title = 'Angular Pomodoro';

	//Has the timer run out?
	$scope.ding = false;

	//Track the number of seconds remaining
	$scope.time = 1500000;

	//Track the number of loops through ANY of the three button types
	$scope.loopCount = 0;

	//Track whether we are in a pomodoro, long break, or short break
	$scope.activeLoop = $scope.startButton;

	//Write out the countdown value in text form
	$scope.formatTime = function() {
		if ($scope.ding) {
			return "DING!";
		}
		return ("0" + Math.floor($scope.time/60000)).slice(-2) + ':' + ("0" + Math.floor(($scope.time%60000)/1000)).slice(-2);
	};

	//Click handler
	$scope.click = function(e, key) {
		var buttons = $scope.buttons;
		var length = buttons.length;
		for (var i = 0; i < length; i++) {
			if (buttons[i].key === key) {
				$scope.ding = false;
				$scope.loopCount++;

				//Add the 900ms to prevent a "flash" at the beginning of the countdown
				var currentTypeFullTime = $scope.time = (buttons[i].seconds * 1000) + 900;
				var loopIndex = $scope.loopCount;
				var loopStartTime = new Date().getTime();
				var formatted;

				//Update the time every quarter second
				var timerLoop = setInterval(function(){
					var time = currentTypeFullTime - (new Date().getTime() - loopStartTime);
					var ding = false;

					if ($scope.time <= 0) {
						$scope.time = 0;
						ding = true;
						clearInterval(timerLoop);
					}
					else if ($scope.loopCount > loopIndex) {
						clearInterval(timerLoop);
					}

					time = time < 0 ? 0 : time;

					//Render the new time
					$scope.$apply(function(){
						$scope.time = time;
						$scope.ding = ding;
						$scope.title = $scope.formatTime();
					});
				}, 250);
				return;
			}
		}
	};
});