// "use strict" // <- hide for iPhone

function ButtonClass()
{
	this.m_x = 0;
	this.m_y = 0;
	this.m_width = 0;
	this.m_height = 0;
	
	this.m_drawX = 0;
	this.m_drawY = 0;
	this.m_drawWidth = 0;
	this.m_drawHeight = 0;
	
	this.m_pText = [];
	this.m_selected = false;
	this.m_pFunction = null;
	
	this.m_font = g_gameFont;
	
	this.Init = function( x, y, width, height, pText, pFunction, font )
	{
		this.m_x = x;
		this.m_y = y;
		this.m_width = width;
		this.m_height = height;
		this.m_pText = pText.split( "\n" );
		this.m_pFunction = pFunction;
		
		this.m_font = font;
		
		this.ResizeElements();
	}
	
	this.ChangeText = function (pText )
	{
		this.m_pText = pText;
	}
	
	this.Animate = function()
	{
	}
	
	this.Draw = function( ctx )
	{
		ctx.font = this.m_font;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		
		if( this.m_pFunction == null )
		{
		}
		else
		{
			if( this.m_selected )
			{
				ctx.fillStyle = g_darkBlue;
				ctx.fillRect( this.m_drawX, this.m_drawY, this.m_drawWidth, this.m_drawHeight );
			}
			else
			{
				ctx.strokeStyle = g_darkBlue;
				ctx.strokeRect( this.m_drawX, this.m_drawY, this.m_drawWidth, this.m_drawHeight );
			}
		}
		
		ctx.fillStyle = g_darkBlue;
		if( this.m_selected )
		{
			ctx.fillStyle = g_backgroundColor;
		}
		
		var textY = this.m_drawY + ( this.m_drawHeight / ( this.m_pText.length+1 ) );
		for( var i = 0; i < this.m_pText.length; i++ )
		{
			ctx.fillText( this.m_pText[i], this.m_drawX  + ( this.m_drawWidth / 2 ), textY );
			
			textY += ( this.m_drawHeight / ( this.m_pText.length+1 ) );
		}

	}

	this.PassInput = function( event, x, y )
	{
		if( x > this.m_drawX && x < ( this.m_drawX + this.m_drawWidth ) )
		{
			if( y > this.m_drawY && y < ( this.m_drawY + this.m_drawHeight ) )
			{
				if( event == "mousedown" )
				{
					this.m_selected = true;
				}
				else if( event == "mouseup" )
				{
					if( this.m_pFunction )
					{
						this.m_pFunction( x, y );
					}
					this.m_selected = false;
				}
				return true;
			}
		}
		this.m_selected = false;
		return false;
	}
	
	this.ResizeElements = function()
	{
		this.m_drawX = this.m_x * g_blockSize;
		this.m_drawY = this.m_y * g_blockSize;
		this.m_drawWidth = this.m_width * g_blockSize;
		this.m_drawHeight = this.m_height * g_blockSize;
	}
}
