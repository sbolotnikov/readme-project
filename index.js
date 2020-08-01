const inquirer = require("inquirer");
const fs = require('fs');
var readme = require('./modules/READMEwriter.js');
const questionsArr = require('./modules/questions')

inquirer.prompt(questionsArr).then(response => {
    fs.writeFile(`README_${response.repo}.md`, readme.generatePage(response), (er) => {
        if (er) return console.log(er);
        console.log(`README completed...Look for README_${response.repo}.md`);
    });

});
