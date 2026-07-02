# DEM-4: Add product management items to ecommerce app and send all agent reports to Slack

Build the requested ecommerce enhancement and make sure every agent reports progress to Slack.



Feature request:

Add product management items in the ecommerce app.



Required implementation:

1\. Add support for products in the ecommerce app.

2\. Each product should have:

&#x20;  \- name

&#x20;  \- description

&#x20;  \- price

&#x20;  \- category

&#x20;  \- stock quantity

&#x20;  \- active status

3\. Show products in the UI.

4\. Allow adding a new product.

5\. Allow editing an existing product.

6\. Allow updating stock quantity.

7\. Allow toggling active/inactive status.

8\. Keep the implementation simple, usable, and production-clean.

9\. Update docs if needed.



Slack reporting is mandatory:

Each phase must send its own Slack report before finishing.



Architect must send:

ARCHITECT\_REPORT:

\- issue ID

\- plan

\- impacted files/areas

\- implementation strategy



Grunt must send:

GRUNT\_REPORT:

\- what was implemented

\- files changed

\- anything blocked

\- current status



Pedant must send:

PEDANT\_REPORT:

\- review/test summary

\- bugs found or no issues found

\- quality status



Scribe must send:

SCRIBE\_REPORT:

\- final summary

\- final deliverables

\- PR / handoff summary



Slack failure rule:

If any role cannot send Slack report, it must explicitly output:

SLACK\_FAILED: \<reason>



Acceptance criteria:

\- ecommerce app supports product management flow

\- UI shows products clearly

\- add/edit/update stock/toggle status works

\- all four agent reports are posted to Slack

\- final result is clean and usable
