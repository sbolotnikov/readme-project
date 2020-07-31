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
    let str = ""
    data.sectionChoice.forEach(el => {
        str += `* [${el}](#${el.toLowerCase()})
        `;
    })
    str += `* [Questions](#questions)
    `;
    let readmeStr = `# ${data.title} 
    ![${data.repo}](https://img.shields.io/github/license/${data.user}/${data.repo})
    
    <https://${data.user}.github.io/${data.repo}>
    ## Description
    ${data.description}


    ## Table of Contents
     ${str}


    ## Installation
     ${data.installation}


    ## Usage
     ${data.usage_info}


    ## Contributing
    ${data.guidelines}


    ## License
    Licensed under ${data.license} License.


    ## Tests
    ${data.instructions}


    ## Questions 
    Contact [${data.user}](mailto:${data.email})`;

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
                default: "mike4506@gmail.com",
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
                type: "input",
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
                type: "input",
                message: "Please enter your project INSTALLATION instructions.",
                name: "installation",
                validate: installation => {
                    if (installation.length < 10) {
                        return "Installation section is too short";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Installation") >= 0 }
            },
            {
                type: "input",
                message: "How many images are needed for the INSTALLATION section",
                name: "install_picN",
                validate: install_picN => {
                    if (isNaN(install_picN)) {
                        return "Please enter a number";
                    }
                    else if (install_picN < 0) {
                        return "enter number more or equal 0";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Installation") >= 0 }
            },
            {
                type: "input",
                message: "Please enter filenames of the images. (separate them with 'space' (for example image.jpg image.gif)",
                name: "install_ImageNames",
                validate: install_ImageNames => {
                    let res = validateImage(install_ImageNames);
                    if (isString(res)) {
                        return res;
                    } else {
                        return true;
                    }
                },
                when: function (response) { return response.install_picN > 0 }
            },
            {
                type: "input",
                message: "Please enter project USAGE information.",
                name: "usage_info",
                validate: usage_info => {
                    if (usage_info.length < 10) {
                        return "USAGE section is too short";
                    }
                    else if (usage_info.length > 500) {
                        return "USAGE section is too long";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Usage") >= 0 }
            },
            {
                type: "input",
                message: "How many images are needed for the USAGE section",
                name: "usage_picN",
                validate: usage_picN => {
                    if (isNaN(usage_picN)) {
                        return "Please enter a number";
                    }
                    else if (usage_picN < 0) {
                        return "enter number more or equal 0";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Usage") >= 0 }
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
                when: function (response) { return response.usage_picN > 0 }
            },
            {
                type: "input",
                message: "Please enter project CONTRIBUTING section.",
                name: "guidelines",
                validate: guidelines => {
                    if (guidelines.length < 4) {
                        return "CONTRIBUTING section is too short";
                    }
                    else if (guidelines.length > 500) {
                        return "CONTRIBUTING section is too long";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Contributing") >= 0 }
            },
            {
                type: "input",
                message: "How many images are needed for the CONTRIBUTING section",
                name: "guidelines_picN",
                validate: guidelines_picN => {
                    if (isNaN(guidelines_picN)) {
                        return "Please enter a number";
                    }
                    else if (guidelines_picN < 0) {
                        return "enter number more or equal 0";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Contributing") >= 0 }
            },
            {
                type: "input",
                message: "Please enter filenames of the images. (separate them with 'space' (for example image.jpg image.gif)",
                name: "guidelines_ImageNames",
                validate: guidelines_ImageNames => {
                    let res = validateImage(guidelines_ImageNames);
                    if (isString(res)) {
                        return res;
                    } else {
                        return true;
                    }
                },
                when: function (response) { return response.guidelines_picN > 0 }
            },
            {
                type: "input",
                message: "Please enter project TESTS section.",
                name: "instructions",
                validate: instructions => {
                    if (instructions.length < 4) {
                        return "TESTS section is too short";
                    }
                    else if (instructions.length > 500) {
                        return "TESTS section is too long";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Tests") >= 0 }
            },



            {
                type: "input",
                message: "How many images are needed for the test instructions section",
                name: "instructions_picN",
                validate: instructions_picN => {
                    if (isNaN(instructions_picN)) {
                        return "Please enter a number";
                    }
                    else if (instructions_picN < 0) {
                        return "enter number more or equal 0";
                    }
                    else {
                        return true;
                    }
                },
                when: function (response) { return response.sectionChoice.indexOf("Tests") >= 0 }
            },
            {
                type: "input",
                message: "Please enter filenames of the images. (separate them with 'space' (for example image.jpg image.gif)",
                name: "instructions_ImageNames",
                validate: instructions_ImageNames => {
                    let res = validateImage(instructions_ImageNames);
                    if (isString(res)) {
                        return res;
                    } else {
                        return true;
                    }
                },
                when: function (response) { return response.instructions_picN > 0 }
            },
            {
                type: "input",
                message: "Please enter the path of the images (like ./image_directory). Make sure that all images are located in the same directory.",
                name: "pictures_Path",
                validate: pictures_Path => {
                    if (pictures_Path.indexOf('./') === 0) {
                        return true
                    }
                    else {
                        return "Please enter a valid path (start with ./)"
                    }
                },
                when: function (response) { return (response.install_picN > 0 || response.usage_picN > 0 || response.guidelines_picN > 0 || response.instructions_picN > 0) }
            },
            {
                type: "list",
                message: "Please choose a license for your project.",
                choices: ["MIT", "Apache License 2.0", "GNU", "BSD 2-Clause 'Simplified'", "BSD 3-Clause 'New'", "None"],
                default: 0,
                name: "license",
                when: function (response) { return response.sectionChoice.indexOf("License") >= 0 }
            },


        ])
        .then(function (response) {
            console.log(response);
            let readme = generatePage(response);
            console.log(readme);
            fs.writeFile("README.md", readme, (er) => {
                if (er) return console.log(er);
                console.log('README completed...');
            });

        });
}
// var res={
//     title: 'sdfcgvhjbnkml;',
//     repo: 'readme-project', 
//     user: 'sbolotnikov',    
//     email: 'sbolotnikov@gmail.com',
//     description: 'xcfgvhjkl;,kjhtygvfrc\r\ndsadzxfcgvhjbnkml;lkjhbtyfgvcrd',
//     sectionChoice: [ 'Installation instructions' ],
//     installation: "dfgvhjbnkml,;'.",
//     install_picN: '0'
//   }
// var readme=generatePage(res);
// console.log(readme);
// fs.writeFile("README-out.md", readme, (er) => {
//     if (er) return console.log(er);
//     console.log('README completed...');
// });
init();
