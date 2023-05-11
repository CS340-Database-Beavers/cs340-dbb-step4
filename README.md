[Assignment directions](https://canvas.oregonstate.edu/courses/1914742/assignments/9185733)

# Objective

In this step, we will begin working on the front-end portion of our project. Namely, we will create two things:

    1. The HTML front-end for your web app that will provide an interface for a user to perform CRUD operations as described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide).
    2. The DML SQL statements that your application will (eventually) use to perform the user-requested CRUD operations.

To get started with this Step, we suggest making a list of all CS340 Project functionalities in terms that are relevant to your database. For example "Add entries to each table" could be "Add a new BSG person", "Add a new Certification", and so on.

Once you have determined all the operations you should implement, draw a design prototype of your HTML page(s). For example, an "Add new BSG person" page would contain fields for first name, last name, a dropdown for Homeworld, and a field for age. Also, remember that you need not implement all your functionalities in different pages. For example, we could have a delete button for each entry on the page listing all bsg_people.

# The Draft Phase

Please see [Draft Phase](https://canvas.oregonstate.edu/courses/1914742/pages/draft-phase?wrap=1) for more information about this phase of the Project Step, including how to submit drafts.

# Deliverable(s)

You should submit a **ZIP** archive containing **4 THINGS**:

    1. A **PDF** file containing information from previous steps. This file should be updated to reflect any changes made to the project. Furthermore, it should be consistent in its details of the overall design.
    2. An **SQL file containing your Data Definition Queries** (DDL.sql) and your **sample data INSERT statements**
    3. An **SQL file containing your Data Manipulation Queries** (DML.sql). These are the queries that your website uses to perform the user-requested CRUD operations. Thus SELECT, INSERT, UPDATE and DELETE queries to provide the functionalities described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide).
    4. A **URL** to an index.html listing all your HTML pages. Put this URL on the top of your PDF file as well as on your discussion post.

The zip file should be named​ **projectgroupX_stepX_DRAFT/FINAL.zip** (e.g., _ProjectGroup42_Step3_DRAFT.zip_ or _ProjectGroup42_Step3_FINAL.zip_).

Your .ZIP file should be posted to the Ed Discussion (please follow the instructions under "How do I turn in this assignment" below). Both members' names and your Group number should be included in the files as well as a comment on the post.

Ensure consistency: as your project changes, be sure to update each of your deliverables as necessary to ensure an overall consistency in your design. If your design is not clear because it is inconsistent, then you may lose points.

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

You must include a DML.sql file. This file will contain the queries that your website will (eventually) use to query the back-end database based on users' interaction with the front-end. This file will include the set of SELECT, INSERT, UPDATE and DELETE queries that your final project will use to implement the required operations as specified in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide) (in addition to any other functionality you plan on implementing).

Many of your queries will depend on _dynamic inputs_. For example, INSERTing a new person into bsg*people requires input from a front-end form (i.e., the \_fname*, _lname_, _homeword_, and _age_ of the person the user wants to INSERT into the table). _Dynamic inputs_ also describe those portions of your queries that need to change dynamically, perhaps because they are based on the state of the front-end/back-end. You should clearly indicate which parts of your queries are _dynamic inputs._ This can be done though SQL comments and special characters.

