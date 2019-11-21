/**
 * Global.js
 * 作用：定义游戏的初始数据
 */

var BOARD_ROW = 9;
var BOARD_COL = 10;

function getBoardRow() {
    return BOARD_ROW;
}

function getBoardCol() {
    return BOARD_COL;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    getBoardRow: getBoardRow,
    getBoardCol: getBoardCol,
    getRandomInt: getRandomInt
}