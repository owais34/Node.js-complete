const sum = (a, b) => {
    if( a && b)
    return a+b;
    throw new Error("Invalid args")
}

console.log(sum(1,2))