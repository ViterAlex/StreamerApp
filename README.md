# Налаштування Termux
1. [termux-services](https://wiki.termux.com/wiki/Termux-services), node.js, npm, pm2
2. Створити службу streamerd
```bash
#!/data/data/com.termux/files/usr/bin/sh
pm2 start $PREFIX/share/streamer/ecosystem.config.js
```
3.Додати цю службу в [автозапуск Termux](https://wiki.termux.com/wiki/Termux:Boot): ~/.termux/boot/startup
  ```bash
  #!/data/data/com.termux/files/usr/bin/sh
  termux-wake-lock
  sshd
  streamerd
  ```
# StreamerApp
1. Сайт працює на порту 33333
2. Під час запуску та перезапуску сервера всі процеси `ffmpeg` знищуються
3. Інформація про стріми, що виконуються, міститься в файлі `%PREFIX/tmp/streams.json` такої структури:
  ```json
  {
  "a1a1-b1b1-c1c1-d1d1-e1e1":1234,
  "a2a2-b2b2-c2c2-d2d2-e2e2":4321
  }
  ```

   - Під час запуску сайту вміст файлу очищується, оскільки стріми автоматично не стартують після перезапуску приставки
   - Файл створюється при першій спробі запустити стрім і оновлюється кожен раз під час старту або зупинення.
   - Під час старту додається запис з ключем стріму та `pid` відповідного процесу
   - Якщо запис з таким ключем вже існує, оновлюється тільки `pid` процесу
1. При збереженні налаштувань всі стріми зупиняються. Файл очищується.
2. Лог стріму записується у відповідний файл `$PREFIX/var/service/streamerd/{key}.log`, де `key` відповідний ключ трансляції.
3. Для перегляду логу конкретного стріму потрібно перейти в папку служби `streamerd` та виконати команду `tail`:
  ```bash
  tail -f {key}.log
  ```