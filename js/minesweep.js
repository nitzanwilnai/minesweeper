var GameState = {
	"IN_GAME": 0,
	"GAME_OVER": 1
};

document.ontouchstart = function(e){
	e.preventDefault();
}

window.requestAnimFrame = (function(){
						   return  window.requestAnimationFrame       ||
						   window.webkitRequestAnimationFrame ||
						   window.mozRequestAnimationFrame    ||
						   function( callback ){
						   window.setTimeout(callback, 1000 / 60);
						   };
						   })();

var m_mobile = false;


function Init()
{
	FillRandomTable();
	
	var canvas = document.getElementById("canvas");
	
	m_canvasWidth = canvas.width;
	m_canvasHeight = canvas.height;
	
	m_touchEvents = false;
	
	if( !IsPhoneGap() )
	{
		InputSetup();
	}
	
	ResizeGame();

	InitButtons();
	
	m_gameState = GameState.IN_GAME;
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	SetupGameVariables();
	
	ResizeElements();
	
	(function animloop(){
	 requestAnimFrame(animloop);
	 Animate();
	 Draw();
	 })();
}

// creete some menu items
var m_inGameButtons = [];
var m_gameOverButtons = [];
var m_gameOverScoreIndex = 0;
function InitButtons()
{
	var midX = m_canvasWidth / 2;
	var midY = m_canvasHeight / 2;
	var buttonWidth = g_numBlocksWide / 4;
	var buttonHeight = 1;
	
	var buttonY = 0.5;
	var buttonX = 1;
	
	var buttonIndex = 0;
	
	m_inGameButtons.length = 0;
	
	AddButton( m_inGameButtons,
			  1,
			  buttonY,
			  1,
			  buttonHeight,
			  String.fromCharCode("0xf021"),
			  function() { StartGame(); },
			  g_fontAwesome );
	
	AddButton( m_inGameButtons,
			  ( g_numBlocksWide - buttonWidth  ) / 2,
			  buttonY,
			  buttonWidth,
			  buttonHeight,
			  "Mine Sweeper", null, g_gameFont );

	AddButton( m_inGameButtons,
			  ( g_numBlocksWide - buttonWidth  ) / 2,
			  ( g_numBlocksHigh - 1.5 ),
			  buttonWidth,
			  buttonHeight,
			  "Click to remove, long click to set flag", null, g_gameFont );

	
	AddButton( m_gameOverButtons,
			  ( g_numBlocksWide - buttonWidth  ) / 2,
			  buttonY,
			  buttonWidth,
			  buttonHeight,
			  "Game Over", null, g_gameFont );

	AddButton( m_gameOverButtons,
			  ( g_numBlocksWide - buttonWidth  ) / 2,
			  ( g_numBlocksHigh - 1.5 ),
			  buttonWidth,
			  buttonHeight,
			  "Mines found: ", null, g_gameFont );
	m_gameOverScoreIndex = 1;
	
	AddButton( m_gameOverButtons,
			  1,
			  buttonY,
			  1,
			  buttonHeight,
			  String.fromCharCode("0xf021"),
			  function() { StartGame(); },
			  g_fontAwesome );

}

function AddButton( pButtonArray, x, y, w, h, pText, pFunction, font )
{
	var arrayLength = pButtonArray.length;
	pButtonArray[arrayLength] = new ButtonClass();
	pButtonArray[arrayLength].Init( x, y, w, h, pText, pFunction, font );
}

// initial setup
function SetupGameVariables()
{
	g_board = [];
	g_boardFlags = [];
	g_boardMines = [];

	StartGame();
	
}

