[Assignment directions](https://canvas.oregonstate.edu/courses/1914742/assignments/9185733)

# Objective

In this step, you implement the CREATE, READ, UPDATE and DELETE functionalities for ONE entity (table) in your web app as described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide). The project requires that each entity have an INSERT and SELECT (i.e., data can be added and displayed). It also requires at least one update and one delete for an M:N relationship. *Therefore, completing this step for a composite entity table may be a good idea.* However, it is also OK to spread these four CRUD functionalities across multiple entities/tables.

The end result should be a functioning HTML page(s) that implements the back-end coding to connect with your database along with the logic to perform the four CRUD operations. Ideally, you will be using the HTML forms and SQL queries you submitted in the previous steps implemented in the web technology of your choice.

If you haven't developed a web-based application before, we would recommend referring to one of the class starter guides for Node.JS or Flask.

You may want to implement READ first since it is often the simplest operation. In the previous step, you decided what data your HTML pages would display. Now you need to implement the functionality to actually display the data on one of your pages. This will involve writing some code to submit the correct query (as indicated in your DML.sql file) to your back-end and displaying the results on your front-end. The code you write will depend on what languages/packages/etc. you plan to use. For example, if you are using a templating engine (e.g., handlebars or Jinja), then your method for displaying the data will be specific to that engine.

**On the front-end**: make sure your forms for INSERT, UPDATE and DELETE are valid HTML code:

    * The input fields should have valid name attributes
    * The submit button should work (i.e., perform the expected action)
    * The form's action should point to the *correct route* (i.e., it should match the route provided by your server-side code)

**On the back-end**: 

    * Write code to retrieve the data by any HTTP request. This data should then be put in your DML query before it is executed on the database. Any results from the database would then be sent out in a HTTP response which would be displayed to the user.
    * All the interaction with the server-side code can happen in AJAX or not. Common errors and mistakes with server-side interaction and database querying can be debugged by printing (or using a debugging tool to display) a variable before it is processed and used. For example, you would want to print the request before actually extracting and using data from it because your form might send HTTP GET request but your server-side code handles only HTTP POST requests thus causing a mismatch.
As always, if you have any questions, ask on Ed Discussions or in office hours!

# The Draft Phase

Please see [Draft Phase](https://canvas.oregonstate.edu/courses/1914742/pages/draft-phase?wrap=1) for more information about this phase of the Project Step, including how to submit drafts.

# Deliverable(s)

(**NOTE**: in addition to the ZIP archive, you must include additional details in your discussion post. See below.)

You should submit a **ZIP** archive containing **5 THINGS**:

    1. A **PDF** file containing information from previous steps. This file should be updated to reflect any changes made to the project. Furthermore, it should be consistent in its details of the overall design.
    2. An **SQL file containing your Data Definition Queries** (DDL.sql) and your **sample data INSERT statements**
    3. An **SQL file containing your Data Manipulation Queries** (DML.sql). These are the queries that your website uses to perform the user-requested CRUD operations. Thus SELECT, INSERT, UPDATE and DELETE queries to provide the functionalities described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide).
    4. A URL to an index.html listing all your HTML pages. Put this URL on the top of your PDF file as well as on your discussion post.
    5. The current versions of your front-end and back-end code.
The zip file should be named​ **projectgroupX_stepX_DRAFT/FINAL.zip** (e.g., *ProjectGroup42_Step4_DRAFT.zip* or *ProjectGroup42_Step4_FINAL.zip*).

Your .ZIP file should be posted to the Ed Discussion (please follow the instructions under "How do I turn in this assignment" below). Both members' names and your Group number should be included in the files as well as a comment on the post.

**Ensure consistency**: as your project changes, be sure to update each of your deliverables as necessary to ensure an overall consistency in your design. If your design is not clear because it is inconsistent, then you may lose points.

 

Along with the deliverables listed above, you must also include the following details in your discussion post:

    1. What functionality works,
    2. What functionality doesn’t work,
    3. Where/why you are blocked on certain functionality.
This information is meant to help reviewers understand any difficulties you may be having with your project, giving them an opportunity to provide advice on how you might resolve any issues you have encountered. Thus, being detailed will help you receive better advice on how to overcome any issues. If all your functionality works, then feel free to say so in your post and omit #2 and #3 above. Also feel free to ask open-ended advice on existing/planned functionality.

## Deliverable 1: PDF File

**The following sections should appear in the same order as they are listed here.**

### a) Fixes based on Feedback from Previous Steps:

