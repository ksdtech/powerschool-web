Registration TODO
=================

System-wide
-----------
Any mandatory yes-no questions must have values "Yes" and "No" as 
radio buttons; checkboxes to be used only for optional fields.

Move lengthy, or duplicate instructions to popup dialogs.


01-registration
---------------
Two forms on same page, one for ITR, one for confirmation?

DONE - Based on today's date, enrollment date and enrollment status 
(pre-enrolled), calculate which registration year is the default, and 
what the selection options should be.  Store the user selection in a custom 
field.

DONE - Add new custom fields: 
* form16\_updated\_at
* form16\_updated\_by

DONE - Updated UI for status checks, using feedback-alert/feedback-confirm

Remove all page links if student is not returning.
Remove "Electives" page link if student is not going to Kent.

03-student
----------

04-family
---------

06-emergency
------------
Add javascript to timestamp the kikdir\_preview\_approved\_at, 
and to clear the field if "unlisted".

Add javascript to build the preview.

Convert existing kik information fields to new custom fields:
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
kikdir\_preview\_approval (Yes/No)
kikdir\_preview\_approved\_at (timestamp)


09-medical
----------

14-permissions
--------------

15-electives
------------
Add new custom fields:
* form15\_updated\_at 
* form15\_updated\_by 