// initailizes our variables and starts a new game
function StartGame()
{
	m_gameState = GameState.IN_GAME;
	
	for( var i = 0; i < g_boardBlocksWide; i++ )
	{
		g_board[i] = [];
		g_boardFlags[i] = [];
		g_boardMines[i] = [];
		for( var j = 0; j < g_boardBlocksHigh; j++ )
		{
			g_board[i][j] = -1; // we have not cleared this one yet
			g_boardFlags[i][j] = false;
			g_boardMines[i][j] = false;
		}
	}
	
	// add mines
	var numMinesPlaced = 0;
	while( numMinesPlaced < g_numMines )
	{
		var indexI = Math.floor( Random() * g_boardBlocksWide );
		var indexJ = Math.floor( Random() * g_boardBlocksHigh );
		
		if( !g_boardMines[indexI][indexJ] )
		{
			g_boardMines[indexI][indexJ] = true;
			numMinesPlaced++;
		}
	}
}

function Alert( string )
{
	alert( string );
}


// phonegap stuff in case we want to release on iOS and Android
var m_phoneGap = false;
function IsPhoneGap()
{
	return m_phoneGap;
}

// resize everything to handle this screen resolution
function ResizeGame() {
	var gameArea = document.getElementById('gameArea');
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	
	
	g_blockSize = Math.floor( newWidth / g_minBlocksWide );
	var blocksHigh = Math.floor( newHeight / g_blockSize );
	if( blocksHigh < g_minBlocksHigh )
	{
		g_blockSize = Math.floor( newHeight / g_minBlocksHigh );
	}
	
	g_numBlocksWide = Math.floor( newWidth / g_blockSize );
	g_numBlocksHigh = Math.floor( newHeight / g_blockSize );
	//g_numBlocksWide = g_minBlocksWide;
	//g_numBlocksHigh = g_minBlocksHigh;
	
	var boardWidth = g_numBlocksWide * g_blockSize;
	var boardHeight = g_numBlocksHigh * g_blockSize;
	
	g_gameOffsetX = ( newWidth - boardWidth ) / 2;
	g_gameOffsetY = ( newHeight - boardHeight ) / 2;
	
	g_boardWidth = g_boardBlocksWide * g_blockSize;
	g_boardHeight = g_boardBlocksHigh * g_blockSize;
	
	g_boardOffsetX = ( newWidth - g_boardWidth ) / 2;
	g_boardOffsetY = ( newHeight - g_boardHeight ) / 2;
	
	newWidth = boardWidth;
	newHeight = boardHeight;
	
	gameArea.style.width = newWidth + 'px';
	gameArea.style.height = newHeight + 'px';
	
	gameArea.style.marginTop = (-newHeight / 2) + 'px';
	gameArea.style.marginLeft = (-newWidth / 2) + 'px';
 
	var gameCanvas = document.getElementById('canvas');
	gameCanvas.width = newWidth;
	gameCanvas.height = newHeight;
	
	m_canvasWidth = gameCanvas.width;
	m_canvasHeight = gameCanvas.height;
	
	//  * window.devicePixelRatio
	g_fpsFontSize = Math.round( g_blockSize * 0.25 );
	g_gameFont = Math.round( g_blockSize / 2 ) + "px Arial";
	g_fontAwesome = Math.round( g_blockSize / 2 ) + "px FontAwesome";
	
	// shouldn't get called the first time?
	ResizeElements();
}

// handle the game window getting resized
function ResizeElements()
{
	var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	
	for( var i = 0; i < m_inGameButtons.length; i++ )
	{
		m_inGameButtons[i].ResizeElements();
	}
	for( var i = 0; i < m_gameOverButtons.length; i++ )
	{
		m_gameOverButtons[i].ResizeElements();
	}
}

// this animates our game, but we have no animations :(
function Animate()
{
	var dt = 1/60.0;
	var now = new Date().getTime();
	dt = ((now-g_now) / 1000);
	g_now = Date.now();
}

