*** Settings ***
Library      Browser
Variables    ../resources/load_env.py

*** Variables ***
${BASE_URL}            http://localhost:3000
${LOGIN_URL}           ${BASE_URL}/login.html
${DIARY_URL}           ${BASE_URL}/diary.html
${INVALID_USERNAME}    wronguser
${INVALID_PASSWORD}    wrongpass

*** Test Cases ***
Login Fails With Wrong Credentials
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text    id=username    ${INVALID_USERNAME}
    Type Secret    id=password    ${INVALID_PASSWORD}
    Click    css=button[type="submit"]

    Wait For Elements State    id=loginError    visible    timeout=5s
    Get Text    id=loginError    contains    Käyttäjänimi tai salasana on väärin.

    Close Browser

Login Succeeds With Correct Credentials
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text    id=username    ${USERNAME}
    Type Secret    id=password    ${PASSWORD}
    Click    css=button[type="submit"]

    Wait For URL    **/diary.html    timeout=8s

    Close Browser

User Can Logout
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text    id=username    ${USERNAME}
    Type Secret    id=password    ${PASSWORD}
    Click    css=button[type="submit"]

    Wait For URL    **/diary.html    timeout=8s
    Wait For Elements State    id=logoutBtn    visible    timeout=5s
    Click    id=logoutBtn

    Wait For URL    **/login.html    timeout=5s

    Close Browser
