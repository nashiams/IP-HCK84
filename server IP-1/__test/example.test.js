const request = require("supertest");
const app = require("../app");
const { sequelize, Article, User, Category } = require("../models");
const { signToken } = require("../helper/jwt");
const { queryInterface } = sequelize;

let adminToken;
let staffToken;
let adminUser;
let staffUser;
let testCategory;
let adminArticleId;
let staffArticleId;

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established for tests.");
    await sequelize.sync({ force: true });
    console.log("Database synced for tests.");

    testCategory = await Category.create({ name: "Tech" });

    adminUser = await User.create({
      username: "testadmin",
      email: "admin@example.com",
      password: "passwordbohong",
      role: "Admin",
    });
    adminToken = signToken({ id: adminUser.id, role: adminUser.role });

    staffUser = await User.create({
      username: "teststaff",
      email: "staff@example.com",
      password: "passwordbohong",
      role: "Staff",
    });
    staffToken = signToken({ id: staffUser.id, role: staffUser.role });

    let articles = [];
    for (let i = 1; i <= 20; i++) {
      articles.push({
        title: `Test Article ${i}`,
        content: `This is content for test article number ${i}.`,
        imgUrl: `https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk`,
        categoryId: testCategory.id,
        authorId:
          i === 1 ? adminUser.id : i === 2 ? staffUser.id : adminUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdArticles = await Article.bulkCreate(articles);

    adminArticleId = createdArticles.find(
      (art) => art.authorId === adminUser.id
    )?.id;
    staffArticleId = createdArticles.find(
      (art) => art.authorId === staffUser.id
    )?.id;

    console.log("Initial test data seeded successfully.");
    console.log("Setup Details:");
    console.log(
      `  Admin User ID: ${adminUser.id}, Staff User ID: ${staffUser.id}`
    );
    console.log(`  Admin Article ID (owned by Admin): ${adminArticleId}`);
    console.log(`  Staff Article ID (owned by Staff): ${staffArticleId}`);
  } catch (error) {
    console.error("Failed to set up database for tests:", error);
    throw error;
  }
});

describe("POST /login", () => {
  describe("success", () => {
    test("login successfull", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "passwordbohong",
      });

      console.log(status);
      console.log(body);
      expect(status).toBe(200);
      expect(body).toHaveProperty("token", expect.any(String));
      expect(body.token.length).toBeGreaterThan(0);
      expect(body).toHaveProperty("user");
      expect(body.user).toHaveProperty("id", adminUser.id);
      expect(body.user).toHaveProperty("email", adminUser.email);
      expect(body.user).not.toHaveProperty("password");
    });
  });

  describe("failed", () => {
    it("couldn't login cause email is not provided", async () => {
      let { status, body } = await request(app).post("/login").send({
        password: "passwordbohong",
      });
      console.log(status);
      expect(status).toBe(400);
      expect(body).toHaveProperty("message", "Email is required");
    });

    it("couldn't login cause password is not provided", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "test@example.com",
      });
      expect(status).toBe(400);
      expect(body).toHaveProperty("message", "Password is required");
    });

    it("couldn't login cause email is not registered", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: "passwordbohong",
      });
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid email/password");
    });

    it("couldn't login cause password does not match", async () => {
      let { status, body } = await request(app).post("/login").send({
        email: adminUser.email,
        password: "wrongpassword",
      });
      console.log(body);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid email/password");
    });
  });
});

describe("POST /article", () => {
  describe("success", () => {
    test("create article successfull", async () => {
      let { status, body } = await request(app)
        .post("/article")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "The Rise of Local Guy",
          content:
            "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
          imgUrl:
            "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
          categoryId: testCategory.id,
        });

      console.log(status);
      console.log(body);
      expect(status).toBe(201);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("title", "The Rise of Local Guy");
      expect(body).toHaveProperty(
        "content",
        "AI is transforming industries from healthcare to finance to many things like things we can't discuss..."
      );
      expect(body).toHaveProperty(
        "imgUrl",
        "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk"
      );
      expect(body).toHaveProperty("categoryId", testCategory.id);
      expect(body).toHaveProperty("authorId", adminUser.id);
    });
  });

  describe("failed", () => {
    it("couldn't create article cause not logged in", async () => {
      let { status, body } = await request(app).post("/article").send({
        title: "The Rise of John Elden",
        content:
          "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
        imgUrl:
          "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
        categoryId: testCategory.id,
      });
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    it("couldn't create article cause token is fake", async () => {
      let { status, body } = await request(app)
        .post("/article")
        .set("Authorization", `Bearer fakeToken`)
        .send({
          title: "Weird Rise of Whatever",
          content:
            "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
          imgUrl:
            "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
          categoryId: testCategory.id,
        });
      console.log(status);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    it("couldn't create article cause invalid input", async () => {
      let { status, body } = await request(app)
        .post("/article")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          content:
            "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
          imgUrl:
            "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
          categoryId: testCategory.id,
        });
      expect(status).toBe(400);
      expect(body).toHaveProperty("message", expect.any(String));
      expect(body.message).toContain("Title is required");
    });
  });
});