// this draws our games
var counter = 0;
function Draw()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	if( m_textureLoadCount != m_prevTextureLoadCount )
	{
		ResizeElements();
		m_prevTextureLoadCount = m_textureLoadCount;
	}
	
	ctx.save();
	{
		if(window.devicePixelRatio == 2)
		{
			canvas.setAttribute('width', m_canvasWidth * 2);
			canvas.setAttribute('height', m_canvasHeight * 2);
			ctx.scale(2, 2);
		}
		
		ctx.clearRect(0, 0, m_canvasWidth, m_canvasHeight ); // clear canvas
		
		ctx.fillStyle = g_backgroundColor;
		ctx.fillRect( 0, 0, m_canvasWidth, m_canvasHeight );
		
		if( m_gameState == GameState.IN_GAME )
		{
			ctx.fillStyle = g_darkBlue;
			
			ctx.font = g_gameFont;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			for( var i = 0; i < m_inGameButtons.length; i++ )
			{
				m_inGameButtons[i].Draw( ctx );
			}
			
			DrawBoard( ctx );
		}
		
		if( m_gameState == GameState.GAME_OVER )
		{
			ctx.fillStyle = g_darkBlue;
			
			ctx.font = g_gameFont;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			// the score text
			var scoreText = [];
			scoreText[0] = "Mines found: " + g_score + " / " + g_numMines;
			if( g_score == g_numMines ) {
				// change it to "all mines found" if we found all the mines
				scoreText[0] = "All mines found!!!";
			}
			m_gameOverButtons[m_gameOverScoreIndex].ChangeText( scoreText );
			
			var titleText = [];
			titleText[0] = "Game over!";
			if( g_score == g_numMines )
			{
				// change game over text to "you win" if we found all the mines
				titleText[0] = "You win!!!";
			}
			m_gameOverButtons[0].ChangeText( titleText );
			
			for( var i = 0; i < m_gameOverButtons.length; i++ )
			{
				m_gameOverButtons[i].Draw( ctx );
			}

			DrawBoard( ctx );
		}
		
		var d2 = new Date();
		frameTimer.EndTimer(d2.getTime());
		
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		//frameTimer.DrawFPS( ctx );
		
		var d1 = new Date();
		frameTimer.StartTimer(d1.getTime());
		
	}
	ctx.restore();
	
	counter++;
	if( counter > 3000 )
	{
		counter = 0;
	}
		
	// this line below unlocks super fast framrate on browsers, but not on mobile which is why its commented out
	//window.requestAnimationFrame(draw, canvas); //???
}

// this function draws the game board
function DrawBoard( ctx )
{
	ctx.save();
	{
		ctx.translate( g_boardOffsetX, g_boardOffsetY );
		
		ctx.fillStyle = g_darkBlue;
		
		if( g_selectedIndexI > -1 && g_selectedIndexJ > -1 )
		{
			ctx.fillRect( g_selectedIndexI * g_blockSize, g_selectedIndexJ * g_blockSize, g_blockSize, g_blockSize );
		}
		
		ctx.strokeStyle = g_darkBlue;
		for( var i = 0; i < g_boardBlocksWide; i++ )
		{
			for( var j = 0; j < g_boardBlocksHigh; j++ )
			{
				ctx.fillStyle = g_lightBlue;
				// fill blocks that have not been cleared with light blue
				if( g_board[i][j] < 0 )
				{
					ctx.fillRect( i * g_blockSize, j * g_blockSize, g_blockSize, g_blockSize );
				}
				
				ctx.fillStyle = g_darkBlue;
				
				if( g_boardFlags[i][j] )
				{
					if( m_gameState == GameState.GAME_OVER )
					{
						if( !g_boardMines[i][j] )
						{
							ctx.fillStyle = g_redColor;
							ctx.fillRect( i * g_blockSize, j * g_blockSize, g_blockSize, g_blockSize );
						}
					}
					
					ctx.fillStyle = g_darkBlue;
					ctx.font = g_fontAwesome;
					ctx.fillText( String.fromCharCode("0xf024"), i * g_blockSize + ( g_blockSize / 2 ), j * g_blockSize + ( g_blockSize / 2 ) );
				}
				else if( g_board[i][j] > 0 )
				{
					// write the # of bombs on this block for cleared blocks
					ctx.font = g_gameFont;
					ctx.fillText( g_board[i][j], i * g_blockSize + ( g_blockSize / 2 ), j * g_blockSize + ( g_blockSize / 2 ) );
				}
				
				if( g_boardMines[i][j] )
				{
					// show bombs on game over
					if( m_gameState == GameState.GAME_OVER )
					{
						ctx.fillStyle = g_lightBlue;
						if( g_boardFlags[i][j] )
						{
							ctx.fillStyle = g_greenColor;
						}
						ctx.fillRect( i * g_blockSize, j * g_blockSize, g_blockSize, g_blockSize );
						
						ctx.fillStyle = g_darkBlue;
						ctx.font = g_fontAwesome;
						ctx.fillText( String.fromCharCode("0xf1e2"), i * g_blockSize + ( g_blockSize / 2 ), j * g_blockSize + ( g_blockSize / 2 ) );
					}
				}
				
				ctx.strokeRect( i * g_blockSize, j * g_blockSize, g_blockSize, g_blockSize );
				
			}
		}
	}
	ctx.restore();

}

