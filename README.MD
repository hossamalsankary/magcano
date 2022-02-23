echo "# magcano" >> README.md
git init
git add . && git commit -m "initial commit"

git add README.md
git commit -m "first commit"
git branch -M main
git remote -v
git push origin master
git remote add origin https://github.com/hossamalsankary/magcano.git
git push -u origin main