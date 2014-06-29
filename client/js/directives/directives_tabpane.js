'use strict';

/* Directives */

angular.module('projectmanagementApp.directives', [])
	.directive('tabs', function() {
		return {
			restrict : 'E',
			transclude : true,
			scope : {},
			controller : function($scope, $element) {
					var panes = $scope.panes = [];
					$scope.select = function(pane) {
						angular.forEach(panes, function(pane) {
							pane.selected = false;
						});
						pane.selected = true;
					}
					console.log("sldhfsdhf");
					
					this.addPane = function(pane) {
						if (panes.length == 0)
							$scope.select(pane);
							panes.push(pane);
					}
			},
			template : '<div class="tabbable">'
					+ '<ul class="nav nav-tabs">'
					+ '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'
					+ '<a ng-click="select(pane)">{{pane.title}}</a>'
					+ '</li>'
					+ '</ul>'
					+ '<div class="tab-content" ng-transclude></div>'
					+ '</div>',
			replace : true
		};
	})
	.directive('pane', function() {
		return {
			require : '^tabs',
			restrict : 'E',
			transclude : true,
			scope : {
				title : '@'
			},
			link : function(scope, element, attrs, tabsCtrl) {
					tabsCtrl.addPane(scope);
			},
			template : '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
			replace : true
		}
	})
