

Credo = {
	
	STATE : {
		INITIALIZING: 0,
		CONNECTING: 1,
		PAUSED: 2,
		PAUSED_FORICE: 3,
		CONNECTED:4,
		MEDIAON: 5	
	},	
	CALLTYPE : {
		VIDEO_ONLY: 'V',
		AUDIO_ONLY: 'A',
		AUDIO_VIDEO: 'AV'	
	},
	PEERTYPE : {
		LOCAL: 0,
		REMOTE: 1
	}
	
	
}


/*Class Media */
Credo.Media = function(callType, localMediaElemId, remoteMediaElemId, success, failure){

	this.callType=callType;
	this.isOffer=false;
	this.success=success;
	this.failure=failure;
	this.localMediaElemId=localMediaElemId;
	this.remoteMediaElemId=remoteMediaElemId;
	this.localStream=null;
	this.remoteStream=null;
	this.onMediaAvailable=null;
	this.connection=null;

}

Credo.Media.prototype.start = function(){
	//Setup the local media
	this.initUserMedia(this.onMedia);
}

Credo.Media.prototype.initUserMedia = function(onMedia){
	var media;
	var mediaObj = this;
	var failMethod = this.failure;
	var trigger = function(stream){
		onMedia(stream,mediaObj,Credo.PEERTYPE.LOCAL);
		};
		
	var triggerFail = function(error){
		failMethod(error);
	}
		
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
	
	if(navigator.getUserMedia){
			if(this.callType==Credo.CALLTYPE.AUDIO_VIDEO){				
				 media=navigator.getUserMedia({audio:true, video:true},trigger,triggerFail);					 
			}else if(this.callType==Credo.CALLTYPE.AUDIO){
				 media=navigator.getUserMedia({audio:true, video:false},trigger,triggerFail);			
			}else if(this.callType==Credo.CALLTYPE.VIDEO){
				 media=navigator.getUserMedia({audio:false, video:true},trigger,triggerFail);			
			}else{
				failure("The provided call type:"+this.callType+" is not supported.");
				return;
			}
	}else{
		this.failure("Your browser does not support WebRTC media capabilities for this request.");
	}
}

Credo.Media.prototype.onMedia = function(stream,mediaObj,type){
	
	if(type===Credo.PEERTYPE.LOCAL){
		mediaElemId=mediaObj.localMediaElemId;
		mediaObj.localStream=stream;
		if(mediaObj.connection && mediaObj.connection.state==Credo.STATE.PAUSED){
			mediaObj.connection.createOfferAnswer();
			mediaObj.connection.setState(Credo.STATE.CONNECTING);
		}
		mediaObj.onMediaAvailable=null;
		var video = document.querySelector("#"+mediaElemId);
		video.src = window.URL.createObjectURL(stream);
	}else if(type===Credo.PEERTYPE.REMOTE){
		mediaElemId=mediaObj.remoteMediaElemId;
		mediaObj.remoteStream=stream;
		var video = document.querySelector("#"+mediaElemId);
		video.src = window.URL.createObjectURL(stream.stream);
	} 
	//TODO check for browser compatibility
	
    
}