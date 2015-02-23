/**
 * Controller
 *
 */
angular.module('pomodoro')
.controller('MainCtrl', function ($scope) {
	//STARTING VALUES
	$scope.startButton = 'Pomodoro';



	//METHODS
	//Write out the countdown value in text form
	$scope.formatTime = function() {
		if ($scope.ding) {
			return "DING!";
		}
		return ("0" + Math.floor($scope.time/60000)).slice(-2) + ':' + ("0" + Math.floor(($scope.time%60000)/1000)).slice(-2);
	};

	//Render the age of each history element
	$scope.formatAge = function(timestamp) {
		var minGone = Math.ceil((new Date().getTime() - timestamp)/60000);

		//Get formatted minutes and hours
		if (minGone < 1200) { //Less than 2 hours?  Show minutes
			return minGone  +' minute'+ (minGone === 1 ? '' : 's') +' ago';
		} else if (minGone < 2880) { //Less than 2 days?  Show hours
			return Math.round(minGone/60) +' hour'+ (Math.floor(minGone/60) === 1 ? '' : 's') +' ago';
		} else { //More than that?  Show days
			return Math.floor(minGone/1440) +' day'+ (Math.floor(minGone/1440) === 1 ? '' : 's') +' ago';
		}
	};



	//INFORMATION STORES
	//Top buttons
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

	//History store
	$scope.history = [];

	//Page title
	$scope.title = 'Angular Pomodoro';

	//Has the timer run out?
	$scope.ding = false;

	//Track the number of seconds remaining
	$scope.time = 1500000;

	//Track the number of loops through ANY of the three button types
	$scope.loopCount = 0;

	//Track whether we are in a pomodoro, long break, or short break
	$scope.activeLoop = $scope.startButton;

	//Click handler
	$scope.click = function(e, key) {
		var buttons = $scope.buttons;
		var length = buttons.length;
		for (var i = 0; i < length; i++) {
			if (buttons[i].key === key) {
				$scope.ding = false;
				$scope.loopCount++;

				//Add the 900ms to prevent a "flash" at the beginning of the countdown
				var currentTypeFullTime = $scope.time = (buttons[i].seconds * 1000) - 100;
				var loopIndex = $scope.loopCount;
				var loopStartTime = new Date().getTime();
				var formatted, changed;

				//Update the time every quarter second
				var timerLoop = setInterval(function(){
					var currentTime = new Date().getTime();
					var time = currentTypeFullTime - (currentTime - loopStartTime);
					var ding = false;

					if ($scope.time <= 0) {
						changed = true;
						$scope.time = 0;
						ding = true;
					}
					else if ($scope.loopCount > loopIndex) {
						changed = true;
						
					}

					time = time < 0 ? 0 : time;

					if (changed === true) {
						//Append to history
						$scope.history.push({
							type: buttons[i].name,
							time: currentTime
						});
						$scope.activeLoop = buttons[i].key;

						//Clear the interval
						clearInterval(timerLoop);
					}

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

	//History text refresh loop
	setInterval(function(){
		$scope.$apply();
	}, 10000);
});