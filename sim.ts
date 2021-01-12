const Similar = (origin: string, compare: string) => {
    let str1A = origin.split("");
    let str2A = compare.split("");

    let str1R: Array<string> = [];
    for (const char of str1A)
        str1R = str1R.concat(getConstantVowel(char));
    let str2R: Array<string> = [];
    for (const char of str2A)
        str2R = str2R.concat(getConstantVowel(char));
    
    let found: number = 0;
    console.log(str1R, str2R)
    str1R.forEach((char, idx) => {
        if (char == undefined) return;
        if (str2R.indexOf(char) != -1 && str2R.indexOf(char) >= idx) {
            // str2R.splice(str2R.indexOf(char), 1);
            str2R[str2R.indexOf(char)] = "";
            found++;
        }
    })
    console.log(found * 100 / str1R.length + "% 일치");
}

function getConstantVowel(kor:string): Array<string> {
    const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
               'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
               'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
               'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
               'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
               'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
               'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
               'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588 + "");
    let sn = parseInt((uni - (fn * 588)) / 28 + "");
    let tn = parseInt(uni % 28 + "");

    return [f[fn],s[sn],t[tn]];
}

Similar("슬 픔", "슬픔");

export default {};