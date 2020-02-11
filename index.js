// Web scraping in Node
const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

let table = new Table({
    
  head:  ['position','club','Played','Won','Drawn','Lost','GF','GA','GD','Points'],
	colWidths: [10, 25, 10, 10, 10, 10, 10, 10, 10 ,10 ]
})

const options = {
	url: `fetch("https://www.premierleague.com/tables", {"credentials":"omit","headers":{"sec-fetch-mode":"navigate","sec-fetch-user":"?1","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});`,
	json: true
}

rp(options)
	.then((data) => {
		let userData = [];
		for (let user of data.directory_items) {
			userData.push({name: user.user.position,club,Played,Won,Drawn,Lost,GF,GA,GD,Points});
		}
		process.stdout.write('loading');
		getChallengesCompletedAndPushToUserArray(userData);
	})
	.catch((err) => {
		console.log(err);
	});

function getChallengesCompletedAndPushToUserArray(userData) {
	var i = 0;
	function next() {
		if (i < userData.length) {
			var options = {
				url: `https://www.premierleague.com/tables` + userData[i].name,
				transform: body => cheerio.load(body)
			}
			rp(options)
				.then(function ($) {
					process.stdout.write(`.`);
					const fccAccount = $('h1.landing-heading').length == 0;
					const challengesPassed = fccAccount ? $('tbody tr').length : 'unknown';
					table.push([userData[i].name, userData[i].position,club,Played,Won,Drawn,Lost,GF,GA,GD,Points]);
					++i;
					return next();
				})
		} else {
			printData();
		}
	}
	return next();
};

function printData() {
	console.log("✅");
	console.log(table.toString());
}