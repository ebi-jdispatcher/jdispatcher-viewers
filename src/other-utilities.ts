export function numberToString(n: number) {
    let stringNumber = "";
    if (Number.isInteger(n)) {
        stringNumber = n + ".0";
    } else if (n < 0.0001 || n > 10000) {
        stringNumber = n.toExponential(2);
    } else {
        stringNumber = n.toString();
    }
    return stringNumber;
}