Itemize the issues raised by your peers and the TAs/instructors in Step 1. This means including a description of each issue as well as how you fixed it. If you chose not to address an issue raised by a peer or the TA/Instructor, you must indicate why you think the design should not change. In other words, you must reason why the perceived issue isn't really an issue. If you make any additional changes based on your own design decisions (including issues that you found and fixed on your own), they should also be listed here.

If you haven't received any feedback, then state this here and do not include the preceding details.

### b) Project Outline and Database Outline, ERD, Schema, & Sample Data - **Updated Versions:**

This section should contain the updated outline, ERD, Schema and sample data based on the feedback from the grader and your peers as well as any design decisions that you decided to make on your own. It's required that you apply the various design tools you learned until now (like Normalization steps, ON DELETE CASCADE, etc.) to review and fix your ERD and Schema. Your Final Project submission will be graded based on your application of these concepts.

## Deliverable 2: Data Definition Queries (DDL.sql) - **Updated Version**

Your DDL.sql file should be updated to reflect any changes in your design since your last submission.

## Deliverable 3: Data Manipulation Queries (DML.sql)

Your DML.sql file should be updated to reflect any changes in your design since your last submission.

## Deliverable 4: URL to your index.html page

You should submit a **URL of an index page** containing links to those pages which implement the CRUD step in your website.

At this point, we only expect pages for which you have implemented the CRUD functionalities to work. For example, if you implemented the CRUD functionalities over a composite entity table, then only the pages associated with those functionalities over that table need to work.

    * Your server-side code should use your DML queries outlined in DML.sql to implement the CRUD steps.
    * The READ step displays (using SELECT) data from the database table. If you implement a dynamic drop down or a search criterion these also use SELECT queries to run on your database.
    * The CREATE step accepts input from the static HTML pages and allow users to add new records to the entity using INSERT (not to be confused with CREATE TABLE).
    * The UPDATE step is used to modify existing data, using an UPDATE query. Note that it's really not acceptable to have the user enter IDs for foreign keys, since that could lead to wrong IDs being entered. You may implement a drop-down menu or something similar but should not have the user enter the ID manually.
    * The DELETE step is used to remove a record, typically using a DELETE and a primary key.
You should include this URL in your PDF on the first page.

## Deliverable 5: Front-End and Back-End Code

Include the front-end (HTML, etc,.) and back-end (server-side) code for your project. Do not include folders of common libraries as this will make the zip file very large. Your code should be organized in a sensible way. Furthermore, the naming-convention of files/folders should make the organization self-documenting. Your code should also use meaningful variable names and include brief comments to explain logic. Any code that is not original should have a citation to clearly credit the source.

# Frequently Asked Questions:

**Q. _This is too much work! I can't complete it in so much short time!_**

**A.** Well, actually you don't need to implement all the pages with all the functionalities! You just need to get started. Since this is Step has only a Draft and Review, you get points for simply turning in things as they are. If you get stuck and can't implement anything, you can still turn it in on the Review Group and get points for submission and discussion. You have until Final Week to get the web application working.

**Q. _My website isn't finished, what should I do?_**

**A.** This assignment is to ensure that you get timely feedback (and also give others) about how your programming approach is coming along. Your project need not be completely functioning for this Step's submission since it won't be graded based on that.

**Q. _How exactly is this different from the Step where I created those HTML pages?_**

**A.** In this Step, you will be actually writing backend code to display data from the database. So the sample data that you provided in the previous Steps should be displayed when a user visits those pages.

**Q. _What platform can I use to interact with the database?_**

**A.** You can write your backend code in anything as long as you write all the SQL queries yourself and don't depend on a library like an ORM to generate them for you. Basically, you will just need to put all your Data Manipulation Queries in your backend code to send to the database and then process their result to be displayed on the web page.

**Q. _So these HTML pages will interact with the database?_**

**A.** Well, they will actually interact with your back-end programming language or framework like Flask/NodeJS which then interacts with the database. We will get there soon enough.

**Q. _How do I connect to the database !? I haven't used NodeJS/Flask before!_**

**A.** Well, actually you did connect to a database in Week 1 using NodeJS or Flask. Also, you may use the sample code provided in the project starter apps to build upon. Looking at that code should help answer most of your questions. But if you are still stuck, please ask in Ed Discussions or teams.

**Q. _How many web pages should my project have?_**

**A.** There is neither a minimum or maximum number of HTML pages that your project should have but it is desirable that your project is spread across different pages rather than a single one. You may combine or separate functionalities from the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide) across pages as you deem necessary.

