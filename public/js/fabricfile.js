document.addEventListener("DOMContentLoaded", function() {
    // Wait for the DOM content to be fully loaded

    var canvas = new fabric.Canvas('canvas');

    // Fetch the points data from the server
    fetch('/coords')
        .then(response => response.json())
        .then(points => {
            // Use the points data obtained from the server

            fabric.Image.fromURL('./images/hand.png', function(img) {
                // Set the image properties
                console.log('inside');
                img.set({
                    left: 0,
                    top: 0,
                    // scaleX: canvas.width / img.width,
                    // scaleY: canvas.height / img.height,
                    selectable: false
                });
                canvas.add(img);
                canvas.setDimensions({ width: img.width, height: img.height });



                // Create circles for each point
                var circles = points.map(function(point) {
                    return new fabric.Circle({
                        radius: 6,
                        fill: 'red',
                        left: point.x,
                        top: point.y,
                        selectable: true,
                        hasControls: false
                    });
                });

                // Create lines connecting the points
                var lines = [];
                for (var i = 0; i < points.length; i++) {
                    var line = new fabric.Line([
                        points[i].x,
                        points[i].y,
                        points[(i + 1) % points.length].x,
                        points[(i + 1) % points.length].y
                    ], {
                        fill: 'black',
                        stroke: 'black',
                        strokeWidth: 2,
                        selectable: false
                    });
                    lines.push(line);
                }

                // Add the circles and lines to the canvas
                circles.forEach(function(circle) {
                    canvas.add(circle);
                });

                lines.forEach(function(line) {
                    canvas.add(line);
                });

                canvas.on('object:moving', function(e) {
                    var obj = e.target;
                    obj.setCoords();
                    var activeObj = canvas.getActiveObject();

                    // Accessing left and top properties directly from activeObj
                    var updatedValue = {
                        x: Math.floor(activeObj.left),
                        y: Math.floor(activeObj.top)
                    };

                    lines.forEach(function(line, index) {
                        if (activeObj === circles[index]) {
                            line.set({
                                x1: activeObj.left,
                                y1: activeObj.top
                            });

                            // Update the corresponding point in the points array
                            points[index].x = updatedValue.x;
                            points[index].y = updatedValue.y;
                        } else if (activeObj === circles[(index + 1) % circles.length]) {
                            line.set({
                                x2: activeObj.left,
                                y2: activeObj.top
                            });

                            // Update the corresponding point in the points array
                            var nextIndex = (index + 1) % circles.length;
                            points[nextIndex].x = updatedValue.x;
                            points[nextIndex].y = updatedValue.y;
                        }
                    });


                    // displayPoints(updatedValue.x, updatedValue.y);
                    saveUpdatedPoints(points);


                    
                    // Render the canvas after object movement
                    canvas.renderAll();
                });
            });

            function displayPoints(left, top) {
                let coords = document.getElementById('coords');
                let x = Math.floor(left);
                let y = Math.floor(top);
                coords.innerHTML = x + "   " + y;
            }
        })
        .catch(error => {
            console.error('Error fetching points:', error);
        });


        function saveUpdatedPoints(points){
    console.log('inside save fun',points)
            fetch('/updatePoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(points)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Points updated successfully.');
                } else {
                    console.error('Failed to update points:', response.status);
                }
            })
            .catch(error => {
                console.error('Error updating points:', error);
            });

        }
});
