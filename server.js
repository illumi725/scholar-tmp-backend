const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;
const IP_ADDRESS = '192.168.110.73';

app.use(cors());
app.use(bodyParser.json());

app.get('/api/branch-codes', (req, res) => {
  fs.readFile('./assets/jsonFiles/branch_codes.json', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading json file!`);
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/scholars-list', (req, res) => {
  fs.readFile('./assets/jsonFiles/scholars_to_update.json', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading json file!`);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/scholars/update', (req, res) => {
  const updatedScholar = req.body;

  fs.readFile('./assets/jsonFiles/scholars_to_update.json', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading json file!`);
    }

    const scholars = JSON.parse(data);
    const index = scholars.findIndex(scholar => scholar.id === updatedScholar.id);

    if (index !== -1) {
      scholars[index].school_category = updatedScholar.school_category;

      fs.writeFile('./assets/jsonFiles/scholars_to_update.json', JSON.stringify(scholars, null, 2), err => {
        if (err) {
          return res.status(500).send(`Error writing file!`);
        }
        res.send(`Scholar updated successfully!`);
      });
    }else{
      res.status(404).send(`Scholar not found!`);
    }
  });
});

app.listen(PORT, IP_ADDRESS, () => {
  console.info(`Server is running on http://${IP_ADDRESS}:${PORT}`)
});
