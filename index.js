const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visitor Management System Group 9 S2', 
      version: '1.0.0',
      description: `
      Welcome to the Visitor Management System API, created by SAM ZHI KANG!

      **Instructions for Users**:
      
      New Users:
      1. If you are a new user, please navigate to the "User" -> "/register/user" section to create an account.
      
      Existing Users:
      2. If you are an existing user, please log in using the "User" -> "/login/user" section.
      
      Managing Visitor Passes:
      3. To create a visitor pass, visit the "User" -> "/create/visitor/user" section and follow the steps to generate a visitor pass.
      
      4. If you need to update information for a visitor pass that you created, please go to the "User" -> "/update/visitor/{visitorname}" section.
      
      5. To delete a visitor pass that you previously created, navigate to the "User" -> "/delete/visitor/{visitorname}" section and follow the instructions.

      6. If you need to view information for a visitor pass that you created, please navigate to the "User" -> "/view/visitor/user" section.


      **Instructions for Visitor to Get Their Pass**:

      7. To access and view your visitor pass (approved/ none), please navigate to the "Visitor" -> "/view/visitor/{visitorName}" section.
      

      **Instructions for Security/Admin**:
      
      8. As a security/administrator, please log in using the "Security" -> "/login/security" section.

      Managing Users:
      9. If you need to delete an existing user, please navigate to "Security" -> "/delete/user/{username}" to delete the user.

      Managing Visitors:
      10. To view visitor information, please go to "Security" -> "/view/visitor/security" to access and view visitor details.

      11. To approve the visitor, please go to "Security" -> "/approve/visitor/{visitorname}" to approve the visitor status.
      `,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // path to API docs
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://zhikangsam0724:2Un24f6Hfk4l1Z1x@cluster0.1jh2xph.mongodb.net/";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect().then(res => {
  console.log(res);
});






app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register/user', async (req, res) => {
  let result = validateAndRegister(
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

app.put('/update/visitor/:visitorname', verifyToken, async (req, res) => {
  const visitorname = req.params.visitorname;
  const username = req.user.username;
  const { checkintime, checkouttime,temperature,gender,ethnicity,age,phonenumber } = req.body;

  try {
    const updateVisitorResult = await client
      .db('benr2423')
      .collection('visitor')
      .updateOne(
        { visitorname, createdBy: username },
        { $set: { checkintime, checkouttime,temperature,gender,ethnicity,age,phonenumber } }
      );

    if (updateVisitorResult.modifiedCount === 0) {
      return res.status(404).send('Visitor not found or unauthorized');
    }

    res.send('Visitor updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/view/visitor/:visitorName', async (req, res) => {
  const visitorName = req.params.visitorName;

  try {
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .findOne({ visitorname: visitorName });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send('Visitor not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


async function login(reqUsername, reqPassword) {
  let matchUser = await client.db('benr2423').collection('security').findOne({ username: { $eq: reqUsername } });

  if (!matchUser)
    return { message: "User not found!" };

  if (matchUser.password === reqPassword)
    return { message: "Correct password", user: matchUser };
  else
    return { message: "Invalid password" };
}

async function loginuser(reqUsername, reqPassword) {
  let matchUser = await client.db('benr2423').collection('users').findOne({ username: { $eq: reqUsername } });

  if (!matchUser)
    return { message: "User not found!" };

  if (matchUser.password === reqPassword)
    return { message: "Correct password", user: matchUser };
  else
    return { message: "Invalid password" };
}

function validateAndRegister(reqUsername, reqPassword, reqName, reqEmail) {
  // Check if the password is strong
  if (!isPasswordStrong(reqPassword)) {
    return "Weak password. Password must be more than 10 characters and include uppercase and lowercase letters, numbers, and symbols.";
  }

  // If the password is strong, proceed to register the user
  client.db('benr2423').collection('users').insertOne({
    "username": reqUsername,
    "password": reqPassword,
    "name": reqName,
    "email": reqEmail,
  });

  return "Account created";
}

function isPasswordStrong(password) {
  const minLength = 10;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

  return password.length >= minLength && regex.test(password);
}

///create visitor 
function createvisitor(reqVisitorname, reqCheckintime, reqCheckouttime, reqTemperature, reqGender, reqEthnicity, reqAge, ReqPhonenumber, createdBy) {
  client.db('benr2423').collection('visitor').insertOne({
    "visitorname": reqVisitorname,
    "checkintime": reqCheckintime,
    "checkouttime": reqCheckouttime,
    "temperature": reqTemperature,
    "gender": reqGender,
    "ethnicity": reqEthnicity,
    "age": reqAge,
    "phonenumber": ReqPhonenumber,
    "createdBy": createdBy,
    "approval": "none" // Default approval status
  });
  return "visitor created";
}

//update status approval visitor by security 
app.put('/approve/visitor/:visitorname', verifyToken, async (req, res) => {
  const visitorname = req.params.visitorname;
  const securityname = req.user.username; // Assuming the username of the security personnel is in the req.user object

  try {
    const updateVisitorResult = await client
      .db('benr2423')
      .collection('visitor')
      .updateOne(
        { visitorname },
        { $set: { approval: "approved", approvedBy: securityname } } // Update approval status and record who approved it
      );

    if (updateVisitorResult.modifiedCount === 0) {
      return res.status(404).send('Visitor not found or unauthorized');
    }

    res.send('Visitor approved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



const jwt = require('jsonwebtoken');

function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'mypassword',
    { expiresIn: 300 }
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

const update_visitor_user_Routes = require('./routes/update-visitor-user');
app.use(update_visitor_user_Routes);

const view_visitor_Routes = require('./routes/view-visitor');
app.use(view_visitor_Routes);

const approve_visitor_security_Routes = require('./routes/approve-visitor-security');
app.use(approve_visitor_security_Routes);