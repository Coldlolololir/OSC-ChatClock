cd ./
if exist C:\Program Files\nodejs\node.exe (
    npm install
) else (
    echo "Nodejs is not installed, install it here: https://nodejs.org"
    goto stop
)
:stop