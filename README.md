# Staff Scheduling Application

Backend application for a staff scheduling system where you can create staff and admin accounts, and create work schedules for staff members.

## Running the application

### Configuriong environment variables

Create a `.env` file with the following info:

```
MYSQLDB_USER=<mysql desired user>
MYSQLDB_ROOT_PASSWORD=<mysql desired password>
MYSQLDB_DATABASE=<mysql desired db>
MYSQLDB_LOCAL_PORT=3307
MYSQLDB_DOCKER_PORT=3306

NODE_LOCAL_PORT=<desired web application port>
NODE_DOCKER_PORT=3000

AUTH_KEY=<jwt key>
COOKIE_SECRET=<cookie secret>
```

### Running the containers

Run the containers by running

```docker-compose up```

Docker will automatically pull the node and/or MySQL images if your system doesn't have them

Alternatively, you can run the containers in the background by providing the `-d` argument

```docker-compose up -d```

You can stop the containers via

```docker-compose down```

Or remove all created containers and images with

```docker-compose down --rmi all```

### Running without docker

Alternatively, you can run just the node server by running `npm start` from the `staff-scheduling` directory,
after changing the environment variables to local values.

## Usage

### Account setup

To do anything meaningful, you will first have to create an account, this can be achieved by POSTing to `/auth/register` with a username and password, eg:

```
{
  "username": "tiemenv"
  "password": "dummyPassword"
}
```

Note that newly created accounts, by default, only get the `user` role. To change a user's role, admin permissions are required. Currently, one should manually change the role of the first created user to admin in the DB. This should probably be automated in the future.

After that, you can login by POSTing the same info to `/auth/login`, which will set a JWT for you which will be used in future authentication.

You can log out at any time by POSTing to `/auth/logout`.

### Schedules

With a user account, we can only view schedules.

With an admin account, we can create, edit, delete and view schedules, as well as list users ordered by amount of scheduled hours. Additionaly, we can edit and delete other user accounts as well.

#### Creating a schedule

Creating a schedule can be done by POSTing the relevant information to `/schedules` while logged in with admin permissions. Start date should be posted as a stringified date.

```
{
  "start": "2022-12-15T07:43:57.202Z",
  "hours": 5,
  "userId": 1,
}
```

For editing, you can PUT the same body properties to `/schedules/{scheduleId}`.

For deletion, you can DELETE `/schedules/{scheduleId}`

#### Viewing schedules

Any user can view schedules of any other user, you can so by GET `/users/{userId}/schedules`

Alternatively, an admin can request a list of users ordered by amount of scheduled hours: GET `/users`

Both these endpoints accepts optional `searchFrom` and `searchTill` query parameters, which should be timestamps

eg. `/users/1/schedules?searchFrom=1668930775039&searchTill=1669050775039`

## notes

open api document still needs more correct responses

in a real world scenario you would want the repo to catch and normalize the error

could've extracted more things to constants, like roles, error messages

better spend some time on setting up auto-generation of docs with swagger

should investigate DB persistency when container shuts down, look into volumes

probably not every error is being gracefully caught and passed along
