#!/bin/bash
set -e

mongosh <<EOF
use devModels

db.createUser({
  user: 'devDevUser',
  pwd: 'devTestPass',
  roles: [
    {
      role: 'readWrite',
      db: 'devModels'
    }
  ],
});


db.createCollection('user', { capped: false });
db.createCollection('queryJob', { capped: false });
db.createCollection('token', { capped: false });
db.createCollection('org', { capped: false });

use devSystems

db.createCollection('system', { capped: false });

db.createUser({
  user: 'devDevUser',
  pwd: 'devTestPass',
  roles: [
    {
      role: 'readWrite',
      db: 'devSystems'
    }
  ],
});

EOF