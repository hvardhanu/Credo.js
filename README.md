credo.js
========

A JavaScript library for (simplifying) WebRTC.

========

credo.js allows development of WebRTC applications quickly, with just a few lines of code. 
It factorizes the repeated WebRTC routine into a few method calls.

Please look at the sample below.

=========
	<script type='text/javascript'>
		
		var config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
		
		signalling = initializeSignalling();
		
		//The call back method that will be called, so that your code can pass it to signalling
			var onSessionDesc = function(localDesc){	
				signalling.send('sdp',localDesc);
			}
			
			//===Credo.js Starts===  Step 1: Start an audio/video media object
			var mediaSession = new Credo.Media('AV','localVid','remVid',success,failure);
			mediaSession.start();
			
			//Step 2: Pass the media object to Connection , that's it !! now just call con.call(); when you want to start calling
			var con = new Credo.Connection(config,onSessionDesc,null,mediaSession,success,failure);
			//===Credo.js Ends === 
			
			//Your signalling code receives sdp and passes it to credo's connection
			signalling.receive('sdp',function(event){
			con.descriptionReceived(event);
			});
	</script>
	
	<body>
		<video id="localVid" autoplay="autoplay" height="400" width="500"></video>
		<input type="submit" onclick="con.call();" name="connect" id="connect"/>
		<video id="remVid" autoplay="autoplay" height="400" width="500"></video>		
	</body>

=========

No need to write the complicated event management routines for getting the media, RTCPeerConnection and associating them with numerous handlers.

credo.js provides a clean and easy API for you to focus more on developing solutions rather than writing logic that adhers to WebRTC spec.

credo.js is not tied to any signalling mechanism. It's designed to be a client side library only. The signalling part is always server dependent hence tied to different implementations (websockets, jingle, SIP etc). So you have to write it as per your requirement. 

credo.js provides handlers/callbacks at the appripriate places for integration with the signalling mechanism of your choice. Hence this is compatible with any signalling you choose, or want to switch to.


=========

The examples folder contains an sample Audio / Video chat application. Use the provided node.js script (uses Socket.io) on server to run the example.