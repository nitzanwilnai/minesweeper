// "use strict" // <- hide for iPhone

function SliderClass()
{
	this.m_x = 0;
	this.m_y = 0;
	this.m_width = 0;
	this.m_height = 0;
	
	this.m_drawX = 0;
	this.m_drawY = 0;
	this.m_drawWidth = 0;
	this.m_drawHeight = 0;
	
	this.m_maxValue = 1;
	this.m_minValue = 0;
	this.m_currentValue = .5;
	
	this.m_pFunction = null;
	
	this.m_selected = false;
	
	this.SetValue = function( value )
	{
		this.m_currentValue = value;
		
		if( this.m_currentValue < this.m_minValue )
		{
			this.m_currentValue = this.m_minValue;
		}
		else if( this.m_currentValue > this.m_maxValue )
		{
			this.m_currentValue = this.m_maxValue;
		}
		if( this.m_pFunction )
		{
			this.m_pFunction( this.m_currentValue );
		}
	}
	
	this.Init = function( x, y, width, height, pFunction )
	{
		this.m_x = x;
		this.m_y = y;
		this.m_width = width;
		this.m_height = height;
		
		this.m_pFunction = pFunction;
		
		this.ResizeElements();
		
		this.SetValue( 0.5 );
	}
	
	this.Animate = function()
	{
	}
	
	this.Draw = function( ctx )
	{
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		
		if( this.m_pFunction == null )
		{
		}
		else
		{
			var barHeight = g_blockSize / 8;
			ctx.fillRect( this.m_drawX, this.m_drawY + ( this.m_drawHeight / 2 ) - ( barHeight / 2 ), this.m_drawWidth, barHeight );
			
			var notchX = this.m_drawX + ( (this.m_drawWidth - g_blockSize) * this.m_currentValue );
			if( this.m_selected )
			{
				ctx.fillStyle = g_darkBlue;
				ctx.fillRect( notchX, this.m_drawY, g_blockSize, this.m_drawHeight );
			}
			else
			{
				ctx.strokeStyle = g_darkBlue;
				ctx.strokeRect( notchX, this.m_drawY, g_blockSize, this.m_drawHeight );
			}
		}
		
		ctx.fillStyle = g_darkBlue;
		if( this.m_selected )
		{
			ctx.fillStyle = g_backgroundColor;
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
					return true;
				}
			}
		}
		if( event == "mousemove" )
		{
			if( this.m_selected )
			{
				this.SetValue( ( x - this.m_drawX ) / ( this.m_drawWidth - g_blockSize ) );
			}
			return true;
		}
		if( event == "mouseup" )
		{
			if( this.m_selected )
			{
				this.m_selected = false;
				return true;
			}
		}
		
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
