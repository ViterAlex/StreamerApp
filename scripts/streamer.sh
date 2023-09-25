#!/data/data/com.termux/files/usr/bin/sh
while getopts ":l:p:i:t:u:k:a:" opt; do
  case $opt in
  l)
	  login="$OPTARG"
	  ;;
  p)
	  password="$OPTARG"
	  ;;
  i)
	  ip="$OPTARG"
	  ;;
  t)
	  port="$OPTARG"
	  ;;
  u)
	  url="$OPTARG"
	  ;;
  k)
	  key="$OPTARG"
	  ;;
  a)
	  audio="$OPTARG"
    ;;
  \?)
    echo "Invalid option: -$OPTARG" >&2
    exit 1
    ;;
  :)
    echo "Option -$OPTARG requires an argument." >&2
    exit 1
    ;;
  esac
done
# echo "login=$login"
# echo "password=$password"
# echo "ip=$ip"
# echo "port=$port"
# echo "url=$url"
# echo "audio=$audio"
# echo "key=$key"
# echo "fullUrl=rtsp://$login:$password@$ip:$port$url"

if [ $audio == true ]
then
  echo "Стрім зі звуком"
  echo ffmpeg -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -c:a aac -filter:a "volume=2.0" -f flv rtmp://a.rtmp.youtube.com/live2/$key>$PREFIX/var/service/streamerd/$key.log 2>&1
  ffmpeg -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -c:a aac -filter:a "volume=2.0" -f flv rtmp://a.rtmp.youtube.com/live2/$key>$PREFIX/var/service/streamerd/$key.log 2>&1
else
  echo "Стрім без звуку"
  echo ffmpeg -f lavfi -i anullsrc -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -f flv rtmp://a.rtmp.youtube.com/live2/$key
  ffmpeg -f lavfi -i anullsrc -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -f flv rtmp://a.rtmp.youtube.com/live2/$key>$PREFIX/var/service/streamerd/$key.log 2>&1
fi
