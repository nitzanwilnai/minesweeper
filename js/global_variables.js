// fonts
var g_fpsFontSize;
var g_gameFont;
var g_fontAwesome;

var g_backgroundColor = "#e8e8e8";
var g_darkBlue = "#244892";
var g_lightBlue = "#c9e7f7";


var g_minBlocksWide = 12;
var g_minBlocksHigh = 12;
var g_numBlocksWide = 12;
var g_numBlocksHigh = 12;
var g_blockSize;

var g_gameOffsetX = 0;
var g_gameOffsetY = 0;

var g_now = new Date().getTime();

var g_boardWidth = 10;
var g_boardHeight = 10;
var g_boardBlocksWide = 10;
var g_boardBlocksHigh = 10;
var g_boardOffsetX = 0;
var g_boardOffsetY = 0;

var g_board = null;
var g_boardFlags = null;
var g_boardMines = null;

var g_numMines = 10;
var g_mine = 100; // a large number to tell us if this index in the board is a mine or not

var g_selectedIndexI = -1;
var g_selectedIndexJ = -1;

var g_mouseDownTimer = 0;
var g_removeBlockTime = 250;

var g_score = 0;
