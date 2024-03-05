export default function xht(url, params, onready) {
  const x = new XMLHttpRequest();
  x.open('POST', url, true);
  x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  x.responseType = 'json';
  x.onload = () => {
    if (x.status==200) {
      onready(x.response);
    }
    else {
      onready(x.response);
      console.log(JSON.stringify(x.response));
    }
  }
  x.send(params);
};