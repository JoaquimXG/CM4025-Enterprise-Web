# CM4025 Placeholder

## TODO
1. Create consistent interface for standar CRUD endpoints
   - I want a similar system to how Django DRF handles standard CRUD with ViewSets supported by Serializers

2. Create User model with sequelize and integrate with passportjs
3. Relative imports???

### Issues



## CRUD Endpoints Framework

- Model definition
  - Definition using sequelize
- Serializer/Controller
  - Holds functions for taking in data and returning data to and from a model
  - Needs to be able to create and update a model
  - Needs to perform validation on fields
  - Needs to be able to pull in external information from other sources when creating a model or returning a representation of a model
  - Needs to be able to check relationships between models
- ViewSet
  - Holds the functions for handling each standard HTTP endpoint
    - GET /model - Returns a list of all models
    - GET /model/:id - Returns a single model
    - POST /model - Creates a new model
    - PATCH /model/:id - Updates a model
    - DELETE /model/:id - Deletes a model
  - As we are using express and not Django, I imagine this will be done by collecting a list of functions from the serializer/controller and using these as middleware
- ViewRouter/BaseRouter
  - Takes a ViewSet and generates the routes for the endpoints
  

### Validators

- I think it will be best to avoid the validation in place from sequelize and instead use standalone validation on controllers
  - Sequelize makes use of validator.js for string validation, should probably do the same

  

## Errors

- Need to extend from Error to allow throwing custom errors through express middleware

## Models

- User
- Project
  - belongs to a User
- Quote
  - belongs to a Project
- Task
  - belongs to a Quote
- TimeEntry
  - belongs to a Task
  - has a Worker
- Worker
  - Are these static, or can the user create new workers?
    - Perhaps there are some that are statically defined, but they can create new ones
  - has a rate
    - Hourly
    - Daily
  - has a title
  

