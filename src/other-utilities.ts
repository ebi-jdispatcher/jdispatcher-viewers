function countDecimals(n: number) {
    if (Math.floor(n) === n) return 0;
    return n.toString().split(".")[1].length || 0;
};

export function numberToString(n: number) {
    let stringNumber = "";
    if (Number.isInteger(n)) {
        return stringNumber = n + ".0";
    } else if (n < 0.0001 || n > 10000) {
        return stringNumber = n.toExponential(2);
    } else if (countDecimals(n) > 3){
        return stringNumber = n.toFixed(3).toString();
    } else {
        return stringNumber = n.toString();
    }
}
