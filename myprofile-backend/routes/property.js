const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");
const nodemailer = require("nodemailer");
const sendMail = require("../utils/sendMail");
router.get("/menu", (req, res) => {

  const sql = `
    SELECT propertyType, rooms, title, slug 
    FROM properties
    WHERE status = 1
  `;

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});
router.post("/send-message", async (req, res) => {
  const { property_id, message } = req.body;

  try {
    const sql = `SELECT users.email, users.firstName FROM properties JOIN users ON users.id = properties.user_id WHERE properties.id = ? LIMIT 1`;
    db.query(sql, [property_id], async (err, result) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      if (result.length === 0) return res.status(404).json({ message: "Owner not found" });

      const ownerEmail = result[0].email;
      const ownerName = result[0].firstName;

      await sendMail(
      ownerEmail,
      "New Property Inquiry",
      `<h3>Hello ${ownerName}</h3>
      <p>You have a new message for your property:</p>
      <p>${message}</p>`
    );

      res.json({ message: "Message sent successfully" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Mail Error" });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const parseJSON = (data, fallback = []) => {
  if (!data) return fallback;

  if (Array.isArray(data)) return data;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data.includes(",") ? data.split(",") : [data];
    }
  }

  return fallback;
};

const upload = multer({ storage: storage });
router.post("/", upload.array("images"), (req, res) => {

  const {
    user_id,
    offerType,
    propertyType,
    price,
    rooms,
    bathrooms,
    parking,
    address,
    locality,
    title,
    description,
    nearbyRoad,
    features,
    singlePrice,
    doublePrice,
    triplePrice,
    meals,
  } = req.body;

  const images = req.files.map(file => file.filename);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const slug = slugify(title);

  const sql = `
  INSERT INTO properties
  (
    user_id,
    offerType,
    propertyType,
    price,
    rooms,
    bathrooms,
    parking,
    address,
    locality,
    nearbyRoad,
    singlePrice,
    doublePrice,
    triplePrice,
    meals,
    title,
    slug,
    description,
    features,
    images
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(sql, [
    user_id,
    offerType,
    propertyType,
    price,
    rooms,
    bathrooms,
    parking,
    address,
    locality,
    nearbyRoad,
    singlePrice,
    doublePrice,
    triplePrice,
    meals,
    title,
    slug,
    description,
    features,
    JSON.stringify(images)
  ], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    // 🔵 LOCATION AVAILABLE +1 UPDATE
    const updateLocation = `
      UPDATE locations 
      SET available = available + 1 
      WHERE title LIKE ?
    `;

    db.query(updateLocation, [`%${locality}%`], (err2) => {

      if (err2) {
        console.log("Location update error:", err2);
      }

      res.json({
        message: "Property submitted successfully",
        id: result.insertId
      });

    });

  });

});
// router.get("/all-properties", (req, res) => {

//   let { location } = req.query;

//   let sql = `
//     SELECT 
//       properties.*,
//       CONCAT(users.firstName, ' ', users.lastName) AS owner_name,
//       users.phone AS user_phone,
//       users.role AS user_role
//     FROM properties
//     JOIN users ON users.id = properties.user_id
//     WHERE properties.status = 1
//   `;

//   let params = [];

//   if (location) {
//     location = location.replace(/-/g, " "); // slug -> text
//     sql += " AND LOWER(properties.locality) = LOWER(?)";
//     params.push(location);
//   }

//   db.query(sql, params, (err, results) => {

//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     const COMPANY_PHONE = "9876543210";

//     const parseJSON = (data) => {
//       if (!data) return [];

//       if (Array.isArray(data)) return data;

//       try {
//         return JSON.parse(data);
//       } catch {
//         return data.split(",");
//       }
//     };

//     const properties = results.map((property) => {

//       // ✅ Phone Logic
//       property.phone =
//         property.user_role === "Broker"
//           ? property.user_phone
//           : COMPANY_PHONE;

//       // ✅ JSON fields parse
//       property.images = parseJSON(property.images);
//       property.features = parseJSON(property.features);

//       return property;
//     });

//     res.json(properties);

//   });

// });
/* ================= GET Properties according to users ================= */


router.get("/all-properties", (req, res) => {

  let { location, type, rooms, baths, page = 1, limit = 6 } = req.query;

  page = Number(page);
  limit = Number(limit);

  const offset = (page - 1) * limit;

  let sql = `
    FROM properties
    JOIN users ON users.id = properties.user_id
    WHERE properties.status = 1
  `;

  let params = [];

  // location
  if (location) {
    location = location.replace(/-/g, " ");
    sql += " AND LOWER(properties.locality)=LOWER(?)";
    params.push(location);
  }

  // type
  if (type) {
    sql += " AND properties.propertyType=?";
    params.push(type);
  }

  // rooms
  if (rooms) {
    sql += " AND properties.rooms=?";
    params.push(Number(rooms));
  }

  // baths
  if (baths) {
    sql += " AND properties.bathrooms=?";
    params.push(Number(baths));
  }

  /* ================= COUNT QUERY ================= */

  const countQuery = `SELECT COUNT(*) as total ${sql}`;

  db.query(countQuery, params, (err, countResult) => {

    if (err) return res.status(500).json({ message: "DB error" });

    const total = countResult[0].total;

    /* ================= DATA QUERY ================= */

    const dataQuery = `
      SELECT 
        properties.*,
        CONCAT(users.firstName,' ',users.lastName) AS owner_name,
        users.phone AS user_phone,
        users.role AS user_role
      ${sql}
      ORDER BY properties.id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(
      dataQuery,
      [...params, limit, offset],
      (err, results) => {

        if (err) return res.status(500).json({ message: "DB error" });

        const COMPANY_PHONE = "9876543210";

        const parseJSON = (data) => {
          if (!data) return [];
          try { return JSON.parse(data); }
          catch { return data.split(","); }
        };

        const properties = results.map((property) => {

          property.phone =
            property.user_role === "Broker"
              ? property.user_phone
              : COMPANY_PHONE;

          property.images = parseJSON(property.images);
          property.features = parseJSON(property.features);

          return property;
        });

        res.json({
          data: properties,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        });
      }
    );
  });
});


router.post("/user", (req, res) => {
  const { user_id, page = 1, limit = 5 } = req.body;

  const offset = (page - 1) * limit;

  // Get properties with pagination
  const sql = `
    SELECT * 
    FROM properties 
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [user_id, Number(limit), Number(offset)], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    // total count query
    const countSql = `SELECT COUNT(*) as total FROM properties WHERE user_id = ?`;

    db.query(countSql, [user_id], (err2, countResult) => {
      if (err2) return res.status(500).json({ message: "Count error" });

      const formatted = results.map(p => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
        features: JSON.parse(p.features || "[]")
      }));

      res.json({
        data: formatted,
        total: countResult[0].total,
        page: Number(page),
        totalPages: Math.ceil(countResult[0].total / limit)
      });
    });
  });
});

router.get("/bookmarked-properties", (req, res) => {

  const sql = `
    SELECT id, title, price, address
    FROM properties
    WHERE bookmark = 1 AND status = 1
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(result);
  });
});

/* ================= Remove bookmark the properties ================= */
router.patch("/remove-bookmark/:id", (req, res) => {

  const propertyId = req.params.id;

  const sql = `
    UPDATE properties
    SET bookmark = 0
    WHERE id = ?
  `;

  db.query(sql, [propertyId], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({ message: "Bookmark removed" });
  });
});
router.post("/update-bookmark/:id", (req, res) => {
  const propertyId = req.params.id;

  const sql = `
    UPDATE properties 
    SET bookmark = IF(bookmark = 1, 0, 1)
    WHERE id = ?
  `;

  db.query(sql, [propertyId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      success: true,
      message: "Bookmark updated"
    });

  });

});

/* ===== GET SINGLE PROPERTY ===== */
router.get("/property/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM properties WHERE id = ?",
    [id],
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      // ✅ IMPORTANT CHECK
      if (!results.length) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      const property = results[0];

      property.images = parseJSON(property.images);
      property.features = parseJSON(property.features);

      res.json(property);
    }
  );
});

/* ===== UPDATE PROPERTY ===== */
router.put("/:id", upload.array("images"), (req, res) => {

  const propertyId = req.params.id;

  const {
    offerType,
    propertyType,
    price,
    rooms,
    bathrooms,
    parking,
    address,
    locality,
    title,
    description,
    nearbyRoad,
    features,
    singlePrice,
    doublePrice,
    triplePrice,
    meals,
    existingImages
  } = req.body;

  // 👇 parse existing images coming from frontend
  let remainingImages = [];
  if (existingImages) {
    try {
      remainingImages = JSON.parse(existingImages);
    } catch {
      remainingImages = [];
    }
  }

  // 👇 new uploaded images
  let newImages = [];
  if (req.files && req.files.length > 0) {
    newImages = req.files.map(file => file.filename);
  }

  // 👇 combine remaining old + new
  const finalImages = [...remainingImages, ...newImages];

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const slug = slugify(title);

  const updateSql = `
    UPDATE properties SET
      offerType=?,
      propertyType=?,
      price=?,
      rooms=?,
      bathrooms=?,
      parking=?,
      address=?,
      locality=?,
      nearbyRoad=?,
      singlePrice=?,
      doublePrice=?,
      triplePrice=?,
      meals=?,
      title=?,
      slug=?,
      description=?,
      features=?,
      images=?
    WHERE id=?
  `;

  db.query(updateSql, [
    offerType,
    propertyType,
    price,
    rooms,
    bathrooms,
    parking,
    address,
    locality,
    nearbyRoad,
    singlePrice,
    doublePrice,
    triplePrice,
    meals,
    title,
    slug,
    description,
    features,
    JSON.stringify(finalImages),
    propertyId
  ], (err) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Update failed" });
    }

    res.json({ message: "Property updated successfully" });

  });

});
router.get("/top-properties", (req, res) => {

  const sql = `
  SELECT *
  FROM properties
  ORDER BY price DESC
  LIMIT 3
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.json({ message: "Property not found" });
    }

    res.json(result);

  });

});
/* ================= proerties status update  ================= */
router.patch("/:id/status", (req, res) => {
  const propertyId = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE properties SET status = ? WHERE id = ?";
  db.query(sql, [status, propertyId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Status updated successfully" });
  });
});
router.get("/locations", (req, res) => {

  const sql = `
    SELECT id,title,image,available
    FROM locations
    WHERE status = 1
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(result);

  });

});
router.get("/:id", (req, res) => {
    const propertyId = req.params.id;

    const sql = "SELECT * FROM properties WHERE id = ?";

    db.query(sql, [propertyId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(result[0]);
    });

});
router.get("/slug/:slug", (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT 
      properties.*,
     CONCAT(users.firstName, ' ', users.lastName) AS owner_name,
      users.phone AS user_phone,
      users.role AS user_role
    FROM properties
    JOIN users ON users.id = properties.user_id
    WHERE properties.slug = ?
    LIMIT 1
  `;

  db.query(sql, [slug], (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Property not found" });
    }

    const property = results[0];

    const COMPANY_PHONE = "9876543210";

    // ✅ Phone Logic
    property.phone =
      property.user_role === "Broker"
        ? property.user_phone
        : COMPANY_PHONE;

    // ✅ Safe JSON Parser
    const parseJSON = (data) => {
      if (!data) return [];

      if (Array.isArray(data)) return data;

      try {
        return JSON.parse(data);
      } catch {
        return data.split(",");
      }
    };

    property.images = parseJSON(property.images);
    property.features = parseJSON(property.features);

    return res.json(property);
  });
});


router.post("/add-location", upload.single("image"), (req, res) => {

  const { title, available } = req.body;

  let image = req.file ? req.file.filename : null;

  const sql = `
  INSERT INTO locations (title,image,available)
  VALUES (?,?,?)`;

  db.query(sql, [title, image, available], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error inserting location" });
    }

    res.json({
      message: "Location added successfully",
      id: result.insertId
    });

  });

});
router.put("/update-location/:id", upload.single("image"), (req, res) => {

  const { title, available } = req.body;
  const id = req.params.id;

  let image = req.file ? req.file.filename : null;

  if (image) {

    const sql = `
      UPDATE locations 
      SET title=?, image=?, available=? 
      WHERE id=?`;

    db.query(sql, [title, image, available, id], (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Location updated" });

    });

  } else {

    const sql = `
      UPDATE locations 
      SET title=?, available=? 
      WHERE id=?`;

    db.query(sql, [title, available, id], (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Location updated" });

    });

  }

});
router.delete("/delete-location/:id", (req, res) => {

  const sql = "DELETE FROM locations WHERE id=?";

  db.query(sql, [req.params.id], (err) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "Location deleted" });

  });

});


module.exports = router;