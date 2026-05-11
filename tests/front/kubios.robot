*** Settings ***
Library      Browser
Variables    ../resources/load_env.py
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}     https://daauudi.switzerlandnorth.cloudapp.azure.com
${LOGIN_URL}    ${BASE_URL}/login.html

*** Test Cases ***
Logged User Can Open History Page And Inspect Graphs
    New Browser    chromium    headless=No
    New Page    ${LOGIN_URL}

    Type Text      id=username    ${TEST_USERNAME}
    Type Secret    id=password    $TEST_PASSWORD
    Click          css=button[type="submit"]

    Sleep      3s

    Click    text=Historia

    Wait For Elements State    css=.kubios-title    visible    timeout=10s
    Get Text    css=.kubios-title    contains    HRV

    Wait For Elements State    css=#hrvChart    visible    timeout=10s
    Wait For Elements State    css=#heartRateChart    visible    timeout=10s
    Wait For Elements State    css=#readinessChart    visible    timeout=10s

    Scroll To Element    css=.kubios-data-table
    Sleep    2s

    Scroll To Element    css=.site-footer
    Sleep    5s
