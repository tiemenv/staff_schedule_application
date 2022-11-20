# Staff Scheduling Application

Backend application for a staff scheduling system where you can create staff and admin accounts, and create work schedules for staff members.

## Running the application

Run the containers by running

```docker-compose up```

Docker will automatically pull the node and/or MySQL images if your system doesn't have them

Alternatively, you can run the containers in the background by providing the `-d` argument

```docker-compose up -d```

You can stop the containers via

```docker-compose down```

Or remove all created containers and images with

```docker-compose down --rmi all```

## Usage

To do anything meaningful, you will first have to create an account
## notes

TODO:

<!-- user list with counted hours -> "start period" -> "end period" -->
<!-- time search options -->
<!-- update schedule -->
<!-- soft-delete schedule -->
<!-- reconsider start time and end time data types -->
<!-- user roles: edit and attach admin roles -->
<!-- edit/delete users -->
<!-- validation in routes -->
<!-- put creds in .env -->
<!-- unit tests???? -->
dockerize
readme + notes
openAPI documentation -> read through and correct responses
<!-- github -->

<!-- TEST VALIDATION -->

<!-- DELETE USER -->
<!-- EDIT USER -->

<!-- fix typedefs? -->

merge 2 similar queries in schedule repo

open api document still needs correct responses

repo does not return the whole Model, needless memory and load, only need data

in a real world scenario you would want the repo to catch and normalize the error

never let the model exit the repo, just do all operations there and return data

could've extracted more things to constants, like roles, error messages
better spend some time on setting up auto-generation of docs with swagger

ROLE: belongsToMany users

USER: hasMany roles, hasMany schedules

SCHEDULE: belongsTo user

USER one-to-many SCHEDULE

USER many-to-many ROLE
