const app = require('express')();
const { json, urlencoded } = require('express');
const { PORT } = require('./config/appConfig.js');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const salt = 10;
const fs = require('fs');
const userFilePath = './service/users.json';
const itemFilePath = './service/items.json';

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(upload.single('item'));

app.get('/', (req, res) => {
  res.redirect('/user/account');
});

app.get('/user/account', (req, res) => {
  res.render('account', {
    title: 'Быстрая регистрация.'
  });
});

const readUserFileToPromise = (dirFile) => {
  return new Promise((res, rej) => {
    fs.readFile(dirFile, 'utf-8', (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

app.post('/user/account', async (req, res) => {
  const { body } = req;
  const { firstName, lastName, nickName, password } = JSON.parse(JSON.stringify(body));

  if (
    !firstName || !lastName  ||
    !nickName || !password
  ) return res.redirect('/user/account');
  
  const user = new Object();

  await bcrypt.hash(password, salt)
    .then(hash => user.password = hash);
  
  readUserFileToPromise(userFilePath)
    .then(result => {
      const users = JSON.parse(result);
      let userExist;

      users.forEach(user => {
        userExist = ((firstName == user.firstName) && (lastName == user.lastName)) ? true : false;
      });

      if (!userExist) {
        user._id = v4();
        user.firstName = firstName;
        user.lastName = lastName;
        user.nickName = nickName;

        users.push(user);

        const convertUsersToFile = JSON.stringify(users, null, 4);
        fs.writeFileSync(userFilePath, convertUsersToFile);

        res.redirect('/user/auth');
      } else {
        res.redirect('/user/account');
      } 
    });
});

app.get('/user/auth', (req, res) => {
  res.render('auth', {
    title: 'Необходимо авторизоваться.'
  });
});

const getUserData = (dataUser, userNick) => {
  const users = JSON.parse(dataUser);
  const searchedUser;

  users.forEach(user => {
    if (userNick == user.nickName) {
      searchedUser = user.nickName;
    }
  });

  return { userNick: searchedUser, users }
}

const getMatchPassword = (userInfo, selfPassword) => {
  const { userNick, users } = userInfo;
  let matchPassword;

  users.forEach(user => {
    if (userNick == user.nickName) {
      matchPassword = bcrypt.compare(selfPassword, user.password);
    }
  });

  return matchPassword;
}

app.post('/user/auth', (req, res) => {
  const { body } = req;
  const { nickName, password } = JSON.parse(JSON.stringify(body));

  if (!nickName || !password) return res.redirect('/user/auth');

  readUserFileToPromise(userFilePath)
    .then(fileToUsers => {
      return getUserData(fileToUsers, nickName);
    })
    .then(dataUser => {
      return getMatchPassword(dataUser, password);
    })
    .then(equalPassword => {
      if (equalPassword) {
        const userId = v4();

        res.redirect(`/item/${userId}`);
      } else {
        res.redirect('/user/account');
      }
    });
});

app.get('/item/:uId', (req, res) => {
  res.render('home', {
    title: 'Каталог товаров.'
  });
});

app.get('/item/upload/confirm', (req, res) => {
  res.render('confirm', {
    title: 'Подтверждение учетной записи.'
  });
});


app.post('/item/upload/confirm', (req, res) => {
  const { body } = req;
  const { nickName, password } = JSON.parse(JSON.stringify(body));

  if (!nickName || !password) return res.redirect('/item/upload/confirm');

  readUserFileToPromise(userFilePath)
    .then(fileToUsers => {
      return getUserData(fileToUsers, nickName);
    })
    .then(dataUser => {
      return getMatchPassword(dataUser, password);
    })
    .then(equalPassword => {
      if (equalPassword) {
        const userId = v4();

        res.redirect(`/item/upload/${userId}`);
      } else {
        res.redirect('/item/upload/confirm');
      }
    });
});

app.get('/item/upload/:uId', (req, res) => {
  res.render('upload', {
    title: 'Добавление нового товара.'
  });
});

app.post('/item/upload/:uId', upload.single('item'), (req, res) => {
  // выполняем сохранение товара
  console.log(req.file, req.body);
});

app.get('/item/delete/confirm', (req, res) => {
  res.redirect('confirm', {
    title: 'Подтверждение учетной записи.'
  });
});

app.post('/item/delete/confirm', (req, res) => {
  const { body } = req;
  const { nickName, password } = JSON.parse(JSON.stringify(body));

  if (!nickName || !password) return res.redirect('/item/delete/confirm');

  readUserFileToPromise(userFilePath)
    .then(fileToUsers => {
      return getUserData(fileToUsers, nickName);
    })
    .then(dataUser => {
      return getMatchPassword(dataUser, password);
    })
    .then(equalPassword => {
      if (equalPassword) {
        const userId = v4();

        res.redirect(`/item/delete/${userId}`);
      } else {
        res.redirect('/item/delete/confirm');
      }
    });
});

app.get('/item/delete/:uId', (req, res) => {
  res.send('Page of item delete!');
});

app.post('/item/delete/:uId', (req, res) => {
  console.log(body);
});

app.listen(PORT, () => {
  console.log(`Server listens on ${PORT}`);
});