**Q. _Should this field in my form be a textbox/textarea/drop-down/some new UX style fancy element ?_**

**A.** This is your choice and an user needs to easily understand how to use it (maybe if it's too difficult you could provide tooltips about how to use it). Your reviewers/graders might disagree and you should be able to justify the usage of one over the other.

**Q. _ I want to implement functionalities like shopping cart/login/authorization/authentication in my Project?_**

**A.** You really shouldn't need to implement authentication or a shopping cart, since this is primarily about giving admin CRUD access to your entities instead of a customer facing shopping experience. So prioritize implementing all of the functionalities described in CS340 Project Guide first and then later you may add any extra functionalities if you want. In case you are implementing some kind of authentication mechanism, be sure to provide the peer reviewers and graders a way to authenticate without having to sign-up (like a default username and password which you would include in your submission somewhere)

|Criteria | Ratings ||||| Pts|
|---|---|---|---|---|--|-|
|Project Draft ZIP|**25 pts Full Marks** Includes ALL required elements 1) zip file correctly named, 2) PDF with information from previous steps 3) DML.SQL file with queries, and 4) DDL.SQL file with sample data 5) Current version of project code|**20 pts Missing ONE** Missing no more than ONE required element 1) zip file correctly named, 2) PDF with information from previous steps 3) DML.SQL file with queries, and 4) DDL.SQL file with sample data 5) Current version of project code|**15 pts Missing TWO** Missing no more than TWO required element 1) zip file correctly named, 2) PDF with information from previous steps 3) DML.SQL file with queries, and 4) DDL.SQL file with sample data 5) Current version of project code|**10 pts Missing THREE or More** Missing THREE or more required elements 1) zip file correctly named, 2) PDF with information from previous steps 3) DML.SQL file with queries, and 4) DDL.SQL file with sample data 5) Current version of project code||25 pts|
|This criterion is linked to a Learning OutcomePosts to discussion|**25 pts Full Marks** 1) Posts draft as a [Group XX] Project Step 4 Draft" 2) categorizes as Project Step 4 Drafts & Reviews 3) Includes both members' names and group number 4) has a URL to all HTML pages. 5) Briefly addresses what works/doesn't and where blocked. 6) URL of Ed post is submitted here on Canvas.|**20 pts Missing ONE** Missing AT MOST ONE of 1) Posts draft as a [Group XX] Project Step 4 Draft" 2) categorizes as Project Step 4 Drafts & Reviews 3) Includes both members' names and group number 4) has a URL to all HTML pages. 5) Briefly addresses what works/doesn't and where blocked. 6) URL of Ed post is submitted here on Canvas.|**15 pts Missing TWO** Missing AT MOST TWO of 1) Posts draft as a [Group XX] Project Step 4 Draft" 2) categorizes as Project Step 4 Drafts & Reviews 3) Includes both members' names and group number 4) has a URL to all HTML pages. 5) Briefly addresses what works/doesn't and where blocked. 6) URL of Ed post is submitted here on Canvas.|**10 pts Missing THREE or More** Missing THREE OR MORE of 1) Posts draft as a [Group XX] Project Step 4 Draft" 2) categorizes as Project Step 4 Drafts & Reviews 3) Includes both members' names and group number 4) has a URL to all HTML pages. 5) Briefly addresses what works/doesn't and where blocked. 6) URL of Ed post is submitted here on Canvas.||25 pts|
|CRUD for One Entity|**50 pts Full Marks** At least one entity implements 1) READ uses SELECT to display data 2) CREATE accepts input and INSERTs record 3) UPDATE modifies existing data 4) DELETE removes a record. High quality.|**45 pts Missing ONE** AT MOST one operation is incomplete or missing: At least one entity implements 1) READ uses SELECT to display data 2) CREATE accepts input and INSERTs record 3) UPDATE modifies existing data 4) DELETE removes a record. Good quality|**40 pts Missing TWO** AT MOST two operations are incomplete or missing: At least one entity implements 1) READ uses SELECT to display data 2) CREATE accepts input and INSERTs record 3) UPDATE modifies existing data 4) DELETE removes a record. Acceptable quality|**35 pts Missing THREE** AT MOST three operations are incomplete or missing: At least one entity implements 1) READ uses SELECT to display data 2) CREATE accepts input and INSERTs record 3) UPDATE modifies existing data 4) DELETE removes a record. Needs improvement -please contact the TA or instructors if you need assistance|**0 pts Not implemented** Unable to find any working CRUD steps. Please contact the TAs or Instructors ASAP to help get your project on track.|50 pts|
||||||Total Points: |100|