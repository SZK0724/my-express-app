const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VMS',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // path to API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register/user', async (req, res) => {
  let result = register(
    req.body.username,
    req.body.password,
    req.body.name,
    req.body.email,
  );

  res.send(result);
});

app.post('/login/security', (req, res) => {
  console.log(req.body);
  login(req.body.username, req.body.password)
    .then(result => {
      if (result.message === 'Correct password') {
        const token = generateToken({ username: req.body.username });
        res.send({ message: 'Successful login', token });
      } else {
        res.send('Login unsuccessful');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get('/view/visitor/security', verifyToken, async (req, res) => {
  try {
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .find()
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'mypassword',
    { expiresIn: 60 }
  );

  console.log(token);
  return token;
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized');
    return;
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'mypassword', function (err, decoded) {
    if (err) {
      res.status(401).send('Unauthorized');
      return;
    }
    req.user = decoded;
    next();
  });
}






app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const hello_Routes = require('./routes/hello');
app.use(hello_Routes);

const register_users_Routes = require('./routes/register-user');
app.use(register_users_Routes);

const login_security_Routes = require('./routes/login-security');
app.use(login_security_Routes);

const view_visitor_securityRoutes = require('./routes/view-visitor-security');
app.use(view_visitor_securityRoutes);