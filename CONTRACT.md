# API Contract — Week Tech

## POST /registrations

```json
{
  "name": "string", // 255 characters max
  "student_registration": "253579732", // string, exactly 9 digits
  "course_name": "string", // 255 characters max
  "course_period": 1, // min 1, max 12
  "coffee_break": false
}
```

- `201`
- `400` `{ "error": "invalid_name" }`
- `400` `{ "error": "invalid_student_registration" }`
- `400` `{ "error": "invalid_course_name" }`
- `400` `{ "error": "invalid_course_period" }`
- `400` `{ "error": "ra_already_registered" }`

---

## POST /projects

```json
{
  "submitter_name": "string", // 255 characters max
  "submitter_registration": "253579732", // string, exactly 9 digits
  "project_name": "string", // 255 characters max
  "description": "string" // 500 characters max
}
```

- `200`
- `400` `{ "error": "invalid_submitter_name" }`
- `400` `{ "error": "invalid_ra" }`
- `400` `{ "error": "invalid_project_name" }`
- `400` `{ "error": "invalid_description" }`
- `400` `{ "error": "ra_not_found" }`

---

## POST /checkin

```json
{
  "student_registration": "253579732" // string, exactly 9 digits
}
```

- `200`
- `400` `{ "error": "invalid_student_registration" }`
- `404` `{ "error": "ra_not_found" }`

---

## POST /admin/login

```json
{
  "email": "string", // email type
  "password": "string" // backend validation
}
```

- `200` `{ "token": "..." }`
- `401` `{ "error": "invalid_credentials" }`

---

## GET /registrations — protected (JWT)

```json
[
  {
    "name": "string", // 255 characters max
    "student_registration": "253579732", // string, exactly 9 digits
    "course_name": "string", // 255 characters max
    "course_period": 1, // min 1, max 12
    "coffee_break": false,
    "checked_in": false
  }
]
```

- `200`
- `401` `{ "error": "missing_token" }`
- `401` `{ "error": "invalid_token" }`

---

## GET /projects — protected (JWT)

```json
[
  {
    "id": 1,
    "submitter_name": "string", // 255 characters max
    "submitter_registration": "253579732", // string, exactly 9 digits
    "project_name": "string", // 255 characters max
    "description": "string" // 500 characters max
  }
]
```

- `200`
- `401` `{ "error": "missing_token" }`
- `401` `{ "error": "invalid_token" }`

---

## DELETE /registrations/{ra} — protected (JWT)

`{ra}` — `student_registration` (9 dígitos).

- `200`
- `401` `{ "error": "missing_token" }`
- `401` `{ "error": "invalid_token" }`
- `404` `{ "error": "ra_not_found" }`

---

## DELETE /checkin/{ra} — protected (JWT)

`{ra}` — `student_registration` (9 dígitos). Desfaz o check-in do participante.

- `200`
- `401` `{ "error": "missing_token" }`
- `401` `{ "error": "invalid_token" }`
- `404` `{ "error": "ra_not_found" }`

---

## Resumo de rotas

| Method | Route | Auth |
|--------|-------|------|
| POST | `/registrations` | — |
| POST | `/projects` | — |
| POST | `/checkin` | — |
| POST | `/admin/login` | — |
| GET | `/registrations` | JWT |
| GET | `/projects` | JWT |
| DELETE | `/registrations/{ra}` | JWT |
| DELETE | `/checkin/{ra}` | JWT |

**Projetos:** não há `PATCH` nem `DELETE` — aprovar/rejeitar no admin exige novo endpoint no backend.

---

## Notas — diferenças em relação ao `CONTRACT.md` anterior deste repositório

| Área | Antes (repo) | Agora (este documento) |
|------|----------------|-------------------------|
| `student_registration` / `submitter_registration` | JSON numérico e comentário “9 chars max” | **String** com **exatamente 9 dígitos** |
| POST `/registrations` | `200`, erros genéricos (`missing_fields`, `invalid_ra`), `422` tipo número | **`201`**, erros específicos por campo |
| POST `/projects` | Poucos códigos de erro listados | Lista completa de `400` por campo + `ra_not_found` |
| POST `/checkin` | `invalid_ra` para RA inválido | **`invalid_student_registration`** |
| POST `/admin/login` | Incluía `400` `missing_fields` | Apenas **`401`** `invalid_credentials` e **`200`** com `token` |
| GET protegidos | Sem códigos de erro no contrato | **`401`** `missing_token` e `invalid_token` |
