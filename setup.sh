mongosh learning_platform --eval "db.dropDatabase()" 
mongosh learning_platform --eval "db.courses.createIndex({ title: "text", description: "text", tags: "text" })"