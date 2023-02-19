# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### TICKET-01 - Add custom id to Agent on database and API mapping

When a new Agent is created, a new `id` is generated for it on the server side, which is used internally by the database. However, for some parts of the application on the client side, an identification of the Agent is needed, specially on the reports.

Currently, the only unique identification is the Agent `id`. We need to add a new optional custom identification that, when present, will be shown instead of the Agent id.

For that, we must add a new `custom_id` column to the `Agent` table in the database. Also, the `Agent` model in the API must be updated to include the `customId` property, mapped to this column.

Other layers, including the mappers and view models should not be updated in the scope of this task. This way we avoid breaking changes to the contract at this moment.

#### Components

- Database
- API

#### Story Points

- 8

#### Out of the scope

This task does not cover editing the API response (mappers and view models). This change to the API and the related tests will be handled in TICKET-02

#### Acceptance criteria

1. Agent table in Database has the new `custom_id` column.
2. The `Agent` model in the API includes the new `customId` property.
3. No changes to the previous contract/response from the API, specially in `getShiftsByFacility` endpoint

---

### TICKET-02 - Add `customId` to the Agent metadata returned by `getShiftsByFacility`

After adding the `customId` property to the `Agent` model in the API (view TICKET-01), we need to update the contract/response to include it. This will allow us to use the `customId` in the parts of application that should show an agent identification.

For that, we must edit the mappers and view models in the API to include the `customId`, when present, and return this property as part of the metadata returned by `getAgent` and `getShiftsByFacility` endpoints.

Also, we need to edit the `createAgent` and `editAgent` endpoints to expect a new `customId` property in the request body, that will be assigned to the Agent.

#### Components

- API

#### Story Points

- 5

#### Out of the scope

This task does not cover editing the reports. This will be handled in TICKET-03

#### Acceptance criteria

1. When creating a new Agent using the `createAgent` endpoint and informing a `customId`, the value must be assigned to the Agent in the database.
2. When editing an Agent using the `editAgent` endpoint and informing a `customId`, the value must update the value assigned to the Agent in the database.
3. The response of the `getShiftsByFacility` now includes the `customId` property for the agents that have it.
4. If no `customId` was included for a given agent, it should not return the `customId` property
5. Unit tests should be edited as needed to include this new logic.

#### Dependencies:
- TICKET-01 - Add custom id to Agent

---

### TICKET-03 - Edit `generateReport` to use the `customId` instead of the `id` when present

After adding the `customId` property to the `Agent` model in the API and other layers, including its mappers and view models (view TICKET-01 & TICKET-02), we have to edit the generated PDF to use the `customId` value instead of the `id` when present.

The expected behavior when generating the PDF is:
- In the Agent identification field, if Agent has `customId` use its value.
- In the Agent identification field, if Agent has empty `customId` use the `id` value.

#### Components

- API

#### Story Points

- 3

#### Acceptance criteria

1. The generated PDF in `generateReport` must show the `customId` in the agent identification field for the agents that have a value assigned to the `custom_id` in the database.
2. The generated PDF in `generateReport` must not show the `id` in the agent identification field for the agents that have a value assigned to the `custom_id` in the database.
2. The generated PDF in `generateReport` must show the `id` in the agent identification field for the agents that don't have a value assigned to the `custom_id` in the database.
3. Unit tests should be edited as needed to include this new logic.

#### Dependencies:
- TICKET-01 - Add custom id to Agent
- TICKET-02 - Add `customId` to the Agent metadata returned by `getShiftsByFacility`