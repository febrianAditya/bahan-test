const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize

let access_token
let organizerId
let eventTypeId
let eventId
let bannerId
let adminId
let typeBefore

beforeAll((done) => {
  queryInterface.bulkInsert("Organizers", [{
    name: "Organizer",
    email: "organizer2@mail.com",
    password: "1234567",
    address: "123 Street",
    phone: "0123456789",
    createdAt: new Date(),
    updatedAt: new Date()
  }], {returning: true})
    .then(response => {
      organizerId = response[0].id
      done()
    })
    .catch(error => {
      done(error)
    })
})

beforeAll((done) => {
  queryInterface.bulkInsert("EventTypes", [{
    name: "Movie",
    createdAt: new Date(),
    updatedAt: new Date()
  }], {returning: true})
    .then(response => {
      eventTypeId = response[0].id
      typeBefore = response[0].id
      done()
    })
    .catch(error => {
      done(error)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete("Admins", {}, { logging: false })
    .then(response => {
      done()
    })
    .catch(error => {
      done(error)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete("Events", {}, { logging: false })
    .then(response => {
      done()
    })
    .catch(error => {
      done(error)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete("EventTypes", {}, { logging: false })
    .then(response => {
      done()
    })
    .catch(error => {
      done(error)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete("Organizers", {}, { logging: false })
    .then(response => {
      done()
    })
    .catch(error => {
      done(error)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete("Banners", {}, { logging: false })
    .then(response => {
      done()
    })
    .catch(error => {
      done(error)
    })
})

describe("Register Admin", () => {
  test("response with data", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "admin@mail.com", password: "12345678" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(201)
        expect(body).toHaveProperty("email", "admin@mail.com")
        done()
      })
  }),
  test("response with email and password required", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "", password: "" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Email is required", "Password is required"])
        done()
      })
  }),
  test("response with email is required", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "", password: "12345678" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Email is required"])
        done()
      })
  }),
  test("response with password is required", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "admin@mail.com", password: "" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Password is required"])
        done()
      })
  }),
  test("response with password must greater than 7", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "admin@mail.com", password: "123" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Password must contain at least 7 characters and maximum 128 characters"])
        done()
      })
  }),
  test("response with email is invalid", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "admin", password: "123456789" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Email is invalid"])
        done()
      })
  }),
  test("response with email is unique", (done) => {
    request(app)
      .post("/admin/register")
      .send({ email: "admin@mail.com", password: "12345678" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Email has already been registered"])
        done()
      })
  })
})

describe("Login Admin", () => {
  test("response with access token", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "admin@mail.com", password: "12345678" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        access_token = res.body.access_token
        expect(status).toBe(200)
        expect(body).toHaveProperty("access_token", access_token)
        done()
      })
  }),
  test("response with email and password required", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "", password: "" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Email and password are required")
        done()
      })
  }),
  test("response with email required", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "", password: "12345" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Email is required")
        done()
      })
  }),
  test("response with password required", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "admin@mail.com", password: "" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Password is required")
        done()
      })
  }),
  test("response with email or password incorrect", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "admin@mail.com", password: "aaaaaaa" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Email or password incorrect")
        done()
      })
  }),
  test("response with invalid account", (done) => {
    request(app)
      .post("/admin/login")
      .send({ email: "admin5@mail.com", password: "12345" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Invalid account")
        done()
      })
  })
})

