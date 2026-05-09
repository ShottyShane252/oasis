*** Settings ***
Library      Browser
Variables    ../resources/load_env.py
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}     https://daauudi.switzerlandnorth.cloudapp.azure.com
${LOGIN_URL}    ${BASE_URL}/login.html

*** Test Cases ***
Logged User Can Open Home Page And Select Mood
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text      id=username    ${TEST_USERNAME}
    Type Secret    id=password    $TEST_PASSWORD
    Click          css=button[type="submit"]

    Wait For Elements State    css=.greeting-title    visible    timeout=10s
    Get Text    css=.greeting-title    contains    Hei
    Get Text    css=.koti-tip-title    contains    Päivän vinkki
    Get Text    text=😊 Miltä sinusta tuntuu tänään?    contains    Miltä sinusta tuntuu tänään?

    Click    css=.mood-emoji[data-mood="hyva"]

    Wait For Elements State    css=.mood-emoji[data-mood="hyva"].selected    visible    timeout=5s
    Get Text    id=moodMessage    contains    Hyvä fiilis

    Sleep    5s
