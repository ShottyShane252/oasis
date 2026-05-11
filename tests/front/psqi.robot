*** Settings ***
Library      Browser
Variables    ../resources/load_env.py
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}     https://daauudi.switzerlandnorth.cloudapp.azure.com
${LOGIN_URL}    ${BASE_URL}/login.html

*** Test Cases ***
Logged User Can Complete PSQI Questionnaire
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text      id=username    ${TEST_USERNAME}
    Type Secret    id=password    $TEST_PASSWORD
    Click          css=button[type="submit"]

    Wait For Elements State    css=.greeting-title    visible    timeout=10s
    Click    text=PSQI

    Wait For Elements State    id=psqiForm    visible    timeout=10s

    Fill Text    id=q1    23:00
    Type Text    id=q2    20
    Fill Text    id=q3    07:00
    Type Text    id=q4    7

    Click    css=input[name="q5a"][value="1"]
    Click    css=input[name="q5b"][value="1"]
    Click    css=input[name="q5c"][value="0"]
    Click    css=input[name="q5d"][value="0"]
    Click    css=input[name="q5e"][value="0"]
    Click    css=input[name="q5f"][value="0"]
    Click    css=input[name="q5g"][value="0"]
    Click    css=input[name="q5h"][value="0"]
    Click    css=input[name="q5i"][value="0"]
    Click    css=input[name="q5j"][value="0"]

    Click    css=input[name="q6"][value="1"]
    Click    css=input[name="q7"][value="0"]
    Click    css=input[name="q8"][value="0"]
    Click    css=input[name="q9"][value="0"]
    Click    css=input[name="q10"][value="no_partner"]

    Scroll To Element    css=button[type="submit"]
    Click    css=button[type="submit"]

    Sleep    2s

    Get Text    id=psqiScore    not contains    -
    Get Text    id=psqiInterpretation    contains    Your PSQI score is

    Sleep    5s
