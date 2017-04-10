# Anomaly detector

Simple http-server to detect anomality in time-series.

# Usage

* Install Node.js
* Download and unpack this application
* Install dependencies `npm i`
* Run application `npm start`
* Open `demo.html` in browser

```
$.ajax({
	type: 'POST',
	url: 'http://127.0.0.1:8000',
	data: JSON.stringify({
		options: {
			regression: 'polynomial',
			degree: 5,
			outlier: 'md'	
		},
		// first element of each pair is unix timestamp	
		series: [[1491652336722,13],[1491652396739,19],[1491652456768,21],[1491652516787,16], ...]
	}),
	dataType: "json",
	success: function(result) {	
		// result is {source, regression, outliers}
	}
});
```