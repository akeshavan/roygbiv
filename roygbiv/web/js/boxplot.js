/*var useCSV = (function(){
		var collectionOfCSVs = {};
		// Cache CSVs by their filename as they are loaded and call the callback function on
		// the csv data if/once loaded.
		return function(filename, callback){
				// if the csv data by this filename already exists...
				if (collectionOfCSVs[filename]){
						// use it
						callback(collectionOfCSVs[filename]);
				} else {
						d3.csv(filename, function(csv){
								// remember the data for this new csv
								collectionOfCSVs[filename] = csv;
								// use the csv data
								callback(csv)
						})
				}
		}
})();
// use mesh data and csv data to calculate and cache face_metrics for all possible
// keys on the faceMetrics argument.
var calculateFaceMetrics = function(mesh, mesh_options, callback){
		//var mesh_options = mesh.anisha_opts
		var csv_filename = mesh_options["filename"]
		var keys = Object.keys(mesh_options.overlays);
		if(!mesh.face_metrics){
				mesh.face_metrics = {}
		}
		useCSV(csv_filename, function(csv){
				keys.forEach(function(key, index){
						if(mesh.face_metrics[key]){
								return;
						}
						mesh.face_metrics[key] = mesh.geometry.faces.map(function(element, index){
								var vals = parseFloat(csv[element["a"]][key]) + parseFloat(csv[element["b"]][key]) + parseFloat(csv[element["c"]][key])
								//vals is the average value of the "key"(travel depth, geodesic depth, etc) for the 3 vertices of the face
								// anisha: I have no idea if this is the right thing to do
								return vals/3;
						});
				});
				if(typeof callback === 'function'){
						callback(mesh, mesh_options);
				}
		});
}
// Color brain depends on face_metrics being calculated once on initialization.
// This means that on change from the gui, color brain will only be going over each
// of the faces in the geometry and looking up what color it should set that face to.
//
// Before, the csv was being reloaded each time and the face_metrics was recalculated each time.
var color_brain = function(mesh, mesh_options){
		//var mesh_options = mesh.anisha_opts
		//var key = mesh_options.key

		mesh.material.transparent = true
		mesh.material.opacity = mesh_options.mesh_transparency || 1
		mesh.visible = mesh_options.mesh_visible || 1
		var overlays = Object.keys(mesh_options.overlays)
		var empty_mesh = true

		for (i=0;i<overlays.length;i++){

				var overlay_name = overlays[i]
				var overlay_options = mesh_options.overlays[overlay_name]


				if (overlay_options.visible) {
						var face_metrics = mesh.face_metrics[overlay_name]
						empty_mesh = false

				var colorgrad = d3.scale.linear()
						.domain([overlay_options.vmin, overlay_options.vmax])//[_.min(face_metrics), _.max(face_metrics)])
						.range([overlay_options.colormin, overlay_options.colormax]);
						mesh.geometry.faces.forEach(function(element, index){
								if (face_metrics[index] > overlay_options.threshold){
										var col = new THREE.Color(colorgrad(face_metrics[index]))
										element.color.setRGB(col.r, col.g, col.b)
										element.coloredBy = overlay_name
								}
								else if(element.coloredBy != overlay_name && element.color.r != 1 && element.color.g != 1 && element.color.b != 1){
										if (mesh_options.overlays[element.coloredBy].visible== false) {
												element.color.setRGB(1, 1, 1)
										}
										//do nothing since its colored from something else
								}
								else {
										// Undo the color setting by setting it back to white.
										element.color.setRGB(1, 1, 1)
								}
						});//end forEach

						mesh.geometry.colorsNeedUpdate = true
				}//end if

				}//end of for loop
		if (empty_mesh){
						console.log("no overlays to show")
						mesh.geometry.faces.forEach(function(element, index){element.color.setRGB(1, 1, 1)})
						mesh.geometry.colorsNeedUpdate = true
				}

				console.log("finished coloring brain")

};//end color brain
*/
function do_boxplot(divID, mesh) {
	/* Draws a box plot, given the labelID, color */
	console.log("doing boxplots")

 	var div_dom = $("#" + divID);
 	div_dom.empty();
 	div_dom.html("loading...");

	labelID = mesh.name;
	console.log(labelID)
	color = [mesh.geometry.faces[0].color["r"],
			  mesh.geometry.faces[0].color["g"],
			  mesh.geometry.faces[0].color["b"]];

	var labels = true;
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(parseInt(r * 255))
				   + componentToHex(parseInt(g * 255))
				   + componentToHex(parseInt(b * 255));
	}
	rgbColor = rgbToHex(color[0], color[1], color[2])
	var margin = {
		top: 30,
		right: 50,
		bottom: 70,
		left: 50
	};
	var width = 400 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;
	var min = Infinity,
		max = -Infinity;

	var csvID = mesh.filename.split(".vtk")[0].split("_").slice(-1)[0]
	filename = mesh.filename.replace(".vtk", ".csv") //"data/mindboggled/Twins-2-1/tables/left_exploded_tables/" + csvID + ".0.csv"
	console.log("FILENAME IS", filename)
	d3.csv(filename, function(error, csv) {
		div_dom.empty();
		var data = [];
		data[0] = [];
		data[1] = [];
		data[2] = [];
		data[3] = [];
		data[4] = [];
		data[0][0] = "travel";
		data[1][0] = "geodesic";
		data[2][0] = "mean curv";
		data[3][0] = "FS curv";
		data[4][0] = "FS thick";
		data[0][1] = [];
		data[1][1] = [];
		data[2][1] = [];
		data[3][1] = [];
		data[4][1] = [];

		csv.forEach(function(x) {
			var v1 = Math.floor(x["travel depth"]),
				v2 = Math.floor(x["geodesic depth"]),
				v3 = Math.floor(x["mean curvature"]),
				v4 = Math.floor(x["freesurfer curvature"]),
				v5 = Math.floor(x["freesurfer thickness"]);
			var rowMax = Math.max(v1, Math.max(v2, Math.max(v3, Math.max(v4, v5))));
			var rowMin = Math.min(v1, Math.min(v2, Math.min(v3, Math.min(v4, v5))));
			data[0][1].push(v1);
			data[1][1].push(v2);
			data[2][1].push(v3);
			data[3][1].push(v4);
			data[4][1].push(v5);
			if (rowMax > max) max = rowMax;
			if (rowMin < min) min = rowMin;
		});

		var chart = d3.box().whiskers(iqr(1.5)).height(height).domain([min, max]).showLabels(labels);

		var svg = d3.select("#" + divID)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("class", "box")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var x = d3.scale.ordinal().domain(data.map(function(d) {
			return d[0]
		})).rangeRoundBands([0, width], 0.7, 0.3);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		svg.selectAll(".box")
		    .data(data)
		    .enter()
		    .append("g")
				.on("click", function(){})
		    .attr("transform", function(d) {
			return "translate(" + x(d[0]) + "," + margin.top + ")";
		}).call(chart.width(x.rangeBand()));

		svg.append("text").attr("x", (width / 2)).attr("y", 0 + (margin.top / 2)).attr("text-anchor", "middle").style("font-size", "18px").text("Shape distributions").on("click", function(d){console.log(d)});
		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (height + margin.top + 10) + ")").call(xAxis).append("text").attr("x", (width / 2)).attr("y", 10).attr("dy", ".71em").style("text-anchor", "middle").style("font-size", "16px")
		$("rect").css("fill", rgbColor)

		key_mapper = {"travel": "travel_depth",
    		          "geodesic": "geodesic_depth",
    		          "mean curv": "mean_curvature",
    		          "FS curv": "freesurfer_curvature",
    		          "FS thick": "freesurfer_thickness"
		}

		/*svg.selectAll(".box").on("click", function(d,i){
    		key = key_mapper[data[i/4][0]] //anisha: I have no idea why I divide by 4. But this works
    		console.log(key)
    		var face_metrics = [] //compute the value for each face instead of each vertex

    		mesh.geometry.faces.forEach(function(element, index, array){
        		var vals = parseFloat(csv[element["a"]][key]) + parseFloat(csv[element["b"]][key]) + parseFloat(csv[element["c"]][key])
                //vals is the average value of the "key"(travel depth, geodesic depth, etc) for the 3 vertices of the face
                // anisha: I have no idea if this is the right thing to do
        		face_metrics.push(vals/3)
    		    });
            console.log(d)

            var colorgrad = d3.scale.linear()
                                .domain([d[0], d[2]]) //[_.min(face_metrics), _.max(face_metrics)])
                                .range(["#ffffff", rgbColor]);
            console.log(face_metrics[0], colorgrad(face_metrics[0]))

    		mesh.geometry.faces.forEach(function(element, index, array){
        		var col = new THREE.Color(colorgrad(face_metrics[index]))
        		element.color.setRGB(col.r, col.g, col.b)
    		})
    		mesh.geometry.colorsNeedUpdate = true

    		})*/
	});

	function iqr(k) {
		return function(d, i) {
			var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
			while (d[++i] < q1 - iqr);
			while (d[--j] > q3 + iqr);
			return [i, j];
		};
	}
}
