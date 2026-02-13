console.log("START");

const res = await fetch("https://api.github.com");
console.log("FETCH OK", res.status);

process.exit(0);
