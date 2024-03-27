# Налаштування Termux
1. Встановити [termux-services](https://wiki.termux.com/wiki/Termux-services)
2. `pkg update && pkg upgrade -y`
3. `pkg install openssh`
4. Запустити сервер ssh `sshd`
5. `pkg install ffmpeg wget python nodejs`
6. Перевірити, що `nodejs` та `npm` встановлені коректно:
```bash
node -v && npm -v
```
5.Створити папку в службах для ведення логів:
```bash
mkdir $PREFIX/var/service/streamerd/
```
6. Встановити `pm2`
```bash
npm install pm2@5.3.0 -g
```
7.Додати запуск веб-сервера в [автозапуск Termux](https://wiki.termux.com/wiki/Termux:Boot): ~/.termux/boot/startup
  ```bash
  #!/data/data/com.termux/files/usr/bin/sh
  termux-wake-lock
  sshd
  $PREFIX/bin/node $PREFIX/bin/pm2 start $PREFIX/share/streamer/ecosystem.config.js
  ```
8.Заватажити архів з релізом та розпакувати його в $PREFIX/share/streamer
```bash
wget https://github.com/ViterAlex/StreamerApp/releases/latest/download/streamer.zip \
&& unzip -q ./streamer.zip -d $PREFIX/share/streamer
```
9.Якщо виконується оновлення і стрімер вже працює, то розпаковку робити із збереженням налаштувань:
```
wget https://github.com/ViterAlex/StreamerApp/releases/latest/download/streamer.zip \
&& unzip -o -q ./streamer.zip -d $PREFIX/share/streamer -x settings.json \
&& pm2 reload 0
```
# StreamerApp
1. Сайт працює на порту 33333
2. В pm2 додаток має назву streamer_app
3. Під час запуску та перезапуску сервера всі процеси `ffmpeg` знищуються
1. При збереженні налаштувань всі стріми зупиняються.
2. Лог стріму записується у відповідний файл `$PREFIX/var/service/streamerd/{key}.log`, де `key` відповідний ключ трансляції.
3. Для перегляду логу конкретного стріму потрібно перейти в папку служби `streamerd` та виконати команду `tail`:
  ```bash
  tail -f {key}.log
  ```
