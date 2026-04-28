# Fanverse Central backend

## A projektről:
>A Fanverse Central a Five Nights at Freddy’s (FNaF) rajongói játékok dedikált központja. A projekt célja egy olyan központi hub létrehozása, ahol a fejlesztők és a játékosok egy helyen érhetik el a legnépszerűbb és legújabb horrorélményeket.A backend biztosítja a játékok rendszerezését, a felhasználói interakciókat és a közösségi funkciókat, kiszolgálva ezzel a FNaF univerzum egyik legaktívabb alkotói körét.
---
## Készítette:
- Fülöp Attila Ákos(Backend, SQL adatbázis, Frontend)
- Timári Bianka(Frontend, SQL adatbázis, Backend)

---
## Adatbázis
- bigpicture
    - game_id
    - bigPic
- creators
    - creator_id
    - creator_pfp
    - creator_name
- favourite
    - user_id
    - game_id
- games
    - game_id
    - title
    - description
    - banner_pic
    - creator_id
    - game_file
- game_images
    - game_id
    - image
- likes
    - user_id
    - game_id
- users
    - user_id
    - email
    - username
    - psw
    - pfp
    - role

![kép az adatbázis kapcsolatokról](https://www.image2url.com/r2/default/images/1777285822353-63bbe052-1cf0-446d-8ec5-68c976eb1dc0.png)
>[Az adatbázis diagramja](https://drawsql.app/teams/rtgh/diagrams/fanverse-central)

---
## Projekt szerkezet

```markdown
├── config/
│   └── dotenvConfig.js
├── controllers/
│   ├── mainControllers.js
│   └── userControllers.js
├── db/
│   └── db.js
├── middleware/
│   ├── adminCheck.js
│   ├── uploadpfp.js
│   └── userMiddleware.js
├── models/
│   ├── mainModel.js
│   └── userModel.js
├── routes/
│   ├── mainRoutes.js
│   └── userRoutes.js
├── app.js
├── package.json
├── README.md
└── server.js
```
---
## Használt package-ek
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [multer](https://www.npmjs.com/package/multer)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [node-email-verifier](https://www.npmjs.com/package/node-email-verifier)


````javascript
"dependencies": {
    "bcrypt": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.0.2",
    "mysql2": "^3.17.2",
    "node-email-verifier": "^4.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
````

## Használt eszközök
- [VS code](https://code.visualstudio.com)
- [NPM](https://www.npmjs.com)
- [Postman](https://www.postman.com)
- [DrawSQL](https://drawsql.app)
- [W3Schools](https://www.w3schools.com)
- [ChatGPT](https://chatgpt.com)
- [GitHub](https://github.com/)
- [Gemini](https://gemini.google.com/app?hl=hu)
- [PhpMyAdmin](https://www.phpmyadmin.net)

## Postman tesztek
- [Attila postmanje](https://documenter.getpostman.com/view/48108190/2sBXqJJzus)
- [Bianka postmanje](https://documenter.getpostman.com/view/48108195/2sBXqJJzuv)

>Két külön gépről csináltuk a projektet és mind a kettőnk tesztelt és ezért van két postman