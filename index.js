'use strict'
const http = require('http');
const regression = require('regression');
const outlier = require('outlier2');

const port = process.argv.splice(process.execArgv.length + 2)[0] || 8000;

function processQuery(query, callback) {
	let series = query.series;

	let s = series.map((e) => [(e[0] - series[0][0])/100000000000, e[1]])
	let r = regression(query.options && query.options.regression || 'polynomial', s, query.options && query.options.degree || 3);
	let delta = series.map((e, i) => Math.abs(e[1] - r.points[i][1]));

	let outs = outlier[query.options && query.options.outlier || 'md'](delta, {indexes: true}) || [];
	let max = outs.map((e) => delta[e]).sort().pop(); // max outlier delta
	let maxOk = delta.filter((e) => e < max).sort().pop(); // max non-outlier delta

	callback(null, {
		source: series,
		regression: r.points.map((e, i) => [series[i][0], e[1]]),	
		outliers: outs.filter((e) => delta[e] > maxOk).map((e) => series[e])
	})
}

http.createServer(function (req, res) {
	function send (err, result) {
		let status = !!err ? 500 : 200;
		let data = err ? {result: 'Error', message: err.message} : result;
		res.writeHead(status, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});		
		res.end(JSON.stringify(data));
	}

	if (req.method != 'POST')
		return send(new Error('Only POST suppported'));
	
    let body = '';
    req.on('data', (data) => body += data);
    req.on('end', () => processQuery(JSON.parse(body), send));
}).listen(port);

console.log("Anomality detector running at http://127.0.0.1:" + port);
