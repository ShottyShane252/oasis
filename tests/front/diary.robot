*** Settings ***
Library      Browser
Variables    ../resources/load_env.py
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}     https://daauudi.switzerlandnorth.cloudapp.azure.com
${LOGIN_URL}    ${BASE_URL}/login.html
${TEST_NOTE}    Robot testimerkintä

*** Test Cases ***
Logged User Can Add View And Delete Diary Entry
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text      id=username    ${TEST_USERNAME}
    Type Secret    id=password    $TEST_PASSWORD
    Click          css=button[type="submit"]

    Wait For Elements State    css=.greeting-title    visible    timeout=10s
    Click    text=Päiväkirja

    Wait For Elements State    id=diaryForm    visible    timeout=10s
    Fill Text    id=entryDate    2026-05-10
    Select Options By    id=mood    value    good
    Type Text    id=sleep    8
    Type Text    id=weight    75
    Type Text    id=notes    ${TEST_NOTE}
    Click        css=button[type="submit"]

    Sleep    2s
    Get Text    css=.entries-list    contains    ${TEST_NOTE}
    Handle Future Dialogs    action=accept
    Click    css=.entry-card:first-child .view-btn

    Click    css=.entry-card:first-child .delete-btn
    Sleep    2s