// Call ReSize() when the screen size changes or the phone orientation changes:
window.addEventListener('resize', ResizeGame, false);
window.addEventListener('orientationchange', ResizeGame, false);

// this function handles all our input
function PassInput( event, key, x, y )
{
	if( m_gameState == GameState.IN_GAME )
	{
		for( var i = 0; i < m_inGameButtons.length; i++ )
		{
			m_inGameButtons[i].PassInput( event, x, y );
		}
		
		// Track input
		if( event == "keydown" )
		{
		}
		else if( event == "keyup" )
		{
		}
		else if( event == "mousedown" )
		{
			g_mouseDown = true;
			g_mouseDownTimer = g_now;
			
			SelectIndicesFromMousePosition( x, y );
		}
		else if( event == "mouseup" )
		{
			SelectIndicesFromMousePosition( x, y );
			
			if( g_boardFlags[g_selectedIndexI][g_selectedIndexJ] )
			{
				g_boardFlags[g_selectedIndexI][g_selectedIndexJ] = false;
			}
			else
			{
				if( ( g_now - g_mouseDownTimer ) > g_removeBlockTime )
				{
					// mark flag
					g_boardFlags[g_selectedIndexI][g_selectedIndexJ] = true;
					// check if we marked all the flags and won the game
					CheckGameOver();
				}
				else
				{
					// remove this block and start the recursion checks
					RemoveBlock( g_selectedIndexI, g_selectedIndexJ );
				}
			}
			g_selectedIndexI = -1;
			g_selectedIndexJ = -1;
			
			g_mouseDown = false;
		}
		else if( event == "mousemove" )
		{
			if( g_mouseDown )
			{
				SelectIndicesFromMousePosition( x, y );
			}
		}

	}
	else if( m_gameState == GameState.GAME_OVER )
	{
		for( var i = 0; i < m_gameOverButtons.length; i++ )
		{
			m_gameOverButtons[i].PassInput( event, x, y );
		}
	}
}

// just a helper function to make sure the user doesn't try to select outside the game board
function SelectIndicesFromMousePosition( x, y )
{
	g_selectedIndexI = Math.floor( ( x - g_boardOffsetX ) / g_blockSize );
	g_selectedIndexJ = Math.floor( ( y - g_boardOffsetY ) / g_blockSize );
	
	if( g_selectedIndexI < 0 || g_selectedIndexI >= g_boardBlocksWide )
	{
		if( g_selectedIndexJ < 0 || g_selectedIndexJ >= g_boardBlocksHigh )
		{
			g_selectedIndexI = g_selectedIndexJ = -1;
		}
	}

}

