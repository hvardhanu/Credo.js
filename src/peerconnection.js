/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

*/
	/** File: connection.js
	*	A class to start RTCPeerConnection, provide signaling interface to clients,
	*	send and receive session description, ice. Handle the session description and
	*	ice depending on whether its an offer or answer.
	*	
	*	To intitiate a peer connection do the following:
	*	var con = new Credo.Connection(configuration,onSessionDesc,onIce,mediaSession,success,failure);
	*	configuration		: configuration object to be passed to RTCPeerConnection, you may pass 
	*						  stun servers here
	*	onSessionDesc		: a call back credo.js will call, when RTCPeerConnection generates a session description
	*	onIce		 		: not mandatory, only required if you want to pass ice over signalling for 
	*						  'ice trickling' mode
	*	mediaSession 		: an already initialized media session
	*	'success/failure' 	: callbacks for success / failure
	*For more information refer: https://github.com/hvardhanu/Credo.js/wiki/Credo.js-API
	*
	*/

	Credo.Connection = function(configuration, onSessionDesc, onGeneratedIce, mediaObj, success, failure){
		this.state = Credo.STATE.INITIALIZING;
		this.isReady = false;
		this.isOffer = false;
		this.success = success;
		this.failure = failure;
		this.configuration = configuration;
		this.peerConnection = null;
		if(mediaObj){
			this.mediaObj = mediaObj;
			mediaObj.connection=this;
		}else{
			this.failure("'mediaObj' is mandatory.");
			return;
		}
		this.onGeneratedIce = onGeneratedIce;
		if(onSessionDesc){
			this.onSessionDesc = onSessionDesc;
		}else{
			this.failure("'onSessionDesc' is mandatory. Supply 'onGeneratedIce' for ICE Candidate Trickling.");
			return;
		}
		//TODO check for opera
		if(typeof(webkitRTCPeerConnection) != 'undefined'){
			this.peerConnection = new webkitRTCPeerConnection(this.configuration);
		}else if(typeof(mozRTCPeerConnection) != 'undefined'){
			this.peerConnection = new mozRTCPeerConnection(this.configuration);
		}else{
			this.failure("Your browser does not support WebRTC capabilities for this request.");
			return;
		}
		this.isReady=true;
	}


	Credo.Connection.prototype.call = function(){
		if(!this.isReady){
			this.callFailureNotReady();
			return;
		}
		this.isOffer=true;
		this.createOfferAnswer();
			
	}

	Credo.Connection.prototype.descriptionReceived = function(sessionDesc){
		console.log('received desc'+JSON.stringify(sessionDesc));
		if(this.isOffer && (sessionDesc.type=="answer" || sessionDesc.type=="pranswer")){
			this.receiveAnswer(sessionDesc);
		}else if(sessionDesc.type=="offer"){
			this.answer(sessionDesc);
		}else{
			
		}
	}

	Credo.Connection.prototype.answer = function(sessionDesc){
		if(!this.isReady){
			this.callFailureNotReady();
			return;
		}
		this.isOffer=false;
		this.onRemoteSessionDesc(sessionDesc);
			
	}

	Credo.Connection.prototype.receiveAnswer = function(sessionDesc){
		if(!this.isReady){
			this.callFailureNotReady();
			return;
		}
		this.onRemoteSessionDesc(sessionDesc);
	}

	Credo.Connection.prototype.callFailureNotReady = function(){
		this.failure('Credo.Connection not connected, did not initialize.');
	}


	Credo.Connection.prototype.createOfferAnswer = function(){
		var isVideo=false;
		var isAudio=false;
		
		//if(this.state!=Credo.STATE.PAUSED_FORICE){
		if(true){
		
			if(this.mediaObj.callType==Credo.CALLTYPE.VIDEO_ONLY) {
				isVideo=true;
			}else if(this.mediaObj.callType==Credo.CALLTYPE.AUDIO_ONLY){
				isAudio=true;
			}else if(this.mediaObj.callType==Credo.CALLTYPE.AUDIO_VIDEO){
				isAudio=true;
				isVideo=true;
			}else{
				this.failure('Credo.Media not initialized or does not have a calltype.');
				return;
			}
			
			if(this.mediaObj.localStream){
				this.peerConnection.addStream(this.mediaObj.localStream);
			}else{
				this.setState(Credo.STATE.PAUSED);
				this.mediaObj.onMediaAvailable=this.createOfferAnswer;
				return;
			}
			
		
		
			if(this.onGeneratedIce){
				this.peerConnection.onicecandidate=this.onGeneratedIce;
			}else{
				this.setState(Credo.STATE.PAUSED_FORICE);
				var connection = this;
				var trigger = function(ice){
					connection.iceHandler(ice,connection);
				}
				this.peerConnection.onicecandidate=trigger;
				//return;
			}
		}
		
			var connection = this;
			var trigger = function(sessionDesc){
			connection.onLocalSessionDesc(sessionDesc,connection);
			}
			
		if(this.isOffer){
			this.peerConnection.createOffer(
					trigger, null, { 'mandatory': { 'OfferToReceiveAudio': isAudio,
														'OfferToReceiveVideo': isVideo } });
		}else{
			this.peerConnection.createAnswer(
					trigger, null, { 'mandatory': { 'OfferToReceiveAudio': isAudio,
														'OfferToReceiveVideo': isVideo } });
		}

	}

	Credo.Connection.prototype.onLocalSessionDesc = function(sessionDesc,connection){
		connection.peerConnection.setLocalDescription(sessionDesc);
		if(connection.state!=Credo.STATE.PAUSED_FORICE){
			connection.onSessionDesc(sessionDesc);
		}
	}


	Credo.Connection.prototype.onRemoteSessionDesc = function(sessionDesc){
		var mediaObj = this.mediaObj;
		var trigger = function(stream){
			mediaObj.onMedia(stream,mediaObj,Credo.PEERTYPE.REMOTE);
			};
		this.peerConnection.onaddstream=trigger;
		if(typeof(webkitRTCPeerConnection) != 'undefined'){
			this.peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDesc),null,this.failure);
		}else if(typeof(mozRTCPeerConnection) != 'undefined'){
			this.peerConnection.setRemoteDescription(new mozRTCSessionDescription(sessionDesc),null,this.failure);
		}else{
			this.failure("Your browser does not support WebRTC capabilities for this request.");
			return;
		}
		
		if(sessionDesc.type=="offer"){
			this.createOfferAnswer(false);//Creating answer
		}
		
	}

	Credo.Connection.prototype.onRemoteIce = function(remoteEvent){
		if(remoteEvent.candidate){
				this.peerConnection.addIceCandidate(new RTCIceCandidate(remoteEvent.candidate));
			}
	}

	Credo.Connection.prototype.setState = function(state){

		this.state = state;
		console.log("Connection State: "+state);

	}

	Credo.Connection.prototype.iceHandler = function(ice, connection){
		if(ice.candidate==null || ice.iceGatheringState=='complete'){
			connection.onSessionDesc(connection.peerConnection.localDescription);
			connection.setState(Credo.STATE.CONNECTING);
		}else{
			console.log(ice);
		}
	}