For example, [bsg_sample_data_manipulation_queries.sql](https://canvas.oregonstate.edu/courses/1914742/files/98097733?wrap=1) documents its dynamic inputs as follows,

```
-- Query for add a new character functionality with colon : character being used to
-- denote the variables that will have data from the backend programming language

INSERT INTO bsg_people (fname, lname, homeworld, age)
VALUES (:fnameInput, :lnameInput, :homeworld_id_from_dropdown_Input, :ageInput);
```

Here, _:fnameInput_ denotes the variable that will have the value of "First Name" in it when the NodeJS code processes it.

All queries should be syntactically correct (apart from the _dynamic inputs_). This means that all your queries should work if the variable names are replaced with actual data. As always, your DML should be consistent with all other deliverables.

**Note:** do not include any of the JavaScript, PHP, or any other programming language's code used to process the data. This file is purely for your DML queries.

## Deliverable 4: URL to your index.html page

You should **submit a URL of an index page containing links to all the other static pages** in your website (e.g. https://web.engr.oregonstate.edu/~yourONID/cs340/index.html) with a short but informative title for each page like "Browse existing ships", "Add new ship", "Manage certifications for each character". **You need to include this URL on the first page of your PDF AND on your discussion post.**

These are the static HTML pages which the user will use to interact with your Project Website. Your HTML pages should be the front-end implementation for all the functionalities described in the [CS340 Project Guide](https://canvas.oregonstate.edu/courses/1914742/pages/cs340-project-guide). These can be plain HTML files or, if you wish, you can build them using a templating engine (e.g., handlebars). The only requirement is that each page is browsable and has the CRUD forms you plan to implement.

At this step, you are only required to provide your project website (front-end). You are welcome to work ahead and implement the back-end in this step, **_but it is not required_**. The front-end should include forms, client-side validation (if you decide to use any), and any additional content (images, etc,.) that you want to display on your website.

You can deploy your website on the flip server by placing all the necessary files inside the **public_html** directory.

**Sample:** for a sample website using the BSG database, we would turn in a URL to an index.html page listing all the other pages in the website along with a short description of what functionality is available in what page. Here is an example of what those files would look like Download an example of what those files would look like.

# Frequently Asked Questions:

**Q. _I am using handlebars/some other templating engine for developing my project website. What should I submit?_**

**A.** Just make sure the handlebar pages are browse-able with the right template syntax inserted.

For example, if I were to submit only the handlebar file for bsg_people, I would make available the people.handlebars file along with the URL I submit and an index.html file listing all the pages and a short description of what they are.

**Q. _How many web pages should my project have?_**

**A.** There is neither a minimum nor a maximum number of HTML pages that your project should have, but it is desirable that your project is spread across different pages rather than a single one. You may combine or separate functionalities from the CS340 Project Guide across pages as you deem necessary.

**Q. _Do I need to show sample data on the HTML pages?_**

**A.** While not necessary, it would be helpful. You may want to use some of the sample data from your previous project step. A webpage should definitely indicate with the correct section headings whether a section lists rows from a table or is a form for adding new rows to the tables or provides some other functionality.

**Q. _What do you mean by "front-end implementation for a functionality" on a static HTML page?_**

**A.** For example, consider the Add people form for the bsg_people entity. The HTML page would contain a form with fields for all the columns (but not the ID since it's auto-incremented) and also a submit button. Of course, you would also have labels telling the user what each of these textboxes or dropdowns are for. You would also include a header on the page specifying that this form is for adding a new person. You could also work ahead and make sure that the fields are displayed in a neat order, probably using a table since there will be points for styling in your Final Project submission.

**Q. _So these HTML pages will interact with the database?_**

**A.** Well, they will actually interact with your back-end programming language or framework like Flask/NodeJS which then interacts with the database. We will get there soon enough.

**Q. _Should this particular field in my form be a textbox/textarea/drop-down/some new UX style fancy element?_**

\*A.\*\* This is your choice. Though the user should easily be able to understand how to use it (if it's too difficult you could also provide tooltips about how to use it). Your reviewers/graders might disagree and you should be able to justify the usage of one over the other.

**Q. _How "done" does the design of the HTML pages need to be for this step?_**

**A.** The page should provide all the necessary HTML elements for implementing a specific functionality. If it does not, then it is not yet "done." For example, the BSG People page would provide all the things necessary for implementing the Add New row to the bsg_people.

**Q. _My website front-end uses AJAX to display rows and the website can't function without it AND/OR I have already written the server-side code to make my website work. Do I need to remove/hide these functionalities?_**

**A.** You do not have to remove/hide any "extra" functionality or features for this submission that makes your front end work. You also do not need to scale down your project or disconnect the server-side code if it's already working. It's perfectly fine to implement a website with more functionality than is required for this Step.

All these "extra things" will simply not be considered by your reviewers and the graders when the Final version is graded. For example, the form's fields, the presence of a Submit button, and the presence of relevant headers and labels on your form to make sure that anyone looking at the form understands what it is for and how to interact with the form, will be the only things reviewed and graded.

**Q. _Why do we have to work on this HTML thing? Isn't this course about databases? Why not just let me write SQL and get points for it?_**

**A.** Databases do not exist in isolation. Unless all your users are comfortable writing SQL for tasks like inserting and browsing data, you definitely need to provide them with an interface to interact with this database. This is why we require an "HTML thing." Forms facilitate a way for providing data to put in your INSERT and UPDATE statements. The data that you get using SELECT statements will be displayed using tables in your HTML pages. And there probably will be a button somewhere which allows a user to DELETE a record in your table.

**Q. _But I already did/am learning database interaction using a web technology like NodeJS in CS290!_**

**A.** CS290 offers an introduction to database interaction using a web technology, while this course gives you an opportunity to create a full-fledged database-drive website.
