#!/data/data/com.termux/files/usr/bin/sh
echo "========================"
echo "streamer.sh"
echo "========================"
while getopts ":l:p:i:t:u:k:s:" opt; do
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
  s)
	  sound="$OPTARG"
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
# echo "key=$key"
# echo "fullUrl=rtsp://$login:$password@$ip:$port$url"
echo ffmpeg -f lavfi -i anullsrc -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -f flv rtmp://a.rtmp.youtube.com/live2/$key
ffmpeg -f lavfi -i anullsrc -rtsp_transport udp -i "rtsp://$login:$password@$ip:$port$url" -c:v copy -pix_fmt yuv420p -f flv rtmp://a.rtmp.youtube.com/live2/$key>$PREFIX/var/service/streamerd/$key.log 2>&1
