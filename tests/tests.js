
	/**
	 *Testing local Video
	 */
	var mediaSession;
	asyncTest( "asynchronous test: testing local video", 1, function() {
		var localvideo = document.querySelector("#localVid");
		localPlaying=function(){
			ok( true, "video has loaded and is ready to play" );
			start();
		};
		localvideo.addEventListener("play",localPlaying,false);
		mediaSession = new Credo.Media('AV','localVid','remVid',message,message);
		mediaSession.start();
		
	});
	
	
	/**
	 *Testing connection init, offer generation
	 */
	 var conn;
	 var localsdp;
	 asyncTest( "asynchronous test: testing offer generation", 1, function() {
		var localOffer=function(sdp){
			ok( sdp.type=="offer", "offer is generated" );
			localsdp=sdp;
			start();
		};
		conn= new Credo.Connection(null,localOffer,null,mediaSession,message,message);
		conn.call();
		
	});
	
	asyncTest( "asynchronous test: testing media stop", 1, function() {
	var localvideo = document.querySelector("#localVid");
		var onSuspend=function(){
		ok( true, "media is stopped" );
			start();
		};
		localvideo.addEventListener("emptied",onSuspend,false);
		conn.disconnect();
	});
	
	
	/*var mediaSession=null;
	asyncTest( "asynchronous test: testing local screencasting", 1, function() {
		var localvideo = document.querySelector("#localVid");
		localvideo.pause();
                if(typeof navigator.webkitGetUserMedia != undefined)
                {     
                    localvideo.src=null;
                }
                else if(typeof navigator.mozGetUserMedia != undefined)
                {
                    localvideo.mozSrcObject=null;
                }
		localPlaying=function(){
			ok( true, "screen has loaded" );
			start();
		};
		localvideo.addEventListener("play",localPlaying,false);
		mediaSession = new Credo.Media('S','localVid','remVid',message,message);
		mediaSession.start();
		
	});*/

	/**
	 *Testing remote 
	 */
	  /*asyncTest( "asynchronous test: testing answer as remote", 1, function() {
		var remvideo = document.querySelector("#remVid");
		remPlaying=function(){
			ok( true, "video has loaded and is ready to play" );
			start();
		};
		remvideo.addEventListener("play",remPlaying,false);
		conn.descriptionReceived(localsdp);
		
		
	});*/
	
	
	
	
	
	//Generic functions
	var message=function(message){
		console.log(message);
	}
	
 
