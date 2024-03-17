rm -f ../export/index.html

# npx esbuild index.js --bundle --minify --outfile=./src/meta/vapormall.js --global-name=vapormall
npx esbuild node_vapormall/index.js --bundle --outfile=./src/meta/vapormall.js --global-name=vapormall

npx esbuild node_vapormall/battle2/src/menus/index.ts --bundle --outfile=./export/menus.js

# make vapormall globally accessible
# from https://stackoverflow.com/questions/64806255/how-to-expose-a-class-to-the-global-scope-with-esbuild
echo "window.vapormall = vapormall;" >> ./src/meta/vapormall.js

cd src
npx ifc -o ../export/index.html

# cd ../export; python3 -m http.server
npx esbuild --serve=8008 --servedir=../export 