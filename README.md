# Налаштування Termux
1. termux-services, node.js, npm, pm2
2. Створити службу streamerd
```bash
#!/data/data/com.termux/files/usr/bin/sh
pm2 start $PREFIX/share/streamer/ecosystem.config.js
```
3.Додати цю службу в автозапуск Termux: ~/.termux/boot/startup
```bash
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
sshd
streamerd
```
# StreamerApp
1. Сайт працює на порту 33333
2. Інформація про стріми, що виконуються, міститься в файлі %PREFIX/tmp/streams.json такої структури:
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
3. При збереженні налаштувань всі стріми зупиняються. Файл очищується.
4. Лог стріму записується у відповідний файл `/data/data/com.termux/files/usr/var/service/streamerd/${key}.log`