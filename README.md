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
