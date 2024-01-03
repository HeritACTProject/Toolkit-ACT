ffmpeg -y -i $1 -vf scale="320:-1" $1.webp
rm $1
