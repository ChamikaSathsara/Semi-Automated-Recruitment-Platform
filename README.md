# 🧠 Semi-Automated Recruitment Backend (MERN + AWS)

This backend handles job vacancy management, CV scoring via AWS Textract, and automated candidate filtering.

## 🧰 Tech Stack

- **Backend:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **File Storage & Text Extraction:** AWS S3 + Textract
- **Export:** JSON/CSV
- **API Docs:** Postman + Swagger-style

---

## ⚙️ Installation

```bash
git clone https://github.com/your-repo/semi-auto-backend.git
cd semi-auto-backend
npm install
```

Add a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/semi_automation_hr
JWT_SECRET=SuperSecureKey
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=cv-uploads-bucket
```

Run locally:

```bash
npm start
```

---

## 🔐 Auth Routes

| Method | Endpoint         | Description         | Role       |
|--------|------------------|---------------------|------------|
| POST   | `/api/auth/signup` | Create account     | All        |
| POST   | `/api/auth/login`  | Login (JWT token)  | All        |

---

## 📌 Admin Routes (`/api/admin`)

> Requires JWT + role = `admin`

| Method | Endpoint                           | Description                      |
|--------|------------------------------------|----------------------------------|
| POST   | `/jobs`                            | Create job vacancy               |
| PATCH  | `/jobs/:id/limit`                  | Set max applications             |
| POST   | `/jobs/:id/keywords`               | Add scoring keywords             |
| GET    | `/applications/:jobId`             | List applications ordered by score |
| POST   | `/filtered/:appId`                 | Push candidate to filtered list  |
| GET    | `/filtered/export?type=json/csv`   | Export filtered data             |

---

## 👤 Candidate Routes (`/api/candidate`)

> Requires JWT + role = `candidate`

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | `/jobs`              | List active jobs           |
| POST   | `/apply/:jobId`      | Apply to job with CV (PDF) |

> ⚠️ `POST /apply/:jobId` requires form-data:
- Key: `cv` (PDF file)
- Header: `Authorization: Bearer <token>`

---

## 📦 Postman Collection

🔗 [Download Postman Collection](https://example.com/postman-collection.json)  
*(Replace with your export URL or upload to GitHub repo)*

To use:

1. Import collection into Postman
2. Set your base URL (e.g., `http://localhost:5000`)
3. Set `{{token}}` as an environment variable after login

---

## 📤 AWS Requirements

- Make sure your S3 bucket is created and public-read or appropriate permissions are set.
- Enable Textract permissions for your IAM user.

---

## 📈 Export Format

- JSON: structured by application/candidate/job info
- CSV: Flattened fields using `json2csv` for Excel use

---

## ✅ Future Enhancements

- Email notifications
- Interview scheduling
- Role-based dashboards

---

## License

MIT