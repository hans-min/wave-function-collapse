class Tem {
    constructor(num) {
        this.num = num;
    }
}
function myFunc(theArr) {
    theArr[0].num = 30;
}

let arr = [];
for (let i = 0; i < 3; i++) {
    arr[i] = new Tem(i);
}
let arrayCopy = arr.slice();
console.log(arr[0]); // 45
myFunc(arrayCopy);
console.log(arr[0]); // 30


function checkValid(possibleModules, validModules) {
    possibleModules = possibleModules.filter(value => validModules.includes(value));
    // for (let i = possibleModules.length - 1; i >= 0; i--) {
    //     if (!validModules.includes(possibleModules[i])) {
    //         possibleModules.splice(i, 1);
    //     }
    // }
    console.log(possibleModules);
    return possibleModules;
}

let arr2 = [1, 2, 3];
console.log(checkValid(arr2, [1, 2]));
console.log(arr2);