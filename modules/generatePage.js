function writeTabOfContent(data){
    str=""
    data.sectionChoice.forEach(element => {
        str += `* [${element}](#${element.toLowerCase()})\n`;
    })
    str+='\n';
    return str;
}
function generatePage(data){
    
    const readme = `# ${data.title} ![https://img.shields.io/github/license/${data.user}/${data.repo}]
    (https://img.shields.io/github/license/${data.user}/${repo.repo})\n\n <https://${data.user}.github.io/${data.repo}>
    ## Description\n\n ${data.description}\n
    ## Table of Contents\n\n ${writeTabOfContent(data)}
    ## Installation\n\n ${data.installation}\n\n
    ## Usage\n\n ${data.usage_info}\n\n
    ## Credits\n\n${data.guidelines}\n\n
    ## License\n\n
    Licensed under ${data.license} License.\n\n
    ## Tests\n\n\n${data.instructions}\n\n\n
    ## Questions\n\n 
    Contact [${data.user}](mailto:${data.email})`;

    return readme;
}
    // includeImage : function(){
        //     if(obj.includeImage) {
        //         let filenameArr = obj.filenames.split(" ");
        //         filenameArr.forEach(element => {
        //             let img = `![${obj.title}](${obj.imagePath}/${element})\n\n`;
        //             this.usage += img;
        //         });
        //     };
        // },


    // includeLink : function(){
        //     if(obj.website) this.description += `Deployed Site: ${this.projectLink}\n\n`;
        // },


    // readme.includeLink();
    // readme.writeTOC();
    // readme.includeImage();

    // Assemble Readme into a string
    // let readmeStr = readme.title.concat(readme.description, readme.toc);

    // Include sections in Readme String based on user selection
    // obj.sections.forEach(element => {
    //     let key = element.toLowerCase();
    //     if(readme.hasOwnProperty(key)){
    //         readmeStr += readme[key];
    //     }
    // });
    // readmeStr += readme.questions;


// module.exports = generatePage;