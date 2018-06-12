process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let {server, connection} = require('../server');
let agent = require('superagent');
let should = chai.should();

chai.use(chaiHttp);

connection.init((conn) => {

  describe('User', () => {
    var sql =  'TRUNCATE user_tbl';
    //executing sql
    conn.query(sql);
    afterEach(function() {

      // this sql command calls all the USER in the table user_tbl where the user_isdel
      // field is equal (=) to 0
    })

    describe('/GET api/user', () => {
        it('it should GET all the users', (done) => {
              chai.request(server)
              .get('/api/user')
              .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');
                res.body.should.be.empty;
                done();
              });
        });
    });

    describe('/POST api/user', () => {
      it ('it should post a new user', (done) => {
        let user = {
          user_fname: "leo",
          user_lname: "dal"
        }
        chai.request(server)
        .post('/api/user')
        .send(user)
        .end((err,res) => {
          res.should.have.status(201);
          res.body.user[0].user_fname.should.be.equals(user.user_fname);
          res.body.user[0].user_lname.should.be.equals(user.user_lname);
          done();
        });
      })
    })

    describe('/GET api/user/:userId', () => {
      it ('it gets the user based on userId', (done) => {
        let user = {
          user_fname: "leo",
          user_lname: "dal"
        }
        
        chai.request(server)
        .get('/api/user/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user.user_fname.should.be.equals(user.user_fname);
          res.body.user.user_lname.should.be.equals(user.user_lname);
          done();
        })
      })
    })

    describe('/PUT api/user/:userId', () => {
      it ('it updates the user based on userId', (done) => {
        let user = {
          user_fname: "leo_update",
          user_lname: "dal"
        }
        
        chai.request(server)
        .put('/api/user/1')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user[0].user_fname.should.be.equals(user.user_fname);
          res.body.user[0].user_lname.should.be.equals(user.user_lname);
          done();
        })
      })
    })

    describe('/PUT api/user/:userId', () => {
      it ('it updates the isDel value', (done) => {
        let user = {
          user_isdel: 1
        }
        
        chai.request(server)
        .put('/api/user/1')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user[0].user_isdel.should.be.equals(user.user_isdel);
          done();
        })
      })
    })
    
  });
  conn.end();
})

