module.exports.generatePage =function (data) {
    let str = "\n";
    data.sectionChoice.forEach(el => {
        str += '* [' + el + '](#' + el.toLowerCase() + ')\n'
    })
    str += '* [Questions](#questions)' + '\n';
    str += '* [Review](#review)' + '\n';
    let strImg = "\n"
    if (data.usage_confirm) {

        let fileArray = data.usage_ImageNames.split(" ");
        fileArray.forEach(el => {
            let img = '![' + data.repo + '](' + data.pictures_Path + '/' + el + ') \n\n';
            strImg += img;
        });
    };
    let readmeStr = `# ${data.title} ![${data.repo}](https://img.shields.io/github/license/${data.user}/${data.repo})\n`;
    readmeStr += '## Description \n' + data.description + '\n';
    readmeStr += '## Table of Contents' + str;
    data.installation ? readmeStr += '## Installation \n' + data.installation + '\n' : readmeStr += '## Installation \n None \n';
    data.usage_info ? readmeStr += '## Usage \n' + data.usage_info + '\n' + strImg + '\n' : readmeStr += '## Usage \n None\n';
    data.guidelines ? readmeStr += '## Contributing \n' + data.guidelines + '\n' : readmeStr += '## Contributing \n None \n';
    data.license ? readmeStr += '## License \n Licensed under ' + data.license + ' License. \n' : readmeStr += '## License \n None \n';
    data.instructions ? readmeStr += '## Tests \n' + data.instructions + '\n' : readmeStr += '## Tests \n None\n';
    readmeStr += '## Questions \n You can see more of my Projects on my [GitHub profile](https://github.com/' + data.user + ') \n\n Contact [' + data.user + '](mailto:' + data.email + ') \n';
    readmeStr += '## Review \n  * Here is this repo link: https://github.com/' + data.user + '/' + data.repo + '\n \n'
    if (data.web_confirm === false) {
        readmeStr += '  * Link: application is not deployed';
    } else {
        data.web_link.length > 4 ? readmeStr += '  * Link: [' + data.title + '](' + data.web_link + ')' : readmeStr += `  * Link: [${data.title}](https://${data.user}.github.io/${data.repo})`
    }
    //
    return readmeStr;
}
