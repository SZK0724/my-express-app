const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
//
const bcrypt = require('bcrypt');
//
//
const { MongoClient, ServerApiVersion } = require('mongodb');
let client; // Declare client here
//
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

      **Instructions for Login**:

      1. If you are an security or existing user, please log in using the "Login" -> "/login" section.


      **Instructions for Security/Admin**:

      Managing Users:
      2. To create a new user account, please navigate to the "Security" -> "/register/user" section to create an account.

      3. If you need to delete an existing user, please navigate to "Security" -> "/delete/user/{username}" to delete the user.

      Managing Visitors:
      4. To view visitor information, please go to "Security" -> "/view/visitor/security" to access and view visitor details.

      5. To approve the visitor, please go to "Security" -> "/approve/visitor/{visitorname}" to approve the visitor status.


      **Instructions for Users**:

      Testing Account
      6. User can create testing account for testing purpose, please go to the "Test Accounts" -> "/register/test/user" section.
      
      Managing Visitor Passes:
      7. To create a visitor pass, visit the "User" -> "/create/visitor/user" section and follow the steps to generate a visitor pass.
      
      8. If you need to update information for a visitor pass that you created, please go to the "User" -> "/update/visitor/{visitorname}" section.
      
      9. To delete a visitor pass that you previously created, navigate to the "User" -> "/delete/visitor/{visitorname}" section and follow the instructions.

      10. If you need to view information for a visitor pass that you created, please navigate to the "User" -> "/view/visitor/user" section.


      **Instructions for Visitor to Get Their Pass**:

      11. To access and view your visitor pass (approved/ none), please navigate to the "Visitor" -> "/view/visitor/{visitorName}" section.
      
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
///

const path = require('path');
// to handle file paths and interact with Azure Blob Storage
const { BlobServiceClient } = require('@azure/storage-blob');

// Azure Blob Storage Configuration
const azureConnectionString = "DefaultEndpointsProtocol=https;AccountName=sam0724;AccountKey=b///vGHmGZp8Soagz/UsgQyeFtUdxPRykr4R9Mt2TutDRcCU4MxDdz/p3CjGXIctCVVz9vi3a9T1+ASt9oRKTQ==;EndpointSuffix=core.windows.net";
const containerName = "cert";
const blobName = "X509-cert-3687050585495095085.pem";
const localPemFilePath = path.join(__dirname, 'certs', 'X509-cert-3687050585495095085.pem');
// PEM certificate file will be stored after downloading it from Azure Blob Storage to local path


// Function to download .pem file from Azure Blob Storage
async function downloadPemFile() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(azureConnectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  const downloadPath = path.join(__dirname, 'certs', blobName);
  await blobClient.downloadToFile(downloadPath);
  console.log(`Downloaded ${blobName} to ${downloadPath}`);
  return downloadPath; // Return the path where the file was downloaded
}

// Download the PEM file and then initiate MongoDB connection
downloadPemFile().then((downloadPath) => {
  client = new MongoClient('mongodb+srv://cluster0.1jh2xph.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
      tlsCertificateKeyFile: downloadPath, // Use the downloaded path
      serverApi: ServerApiVersion.v1
  });

  async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to MongoDB");
      app.locals.db = client.db("testDB");
    } catch (error) {
      console.error("Could not connect to MongoDB", error);
      process.exit(1);
    }
  }

  run().catch(console.dir);


}).catch(console.error);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

//allows anyone to create an account for testing purposes.
app.post('/register/test/user', async (req, res) => {
 // Extract user details from request body
  const { username, password, name, email } = req.body;

  // Here you would call a function to insert the user into the database, marking the account as inactive or for testing
  const result = await createTestUser(username, password, name, email);

  res.status(result.status).send(result.message);
});

// This function simulates inserting the user into the database as a test account
async function createTestUser(username, password, name, email) {
  // Implement the logic to insert user into the database
  // For now, just return a success message
  return {
    status: 200, // Or appropriate status code
    message: "Test account created successfully."
  };
}

