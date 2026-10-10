function convertUnixToDate(unixTime) {
    return new Date(unixTime * 1000).toLocaleDateString("pt-BR");
}

module.exports = { convertUnixToDate }