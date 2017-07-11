#! /bin/bash

CopyResources()
{
	echo "Copying to $1"
	cp -R -f assets $1
	cp -R -f sounds $1
	cp -R -f index.html $1
#	cp -R -f sketchnation.png $1

    	if [ "$2" == "compress" ]; then
		MinifyJavascriptFiles js/ $1
		MinifyJavascriptFiles js/common/ $1
		MinifyJavascriptFiles js/game_common/ $1
	
		MinifyGamesJavascriptFiles js/games/ $1
    	elif [ “$2” == “combine” ]; then
		MinifyAndCombineJavascriptFiles sn_final_engine.js 		js/
		MinifyAndCombineJavascriptFiles sn_final_common.js 		js/common/
		MinifyAndCombineJavascriptFiles sn_final_games_common.js	js/games_common/
		MinifyAndCombineJavascriptFiles sn_final_game.js 		js/games/sideflying_simple/
		MinifyAndCombineJavascriptFiles sn_final_game.js 		js/games/sideflying_advanced/
		MinifyAndCombineJavascriptFiles sn_final_game.js 		js/games/siderunning/
		MinifyAndCombineJavascriptFiles sn_final_game.js 		js/games/traffic/
		MinifyAndCombineJavascriptFiles sn_final_game.js		js/games/powerof2/
		MinifyAndCombineJavascriptFiles sn_final_game.js		js/games/lander/
	else

		cp -R -f js $1
	fi
}

MinifyJavascript()
{
	echo “java -jar /Programming/v3/closure/compiler-latest/compiler.jar --js_output_file=$1 $2”
	java -jar /Programming/v3/closure/compiler-latest/compiler.jar --js_output_file=$1 $2

}

MinifyJavascriptFiles()
{
	FILES=$1*.js
	echo $FILES
	for f in $FILES
	do
		MinifyJavascript $2$f $f
	done
}

MinifyGamesJavascriptFiles()
{
	DIRECTORIES=$1*
	#echo $DIRECTORIES
	for d in $DIRECTORIES
	do
		#echo $d
		FILES=$d/*.js
		#echo $FILES
		for f in $FILES
		do
			#echo $f
			MinifyJavascript $2$f $f
		done
	done
}

MinifyAndCombineJavascriptFiles()
{
	PATH = $2
	MinifyJavascript $PATH$1 $PATH*.js
}



echo "Starting copy $1"
CopyResources phonegap/letters/www/ $1
CopyResources phonegap/letters/platforms/ios/www/ $1
echo "Done"
