credo.js
========

A javascript library for WebRTC.

========

credo.js allows development of WebRTC applications quickly, with just a few lines of code.

No need to write the complicated event management routines for getting the media, creating peer connection adding handlers for sdp and ice.

credo.js provides a clean and easy API for you to focus more on developing solutions rather than writing logic that adhers to WebRTC standards.

credo.js is not tied to any signalling mechanism. It's designed to be a client side library only. The signalling part is always server dependent hence tied to different implementations (websockets, jingle, SIP etc). 

credo.js provides handlers/callbacks at the appripriate places for integration with the signalling mechanism of your choice. Hence this is compatible with any signalling you choose, or want to switch to.


