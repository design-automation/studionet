# Users
|         Endpoint          |                         Description                         | Access Rights |
|---------------------------|-------------------------------------------------------------|---------------|
|      GET /api/users       |  Get a list of all users with basic information about each  |  Super Admin  |
|      POST /api/users      |       Add a new user not associated with any modules        |  Super Admin  |
|  GET /api/users/:userId   |         Get a specific user with basic information          |  Super Admin  |
|  PUT /api/users/:userId   |                    Update a specific user                   |  Super Admin  |
| DELETE /api/users/:userId |                    Delete a specific user                   |  Super Admin  |



## `GET /api/users`
Get a list of all users with basic information about each.

### Access Rights
Super Admin

### Parameters required
| Request Property |  Name  |   Type   |           Description           |
|------------------|--------|----------|---------------------------------|
|     req.user     |  User  |  Object  |  Available after user logs in.  |

### Example response
```json
[{
  "canEdit": true,
  "name": "User",
  "uploads": [{
               "id": 136,
               "type": "model"
              },
              {
               "id": 135,
               "type": "model"
              }],
  "avatar": "/uploads/E123456/avatar",
  "contributions": [{
                     "id": 94,
                     "contributionTypes": ["Question","test"]
                    }],
  "nusOpenId": "E123456",
  "year": 2,
  "id": 87,
  "modules": [{
               "role": "Admin",
               "id": 129
              },
              {
               "role": "Admin",
               "id": 121
              }],
  "views": [{
             "count": 1,
             "id": 97
            }],
  "lastLoggedIn": 1470033863980,
  "superAdmin":true
}]
```

## `POST /api/users`
Add a new user not associated with any modules. User will not be super admin by default.

### Access Rights
Super Admin

### Parameters required
|   Request Property   |     Name     |    Type   |                                Description                                |
|----------------------|--------------|-----------|---------------------------------------------------------------------------|
|       req.user       |     User     |   Object  |                       Available after user logs in.                       |
|     req.body.name    |     Name     |   String  |                         Name of user to be added.                         |
|  req.body.nusOpenId  |  NUS OpenID  |   String  |                      OpenID of the user to be added.                      |
|   req.body.canEdit   |  Allow Edit  |  Boolean  |                         Allow this user to edit.                          |
|     req.body.year    |     Year     |   Number  |  Year of study for the current user. Can be any number if not a student.  |

### Example response
```json
{
  "year": 2,
  "nusOpenId": "E123456",
  "canEdit": true,
  "name": "User",
  "lastLoggedIn": 1470033863980,
  "avatar": "/uploads/E123456/avatar",
  "superAdmin": false
}
```


## `GET /api/users/:userId`
Get a specific user with basic information.

### Access Rights
Super Admin

### Parameters required
|  Request Property |  Name  |   Type   |           Description           |
|-------------------|--------|----------|---------------------------------|
|     req.user      |  User  |  Object  |  Available after user logs in.  |
| req.params.userId | User ID|  String  | ID of the user in the database. |

### Example response
```json
{
  "canEdit": true,
  "name": "User",
  "uploads": [{
               "id": 136,
               "type": "model"
              },
              {
               "id": 135,
               "type": "model"
              }],
  "avatar": "/uploads/E123456/avatar",
  "contributions": [{
                     "id": 94,
                     "contributionTypes": ["Question","test"]
                    }],
  "nusOpenId": "E123456",
  "year": 2,
  "id": 87,
  "modules": [{
               "role": "Admin",
               "id": 129
              },
              {
               "role": "Admin",
               "id": 121
              }],
  "views": [{
             "count": 1,
             "id": 97
            }],
  "lastLoggedIn": 1470033863980,
  "superAdmin":true
}
```

## `PUT /api/users/:userId`
Update a specific user.

### Access Rights
Super Admin

### Parameters required
|   Request Property   |     Name     |    Type   |                                Description                                |
|----------------------|--------------|-----------|---------------------------------------------------------------------------|
|       req.user       |     User     |   Object  |                       Available after user logs in.                       |
|  req.params.userId   |    User ID   |   String  |                      ID of the user in the database.                      |
|     req.body.name    |     Name     |   String  |                         Name of user to be added.                         |
|  req.body.nusOpenId  |  NUS OpenID  |   String  |                      OpenID of the user to be added.                      |
|   req.body.canEdit   |  Allow Edit  |  Boolean  |                         Allow this user to edit.                          |
|     req.body.year    |     Year     |   Number  |  Year of study for the current user. Can be any number if not a student.  |

### Example response
```json
{
  "year": 2,
  "nusOpenId": "E123456",
  "canEdit": true,
  "name": "User",
  "lastLoggedIn": 1470033863980,
  "avatar": "/uploads/E123456/avatar",
  "superAdmin": false
}
```

## `DELETE /api/users/:userId`
Delete a specific user.
Can only delete the user if the user no longer has any relationships with any other nodes.

### Access Rights
Super Admin

### Parameters required
|  Request Property |  Name  |   Type   |           Description           |
|-------------------|--------|----------|---------------------------------|
|     req.user      |  User  |  Object  |  Available after user logs in.  |
| req.params.userId | User ID|  String  | ID of the user in the database. |

### Example response
```json
N/A
```
