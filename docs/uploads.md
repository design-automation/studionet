# Uploads
|                  Endpoint                 |                           Description                          | Access Rights |
|-------------------------------------------|----------------------------------------------------------------|---------------|
|            POST /uploads/avatar           |            Upload a new avatar for the current user            |      User     |
|           POST /uploads/models            |            Upload a new model under the current user           |      User     |
|      GET /uploads/:nusOpenId/avatar       |                  Get a specific user's avatar                  |      User     |
|      GET /uploads/:nusOpenId/models       |  Get information about all models uploaded by a specific user  |      User     |
|  GET /uploads/:nusOpenId/models/:modelId  |      Download a specific model uploaded by a certain user      |      User     |


## `POST /uploads/avatar`
Upload a new avatar for the current user.

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in   |
|     req.file     |  File  |  Object  |    The uploaded avatar image    |

### Example response
```json
{ 
  "year": 2,
  "nusOpenId": "E123456",
  "canEdit": true,
  "name": "User",
  "lastLoggedIn": 1469442573896,
  "avatar": "/uploads/E123456/avatar",
  "superAdmin": true,
  "id": 87
}
```

## `POST /uploads/models`
Upload a new model under the current user.

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in   |
|     req.file     |  File  |  Object  |    The uploaded model file      |

### Example response
```json
{
 "date": 1469421313217,
 "size": 67645,
 "name": "example.obj",
 "type":"model",
 "id":135
}
```

## `GET /uploads/:nusOpenId/avatar`
Get a specific user's avatar 

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in   |


### Example response
```
The user's avatar
```

## `GET /uploads/:nusOpenId/models`
Get information about all models uploaded by a specific user

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in   |


### Example response
```json
[{
  "date": 1469428691679,
  "size": 17384,
  "name": "example-model.obj",
  "type": "model",
  "id": 136
 },
 {
  "date": 1469421313217,
  "size": 67645,
  "name": "example.obj",
  "type": "model",
  "id": 135
}]
```


## `GET /uploads/:nusOpenId/models/:modelId`
Download a specific model uploaded by a certain user.

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in   |


### Example response
```json
The uploaded model file
```