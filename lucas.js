function findString(letter, str){
for (let i=0; i<str.length; i++){
    if (letter===str[i]){
        return true
    }
    return false;
};
}

function wordInWord(word1, word2){
    for (let i=0; i<word1[i]; i++){
        if (!findString(word1[i],word2)){
            return false
        }
    }
    return true
}
console.log(wordInWord('ash', 'bash'))