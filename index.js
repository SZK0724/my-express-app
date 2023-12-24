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

app.delete('/delete/user/:username', verifyToken, async (req, res) => {
  const username = req.params.username;

  try {
    // Delete the user
    const deleteUserResult = await client
      .db('benr2423')
      .collection('users')
      .deleteOne({ username });

    if (deleteUserResult.deletedCount === 0) {
      return res.status(404).send('User not found');
    }

    // Delete the user's documents
    const deleteDocumentsResult = await client
      .db('benr2423')
      .collection('documents')
      .deleteMany({ username });

    // Delete the visitors created by the user
    const deleteVisitorsResult = await client
      .db('benr2423')
      .collection('visitor')
      .deleteMany({ createdBy: username });

    res.send('User and associated data deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login/user', (req, res) => {
  console.log(req.body);
  loginuser(req.body.username, req.body.password)
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

app.post('/create/visitor/user', verifyToken, async (req, res) => {
  const createdBy = req.user.username; // Get the username from the decoded token
  let result = createvisitor(
    req.body.visitorname,
    req.body.checkintime,
    req.body.checkouttime,
    req.body.temperature,
    req.body.gender,
    req.body.ethnicity,
    req.body.age,
    req.body.phonenumber,
    createdBy
  );   
  res.send(result);
});

app.get('/view/visitor/user', verifyToken, async (req, res) => {
  try {
    const username = req.user.username; // Get the username from the decoded token
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .find({ createdBy: username }) // Retrieve visitors created by the authenticated user
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete('/delete/visitor/:visitorname', verifyToken, async (req, res) => {
  const visitorname = req.params.visitorname;
  const username = req.user.username; // Assuming the username is available in the req.user object

  try {
    // Find the visitor by visitorname and createdBy field to ensure the visitor belongs to the user
    const deleteVisitorResult = await client
      .db('benr2423')
      .collection('visitor')
      .deleteOne({ visitorname: visitorname, createdBy: username });

    if (deleteVisitorResult.deletedCount === 0) {
      return res.status(404).send('Visitor not found or unauthorized');
    }

    res.send('Visitor deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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

const delete_user_securityRoutes = require('./routes/delete-user-security');
app.use(delete_user_securityRoutes);

const login_user_Routes = require('./routes/login-user');
app.use(login_user_Routes);

const create_visitor_user_Routes = require('./routes/create-visitor-user');
app.use(create_visitor_user_Routes);

const view_visitor_user_Routes = require('./routes/view-visitor-user');
app.use(view_visitor_user_Routes);

const delete_visitor_user_Routes = require('./routes/delete-visitor-user');
app.use(delete_visitor_user_Routes);