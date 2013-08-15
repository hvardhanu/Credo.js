credo.js
========

A JavaScript library for (simplifying) WebRTC.

========

credo.js allows development of WebRTC applications quickly, with just a few lines of code.
Please look at the sample below.

=========
	<script type='text/javascript'>
		//sample code
		//The call back method that will be called, so that your code can pass it to signalling
		
		var config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
			var onSessionDesc = function(localDesc){
			//Your signalling code
				socket.emit('sdp',localDesc);
			}
			
			//===Credo.js API call starts===  Step 1 Start an audio/video media object
			var mediaSession = new Credo.Media('AV','localVid','remVid',success,failure);
			mediaSession.start();
			
			//Step 2 Pass the media object to Connection , that's it !! just call con.call(); when you want to start calling
			var con = new Credo.Connection(config,onSessionDesc,null,mediaSession,success,failure);
			//===Credo.js API call ends=== 
			
			//Your signalling code receives sdp and passes it to credo's connection
			socket.on('sdp',function(evt){
			con.descriptionReceived(evt)
			});
	</script>
	
	<body>
		<video id="localVid" autoplay="autoplay" height="400" width="500"></video>
		<input type="submit" onclick="con.call();" name="connect" id="connect"/>
		<video id="remVid" autoplay="autoplay" height="400" width="500"></video>		
	</body>

=========

No need to write the complicated event management routines for getting the media, creating peer connection adding handlers for sdp and ice.

credo.js provides a clean and easy API for you to focus more on developing solutions rather than writing logic that adhers to WebRTC standards.

credo.js is not tied to any signalling mechanism. It's designed to be a client side library only. The signalling part is always server dependent hence tied to different implementations (websockets, jingle, SIP etc). So you have to write it as per your requirement. 

credo.js provides handlers/callbacks at the appripriate places for integration with the signalling mechanism of your choice. Hence this is compatible with any signalling you choose, or want to switch to.


