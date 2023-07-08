# StayFit - live a healthy lifestyle
This is a calorie-tracking application developed using PostgreSQL, Express, React and NodeJS. The application consists of goal-setting features, a weekly weigh-in reminder and reward system.

*There is a version of this application that only requires the frontend to be run locally as the backend is being hosted online using Amazon's Relational Database Services. Unfortunately, I can only allow a few users to use the application at the same time due to running costs. If you are interested, email me at - 'minhaj275@gmail.com'.

## To run the application locally:

1. Set up a PostgreSQL server locally - https://www.postgresql.org/download/

2. Use an SQL client (e.g., DBeaver) to connect to it.

3. Create a database and its schema -

		CREATE TABLE public."USER" (
		email varchar NOT NULL,
		"password" varchar NOT NULL,
		birthdate varchar NOT NULL DEFAULT (1 - 1 - 2000),
		weight varchar NOT NULL DEFAULT 120,
		height varchar NOT NULL DEFAULT 180,
		gender varchar NOT NULL DEFAULT 'Male'::character varying,
		caloriegoal int4 NOT NULL DEFAULT 0,
		lastweighin varchar NOT NULL DEFAULT 0,
		points int4 NOT NULL DEFAULT 0,
		proteingoal int4 NOT NULL DEFAULT 0,
		CONSTRAINT "USER_pkey" PRIMARY KEY (email)
		);

		CREATE TABLE public."FOOD" (
			foodid int4 NOT NULL DEFAULT nextval('food_foodid_seq'::regclass),
			foodname varchar(255) NOT NULL,
			cal varchar(255) NOT NULL,
			fat varchar(255) NOT NULL,
			protein varchar(255) NOT NULL,
			carb varchar(255) NOT NULL,
			email varchar NOT NULL,
			"day" varchar NOT NULL,
			weight varchar NOT NULL,
			CONSTRAINT food_pk PRIMARY KEY (foodid)
		);
		
		CREATE TABLE public."PHYSICAL_ACTIVITY" (
			physicalactivityid int4 NOT NULL DEFAULT nextval('physical_activity_physicalactivityid_seq'::regclass),
			exercisename varchar(255) NOT NULL,
			burnt varchar(255) NOT NULL,
			email varchar NOT NULL,
			"day" varchar NOT NULL,
			CONSTRAINT physical_activity_pk PRIMARY KEY (physicalactivityid)
		);
		
		CREATE TABLE public."REWARD_UNLOCKED" (
			unlockid int4 NOT NULL DEFAULT nextval('reward_unlocked_unlockid_seq'::regclass),
			email varchar(255) NOT NULL,
			rewardid int4 NOT NULL,
			CONSTRAINT "REWARD_UNLOCKED_pkey" PRIMARY KEY (unlockid)
		);
		
		CREATE TABLE public."REWARD" (
			rewardid int4 NOT NULL DEFAULT nextval('reward_rewardid_seq'::regclass),
			"name" varchar(255) NOT NULL,
			"cost" int4 NOT NULL,
			"content" varchar NULL,
			CONSTRAINT "REWARD_pkey" PRIMARY KEY (rewardid)
		);

4. For the 'Rewards' table, you will have to insert your own data.

5. The server/src/models/index.ts file contains the information to the database. Modify the necessary information as needed.

6. Download and install Node.js from 'https://nodejs.org/en/download'.

7. Follow the instructions of this video 'https://youtu.be/Mul8XCt6f8M'. Instructions are also included in the video description.


## Structure of the source code:
1. The server folder is the backend folder.
    - It contains the data models in the 'src/models' folder    
    - The ‘src/middlewares’ folder contains a middleware function called isLoggedIn, which checks whether the user is authenticated by verifying the presence of a session variable email. 
    - The 'src/controllers' folder contains classes that handle HTTP requests and responses for different endpoints or routes.

2. The client folder is the frontend folder.
    - The 'src/main' folder contains the main pages/screens of the application.
    - The 'src/components' folder contains components that are imported and used by the main pages.
    - The 'src/constants' folder contains a helperFunctions.ts file and a constants.ts file. The helperFunctions.ts contains small functions that are used throughout the implementation.
    
