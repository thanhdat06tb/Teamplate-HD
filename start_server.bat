@echo off
echo Dang khoi dong server noi bo (p 8090)...
start python -m http.server 8090 --bind 127.0.0.1
echo.
echo Dang mo ket noi ngrok voi ten mien co dinh...
echo Link cua ban se la: https://shown-underuse-disliking.ngrok-free.dev/index.html
echo.
start http://localhost:8090/index.html
ngrok http --domain=shown-underuse-disliking.ngrok-free.dev 8090
.\start_server.bat