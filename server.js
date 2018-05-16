const express = require('express');
const app = express();
const morgan = require('morgan');
const cliArgs = require('command-line-args');

app.use(morgan('combined'));

const cli = cliArgs([
  { name: 'dir', type: String, alias: 'd', defaultOption: true, defaultValue: __dirname, description: 'Directory to serve from' },
  { name: 'port', type: Number, alias: 'p', defaultValue: 9020, description: 'Port to use' }
]);

const options = cli.parse();

const env = process.env.DEPLOYMENT_ENV || 'dev';
console.log('Serving ' + options.dir + ' on port ' + options.port + ' in ' + env);

const router = new express.Router();
app.use('/imageviewer', router);

// send static files back
app.use(express.static(options.dir));

app.listen(options.port, '0.0.0.0');
