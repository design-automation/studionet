# Modules
|             Endpoint             |                            Description                           |  Access Rights  |
|----------------------------------|------------------------------------------------------------------|-----------------|
|         GET /api/modules         |    Get a list of all modules with basic information about each   |      User       |
|         POST /api/modules        |                          Add a new module                        |   Super Admin   |
|    GET /api/modules/:moduleId    |       Get a specific module with basic information about it      |      User       |
|    PUT /api/modules/:moduleId    |                      Update a specific module                    |    Moderator    |
|  DELETE /api/modules/:moduleId   |                      Delete a specific module                    |   Super Admin   |
| GET /api/modules/:moduleId/users |         Get all users that are part of a specific module.        |      User       |

## `GET /api/modules`
Get a list of all modules with basic information about each.

### Access Rights
User

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in.  |

### Example response
```json
[{
  "name": "123",
  "users": [{
             "id": 127,
             "role": "Admin"
            }],
  "contributionTypes": ["123","wdqw"],
  "code": "123",
  "id": 126
 },
 {
  "name": "test",
  "users": [{
             "id": 112,
             "role": "Admin"
            },
            {
             "id": 87,
             "role": "Admin"
            }],
  "contributionTypes": ["test"],
  "code": "test",
  "id": 121
}]
```

## `POST /api/modules`
Add a new module.

### Access Rights
Super Admin

### Parameters required
|      Request Property        |            Name             |   Type   |                   Description                   |
|------------------------------|-----------------------------|----------|-------------------------------------------------|
|         req.user             |            User             |  Object  |          Available after user logs in.          |
|         req.body.name        |         Module Name         |  String  |         Name of the module to be added.         |
|         req.body.code        |         Module Code         |  String  |         Code of the module to be added.         |
|  req.body.contributionTypes  |  Module Contribution Types  |   Array  |  Contribution Types of the module to be added.  |

### Example response
```json
{
  "contributionTypes": ["test"],
  "code": "test",
  "name": "test",
  "id": 121
}
```

## `GET /api/modules/:moduleId`
Get a specific module with basic information about it.

### Access Rights
User

### Parameters required
|    Request Property    |     Name    |   Type   |           Description           |
|------------------------|-------------|----------|---------------------------------|
|           req.user     |     User    |  Object  |  Available after user logs in.  |
|  req.params.moduleId   |  Module Id  |  String  |  ID of the module in database.  |

### Example response
```json
{
  "name": "test",
  "users": [{
             "id": 112,
             "role": "Admin"
            },
            {
             "id": 87,
             "role": "Admin"
            }],
  "contributionTypes": ["test"],
  "code": "test",
  "id": 121
}
```

## `PUT /api/modules/:moduleId`
Update a specific module.

### Access Rights
Moderator

### Parameters required
|       Request Property       |            Name             |   Type   |                       Description                        |
|------------------------------|-----------------------------|----------|----------------------------------------------------------|
|            req.user          |            User             |  Object  |              Available after user logs in.               |
|     req.params.moduleId      |          Module Id          |  String  |               ID of the module in database.              |
|         req.body.name        |         Module Name         |  String  |         Name of the module to be added.                  |
|         req.body.code        |         Module Code         |  String  |         Code of the module to be added.                  |
|  req.body.contributionTypes  |  Module Contribution Types  |   Array  |  Contribution Types of the module to be added.           |

### Example response
```json
{
  "contributionTypes": ["test"],
  "code": "test",
  "name": "test",
  "id": 121
}
```

## `DELETE /api/modules/:moduleId`
Delete a specific module.
Can only delete the node if it does not contain any relationship with any other nodes.

### Access Rights
Super Admin

### Parameters required
|   Request Property  |   Name   |   Type   |           Description           |
|---------------------|----------|----------|---------------------------------|
|       req.user      |   User   |  Object  |  Available after user logs in.  |
| req.params.moduleId | Module Id|  String  |   ID of the modue in database.  |

### Example response
```json
N/A
```

## `GET /api/modules/:moduleId/users`
Get all users that are part of a specific module.

### Access Rights
User

### Parameters required
|   Request Property  |   Name   |   Type   |           Description           |
|---------------------|----------|----------|---------------------------------|
|       req.user      |   User   |  Object  |  Available after user logs in.  |
| req.params.moduleId | Module Id|  String  |   ID of the modue in database.  |

### Example response
```json
[{
  "year": 2,
  "canEdit": true,
  "nusOpenId": "a231312",
  "name": "Jack",
  "lastLoggedIn": 12312312,
  "superAdmin": false,
  "avatar": "/uploads/a231312/avatar",
  "id": 112
 },
 {
  "year": 2,
  "nusOpenId": "E123456",
  "canEdit": true,
  "name": "User",
  "lastLoggedIn": 1470033863980,
  "avatar": "/uploads/E123456/avatar",
  "superAdmin":true,
  "id":87
}]
```