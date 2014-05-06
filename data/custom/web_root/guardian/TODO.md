Registration TODO
=================

Email announcements to parents
------------------------------
All current students need to go to first page of registration 
whether they are returning or not.

Admin Side
----------

Process for assigning home language, ELA, primary residence, etc.

System-wide
-----------
Any mandatory yes-no questions must have values "Yes" and "No" as 
radio buttons; checkboxes to be used only for optional fields.
These fields must have an option meaning "not filled out"
and write code that makes them answer the question:

* isguardian
* inetaccess
* publishing permissions

DONE - Move lengthy, or duplicate instructions to popup dialogs.

DONE - Move Electives to a separate page

DONE - Remove PTA page

Move SRS and Locker Information to separate areas inside the parent portal?

01-registration.html
---------------
Fix broken popup link:
For information about the registration process and requirements, click here.

Remove all page links if student is not returning.

DONE - Remove "Electives" page link if student is not going to Kent.

DONE - Based on today's date, enrollment date and enrollment status 
(pre-enrolled), calculate which registration year is the default, and 
what the selection options should be. Store the user selection in a custom 
field.

DONE - Add new custom fields: 
* form16\_updated\_at
* form16\_updated\_by

DONE - Updated UI for status checks, using feedback-alert/feedback-confirm

ksdp_registration.html (popup)
----------------------
DONE - Fix or change links on the popup:
See Page 3 for more information.
See Page 9 for more information.
See Page 4 for more information.
See Page 9 for more information.

ksdp_instructions.html (popup)
----------------------
DONE - Fix or change links on the popup:
fill out the exit information on Page 2.,,
fill in or review the information on all pages (Pages 2-14)...
Sign and date the acknowledgement on Page 14...

03-student.html
----------

04-family.html
---------

06-emergency.html
------------
DONE - Add Javascript to timestamp the kikdir\_preview\_approved\_at, 
and to clear the field if "unlisted".

DONE - Add Javascript to build the preview.

DONE - Convert existing kik information fields to new custom fields:
kikdir\_home\_addr
kikdir\_home\_phone
kikdir\_mother\_name
kikdir\_mother\_work_phone
kikdir\_mother\_cell
kikdir\_mother\_email
kikdir\_father\_name
kikdir\_father\_work_phone
kikdir\_father\_cell
kikdir\_father\_email
kikdir\_home2\_addr
kikdir\_home2\_phone
kikdir\_mother2\_name
kikdir\_mother2\_work_phone
kikdir\_mother2\_cell
kikdir\_mother2\_email
kikdir\_father2\_name
kikdir\_father2\_work_phone
kikdir\_father2\_cell
kikdir\_father2\_email
kikdir\_unlisted (Yes/No)
kikdir\_preview\_approved (Yes/No)
kikdir\_preview\_approved\_at (timestamp)

09-medical.html
----------

14-permissions.html
--------------

15-electives.html
------------
DONE - Add new custom fields:
* form15\_updated\_at
* form15\_updated\_by
