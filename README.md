# CM4025 Placeholder

## Influences/Inspiration

### DRF - Django Rest Framework

Codebase is written in JavaScript but the concepts for code structure and organisation of models/routes/etc. are all heavily inspired by
Django Rest Framework which is written in Python. Many of the class names are identical to Django Rest Framework and the implemenatations are similar.
I hope that this is suitable as the only reason this has been done is because DRF is excellent but unfortunately not available in JavaScript. Realistically this is much
more work than it would have been to use DRF and it is not against the license for DRF. I have not copied any code from DRF, but I have looked at the source code for DRF
to get ideas for how to implement things in JavaScript.

### Previous Work

Small sections of the codebase, particularly around the middleware for PassportJS is taken from previuos coursework for web dev in years 2 and 3. Some of this work was as teams
but I can evidence that these sections of these projects were implemented by me.

## TODO

2. Finally..., endpoints for the standard API
3. Eager loading for related queries, should be handled at the view level

### Maybe TODO (probably not for this project)
    
1. Password reset/recovery
2. MFA
3. Complex permissions
  - The outline for this is done, see IsAdmin and IsAuthenticated implementations
  - Further work can be done on more complex permissions but they are likley not required here.
    - read, write, update, delete permissions
4. Relative imports???
5. CSRFTOKEN??? Should ask whether they are likely to care about this in class

### DONE
1. Create consistent interface for standar CRUD endpoints
   - I want a similar system to how Django DRF handles standard CRUD with ViewSets supported by Serializers
2. Create User model with sequelize and integrate with passportjs
3. Create standard CRUD endpoints for user model, without proper validation
4. Create ChoiceField
5. Create DateTime fields and validators
6. Integrate User model with passportjs
7. /user/me endpoint
8. View based permissions
9. Relations

### Tags

Search the codebase for the following tags

TODO - Things that need to be done
DRF - Things that could be taken from Django Rest Framework, likely look at DRF implementation for details

### Issues

### Other
1. Error formatting
  - Errors should be formatted properly through the validation chain

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

## Application Model

This is not complex, no ERD is required.

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