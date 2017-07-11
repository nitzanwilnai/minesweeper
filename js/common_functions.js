function SetRandIndex(n)
{
	randIndex=n;
}

function RandomCalc()
{
	var n = 1000;
	seed = (0x015a4e35 * seed) % 0x7fffffff;
	return ((seed >> 16) % n)/n;
}

function Random()
{
	var value = RANDOMTABLE[randIndex];
	randIndex++;
	if(randIndex >= RANDOMTABLEMAX)
	{
		randIndex = 0;
	}
	return value;
}

function FillRandomTable()
{
	for(i=0; i<RANDOMTABLEMAX; i++)
	{
		RANDOMTABLE[i] = RandomCalc();
	}
}

var seed = Date.now();
var RADIANS = Math.PI*2/360;
var RADIANS360 = Math.PI*2;

var RANDOMTABLE = new Array();
var RANDOMTABLEMAX = 200;
var randIndex = 0;

function TimerClass()
{
	var m_startTime = 0;
	var m_endTime = 0;
	this.StartTimer = StartTimer;
	this.EndTimer = EndTimer;
	this.GetTime = GetTime;
	this.DrawFPS = DrawFPS;
	
	function StartTimer(time)
	{
		m_startTime = time;
	}
	
	function EndTimer(time)
	{
		m_endTime = time;
	}
	
	function GetTime()
	{
		return (m_endTime - m_startTime);
	}
	
	function DrawFPS( ctx)
	{
		var frames = Math.floor( 1000 / GetTime() );
		ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        var framesLimit = frames;
        if( frames > 45 )
        {
            framesLimit = 60;
        }
        else if( frames > 25 )
        {
            framesLimit = 30;
        }
        else if( frames > 15 )
        {
            framesLimit = 20;
        }
        else
        {
            framesLimit = 0;
        }
        
		var stringTest = "FPS " + frames + " " + framesLimit;
		ctx.font = g_fpsFontSize + "px Arial";
		ctx.fillText(stringTest, 0, g_fpsFontSize + 4 );
	}
}


function log(msg) {
	setTimeout(function() {
			   throw new Error(msg);
			   }, 0);
}


function TouchHandler(event)
{
	// make sure our code knows we are receiving touch events so we can ignore mouse clicks
	m_touchEvents = true;
	
	// if we are not in touchend or touchcancel, make sure we are doing one finger touch
	if( event.changedTouches.length == 1 )
	{
		HandleInput( event );
	}
}



function DrawCachedImageReSize( ctx, cachedImage, pixelRatio, x, y, width, height )
{
    ctx.save();
    {
        ctx.scale( 1/pixelRatio, 1/pixelRatio );
        ctx.drawImage( cachedImage, x*pixelRatio, y*pixelRatio, width*pixelRatio, height*pixelRatio );
    }
    ctx.restore();
}


function DrawCachedImage( ctx, cachedImage, oneOverPixelRatio, x, y )
{
    ctx.save();
    {
        ctx.scale( oneOverPixelRatio, oneOverPixelRatio );
        ctx.drawImage( cachedImage, x, y );
    }
    ctx.restore();
}

var renderToCanvas = function (width, height, renderFunction) {
	var buffer = document.createElement('canvas');
    
    ctx = buffer.getContext('2d');
    log("window.devicePixelRatio " + window.devicePixelRatio);
    
    var pixelRatio = window.devicePixelRatio;
    
	buffer.width = width * pixelRatio;
	buffer.height = height * pixelRatio;
    
    
    buffer.setAttribute('width', width * pixelRatio);
    buffer.setAttribute('height', height * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    
	renderFunction(ctx);
	return buffer;
};


function AddCommasToNumbers( number )
{
	//			log( "number " + number );
	var numberString = ""+number;
	var array = numberString.split("");
	for(i = 0; i < array.length; i++)
	{
		//				log( " array[" + i + "] " + array[i] );
	}
	var numberStringWithCommas = [];
	var numberIndex = 0;
	var numberCounter = 0;
	for( i = array.length-1; i > -1 ; i-- )
	{
		//				log( "numberStringWithCommas["+numberIndex+"] adding " + numberString[i] );
		numberStringWithCommas[numberIndex] = ""+numberString[i];
		//				log( "i (i+1) " + ( i + 1 ) );
		if( ( numberCounter + 1 ) % 3 == 0 && ( i != 0 ) && ( i != array.length-1 ) )
		{
			numberIndex++;
			//					log( "numberStringWithCommas["+numberIndex+"] adding ," );
			numberStringWithCommas[numberIndex] = ",";
		}
		numberIndex++;
		numberCounter++;
	}
	var returnString = "";
	for( i = numberStringWithCommas.length-1; i > -1 ; i-- )
	{
		returnString += numberStringWithCommas[i];
	}
	
	//			log( "returnString " + returnString );
	
	return returnString;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var cars = text.split("\n");
	var totalHeight = y;
	
	for (var ii = 0; ii < cars.length; ii++) {
		
		var line = "";
		var words = cars[ii].split(" ");
		
		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			
			if (testWidth > maxWidth) {
				context.fillText(line, x, y);
				line = words[n] + " ";
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		
		context.fillText(line, x, y);
		y += lineHeight;
	}
	totalHeight = y - totalHeight;
	return totalHeight;
}

// this function somehow detects if we are running on a mobile browser, and if the web-app has been installed (added to home screen)
function DetectMobile()
{
	var mobile = false;
	var mobileInstalled = false;
	
	window.mobilecheck = function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	};
	
	
	if( !( window.mobilecheck()) )
	{
		mobile = false;
	}
	else
	{
		mobile = true;
		
		if( window.navigator.standalone )
		{
			mobileInstalled = true;
		}
	}
	
	return {
	mobile: mobile,
	mobileInstalled: mobileInstalled
	};
}