describe("Add Event", () => {
  test("register organizer", (done) => {
    request(app)
    .post("/organizers/register")
    .send({
      name: "Organizer",
      email: "organizer@mail.com",
      password: "1234567",
      address: "123 Street",
      phone: "0123456789"
    })
    .end((err, res) => {
      const { body, status } = res;
      if (err) {
        return done(err);
      }
      organizerId = res.body.id
      done();
    });
  }),
  test("register event type", (done) => {
    request(app)
    .post("/admin/eventType")
    .set("access_token", access_token)
    .send({
      name: "Movie"
    })
    .end((err, res) => {
      const { body, status } = res;
      if (err) {
        return done(err);
      }
      eventTypeId = res.body.id
      done();
    });
  }),
  test("response with data", (done) => {
    request(app)
      .post("/admin/event")
      .set("access_token", access_token)
      .send({ title: "Wayangan", date: '2021-02-13', time: '22:00:00', location: "Balai Kota Yogyakarta", capacity_regular: 40, capacity_vip: 40, capacity_vvip: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        eventId = res.body.id
        expect(status).toBe(201)
        expect(body).toHaveProperty("title", "Wayangan")
        done()
      })
  }),
  test("response with title required", (done) => {
    request(app)
      .post("/admin/event")
      .set("access_token", access_token)
      .send({ title: "", date: '2021-02-13', time: '22:00:00', location: "Balai Kota Yogyakarta", capacity_regular: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Title is required"])
        done()
      })
  }),
  test("response with date must greater than today", (done) => {
    request(app)
      .post("/admin/event")
      .set("access_token", access_token)
      .send({ title: "Kunjungan Menteri", date: '2020-02-13', time: '22:00:00', location: "Balai Kota Yogyakarta", capacity_regular: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Date must be greater than today"])
        done()
      })
  }),
  test("response with location required", (done) => {
    request(app)
      .post("/admin/event")
      .set("access_token", access_token)
      .send({ title: "Kunjungan Menteri", date: '2021-02-13', time: '13:00:00', location: "", capacity_regular: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Location is required"])
        done()
      })
  })
})

describe("Get Event by ID", () => {
  test("response with data", (done) => {
    request(app)
      .get("/admin/event/" + eventId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("title", "Wayangan")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .get("/admin/event/" + eventId)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  })
})

describe("Edit Event", () => {
  test("response with data", (done) => {
    request(app)
      .put("/admin/event/" + eventId)
      .set("access_token", access_token)
      .send({ title: "Ketoprak", date: '2021-02-13', time: '22:00:00', location: "Balai Kota Yogyakarta", capacity_regular: 40, capacity_vip: 40, capacity_vvip: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("title", "Ketoprak")
        done()
      })
  }),
  test("response with title required", (done) => {
    request(app)
      .put("/admin/event/" + eventId)
      .set("access_token", access_token)
      .send({ title: "", date: '2021-02-13', time: '22:00:00', location: "Balai Kota Yogyakarta", capacity_regular: 40, capacity_vip: 40, capacity_vvip: 40, price_regular: 10000, price_vip: 20000, price_vvip: 40000, EventTypeId: eventTypeId, OrganizerId: organizerId })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Title is required"])
        done()
      })
  })
})

describe("Get event", () => {
  const temp = [
    { title: 'Ketoprak' }
  ]
  test("response with data", (done) => {
    request(app)
      .get("/admin/event")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(temp).toEqual(expect.arrayContaining([
          expect.objectContaining({
            title: 'Ketoprak'
          })
        ]))
        done()
      })
  }),
  test("response with unauthorized", (done) => {
    request(app)
      .get("/admin/event")
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  }),
  test("response with internal server error", (done) => {
    request(app)
      .get("/admin/event")
      .set("access_token", "access_token")
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(500)
        expect(body).toHaveProperty("message", "Internal Server Error")
        done()
      })
  })
})