// remove the block at this index
function RemoveBlock( indexI, indexJ )
{
	// first make sure this index is within the game board
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			// if there is a mine in this index, end the game because we stepped on it
			if( g_boardMines[indexI][indexJ] )
			{
				GameOver();
			}
			// if this block has not been cleared yet
			else if( g_board[indexI][indexJ] < 0 )
			{
				// clear this block
				// get the # of bombs around me
				var numBombs = CheckBlock( indexI, indexJ );
				g_board[indexI][indexJ] = numBombs;

				// if this block has no bombs on it, continue trying to remove the 8 blocks around it
				if( numBombs == 0 )
				{
					// now check the 8 blocks around it
					for( var i = -1; i < 2; i++ )
					{
						for( var j = -1; j < 2; j++ )
						{
							// for all the blocks around it, if it is not a bomb, remove it
							// not that we are checking our indexI and indexJ again, but we take care of it in the recursion
							if( !IsBomb( indexI + i, indexJ + j ) )
							{
								RemoveBlock( indexI + i, indexJ + j );
							}
						}
					}
				}
			}
		}
	}
}

// this function counts how many bombs are around this block
function CheckBlock( indexI, indexJ )
{
	var bombCounter = -1;
	// first makre sure the indices are in the game board
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			// also make sure we have not removed this block already
			if( g_board[indexI][indexJ] < 0 )
			{
				// now check the 8 blocks around us, if one of them is a bomb, increment the counter
				// note we are also checking ourselves and will not remove ourselves if that is the case
				bombCounter = 0;
				for( var i = -1; i < 2; i++ )
				{
					for( var j = -1; j < 2; j++ )
					{
						// not that we are checking our indexI and indexJ again, but we take care of it in the recursion
						if( IsBomb( indexI + i, indexJ + j ) )
						{
							bombCounter++;
						}
					}
				}
			}
		}
	}
	return bombCounter;
}

// check if this index is a bomb
function IsBomb( indexI, indexJ )
{
	// first make sure the index is valid
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			// now check if we are a bomb
			if( g_boardMines[indexI][indexJ] )
			{
				return true;
			}
		}
	}
	return false;
}

// Game has ended, calculated score
// The score is how many mines were successfully marked
function GameOver()
{
	// set our gamestate to the game over state
	m_gameState = GameState.GAME_OVER;
	
	g_score = 0;
	
	// go through the entire board and increment score where the flag and mine are in the same location
	for( var i = 0; i < g_boardBlocksWide; i++ )
	{
		for( var j = 0; j < g_boardBlocksHigh; j++ )
		{
			if( g_boardMines[i][j] && g_boardFlags[i][j] )
			{
				g_score++;
			}
		}
	}
}

// every time we mark a flag, check if we marked all the mines
function CheckGameOver()
{
	var minesMarked = 0;
	for( var i = 0; i < g_boardBlocksWide; i++ )
	{
		for( var j = 0; j < g_boardBlocksHigh; j++ )
		{
			// count how many mines are correctly marked
			if( g_boardMines[i][j] && g_boardFlags[i][j] )
			{
				minesMarked++;
			}
		}
	}
	// if we marked all the mines correctly, set our score to maximum and end the game
	if( minesMarked == g_numMines )
	{
		g_score == g_numMines;
		GameOver();
	}
}



var m_canvasWidth;
var m_canvasHeight;

var frameTimer = new TimerClass();

// it takes time for our textures to load. We use m_textureLoadCount and m_prevTextureLoadCount to determine if a new texture has been loaded.
var m_textureLoadCount = 0;
var m_prevTextureLoadCount = 0;

// variable to determine whether we are using touch events or mouse clicks
var m_touchEvents;

var m_gameState;

var m_drag; // mouse/finger drag


////////

if( 0 )
{
	window.log = function(){};
}
else
{
	if (Function.prototype.bind) {
		window.log = Function.prototype.bind.call(console.log, console);
	}
	else {
		window.log = function() {
			Function.prototype.apply.call(console.log, console, arguments);
		};
	}
}

