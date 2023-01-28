# CM4025 Placeholder

## TODO
1. Create consistent interface for standar CRUD endpoints
   - I want a similar system to how Django DRF handles standard CRUD with ViewSets supported by Serializers
2. Create User model with sequelize and integrate with passportjs


### CRUD Endpoints Framework

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