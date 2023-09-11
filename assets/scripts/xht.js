export default function  xht (url, params, onready) {
  const x = new XMLHttpRequest();
  x.open('POST', url, true);
  x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  x.responseType = 'json';
  x.onreadystatechange = () => {
    if (x.readyState == 4 && x.status == 200) {
      onready(x.response);
    }
    console.log(x.response);
  };
  x.send(params);
};