describe("PUT /article/:id", () => {
  let articleToUpdateId;
  beforeEach(async () => {
    let newArticle = await Article.create({
      title: "The Rise of John Elden",
      content:
        "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
      imgUrl:
        "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
      categoryId: testCategory.id,
      authorId: adminUser.id,
    });
    articleToUpdateId = newArticle.id;
  });

  describe("success", () => {
    test("update successfull", async () => {
      let { status, body } = await request(app)
        .put(`/article/${articleToUpdateId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "The Rise of John Elden Updated",
        });

      console.log(body);
      expect(status).toBe(200);
      expect(body).toHaveProperty("id", articleToUpdateId);
      expect(body).toHaveProperty("title", "The Rise of John Elden Updated");
      expect(body.updatedAt).not.toBe(body.createdAt);
    });
  });

  describe("failed", () => {
    it("couldn't update cause not logged in", async () => {
      let { status, body } = await request(app)
        .put(`/article/${articleToUpdateId}`)
        .send({
          title: "The Rise of Local Guy Updated",
        });
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    it("couldn't update cause token is fake", async () => {
      let { status, body } = await request(app)
        .put(`/article/${articleToUpdateId}`)
        .set("Authorization", `Bearer fakeToken`)
        .send({
          title: "Weird Rise of Whatever Updated",
        });
      console.log(status);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    it("couldn't update cause data are not found", async () => {
      const nonExistentId = 999999;
      let { status, body } = await request(app)
        .put(`/article/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "The Rise of John Elden Updated",
        });
      expect(status).toBe(404);
      expect(body).toHaveProperty("message", `Article not found`);
    });

    it("couldn't update cause unauthorized", async () => {
      let { status, body } = await request(app)
        .put(`/article/${adminArticleId}`)
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          title: "The Rise of Local Guy Updated",
        });
      console.log(body);
      expect(status).toBe(401);
      expect(body).toHaveProperty(
        "message",
        "You are not authorized to perform this action on this article."
      );
    });

    it("couldn't update cause invalid input", async () => {
      let { status, body } = await request(app)
        .put(`/article/${articleToUpdateId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "message",
        "At least title or content must be provided"
      );
    });
  });
});

describe("DELETE /article/:id", () => {
  let articleToDeleteId;
  beforeEach(async () => {
    let newArticle = await Article.create({
      title: "Weird Rise of Whatever",
      content:
        "AI is transforming industries from healthcare to finance to many things like things we can't discuss...",
      imgUrl:
        "https://unsplash.com/photos/man-in-black-and-blue-suit-riding-on-silver-motorcycle-iE7AmEF-9wk",
      categoryId: testCategory.id,
      authorId: adminUser.id,
    });
    articleToDeleteId = newArticle.id;
  });

  describe("success", () => {
    test("should delete article", async () => {
      let { status, body } = await request(app)
        .delete(`/article/${articleToDeleteId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      console.log(status);
      expect(status).toBe(200);
      expect(body).toHaveProperty(
        "message",
        `article id : ${articleToDeleteId} deleted`
      );

      const deletedArticle = await Article.findByPk(articleToDeleteId);
      expect(deletedArticle).toBeNull();
    });
  });

  describe("failed", () => {
    it("should fail to delete because not logged in", async () => {
      let { status, body } = await request(app).delete(
        `/article/${articleToDeleteId}`
      );
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    it("should fail to delete because token is fake", async () => {
      let { status, body } = await request(app)
        .delete(`/article/${articleToDeleteId}`)
        .set("Authorization", `Bearer fakeToken`);
      console.log(body);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid token");
    });

    test("should fail because article id not found in database", async () => {
      const nonExistentId = 999999;
      let { status, body } = await request(app)
        .delete(`/article/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(status).toBe(404);
      expect(body).toHaveProperty("message", `Article not found`);
    });

    test("should fail because staff tries to delete someone else's article", async () => {
      let { status, body } = await request(app)
        .delete(`/article/${adminArticleId}`)
        .set("Authorization", `Bearer ${staffToken}`);
      console.log(status);
      expect(status).toBe(401);
      expect(body).toHaveProperty(
        "message",
        "You are not authorized to perform this action on this article."
      );
    });
  });
});

describe("GET /pub/article", () => {
  describe("success", () => {
    test("get articles without query filters successfull", async () => {
      let { status, body } = await request(app).get("/pub/article");

      console.log(body);
      expect(status).toBe(200);
      expect(body).toHaveProperty("articles");
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles.length).toBeLessThanOrEqual(10);
      expect(body).toHaveProperty("currentPage", 1);
      expect(body).toHaveProperty("totalPage", expect.any(Number));
      expect(body).toHaveProperty("total", expect.any(Number));
      expect(body.total).toBeGreaterThanOrEqual(20);

      if (body.articles.length > 0) {
        const article = body.articles[0];
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("Category");
        expect(article.Category).toHaveProperty("name", testCategory.name);
        expect(article).toHaveProperty("User");
        expect(article.User).toHaveProperty("username", expect.any(String));
        expect(article.User).toHaveProperty("email", expect.any(String));
      }
    });

    test("get filtered articles by search successfull", async () => {
      const searchTerm = "Test Article 10";
      let { status, body } = await request(app).get(
        `/pub/article?search=${searchTerm}`
      );

      expect(status).toBe(200);
      expect(body.articles.length).toBe(1);
      expect(body.articles[0]).toHaveProperty("title", searchTerm);
      expect(body.total).toBe(1);
    });

    test("get correct pagination successfull", async () => {
      const page = 2;
      let { status, body } = await request(app).get("/pub/article?page=2");

      console.log(status);
      expect(status).toBe(200);
      expect(body.articles.length).toBeLessThanOrEqual(10);
      expect(body).toHaveProperty("currentPage", page);
      expect(body.total).toBeGreaterThanOrEqual(20);
    });
  });
});

describe("GET /pub/article/:id", () => {
  describe("success", () => {
    test("get specific article by id successfull", async () => {
      const articleId = adminArticleId;

      let { status, body } = await request(app).get(
        `/pub/article/${articleId}`
      );

      console.log(body);
      expect(status).toBe(200);
      expect(body).toHaveProperty("id", articleId);
      expect(body).toHaveProperty("title", expect.any(String));
      expect(body).toHaveProperty("content", expect.any(String));
      expect(body).toHaveProperty("imgUrl", expect.any(String));
      expect(body).toHaveProperty("categoryId", expect.any(Number));
      expect(body).toHaveProperty("authorId", expect.any(Number));
    });
  });

  describe("failed", () => {
    it("couldn't get article cause id does not exist", async () => {
      const nonExistentId = 999999;
      let { status, body } = await request(app).get(
        `/pub/article/${nonExistentId}`
      );
      expect(status).toBe(404);
      expect(body).toHaveProperty(
        "message",
        `Article id ${nonExistentId} not found`
      );
    });

    it("couldn't get article cause id is invalid", async () => {
      const invalidId = "abc";
      let { status, body } = await request(app).get(
        `/pub/article/${invalidId}`
      );
      console.log(status);
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "message",
        "Article id is required in params"
      );
    });
  });
});

afterAll(async () => {
  try {
    await sequelize.close();
    await queryInterface.bulkDelete(
      "Articles",
      {},
      { truncate: true, cascade: true, restartIdentity: true }
    );
    await queryInterface.bulkDelete(
      "Categories",
      {},
      { truncate: true, cascade: true, restartIdentity: true }
    );
    await queryInterface.bulkDelete(
      "Users",
      {},
      { truncate: true, cascade: true, restartIdentity: true }
    );
  } catch (error) {
    console.error("Failed to close database", error);
  }
});
