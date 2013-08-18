@echo off

copy ..\src\media.js media.js
copy ..\src\peerconnection.js peerconnection.js

type media.js peerconnection.js > ..\credo.js

del media.js
del peerconnection.js