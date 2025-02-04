ffmpeg -y -i $1 -vf scale="$2:-1" $1.webp
rm $1
