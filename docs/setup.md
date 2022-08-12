# Setting Up
## Requirements
* [Node.js](https://nodejs.org/en/)
* [Home | Yarn - Package Manager](https://yarnpkg.com)
* [Judge0 CE API (RapidAPI Key)](https://rapidapi.com/judge0-official/api/judge0-ce/details)
* [Firebase](https://firebase.google.com)

## Initial Setup
The project dependencies can be installed with:
```
$ yarn install
```

### Firebase Setup

A free Firebase application needs to be created. A tutorial for creating the application is available [here](https://cloud.google.com/firestore/docs/client/get-firebase). In this process, you will be given various keys that correspond to that specific Firebase application. The keys you need are the API key, auth domain, database URL, project ID, storage bucket, messaging sender ID, app ID, and measurement ID.

Within Firebase, the following collections need to be created in the **Firestore database**:

**students**:
| Field Name | Field Type                      | Example Value                        | Description                                                                                                          |
|----------------|-------------------------------------|------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| achievements   | array of achievement ID's (numbers) | [1, 2]                                   | All achievements the user has earned.                                                                                |
| anonymous_name | string                              | Michael Jordan                           | The user's anonymous name.                                                                                           |
| email          | string                              | johndoe@sfu.ca                           | The user's email. Must be an SFU email.                                                                              |
| friends        | array of uuid's (strings)           | ["987d02d8-0db9-427e-b5d9-95273acbeb0b"] | A list of the user's friends. This is deprecated, but might be less complicated than the 'relationships' collection. |
| is_anonymous   | boolean                             | false                                    | True if the user is using their anonymous name currently.                                                            |
| level          | number                              | 1                                        | The user's level.                                                                                                    |
| score          | number                              | 100                                      | The user's score.                                                                                                    |
| name           | string                              | John Doe                                 | The user's real name.                                                                                                |
| uuid           | string                              | 19d03e95-8191-4844-86d6-3ef0ff833cd5     | The user's unique identifier.                                                                                        |

Note: the name of each document is the generated UUID!

**replies**:
| Field Name | Field Type           | Example Value                        | Description                                         |
|----------------|--------------------------|------------------------------------------|-----------------------------------------------------|
| author         | string                   | 19d03e95-8191-4844-86d6-3ef0ff833cd5     | The ID of the user who posted the response.         |
| content        | string                   | This is a good question!                 | The content of the response. NOT rendered as HTML.  |
| date           | timestamp                | July 2, 2022 at 11:47:30 AM UTC-7        | The time that the user posted the response.         |
| id             | string                   | 070740eb-541b-4efb-bf5a-99100ed738a8     | The unique ID of the response.                      |
| parent         | string                   | 629bcbe0-f6a0-4e47-93ee-021f86bee82b     | The parent discussion that the response belongs to. |
| upvoted_by     | array of uuids (strings) | ["987d02d8-0db9-427e-b5d9-95273acbeb0b"] | UUID's of users who upvoted the response.           |

Note: the name of each document is the generated UUID!

**relationships**:
| Field Name | Field Type | Example Value                    | Description                                                     |
|----------------|----------------|--------------------------------------|-----------------------------------------------------------------|
| from           | string         | 19d03e95-8191-4844-86d6-3ef0ff833cd5 | The UUID of the user who sent the request.                      |
| responded      | timestamp      | July 4, 2022 at 9:47:00 PM UTC-7     | The time that the receiver responded to the request.            |
| sent           | timestamp      | July 2, 2022 at 11:47:30 AM UTC-7    | The time that the sender sent the request.                      |
| status         | number         | 1                                    | The current status of the request. See code for status meaning. |
| to             | string         | 987d02d8-0db9-427e-b5d9-95273acbeb0b | The UUID of the user who received the request.                  |

**personalization**:
| Field Name | Field Type                   | Example Value                    | Description                                                  |
|----------------|----------------------------------|--------------------------------------|--------------------------------------------------------------|
| challenges     | array of challenge IDs (strings) | ["nested_conditionals_2"]            | A list of challenges that the user has completed.            |
| leaderboards   | number                           | 1                                    | The visibility status of leaderboards. See code for meaning. |
| show_lectures  | boolean                          | true                                 | Lecture content is automatically shown if true.              |
| shown_modules  | array of module names (strings)  | [“Nested Conditionals”]                                    | A list of modules that are shown to the user.                |
| uuid           | string                           | 987d02d8-0db9-427e-b5d9-95273acbeb0b | The UUID of the user whom this personalization belongs to.   |

**discussions**:
| Field Name | Field Type           | Example Value                                               | Description                              |
|----------------|--------------------------|-----------------------------------------------------------------|------------------------------------------|
| author         | string                   | 987d02d8-0db9-427e-b5d9-95273acbeb0b                            | The UUID of the author.                  |
| content        | string                   | Are there any downsides to having a lot of nested conditionals? | The content of the post.                 |
| date           | timestamp                | July 1, 2022 at 12:00:00 PM UTC-7                               | The time the post was posted.            |
| open           | boolean                  | true                                                            | Post can have replies if true.           |
| title          | string                   | Is it bad to have a lot of "levels" of nested conditionals?     | The title of the post.                   |
| upvoted_by     | array of UUIDs (strings) | ["e788ff15-b1ce-49fa-bdd9-6c2d375d403d"]                        | The UUIDs of users who upvoted the post. |
| uuid           | string                   | 629bcbe0-f6a0-4e47-93ee-021f86bee82b                            | The unique ID of the post.               |

Note: the name of each document is the generated UUID!

**answers**:
| Field Name | Field Type             | Example Value                                                        | Description                                   |
|----------------|----------------------------|--------------------------------------------------------------------------|-----------------------------------------------|
| answers        | array of answers (strings) | ["No"]                                                                   | The answers that the user has responded with. |
| questions      | string                     | nested_conditionals_mc_1                                                 | The question ID.                              |
| uuid           | string                     | 19d03e95-8191-4844-86d6-3ef0ff833cd519d03e95-8191-4844-86d6-3ef0ff833cd5 | The unique ID for the question.               |

Note: the name of each document is the generated UUID!

### RapidAPI Setup & Changing Environment Variables

A RapidAPI account needs to be created with free access to the Judge0 CE API. After creating your RapidAPI account and selecting the lowest-tier for the Judge0 CE API, you will receive an API key.

Next, duplicate the existing `.sample-env` file and rename it to `.env`. The contents of the file should be the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_RAPIDAPI_KEY=
```

Add the corresponding keys after the ‘=‘ for each line. For example, if my RapidAPI key is `e579b80725p12js14873fmsh9ad7d0052d2d8n3f0b383210e5`, I would change the last line to:

```
NEXT_PUBLIC_RAPIDAPI_KEY=e579b80725p12js14873fmsh9ad7d0052d2d8n3f0b383210e5
```

## Running
The web application can be ran with:
```
$ yarn run dev
```

This will launch the web server, which can be accessed locally at [localhost:3000](http://localhost:3000).