//Security register user account
app.post('/register/user', verifyToken, verifyRole('security'), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password

    let result = await validateAndRegister(
      req.body.username,
      hashedPassword, // Store the hashed password in the database
      req.body.name,
      req.body.email,
      req.body.role, // 'user' or 'security'
      req.user.username // the username of the 'security' user creating the account
    );

    if (result.status === 'error') {
      res.status(400).send(result.message); // Send a 400 Bad Request if there's an error
    } else {
      res.send(result.message); // Success message
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Login for security or user 
app.post('/login', async (req, res) => {
 
  login(req.body.username, req.body.password)
    .then(async result => {
      if (result.message === 'Correct password') {
        const token = generateToken({ username: req.body.username, role: result.user.role });

        // Check if the role is 'security' and fetch data of all users with role 'user'
        let userData = [];
        if (result.user.role === 'security') {
          userData = await client.db('benr2423').collection('users').find({ role: 'user' }).toArray();
        }

        res.send({ message: 'Successful login', token, userData });
      } else {
        res.send('Login unsuccessful');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

//visitor view all security
app.get('/view/visitor/security', verifyToken, verifyRole('security'), async (req, res) => {
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

//Security delete existing user 
app.delete('/delete/user/:username', verifyToken, verifyRole('security'), async (req, res) => {
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

//User create visitor 
app.post('/create/visitor/user', verifyToken, verifyRole('user'), async (req, res) => {
  const createdBy = req.user.username; // Get the username from the decoded token
  const result = await createvisitor(
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

app.get('/view/visitor/user', verifyToken, verifyRole('user'), async (req, res) => {
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

app.delete('/delete/visitor/:visitorname', verifyToken, verifyRole('user'), async (req, res) => {
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

app.put('/update/visitor/:visitorname', verifyToken, verifyRole('user'), async (req, res) => {
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
      .findOne({ visitorname: visitorName }, {
        projection: {
          _id: 0, 
          visitorname: 1,
          checkintime: 1,
          checkouttime: 1,
          temperature: 1,
          approval: 1
        }
      });

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

//update status approval visitor by security 
app.put('/approve/visitor/:visitorname', verifyToken, verifyRole('security'), async (req, res) => {
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


async function login(username, password) {
  let matchUser = await client.db('benr2423').collection('users').findOne({ username: username });
  if (!matchUser) return { message: "User not found!" };

  // Compare the hashed password
  const passwordMatch = await bcrypt.compare(password, matchUser.password);
  if (passwordMatch) {
    return { message: "Correct password", user: matchUser };
  } else {
    return { message: "Invalid password" };
  }
}


async function validateAndRegister(username, password, name, email, role = 'user',createdBy) {
  // Check if the password is strong
  if (!isPasswordStrong(password)) {
    return { status: 'error', message: "Weak password. Password must be more than 10 characters and include uppercase and lowercase letters, numbers, and symbols." };
  }

  // Check if the username already exists
  const existingUser = await client.db('benr2423').collection('users').findOne({ username: username });
  if (existingUser) {
    return { status: 'error', message: "Username already exists. Please try a different username." };
  }

  // If username doesn't exist, create the new user
  await client.db('benr2423').collection('users').insertOne({
    username,
    password,
    name,
    email,
    role, // save the role
    createdBy // save the username of the 'security' user who created this account
  });

  return { status: 'success', message: "Account created successfully." };
}



function verifyRole(role) {
  return function(req, res, next) {
    if (req.user.role !== role) {
      return res.status(403).send('Access Denied');
    }
    next();
  };
}


function isPasswordStrong(password) {
  const minLength = 10;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^.()])[A-Za-z\d@$!%*?&^.()]{10,}$/;

  return password.length >= minLength && regex.test(password);
}

///create visitor 
async function createvisitor(reqVisitorname, reqCheckintime, reqCheckouttime, reqTemperature, reqGender, reqEthnicity, reqAge, ReqPhonenumber, createdBy) {
  const existingVisitor = await client.db('benr2423').collection('visitor').findOne({ "visitorname": reqVisitorname });
  
  if (existingVisitor) {
    return { message: "Visitor name already exists, please use a different name." };
  }

  await client.db('benr2423').collection('visitor').insertOne({
    "visitorname": reqVisitorname,
    "checkintime": reqCheckintime,
    "checkouttime": reqCheckouttime,
    "temperature": reqTemperature,
    "gender": reqGender,
    "ethnicity": reqEthnicity,
    "age": reqAge,
    "phonenumber": ReqPhonenumber,
    "createdBy": createdBy,
    "approval": "none"
  });

  return { message: "visitor created" };
}

//

//


const jwt = require('jsonwebtoken');

function generateToken({ username, role }) {
  return jwt.sign({ username, role }, 'mypassword', { expiresIn: 300 });
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

const login_user_Routes = require('./routes/login-user');
app.use(login_user_Routes);

const view_visitor_securityRoutes = require('./routes/view-visitor-security');
app.use(view_visitor_securityRoutes);

const delete_user_securityRoutes = require('./routes/delete-user-security');
app.use(delete_user_securityRoutes);

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

const register_testusers_Routes = require('./routes/register-testuser');
app.use(register_testusers_Routes);
