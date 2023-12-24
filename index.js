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




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const hello_Routes = require('./routes/hello');
app.use(hello_Routes);

const register_users_Routes = require('./routes/register-user');
app.use(register_users_Routes);
