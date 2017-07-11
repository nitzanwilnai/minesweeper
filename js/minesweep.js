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

function SetupGameVariables()
{
	g_board = [];
	g_boardFlags = [];
	g_boardMines = [];

	StartGame();
	
}

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
			g_board[i][j] = 0;
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


var m_phoneGap = false;
function IsPhoneGap()
{
	return m_phoneGap;
}


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

function Animate()
{
	var dt = 1/60.0;
	var now = new Date().getTime();
	dt = ((now-g_now) / 1000);
	g_now = Date.now();
}

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
			
			var scoreText = [];
			scoreText[0] = "Mines found: " + g_score + " / " + g_numMines;
			if( g_score == g_numMines ) {
				scoreText[0] = "All mines found!!!";
			}
			m_gameOverButtons[m_gameOverScoreIndex].ChangeText( scoreText );
			
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
				if( g_board[i][j] > -1 )
				{
					ctx.fillRect( i * g_blockSize, j * g_blockSize, g_blockSize, g_blockSize );
				}
				
				ctx.fillStyle = g_darkBlue;
				
				if( g_boardFlags[i][j] )
				{
					ctx.font = g_fontAwesome;
					ctx.fillText( String.fromCharCode("0xf024"), i * g_blockSize + ( g_blockSize / 2 ), j * g_blockSize + ( g_blockSize / 2 ) );
				}
				else if( g_board[i][j] > 0 )
				{
					ctx.font = g_gameFont;
					ctx.fillText( g_board[i][j], i * g_blockSize + ( g_blockSize / 2 ), j * g_blockSize + ( g_blockSize / 2 ) );
				}
				
				if( g_boardMines[i][j] )
				{
					// show bombs on game over
					if( m_gameState == GameState.GAME_OVER )
					{
						ctx.fillStyle = g_lightBlue;
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
					CheckGameOver();
				}
				else
				{
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

function RemoveBlock( indexI, indexJ )
{
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			if( g_boardMines[indexI][indexJ] )
			{
				GameOver();
			}
			else if( g_board[indexI][indexJ] > -1 )
			{
				g_board[indexI][indexJ] = -1;
				
				var bombFound = false;
				for( var i = -1; i < 2; i++ )
				{
					for( var j = -1; j < 2; j++ )
					{
						var bombCounter = CheckBlock( indexI + i, indexJ + j );
						if( bombCounter > -1/* && g_board[indexI + i][indexJ + j] != g_mine*/ )
						{
							g_board[indexI + i][indexJ + j] = bombCounter;
						}
						if( bombCounter == 0 )
						{
							RemoveBlock( indexI + i, indexJ + j );
						}
					}
				}
			}
		}
	}
}

function GameOver()
{
	m_gameState = GameState.GAME_OVER;

	g_score = 0;
	
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

function CheckGameOver()
{
	var minesMarked = 0;
	for( var i = 0; i < g_boardBlocksWide; i++ )
	{
		for( var j = 0; j < g_boardBlocksHigh; j++ )
		{
			if( g_boardMines[i][j] && g_boardFlags[i][j] )
			{
				minesMarked++;
			}
		}
	}
	if( minesMarked == g_numMines )
	{
		g_score == g_numMines;
		GameOver();
	}
}

function CheckBlock( indexI, indexJ )
{
	var bombCounter = -1;
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			if( g_board[indexI][indexJ] > -1 )
			{
				bombCounter = 0;
				for( var i = -1; i < 2; i++ )
				{
					for( var j = -1; j < 2; j++ )
					{
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

function IsBomb( indexI, indexJ )
{
	if( indexI >= 0 && indexI < g_boardBlocksWide )
	{
		if( indexJ >= 0 && indexJ < g_boardBlocksHigh )
		{
			if( g_boardMines[indexI][indexJ] )
			{
				return true;
			}
		}
	}
	return false;
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

