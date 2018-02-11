cp -r src/css dist/
cp -r src/images dist/
yarn run webpack
zip -r n-yobi-patch.zip dist