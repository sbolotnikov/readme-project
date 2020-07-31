const inquirer = require("inquirer");
const fs = require('fs');
const { isNumber, isString } = require("util");

function isImageExtention(img) {
    let extentions = [".tif", ".tiff", ".gif", ".jpeg", ".jpg", ".jif", ".jfif", ".jp2", ".jpx", ".j2k", ".j2c", ".fpx", ".pcd", ".png"]
    let ext = img.slice(img.lastIndexOf(".", img.length - 1)).toLowerCase();
    if (extentions.indexOf(ext) >= 0) {
        return true;
    } else {
        return false
    }
}
function isFileName(file) {
    let fileLow = file.toLowerCase();
    let alphaExp = /^[a-z_\-\s0-9\.]+$/;
    if (!fileLow.match(alphaExp)) {
        return false;
    } else {
        return true;
    }
}
function countWords(words, separator) {
    let str = words.trim();
    let count = 0;
    if (str.length > 0) {
        count = 1;
    } else {
        return count;
    }
    let pos = 0;
    while (str.indexOf(separator, pos) > 0) {
        pos = str.indexOf(separator, pos) + 1;
        count++;
    }
    return count;
}
function validateImage(str) {
    var imgs = str.trim();
    let img = "";
    let count = countWords(imgs, ' ');
    for (let i = 0; i < count; i++) {
        img = imgs.slice(0, imgs.search(" "));
        imgs = imgs.slice(imgs.search(" ") + 1);
        if (i === count - 1) {
            img = imgs;
        }
        if (!isFileName(img)) {
            return `Please correct ${i + 1} file name`;
        }
        if (!isImageExtention(img)) {
            return `${i + 1} file is not an image`;
        }
    }
    return true
}