describe("delete event", () => {
  test("response with data", (done) => {
    request(app)
      .delete("/admin/event/" + eventId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Data deleted successful")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .delete("/admin/event/" + eventId)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  }),
  test("response with internal server error", (done) => {
    request(app)
      .delete("/admin/event/" + eventId)
      .set("access_token", "access_token")
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(500)
        expect(body).toHaveProperty("message", "Internal Server Error")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .delete("/admin/event/" + eventId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .get("/admin/event")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data event by ID not found", (done) => {
    request(app)
      .get("/admin/event/" + eventId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  })
})

describe("Create Banner", () => {
  test("response with data", (done) => {
    request(app)
      .post("/admin/banner")
      .set("access_token", access_token)
      .send({ image_url: "ini image", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        bannerId = res.body.id
        expect(status).toBe(201)
        expect(body).toHaveProperty("image_url", "ini image")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .post("/admin/banner")
      .send({ image_url: "ini image", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  }),
  test("response with internal server error", (done) => {
    request(app)
      .post("/admin/banner")
      .set("access_token", "asasassas")
      .send({ image_url: "ini image", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(500)
        expect(body).toHaveProperty("message", "Internal Server Error")
        done()
      })
  }),
  test("response with image URL is required", (done) => {
    request(app)
      .post("/admin/banner")
      .set("access_token", access_token)
      .send({ image_url: "", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Image URL is required"])
        done()
      })
  })
})

describe("Get Banner by ID", () => {
  test("response with data", (done) => {
    request(app)
      .get("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("image_url", "ini image")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .get("/admin/banner/" + bannerId)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  })
})

describe("Get Banner", () => {
  const temp = [
    { image_url: "ini image" }
  ]
  test("response with data", (done) => {
    request(app)
      .get("/admin/banner")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(temp).toEqual(expect.arrayContaining([
          expect.objectContaining({
            image_url: "ini image"
          })
        ]))
        done()
      })
  })
})

describe("Edit Banner", () => {
  test("response with data", (done) => {
    request(app)
      .put("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .send({ image_url: "ini image baru", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("image_url", "ini image baru")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .put("/admin/banner/" + bannerId)
      .send({ image_url: "ini image baru", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  }),
  test("response with image required", (done) => {
    request(app)
      .put("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .send({ image_url: "", detail: "ini detail" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", ["Image URL is required"])
        done()
      })
  })
})

describe("Delete Banner", () => {
  test("response with data", (done) => {
    request(app)
      .delete("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Data deleted successful")
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .delete("/admin/banner/" + bannerId)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .delete("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .get("/admin/banner")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data banner by ID not found", (done) => {
    request(app)
      .get("/admin/banner/" + bannerId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  })
})

describe("Create Event Type", () => {
  test("response with data", (done) => {
    request(app)
      .post("/admin/eventType")
      .set("access_token", access_token)
      .send({ name: "Music" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        eventTypeId = res.body.id
        expect(status).toBe(201)
        expect(body).toHaveProperty("name", "Music")
        done()
      })
  })
})

describe("Get Event Type", () => {
  const temp = [
    { name: "Movie" }
  ]
  test("response with data", (done) => {
    request(app)
      .get("/admin/eventType")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(temp).toEqual(expect.arrayContaining([
          expect.objectContaining({
            name: "Movie"
          })
        ]))
        done()
      })
  }),
  test("response with login first", (done) => {
    request(app)
      .get("/admin/eventType")
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Please login first")
        done()
      })
  })
})

describe("Edit Event Type", () => {
  test("response with data", (done) => {
    request(app)
      .put("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .send({ name: "Game" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        eventTypeId = res.body.id
        expect(status).toBe(200)
        expect(body).toHaveProperty("name", "Game")
        done()
      })
  }),
  test("response with no data change", (done) => {
    request(app)
      .put("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .send({ name: "Game" })
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "There is no data change")
        done()
      })
  })
})

describe("Get Event Type by ID", () => {
  test("response with data", (done) => {
    request(app)
      .get("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("name", "Game")
        done()
      })
  })
})

describe("Delete Event Type", () => {
  test("response with data", (done) => {
    request(app)
      .delete("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Data deleted successful")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .delete("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data deleted successful", (done) => {
    request(app)
      .delete("/admin/eventType/" + typeBefore)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Data deleted successful")
        done()
      })
  }),
  test("response with data not found", (done) => {
    request(app)
      .get("/admin/eventType")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  }),
  test("response with data detail event type by ID not found", (done) => {
    request(app)
      .get("/admin/eventType/" + eventTypeId)
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Data not found")
        done()
      })
  })
})

describe("Get Organizer", () => {
  const temp = [
    { name: "Organizer" }
  ]
  test("get data", (done) => {
    request(app)
      .get("/admin/organizers")
      .set("access_token", access_token)
      .end((err, res) => {
        const { status, body } = res
        if (err) {
          return done(err)
        }
        expect(status).toBe(200)
        expect(temp).toEqual(expect.arrayContaining([
          expect.objectContaining({
            name: "Organizer"
          })
        ]))
        done()
      })
  })
})