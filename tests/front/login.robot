*** Settings ***
Library      Browser
Variables    ../resources/load_env.py
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}            http://localhost:3000
${LOGIN_URL}           ${BASE_URL}/login.html
${INVALID_USERNAME}    wronguser
${INVALID_PASSWORD}    wrongpass

*** Test Cases ***
Login Fails With Wrong Credentials
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text    id=username    ${INVALID_USERNAME}
    Type Text    id=password    ${INVALID_PASSWORD}
    Click        css=button[type="submit"]

    Wait For Elements State    id=loginError    visible    timeout=5s
    Get Text    id=loginError    contains    Käyttäjänimi tai salasana on väärin.

    Sleep    5s

Login Succeeds With Correct Credentials And Can Logout

    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text    id=username    ${TEST_USERNAME}
    Type Text    id=password    ${TEST_PASSWORD}
    Click        css=button[type="submit"]

    Sleep    5s

    ${url}=    Get Url
    Should Contain    ${url}    /koti.html

    Wait For Elements State    id=logoutBtn    visible    timeout=5s
    Click    id=logoutBtn

    Sleep    5s

    ${logoutUrl}=    Get Url
    Should Contain    ${logoutUrl}    /login.html

    Sleep    3s