.directive('grgetherpad', function() {
		return {
			restrict : 'EA',
			scope : {
				data : "=",
 			},
			link : function(scope, iElement, iAttrs) {
				var p = iElement[0];  
  
				scope.$watch('data', function(newVals, oldVals) {
				 	return scope.render(newVals);
				}, true);
				
				scope.render = function(data) { 
					if (data == undefined) return; 
					console.log('scope.render  id: ' + data.id);
					console.log('grgetherpad data' + JSON.stringify(data) );

					var id = "etherpad" + data.id;
					var username = data.username; 
					var usercolor = data.color; 
					console.log('username: ' +username);
					console.log('usercolor: ' +usercolor);
					console.log('id: ' +id);

					$(p).pad({ 
						'padId' : id,
						'showChat':'false', 
						'userName' : username, 
						'host': 'http://0.0.0.0:9001',
						 'width' : 400,
						 'height' : 600,
						 'showControls': true, 
						 'userColor' : usercolor,
 						 'border' : '1px',
						 'borderStyle' : 'solid'
					});
				} 
			}
		}; 
	})
	 
		.directive('grgCalendar', function() {
					return {
						restrict : 'EA',
						transclude : true, 
						scope : {
							data : "=" 
						},
						link : function(scope, iElement, iAttrs) {
  							  
							console.log('grg-calendar');
 
							var containerWidth = 1300, 	
								containerHeight = 700; 
							
							var marginChart = {top: 30, right: 10, bottom: 30, left: 60},
							    widthChart = containerWidth - marginChart.left - marginChart.right,
							    heightChart = containerHeight - marginChart.top - marginChart.bottom;
							
							console.log('grg-calendar: containerWidth: ' + containerWidth);
							console.log('grg-calendar: containerHeight: ' + containerHeight);

							var svg = d3.select('.chartArea').append('svg')
				    			.attr("width", containerWidth)
				    			.attr("height", containerHeight)
				 	
							
							scope.$watch('data', function(newVals, oldVals) {
							 	return scope.render(newVals);
							}, true);
				 		 
							// define render function
							scope.render = function(allData) { 
 								  
								console.log('scope.render.allData: ' + JSON.stringify(allData));
								var drag = d3.behavior.drag().on("drag", function (d) { 
									chartOffset += d3.event.dx;
								 	var s = "translate(" + (chartOffset) + ", 0)";
									console.log('"translate text : s: ' + s);  

									chartArea.attr("transform", s );
								}); 
								svg.call(drag);
								
								var chartArea = svg.append('g');

								
 								// dummy startDaten and endDate
								// later this is read from the <input> elements
								var halfYear = 365 / 2 * 24 * 60 * 60 * 1000; 

								var now = new Date().getTime(); 
								      
								var startDate = now - halfYear; 
								var endDate = now + 4*halfYear; 

								console.log('startDate: ' + startDate);
								console.log('endDate: ' + endDate);

								var minExtentX = startDate;
								var maxExtentX = endDate; 
								
								var countMonth = (endDate - startDate) / (halfYear * 2 )* 12;
								console.log('countMonth: ' + countMonth);

								var pixelPerMonth = containerWidth / 12; 
								var dataWidth = countMonth * pixelPerMonth; 
								console.log('dataWidth: ' + dataWidth);

								var chartOffset = -200; 
								 
								var xScaleChart = d3.time.scale().range([0, dataWidth]),
								    yScaleChart = d3.scale.linear().range([0, heightChart]);
								 
								var xAxisChart = d3.svg.axis()
									.scale(xScaleChart)
									.orient('top')
									.ticks(d3.time.month, 1)
									.tickFormat(d3.time.format('%B %y'))
									.tickSize(6, 0, 0);
								 
								// y Axis
								var yAxisChart = d3.svg.axis()
									.scale(yScaleChart)
									.orient('left')
									.tickValues([1, 5, 10, 15, 20, 25, 30, 31,]); 
								 

											 		 		
								svg.append("rect")
								    .attr("class", "overlay")
								    .attr("width", widthChart)
								    .attr("height", heightChart);

								svg.append("defs").append("clipPath")
									   	.attr("id", "clip")
									 .append("rect")
									  	.attr("width", widthChart)
									  	.attr("height", heightChart + marginChart.top +20);
								  
								 
								 
								  
								// x domain: from startDate to endDate which is choosen by the user
								xScaleChart.domain([minExtentX, maxExtentX]);
									
								// y domain: 31 days
								yScaleChart.domain([1, 31]);


								chartArea.append("g")
								      .attr("class", "x axis")
								      .attr("transform", "translate(0," + (marginChart.top-10) + ")") 
								      .call(xAxisChart)
								      .selectAll("text")  
								      .style("text-anchor", "center") 
								      .attr("transform", function(d) {
								    	  	var s = "translate(" + (pixelPerMonth/2) + ", 0)";
								   			//console.log('"translate text : s: ' + s);  
											 return s;
								      });
								    	  	
								svg.append("g")
									.attr("class", " y axis")
									.attr("transform", "translate(" + marginChart.left + "," + marginChart.top + ")") 
									.call(yAxisChart);
								 
								var days = []; 

								for (var i = 0; i < 31; i++) {
									days[i] = i+1;  	
								}
								 	
								var month = []; 
								 // horizontal grid
								var gridLinesHorizontal = svg.append('g').selectAll('.laneLines-horizontal')
											.data(days)
										.enter().append('line')
											.attr('x1', marginChart.left)
											.attr('y1', function(d) { return d3.round(yScaleChart(d )) + (marginChart.top )   ; })
											.attr('x2', widthChart)
											.attr('y2', function(d) { return d3.round(yScaleChart(d )) + (marginChart.top )   ; })
											.attr('class', 'laneLines')
											.attr('stroke',  'lightgray' );

								var gridLinesVertical = chartArea.append('g').selectAll('.laneLines-verical')		
										.data(xScaleChart.ticks(countMonth))
									.enter().append("line")
									    .attr("class", "laneLines")
									    .attr('y1', marginChart.top)
										.attr('x1', function(d) { 
												//console.log('d  x1: ' + JSON.stringify(d));
												return xScaleChart(d);
										})
										.attr('y2', heightChart  +  marginChart.top )
										.attr('x2', function(d){ 
												//console.log('d x2 : ' + JSON.stringify(d)); 
												return xScaleChart(d); 
										})
										.attr('class', 'laneLines ')
										.attr('stroke',  'lightgray' );
										
										
								var parseDate = d3.time.format("%d.%m.%Y").parse;
								var parseDateMonthYear = d3.time.format("%m.%Y").parse;

								var showTasks= [
								 	      	{ name: 'Urlaub Anna', type : 'miscellaneous', from : '01.04.2014', until : '10.04.2014', projectuid : 100 } ,
								  		 	{ name: 'Urlaub Georg', type : 'miscellaneous', from : '17.5.2014', until : '19.5.2014', projectuid : 100 } ,
								 				 { name: 'Launch freiwilligentag.at', status : 'open', type : 'projectgoal', from : '5.5.2014' , projectuid : 102 }  , 
								 		       	{ name: 'Startseite freiwilligentag.at', status : 'done', type : 'milestone', from : '12.4.2014' , projectuid : 102 } 
								            ];    
								            
								showTasks.forEach(function (d) { 
									var dummy = parseDate(d.from); 
									d.fromDate = parseDateMonthYear(dummy.getMonth() + "." + dummy.getFullYear());
								 
									if (d.until ==  undefined ) {
								   		d.untilDate = new Date(dummy.getTime() + 24*60*60*1000+600); 
									} else {
								  		d.untilDate = parseDate(d.until);	
									} 
									d.fromDay = dummy.getDate();
									d.duration = d.untilDate.getDate() - d.fromDay;  
								 });

								var tasksGroup = chartArea.append('g').selectAll( )		
										.data(showTasks)
									.enter()
										.append("g")
										.attr('transform', function(d) { 
											var x1 = xScaleChart(d.fromDate);
											var y1 = yScaleChart(d.fromDay) + marginChart.top;
											var s = 'translate(' + x1 + ', ' +y1+')';
											console.log('x1     : ' +x1); 
											console.log('y1     : ' +y1); 
								 			return s;
										});		
										
								var tasks = tasksGroup 
										.append("rect")
										.attr("class",  function(d) { 
								 			return d.status + " " + d.type;
										})
										.attr('x', 0)
										.attr('y', 0)
										.attr('width', pixelPerMonth )
										.attr('height', function(d) { 
											var h = d.duration*(yScaleChart(d.fromDay+1)-yScaleChart(d.fromDay));
											console.log('h    : ' + h);
								 			return h;
										});
										
										
								var taskLabels = tasksGroup
										.append('text')
											.text(function (d) { return d.name; })
								 			.attr('y', function(d) {
								 					return   (yScaleChart(2) - yScaleChart(1))/2 ;
											}) 
											.attr('text-anchor', 'start')
											.attr('class', 'itemLabel'); 
								  
							}; 
						}
					};
				})