function generatePage(data) {
    let str = "\n";
    data.sectionChoice.forEach(el => {
        str += '* [' + el + '](#' + el.toLowerCase() + ')\n'
    })
    str += '* [Questions](#questions)' + '\n';
    str += '* [Review](#review)'+ '\n';
    let strImg = "\n"
    if (data.usage_confirm) {

        let fileArray = data.usage_ImageNames.split(" ");
        fileArray.forEach(el => {
            let img = '!['+data.repo+']('+data.pictures_Path+'/'+el+') \n\n';
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
    readmeStr += '## Questions \n You can see more of my Projects on my [GitHub profile](https://github.com/'+data.user+') \n\n Contact [' + data.user + '](mailto:' + data.email + ') \n';
    readmeStr+='## Review \n  * Here is this repo link: https://github.com/'+data.user+'/'+data.repo+'\n \n'
    if (data.web_confirm===false){
readmeStr+='  * Link: application is not deployed';
    }else {
        data.web_link.length>4? readmeStr +='  * Link: ['+data.title+']('+data.web_link+')': readmeStr +=`  * Link: [${data.title}](https://${data.user}.github.io/${data.repo})`
    }
    //
    return readmeStr;
}

function init() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter your project title.",
                name: "title",
                validate: title => {
                    if (title.length < 4) {
                        return "Title is too short";
                    }

                    else {
                        return true
                    }
                }
            },
            {
                type: "input",
                message: "Please input Github project repository name.",
                name: "repo",
                default: "readme-project",
                validate: repo => {
                    let alphaExp = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,39}$/i
                    if (!repo.match(alphaExp)) {
                        return "Use alphanumeric characters or hyphens.No consecutive hyphens.No begin or end with a hyphen. Max length 40";
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "Please input your Github username.",
                name: "user",
                default: "sbolotnikov",
                validate: user => {
                    let alphaExp = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
                    if (!user.match(alphaExp)) {
                        return "Use alphanumeric characters or hyphens.No consecutive hyphens.No begin or end with a hyphen. Max length 39";
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "Enter your email address.",
                name: "email",
                default: "sbolotnikov@gmail.com",
                validate: email => {
                    let alphaExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                    if (!email.match(alphaExp)) {
                        return "Please enter a valid e-mail";
                    } else {
                        return true;
                    }
                }
            },

            {
                type: "editor",
                message: "Please enter your project description.",
                name: "description",
                validate: description => {
                    if (description.length < 10) {
                        return "Description is too short";
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                type: "checkbox",
                message: "Please choose sections that you wish to incude in the README file",
                name: "sectionChoice",
                choices: [{ name: "Installation", checked: true }, { name: "Usage", checked: true },
                { name: "Contributing", checked: true }, { name: "Tests", checked: true }, { name: "License", checked: true }],
                validate: (sectionChoice) => {
                    if (sectionChoice.length != 0) {

                        return true;
                    }

                    return "Choose at least one section";
                },
            },
            {
                type: "editor",
                message: "Please enter your project INSTALLATION instructions.",
                name: "installation",
                validate: installation => {
                    if (installation.length < 5) {
                        return "Installation section is too short";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Installation") >= 0 }
            },
            {
                type: "editor",
                message: "Please enter project USAGE information.",
                name: "usage_info",
                validate: usage_info => {
                    if (usage_info.length < 5) {
                        return "USAGE section is too short";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Usage") >= 0 }
            },
            {
                type: "confirm",
                message: "Do you have images to add to the USAGE section",
                name: "usage_confirm",
                default: true,
                when: function (response) { return response.sectionChoice.indexOf("Usage") >= 0 }
            },
            {
                type: "input",
                message: "Please enter the path of the images (like ./image_directory). Make sure that all images are located in the same directory.",
                name: "pictures_Path",
                default: './images',
                validate: pictures_Path => {
                    if (pictures_Path.indexOf('./') === 0) {
                        return true
                    }
                    else {
                        return "Please enter a valid path (start with ./)"
                    }
                },
                when: function (response) { return response.usage_confirm }
            },
            {
                type: "input",
                message: "Please enter filenames of the images. (separate them with 'space' (for example image.jpg image.gif)",
                name: "usage_ImageNames",
                validate: usage_ImageNames => {
                    let res = validateImage(usage_ImageNames);
                    if (isString(res)) {
                        return res;
                    } else {
                        return true;
                    }
                },
                when: function (response) { return response.usage_confirm }
            },
            {
                type: "input",
                message: "Please enter project CONTRIBUTING section.",
                name: "guidelines",
                validate: guidelines => {
                    if (guidelines.length < 4) {
                        return "CONTRIBUTING section is too short";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Contributing") >= 0 }
            },
            {
                type: "input",
                message: "Please enter project TESTS section.",
                name: "instructions",
                validate: instructions => {
                    if (instructions.length < 4) {
                        return "TESTS section is too short";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Tests") >= 0 }
            },

            {
                type: "list",
                message: "Please choose a license for your project.",
                choices: ["MIT", "Apache License 2.0", "GNU", "BSD 2-Clause 'Simplified'", "BSD 3-Clause 'New'", "None"],
                default: 0,
                name: "license",
                when: function (response) { return response.sectionChoice.indexOf("License") >= 0 }
            },
            {
                type: "confirm",
                message: "Have you deploy your application?",
                name: "web_confirm",
                default: true,
            },
            {
                type: "input",
                message: "Would you like to provide a link? By default it will generate link from GitHub",
                name: "web_link",
                when: function (response){return response.web_confirm===true},
                validate: web_link=>{
                    let alphaExp = /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
                    // Regex condition
                    if (web_link===''){
                        return true
                    } else if (!web_link.match(alphaExp)) {
                        return "Please enter a valid webpage address";
                    } else {
                        return true;
                    }
                }
            },

        ])
        .then(function (response) {
            let readme = generatePage(response);
            fs.writeFile("README.md", readme, (er) => {
                if (er) return console.log(er);
                console.log('README completed...');
            });

        });
}
init();
